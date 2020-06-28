import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ConfusionGraph from './ConfusionGraph';
import QuestionList from './QuestionList';
import Menu from './Menu';

import { updateClass, endClass } from '../../../redux/actions';

const styles = {
  container: {
    height: '100vh',
    maxHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
};

class TeacherClassView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapseMenu: false,
      collapseQuestions: false,
      pausedClass: false
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleQuestions = this.toggleQuestions.bind(this);
    this.pause = this.pause.bind(this);
    this.end = this.end.bind(this);
  }

  componentDidMount() {
    const { socket, classId, updateClassInfo } = this.props;

    socket.emit('joinClass', { isOrganizer: true, classId });
    socket.emit('classRoom', classId);

    socket.on('classRoom', classRoom => {
      const { questions, attendees } = classRoom;
      // console.log('updated', questions);
      updateClassInfo({ questions, students: Object.keys(attendees) });
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

  pause() {
    console.log('pause class');
    this.setState({
      pausedClass: !this.state.pausedClass
    });
  }

  end() {
    console.log('stop class');
    /* const { socket, classId, chartData, stopClass } = this.props;
    socket.emit('endClass', { classId, chartData });
    stopClass(); */
  }

  render() {
    const { socket } = this.props;
    const {
      questions,
      collapseMenu,
      collapseQuestions,
      pausedClass
    } = this.state;
    return (
      <div style={styles.container}>
        <Menu
          collapse={collapseMenu}
          toggle={this.toggleMenu}
          endClass={this.end}
        />
        <ConfusionGraph
          socket={socket}
          pauseClass={this.pause}
          paused={pausedClass}
        />
        <QuestionList
          questions={questions}
          collapse={collapseQuestions}
          toggle={this.toggleQuestions}
        />
      </div>
    );
  }
}

TeacherClassView.propTypes = {
  teacherInfo: PropTypes.object,
  classId: PropTypes.string
};

const mapStateToProps = state => {
  return {
    teacherInfo: state && state.teacher,
    classId: state && state.classRoom && state.classRoom.classId,
    chartData: state && state.classRoom && state.classRoom.chartData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateClassInfo: confusion => dispatch(updateClass(confusion)),
    stopClass: () => dispatch(endClass())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherClassView);
