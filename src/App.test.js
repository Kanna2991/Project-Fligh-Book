import {render, fireEvent, screen} from '@testing-library/react'
import App from './App';
import {create, act} from 'react-test-renderer';

test('Snapshot test for single column', () => {
  let renderer;

  act(() => {
    const initialRowsColumns = [ [2, 3] ];
    renderer = create(<App initialRowsColumns={initialRowsColumns}/>);
  })
  expect(renderer.toJSON()).toMatchSnapshot();
});


test('Snapshot test for two column', () => {
  let renderer;

  act(() => {
    const initialRowsColumns = [ [2, 3], [4,2] ];
    renderer = create(<App initialRowsColumns={initialRowsColumns}/>);
  })
  expect(renderer.toJSON()).toMatchSnapshot();
});

test('Snapshot test for three column', () => {
  let renderer;

  act(() => {
    const initialRowsColumns = [ [4,3], [2,3], [3,4] ];
    renderer = create(<App initialRowsColumns={initialRowsColumns}/>);
  })
  expect(renderer.toJSON()).toMatchSnapshot();
});

test('Snapshot test for four column', () => {
  let renderer;

  act(() => {
    const initialRowsColumns = [ [3,2], [4,3], [2,3], [3,4] ];
    renderer = create(<App initialRowsColumns={initialRowsColumns}/>);
  })
  expect(renderer.toJSON()).toMatchSnapshot();
});

