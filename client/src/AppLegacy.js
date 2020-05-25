/* eslint-disable no-console, react/no-multi-comp, react/prefer-stateless-function */
import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
// import PropTypes from 'prop-types';

// import StudentLogin from './components/Student/StudentLogin';
// import StudentRoom from './components/Student/StudentRoom';
// import ProfessorLogin from './components/Professor/ProfessorLogin';
// import ProfessorRegistration from './components/Professor/ProfessorRegistration';
// import ProfessorCreateRoom from './components/Professor/ProfessorCreateRoom';
// import StudentButton from './components/Student/StudentButton';
// import Chart from './components/Professor/Chart';
// import ProfessorMainPage from './components/Professor/ProfessorMainPage';
// import ClassSummary from './components/Professor/ClassSummary';
// import StudentSurvey from './components/Student/StudentSurvey';

// import Authn from './components/Authn/Authn';
// const PrivateRoute = ({ component: Comp, ...rest }) => (
//   <Route
//     {...rest}
//     render={renderProps => {
//       const profile = Authn.getProfile();
//       if (profile) {
//         return <Comp {...renderProps} />;
//       }
//       return (
//         <Redirect
//           to={{
//             pathname: '/login/professor',
//             state: { from: renderProps.location }
//           }}
//         />
//       );
//     }}
//   />
// );

// import Home from './components/Home';

import NoMatch from './components/NoMatch';

import StudentClassView from './components/Student/Class/StudentClassView';
import TeacherClassView from './components/Teacher/Class/TeacherClassView';

const io = require('socket.io-client');

const routes = [
  {
    path: '/student',
    component: StudentClassView
  },
  {
    path: '/teacher',
    component: TeacherClassView
  }
];

const Routes = ({ socket }) => (
  <div>
    <Switch>
      {/* put all the routes here */}
      {routes.map(({ path, component: Component }) => (
        <Route
          path={path}
          render={props => <Component socket={socket} {...props} />}
        />
      ))}

      <Route component={NoMatch} />

      {/* <Route exact path="/" component={Home} />
      <Route exact path="/login/teacher" component={TeacherLogin} />
      <Route
        path="/login/teacher/register"
        component={TeacherRegistration}
      />
      <Route exact path="/login/student" component={StudentLogin} /> 
      <Route exact path="/login/student" component={StudentRoom} />
      <Route
        path="/login/student/nickname/:roomName"
        component={StudentLogin}
      />
      <Route exact path="/login/professor" component={ProfessorLogin} />
      <Route
        path="/login/professor/register"
        component={ProfessorRegistration}
      />
      <Route
        path="/student/:nickname/room/:roomName"
        component={StudentButton}
      />
      <Route path="/student/comments/:roomName" component={StudentSurvey} />

      <PrivateRoute path="/professor/menu" component={ProfessorMainPage} />
      <PrivateRoute
        path="/professor/create/room"
        component={ProfessorCreateRoom}
      />
      <PrivateRoute path="/professor/room/:roomName" component={Chart} />
      <PrivateRoute
        path="/professor/summary/:roomName"
        component={ClassSummary}
      /> */}
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
      <div style={{ textAlign: 'center' }}>
        <HashRouter>
          <Routes socket={this.state.socket} />
        </HashRouter>
      </div>
    );
  }
}

// PrivateRoute.propTypes = {
//   component: PropTypes.func.isRequired
// };

export default App;
