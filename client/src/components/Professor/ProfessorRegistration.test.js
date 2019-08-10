import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import ProfessorRegistration from './ProfessorRegistration';
import { findButton } from '../../setupTests';

describe('ProfessorRegistration rendering tests', () => {
  let professorRegistration;

  beforeEach(async () => {
    professorRegistration = mount(
      <MemoryRouter>
        {' '}
        <ProfessorRegistration />{' '}
      </MemoryRouter>
    );
  });

  describe('ProfessorRegistration component contents', () => {
    test('There should be a Register button', () => {
      const button = findButton(professorRegistration, /register/i);
      expect(button.exists()).toBe(true);
    });
  });
});
