import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import NoMatch from './components/NoMatch';

import StudentClassView from './components/Student/Class/StudentClassView';
import TeacherClassView from './components/Teacher/Class/TeacherClassView';

import './mysass.scss';

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
          key={path}
          path={path}
          render={props => <Component socket={socket} {...props} />}
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
      <HashRouter>
        <Routes socket={this.state.socket} />
      </HashRouter>
    );
  }
}

export default App;
