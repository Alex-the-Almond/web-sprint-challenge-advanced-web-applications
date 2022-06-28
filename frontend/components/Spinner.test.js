import React from 'react';
import Spinner from './Spinner';
import {render} from '@testing-library/react';


test('sanity', () => {
  expect(true).toBe(true)
})

test('test that spinner renders without errors', () => {
  render(<Spinner/>);
});