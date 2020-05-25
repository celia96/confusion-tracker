/* eslint-disable react/prefer-stateless-function, react/no-unused-state*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'reactstrap';

import Header from './Header';
import ConfusionGraph from './ConfusionGraph';
import QuestionList from './QuestionList';
import Menu from './Menu';

import { store } from '../../../redux/store';
import { updateClass } from '../../../redux/actions';

// import data from '../../../data/data.json';

// const io = require('socket.io-client');

class TeacherClassView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // socket: io(),
      collapseMenu: false,
      collapseQuestions: false,
      questions: new Map(),
      confusionRate: 0,
      attendees: new Map(),
      className: '',
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
    // const { classId } = data;

    const { socket, classId, updateClassInfo } = this.props;
    socket.emit('joinClass', { isOrganizer: true, classId });
    socket.emit('classRoom', classId);

    socket.on('classRoom', classRoom => {
      const { questions, confusionRate, attendees, className } = classRoom;
      // console.log('updated', questions);
      console.log('store ', store.getState());
      updateClassInfo({ questions, students: Object.keys(attendees) });
      this.setState({ questions, confusionRate, attendees, className });
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
    const { socket, className } = this.props;
    const { collapseMenu, collapseQuestions } = this.state;
    return (
      <div style={styles.container}>
        {/* <Header className={className}/> */}
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

const mapStateToProps = state => {
  return {
    teacherInfo: state && state.teacher,
    classId: state && state.classRoom && state.classRoom.classId,
    className: state && state.classRoom && state.classRoom.className
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
