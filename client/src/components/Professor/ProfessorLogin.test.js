import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import ProfessorLogin from './ProfessorLogin';
import { findButton } from '../../setupTests';

describe('ProfessorLogin rendering tests', () => {
  let professorLogin;

  beforeEach(async () => {
    professorLogin = mount(
      <MemoryRouter>
        {' '}
        <ProfessorLogin />{' '}
      </MemoryRouter>
    );
  });

  describe('ProfessorLogin content tests', () => {
    test('There should be a Login button', () => {
      const button = findButton(professorLogin, /login/i);
      expect(button.exists()).toBe(true);
    });

    test('There should be a Register button', () => {
      const button = findButton(professorLogin, /register/i);
      expect(button.exists()).toBe(true);
    });
  });
});
