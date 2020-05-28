/* eslint-disable react/prefer-stateless-function, react/no-unused-state*/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ConfusionGraph from './ConfusionGraph';
import QuestionList from './QuestionList';
import Menu from './Menu';

import { store } from '../../../redux/store';
import { updateClass } from '../../../redux/actions';

class TeacherClassView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseMenu: false,
      collapseQuestions: false,
      questions: new Map(),
      confusionRate: 0,
      attendees: new Map(),
      menuButtonStyle: {
        width: '30%'
      },
      questionsButtonStyle: {
        width: '30%'
      }
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleQuestions = this.toggleQuestions.bind(this);
  }

  componentDidMount() {
    const { socket, classId, updateClassInfo } = this.props;

    socket.emit('joinClass', { isOrganizer: true, classId });
    socket.emit('classRoom', classId);

    socket.on('classRoom', classRoom => {
      const { questions, confusionRate, attendees } = classRoom;
      // console.log('updated', questions);
      console.log('store ', store.getState());
      updateClassInfo({ questions, students: Object.keys(attendees) });
      this.setState({ questions, confusionRate, attendees });
    });
    socket.on('message', message => {
      console.log(message);
    });
  }

  toggleMenu() {
    const { collapseMenu } = this.state;
    this.setState({
      collapseMenu: !collapseMenu
    });
  }

  toggleQuestions() {
    const { collapseQuestions } = this.state;
    this.setState({
      collapseQuestions: !collapseQuestions
    });
  }

  render() {
    const { socket } = this.props;
    const { collapseMenu, collapseQuestions } = this.state;
    return (
      <div style={styles.container}>
        <Menu collapse={collapseMenu} toggle={this.toggleMenu} />
        <ConfusionGraph socket={socket} />
        <QuestionList
          collapse={collapseQuestions}
          toggle={this.toggleQuestions}
        />
      </div>
    );
  }
}

const styles = {
  container: {
    height: '100vh',
    maxHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

TeacherClassView.propTypes = {
  teacherInfo: PropTypes.object,
  classId: PropTypes.string
};

const mapStateToProps = state => {
  return {
    teacherInfo: state && state.teacher,
    classId: state && state.classRoom && state.classRoom.classId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateClassInfo: confusion => dispatch(updateClass(confusion))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeacherClassView);
