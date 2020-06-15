import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import NoMatch from './components/NoMatch';

// In Class
import StudentClassView from './components/Student/Class/StudentClassView';
import TeacherClassView from './components/Teacher/Class/TeacherClassView';

// Student's Pages
import StudentLogin from './components/Student/Join/StudentLogin';

// Teacher's Pages
import TeacherLogin from './components/Teacher/Join/TeacherLogin';
import TeacherRegistration from './components/Teacher/Join/TeacherRegistration';

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
    path: '/join',
    component: StudentLogin
  },
  {
    path: '/student/class/:className',
    component: StudentClassView
  },
  {
    path: '/login',
    component: TeacherLogin
  },
  {
    path: '/register',
    component: TeacherRegistration
  },
  {
    exact: true,
    isProtected: true,
    path: '/home',
    component: MainPage
  },
  {
    isProtected: true,
    path: '/profile',
    component: ProfileSetting
  },
  {
    exact: true,
    isProtected: true,
    path: '/courses',
    component: ManageCourses
  },
  {
    exact: true,
    isProtected: true,
    path: '/courses/:courseName',
    component: ManageCourseDetail
  },
  {
    isProtected: true,
    path: '/courses/:courseName/analytics',
    component: ManageAnalytics
  },
  {
    isProtected: true,
    path: '/teacher/class/:className',
    component: TeacherClassView
  }
];

const PrivateRoute = ({ component: Comp, ...rest }) => {
  const { isAuthenticated } = rest;
  return (
    <Route
      {...rest}
      render={props => {
        return isAuthenticated ? <Comp {...props} /> : <Redirect to="/login" />;
      }}
    />
  );
};

const Routes = ({ socket, isAuthenticated }) => (
  <div>
    <Switch>
      {/* put all the routes here */}
      {routes.map(({ exact, isProtected, path, component: Comp }) => {
        if (isProtected) {
          return (
            <PrivateRoute
              key={path}
              exact={exact}
              path={path}
              isAuthenticated={isAuthenticated}
              component={Comp}
            />
          );
        }
        return (
          <Route
            key={path}
            exact={exact}
            path={path}
            render={props => <Comp socket={socket} {...props} />}
          />
        );
      })}

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
      console.log('ws disconnect', socket.id);
    });
  }

  render() {
    const { socket } = this.state;
    const { clientToken } = this.props;
    return (
      <Router>
        <Routes socket={socket} isAuthenticated={clientToken !== ''} />
      </Router>
    );
  }
}

App.propTypes = {
  clientToken: PropTypes.string.isRequired
};

const mapStateToProps = state => {
  return {
    clientToken: state && state.teacher && state.teacher.clientToken
  };
};

export default connect(mapStateToProps, null)(App);
