// @flow
// @flow
// TODO: Split this into a stand-alone library
import React, { createContext } from "react";

export type State = { [key: string]: any };
export type StateFactory = (props: Props) => State;
export type InitialState = State | StateFactory;
export type Props = { [key: string]: any };
export type Reducer = (state: State, payload: any, actions: Actions) => State;
export type Reducers = { [key: string]: Reducer };
export type Action = (payload?: any) => State;
export type Actions = { [key: string]: Action };
export type RenderFunction = (props: Props) => React.ReactNode;

type Resolve = (v: any) => any;

export const stateComponent = (
  initialState: InitialState,
  reducers: Reducers,
  Render: RenderFunction
) =>
  class Stateful extends React.Component {
    state: State = typeof initialState === "function"
      ? initialState(this.props)
      : initialState;

    actions: Actions = Object.keys(reducers).reduce(
      (acc: Actions, key: string) => {
        acc[key] = (payload: any) =>
          new Promise(async (resolve: Resolve) => {
            const newState = await reducers[key](
              this.state,
              payload,
              this.actions
            );
            this.setState(newState, () => resolve(this.state));
          });
        return acc;
      },
      {}
    );

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
      ({ children, ...props }: Props) => (
        <Provider value={props}>{children}</Provider>
      )
    ),
    Consumer
  };
};

export const toggle = (key: string) => (state: State): State => ({
  ...state,
  [key]: !state[key]
});
