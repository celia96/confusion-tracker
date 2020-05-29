import React from 'react';
import { cleanup, fireEvent, render } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

describe('Test', () => {
  test('Default test ', () => {
    expect().toBe(undefined);
  });
})