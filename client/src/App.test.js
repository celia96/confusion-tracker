import React from 'react';
import ReactDOM from 'react-dom';
//import { shallow, mount } from 'enzyme';

import App from './App';
//import MainPage from './components/MainPage';
//import ProfessorLogin from './components/ProfessorLogin';
//import { findButton, flushPromises } from './setupTests';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
