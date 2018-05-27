// @flow
import React, { createContext } from 'react';

export type State = { [key: string]: any };
export type StateFactory = (props: Props) => State;
export type InitialState = State | StateFactory;
export type Props = { [key: string]: any };
export type Reducer = (state: State, payload: any, actions: Actions) => State;
export type Reducers = { [key: string]: Reducer };
export type Action = (payload?: any) => State;
export type Actions = { [key: string]: Action };
export type RenderFunction = (props: Props) => ?React$Element<any>;

type Resolver<T> = T | ((props: Props) => T);
function resolve<T>(thing: Resolver<T>, props: Props): T {
  return typeof thing === 'function' ? thing(props) : thing;
}

export const stateComponent = (
  state: InitialState,
  reducers: Reducers,
  Render: RenderFunction
) =>
  class Stateful extends React.Component<Props, State> {
    actions: Actions;

    constructor(props: Props) {
      super(props);
      this.state = resolve(state, props);

      const resolvedReducers = resolve(reducers, props);
      this.actions = Object.keys(resolvedReducers).reduce((acc, key) => {
        acc[key] = (payload: any) =>
          new Promise(resolve =>
            Promise.resolve(resolvedReducers[key](this.state, payload)).then(
              newState => this.setState(newState, () => resolve(this.state))
            )
          );
        return acc;
      }, {});
    }

    render() {
      return <Render {...this.props} {...this.state} {...this.actions} />;
    }
  };

export const stateContext = (
  initialState: InitialState,
  reducers: Reducers
) => {
  const { Consumer, Provider } = createContext({});

  return {
    Provider: stateComponent(
      initialState,
      reducers,
      ({ children, ...props }) => <Provider value={props}>{children}</Provider>
    ),
    consume: (Component: RenderFunction) => (props: Props) => (
      <Consumer>{state => <Component {...props} {...state} />}</Consumer>
    )
  };
};

export const toggle = (key: string) => (state: State): State => ({
  ...state,
  [key]: !state[key]
});
