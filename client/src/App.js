import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NoMatch from './components/NoMatch';

import StudentClassView from './components/Student/Class/StudentClassView';
import TeacherClassView from './components/Teacher/Class/TeacherClassView';
import MainPage from './components/Teacher/MainPage/MainPage';
import ProfileSetting from './components/Teacher/MainPage/Profile/ProfileSetting';
import ManageCourses from './components/Teacher/MainPage/ManageCourses/ManageCourses';
import ManageCourseDetail from './components/Teacher/MainPage/ManageCourseDetail/ManageCourseDetail';
import ManageAnalytics from './components/Teacher/MainPage/ManageAnalytics/ManageAnalytics';

import './App.css';
import './mysass.scss';

const io = require('socket.io-client');

const routes = [
  {
    path: '/student/class/:className',
    component: StudentClassView
  },
  {
    path: '/teacher/class/:className',
    component: TeacherClassView
  },
  {
    exact: true,
    path: '/home',
    component: MainPage
  },
  {
    path: '/profile',
    component: ProfileSetting
  },
  {
    exact: true,
    path: '/courses',
    component: ManageCourses
  },
  {
    exact: true,
    path: '/courses/:courseName', // /teacher/courses/courseName?dateCreated=2019512
    component: ManageCourseDetail
  },
  {
    path: '/courses/:courseName/analytics',
    component: ManageAnalytics
  }
];

const Routes = ({ socket }) => (
  <div>
    <Switch>
      {/* put all the routes here */}
      {routes.map(({ exact, path, component: Comp }) => (
        <Route
          key={path}
          exact={exact}
          path={path}
          render={props => <Comp socket={socket} {...props} />}
        />
      ))}

      <Route component={NoMatch} />
    </Switch>
  </div>
);

class App extends Component {
  constructor() {
    super();
    // Initialize the App state
    this.state = {
      socket: io()
    };
  }

  componentDidMount() {
    const { socket } = this.state;
    socket.on('connect', () => {
      console.log('ws connect');
    });
    socket.on('disconnect', () => {
      console.log('ws disconnect', this.state.socket.id);
    });
  }

  render() {
    return (
      <Router>
        <Routes socket={this.state.socket} />
      </Router>
    );
  }
}

export default App;
