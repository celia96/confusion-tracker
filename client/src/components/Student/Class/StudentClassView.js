import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from './Header';
import ConfusionToggleButton from './ConfusionToggleButton';
import AddQuestion from './AddQuestion';
import QuestionList from './QuestionList';

import {
  updateConfusion,
  joinClassRoom,
  leaveClassRoom
} from '../../../redux/actions';
import { store } from '../../../redux/store';

class StudentClassView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confused: this.props.confusionState,
      questions: new Map(),
      text: ''
    };
    this.toggleConfusion = this.toggleConfusion.bind(this);
    this.submitQuestion = this.submitQuestion.bind(this);
    this.upvoteQuestion = this.upvoteQuestion.bind(this);
    this.onTextChange = this.onTextChange.bind(this);
  }

  componentDidMount() {
    console.log('store ', store.getState());
    const { socket, studentId, classId, updateMyConfusion } = this.props;

    socket.emit('joinClass', { studentId, isOrganizer: false, classId });
    socket.emit('classRoom', classId);

    socket.on('classRoom', classRoom => {
      const { questions, attendees } = classRoom;
      const confused = attendees[studentId];

      updateMyConfusion(confused);
      this.setState({ questions, confused });
      console.log('now confused: ', this.state.confused);
    });
    socket.on('message', message => {
      console.log(message);
    });
  }

  join() {
    const { studentId, joinClass } = this.props;
    joinClass(studentId);
  }
  leave() {
    const { leaveClass } = this.props;
    leaveClass();
  }

  toggleConfusion() {
    const { socket, classId, studentId } = this.props;
    socket.emit('toggleConfusion', {
      classId,
      studentId
    });
  }

  submitQuestion() {
    const { socket, classId, studentId } = this.props;
    const { text } = this.state;
    const timestamp = new Date();
    socket.emit('addQuestion', {
      classId,
      studentId,
      text,
      timestamp
    });
    this.setState({
      text: ''
    });
  }

  upvoteQuestion(question) {
    const { socket, classId, studentId } = this.props;
    const { questionId } = question;
    console.log('upvoted question ID ', questionId);
    socket.emit('toggleUpvoteQuestion', {
      classId,
      studentId,
      questionId
    });
  }

  onTextChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  render() {
    const { questions, confused, text } = this.state;
    const { className, studentId } = this.props;
    return (
      <div style={styles.container}>
        <Header className={className} studentId={studentId} />
        <div style={styles.contentContainer}>
          <div style={styles.left}>
            <div style={styles.buttonContainer}>
              <ConfusionToggleButton
                toggleConfusion={this.toggleConfusion}
                confused={confused}
              />
            </div>
            <div style={styles.addContainer}>
              <AddQuestion
                text={text}
                submitQuestion={this.submitQuestion}
                onTextChange={this.onTextChange}
              />
            </div>
          </div>
          <div style={styles.right}>
            <QuestionList
              questions={questions}
              upvoteQuestion={this.upvoteQuestion}
            />
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxHeight: '100vh'
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 2,
    height: 'calc(100vh - 58px)'
  },
  left: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: '100px'
  },
  right: {
    flex: 1,
    margin: '20px',
    marginLeft: '100px',
    marginRight: '100px',
    overflow: 'auto',
    backgroundColor: '#6495ed',
    borderRadius: '5px'
  },
  buttonContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  addContainer: {
    marginBottom: '20px'
  }
};

const mapStateToProps = state => {
  return {
    studentId: state && state.student && state.student.studentId,
    confusionState: state && state.student && state.student.confusionState,
    classId: state && state.classRoom && state.classRoom.classId,
    className: state && state.classRoom && state.classRoom.className
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateMyConfusion: confusion => dispatch(updateConfusion(confusion)),
    joinClass: studentId => dispatch(joinClassRoom(studentId)),
    leaveClass: () => dispatch(leaveClassRoom())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudentClassView);