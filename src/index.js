// @flow
import React, { createContext } from 'react';

// export type State = { [key: string]: any };
// export type StateFactory = (props: Props) => State;
// export type InitialState = State | StateFactory;
// export type Props = { [key: string]: any };
// export type Reducer = (state: State, payload: any, actions: Actions) => State;
// export type Reducers = { [key: string]: Reducer };
// export type Action = (payload?: any) => State;
// export type Actions = { [key: string]: Action };
// export type RenderFunction = (props: Props) => React.ReactNode;

// type ResolvePromise = (v: any) => any;

// type Resolver<T> = T | (() => T);
// const resolve = <T>(thing: Resolver<T>, props: Props): T =>
//   typeof thing === 'function' ? thing(this.props) : thing;

// export const stateComponent = (
//   initialState: InitialState,
//   reducers: Reducers,
//   Render: RenderFunction
// ) =>
//   class Stateful extends React.Component {
//     constructor(props) {
//       super(props);

//       this.state = resolve < State > (initialState, props);

//       const resolvedReducers = resolve < Reducers > (reducers, props);
//       this.actions = Object.keys(resolvedReducers).reduce(
//         (acc: Actions, key: string) => {
//           acc[key] = (payload: any) =>
//             new Promise(async (resolve: ResolvePromise) => {
//               const newState = await resolvedReducers[key](
//                 this.state,
//                 payload,
//                 this.actions
//               );
//               this.setState(newState, () => resolve(this.state));
//             });
//           return acc;
//         },
//         {}
//       );
//     }

//     render() {
//       return <Render {...this.props} {...this.state} {...this.actions} />;
//     }
//   };

// export const stateContext = (
//   initialState: InitialState,
//   reducers: Reducers
// ) => {
//   const { Consumer, Provider } = createContext({});

//   return {
//     Provider: stateComponent(
//       initialState,
//       reducers,
//       ({ children, ...props }: Props) => (
//         <Provider value={props}>{children}</Provider>
//       )
//     ),
//     consume: Component => props => (
//       <Consumer>{state => <Component {...props} {...state} />}</Consumer>
//     )
//   };
// };

export const toggle = (key: string) => (state: State): State => ({
  ...state,
  [key]: !state[key]
});
