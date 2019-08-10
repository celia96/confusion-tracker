import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import MainPage from './MainPage';
import { findButton } from '../setupTests';

describe('Main page rendering tests', () => {
  let mainPage;

  beforeEach(async () => {
    mainPage = mount(
      <MemoryRouter>
        {' '}
        <MainPage />{' '}
      </MemoryRouter>
    );
  });

  describe('Main page initial content', () => {
    test('There should be a Student Login button', () => {
      const button = findButton(mainPage, /student[ ]+login/i);
      expect(button.exists()).toBe(true);
    });

    test('There should be a Professor Login button', () => {
      const button = findButton(mainPage, /professor[ ]+login/i);
      expect(button.exists()).toBe(true);
    });
  });
});
