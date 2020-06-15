import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';

import Header from './Header';
import ConfusionToggleButton from './ConfusionToggleButton';
import AddQuestion from './AddQuestion';
import QuestionList from './QuestionList';

import { updateConfusion, joinClass, leaveClass } from '../../../redux/actions';

const styles = {
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
    const { socket, studentId, classId, updateMyConfusion } = this.props;

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
    const { courseName, studentId, classId } = this.props;
    return (
      <div className="custom-container">
        {!studentId || !classId ? <Redirect to="/join" /> : null}
        <Header courseName={courseName} studentId={studentId} />
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

StudentClassView.propTypes = {
  studentId: PropTypes.string.isRequired,
  confusionState: PropTypes.bool.isRequired,
  classId: PropTypes.string.isRequired,
  courseName: PropTypes.string.isRequired,
  updateMyConfusion: PropTypes.func.isRequired,
  joinClassRoom: PropTypes.func,
  leaveClassRoom: PropTypes.func
};

const mapStateToProps = state => {
  const { student } = state;
  return {
    studentId: student && student.studentId,
    confusionState: student && student.confusionState,
    classId: student && student.currentClass && student.currentClass.classId,
    courseName:
      student && student.currentClass && student.currentClass.courseName
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateMyConfusion: confusion => dispatch(updateConfusion(confusion)),
    joinClassRoom: studentId => dispatch(joinClass(studentId)),
    leaveClassRoom: () => dispatch(leaveClass())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentClassView);
