import React from 'react';
import { stateComponent, stateContext, toggle } from '../';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

const Test = () => null;

test('State', () => {
  const state = { foo: true };
  const reducers = {
    toggle: state => ({ foo: !state.foo })
  };
  const Component = stateComponent(state, reducers, Test);
  const wrapper = mount(<Component />);
  const testWrapper = wrapper.find(Test);
  expect(testWrapper.prop('foo')).toBe(true);

  return testWrapper
    .prop('toggle')()
    .then(({ foo }) => expect(foo).toBe(false));
});

test('State from props', () => {
  const state = ({ initialFoo }) => ({ foo: initialFoo });
  const reducers = {
    toggle: state => ({ foo: !state.foo })
  };
  const Component = stateComponent(state, reducers, Test);
  expect(
    mount(<Component initialFoo={true} />)
      .find(Test)
      .prop('foo')
  ).toBe(true);
  expect(
    mount(<Component initialFoo={false} />)
      .find(Test)
      .prop('foo')
  ).toBe(false);
});

test('State context', () => {});

test('Reducers from props', () => {
  const state = { count: 0 };
  const reducers = ({ amount }) => ({
    increment: state => ({ count: state.count + amount })
  });
  const Component = stateComponent(state, reducers, Test);
  const wrapper = mount(<Component amount={1} />);
  const testWrapper = wrapper.find(Test);
  expect(testWrapper.prop('count')).toBe(0);

  return testWrapper
    .prop('increment')()
    .then(({ count }) => expect(count).toBe(1));
});

// TODO: Enzyme doesn't seem to support the new React context API
// test('State context', () => {
//   const state = { foo: true };
//   const reducers = {
//     toggle: state => ({ foo: !state.foo })
//   };

//   const TestContext = stateContext(state, reducers);
//   const Consumer = TestContext.consume(Test);

//   const wrapper = mount(
//     <TestContext.Provider>
//       <Consumer />
//     </TestContext.Provider>
//   );

//   const testWrapper = wrapper.find(Test);
//   expect(testWrapper.prop('foo')).toBe(true);

//   return testWrapper
//     .prop('toggle')()
//     .then(({ foo }) => expect(foo).toBe(false));
// });

test('toggle', () => {
  const state = { foo: true };
  const reducer = toggle('foo');
  expect(reducer(state)).toEqual({ foo: false });
});
