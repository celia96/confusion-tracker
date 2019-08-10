/* eslint-disable no-console, react/no-multi-comp, react/prefer-stateless-function */
import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import MainPage from './components/MainPage';

import StudentLogin from './components/Student/StudentLogin';
import StudentRoom from './components/Student/StudentRoom';

import ProfessorLogin from './components/Professor/ProfessorLogin';
import ProfessorRegistration from './components/Professor/ProfessorRegistration';
import ProfessorCreateRoom from './components/Professor/ProfessorCreateRoom';

import StudentButton from './components/Student/StudentButton';
import Chart from './components/Professor/Chart';

import ProfessorMainPage from './components/Professor/ProfessorMainPage';

import ClassSummary from './components/Professor/ClassSummary';
import StudentSurvey from './components/Student/StudentSurvey';

import NoMatch from './components/NoMatch';

import Authn from './components/Authn/Authn';
import './App.css';

const PrivateRoute = ({ component: Comp, ...rest }) => (
  <Route
    {...rest}
    render={renderProps => {
      const profile = Authn.getProfile();
      if (profile) {
        return <Comp {...renderProps} />;
      }
      return (
        <Redirect
          to={{
            pathname: '/login/professor',
            state: { from: renderProps.location }
          }}
        />
      );
    }}
  />
);

const Routes = () => (
  <div>
    <Switch>
      {/* put all the routes here */}
      <Route exact path="/" component={MainPage} />
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
      />
      <Route component={NoMatch} />
    </Switch>
  </div>
);

class App extends Component {
  constructor() {
    super();
    // Initialize the App state
    this.state = {};
  }
  render() {
    return (
      <div className="App">
        <HashRouter>
          <Routes />
        </HashRouter>
      </div>
    );
  }
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired
};

export default App;
