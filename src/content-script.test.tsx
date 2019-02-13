import { mount } from 'enzyme';
import * as React from 'react';
import { Main } from './content-script';

test('Snapshot Testing at Initialize', () => {
  const main = mount(<Main />);
  expect(main).toMatchSnapshot();
});
