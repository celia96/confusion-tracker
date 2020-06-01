// import React from 'react';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

describe('Test', () => {
  test('Default test ', () => {
    expect().toBe(undefined);
  });
})