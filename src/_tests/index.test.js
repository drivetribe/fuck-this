import { toggle } from '../';

test('toggle', () => {
  const state = { foo: true };
  const reducer = toggle('foo');
  expect(reducer(state)).toEqual({ foo: false });
});
