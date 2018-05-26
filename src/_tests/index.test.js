import React from 'react';
import { stateComponent, stateContext, toggle } from '../';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

test('stateComponent', () => {
  const state = { foo: true };
  const reducers = {
    toggle: (state) => ({ foo: !state.foo });
  };
  const render = ({ foo, toggle }) => (
    <button onClick={toggle}>Test</button>
  )
  const Component = stateComponent(state, reducers, render);

  const wrapper = shallow(<Component />);
  expect(wrapper.prop('foo').toBe(true));
  wrapper.find('button').simulate('click');
  expect(wrapper.prop('foo').toBe(false));
});

test('toggle', () => {
  const state = { foo: true };
  const reducer = toggle('foo');
  expect(reducer(state)).toEqual({ foo: false });
});
