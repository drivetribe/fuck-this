# <img alt="Fuck This" src="https://user-images.githubusercontent.com/7850794/40551187-28f8ea2a-6034-11e8-8e83-dd3a97fa7183.png" width="400">

**A stateful, functional React component microlibrary.**

[![npm](https://img.shields.io/npm/v/fuck-this.svg?style=flat-square)](https://www.npmjs.com/package/fuck-this) [![npm](https://img.shields.io/npm/dm/fuck-this.svg?style=flat-square)](https://www.npmjs.com/package/fuck-this)

<!-- TOC -->

- [About](#about)
- [Features](#features)
- [Get started](#get-started)
  - [Installation](#installation)
  - [Counter example](#counter-example)
  - [Initialising state and reducers via `props`](#initialising-state-and-reducers-via-props)
  - [Asynchronous reducers](#asynchronous-reducers)
  - [State via context (Beta)](#state-via-context-beta)
- [API](#api)
  - [`stateComponent`](#statecomponent)
  - [`stateContext` (Beta)](#statecontext-beta)
  - [Reducer helpers](#reducer-helpers)
    - [`toggle`](#toggle)
- [TODOs](#todos)
- [FAQs](#faqs)

<!-- /TOC -->

## About

Fuck `this` is a microlibrary for creating stateful, functional React components.

It's inspired (via an ajar window) by the approaches taken in [ReasonReact](https://github.com/reasonml/reason-react) and [Hyperapp](https://github.com/hyperapp/hyperapp).

It looks like this:

```javascript
import { stateComponent } from 'fuck-this';

const initialState = { count: 0 };

const reducers = {
  increment: (state, amount = 1) => ({
    ...state,
    count: state.count + amount
  })
};

const render = ({ count, increment }) => (
  <>
    <Text>{count}</Text>
    <Button onPress={() => increment()}>+</Button>
  </>
);

export default stateComponent(initialState, reducers, render);
```

## Features

* **Redux-style reducers:** Use of Redux-style reducers means all logic resides in one pure, testable location.
* **Reducers => actions:** Reducers are automatically converted into action functions and passed in as props. Named reducers means no more action strings littering your codebase.
* **Async reducers:** Reducers can be asynchronous to resolve data from external sources.
* **Portable render:** As state and actions are passed as props, the render function remains portable.
* **Tiny:** Less than 1kb.

## Get started

### Installation

Fuck `this` can be installed via your favourite package manager as `fuck-this`:

```bash
npm install fuck-this
```

You can also use Fuck `this` in CodePen or locally by including the script from `https://unpkg.com/fuck-this@0.1.0`.

### Counter example

To cover the basics of Fuck `this`, let's create a simple counter component with `stateComponent`. You've probably made a few of these in your time, one more won't hurt (we can hope).

First let's define our initial state as a plain object:

```javascript
const initialState = { counter: 0 };
```

Each property defined in the component state will be provided to our render function as an individual prop.

Next, let's define our reducers. A reducer takes the current state and some optional data, and returns a new copy of the state.

```javascript
const reducers = {
  increment: (state, amount) => ({
    ...state,
    counter: state.counter + amount
  })
};
```

When `reducers` is passed to `stateComponent`, each reducer have a corresponding **action** created and provided to the render function as a prop.

An action is called like this:

```javascript
increment(1);
```

When the action is called, Fuck `this` will provide the latest version of the state and the value passed to the action to the corresponding reducer. The state returned from the reducer becomes the latest component state.

Now, create a functional React component that displays the current `counter` and provides a button that fires `increment`.

```javascript
const render = ({ count, increment }) => (
  <>
    <span>{count}</span>
    <button onClick={() => increment(1)}>+</button>
  </>
);
```

We have our initial state, our reducer functions and a component. All that's left is to bind these together with `stateComponent`:

```javascript
import { stateComponent } from 'fuck-this';

/* Our `initialState`, `reducers` and `render` declarations */

export default stateComponent(initialState, reducers, render);
```

This component can be now be render as any other:

```javascript
import Counter from './Counter';
export default () => <Counter />;
```

### Initialising state and reducers via `props`

So far we've defined `initialState` and `reducers` as objects.

Both can also be defined as a function that returns an object. This function is provided `props`, the same `props` that are provided to your component by its parent:

```javascript
const initialState = ({ initialCount }) => ({ count: initialCount });
```

Now when we use the component returned from `stateComponent`, we can provide it `initialCount`:

```javascript
<Counter initialCount={1} />
```

`count` will now be initialised as `1`.

With reducers, we can use this capability to (for instance) bind an API endpoint. If we're calling an async endpoint, it means we'll need async reducers. Which, luckily...

### Asynchronous reducers

Our reducers can be asynchronous. They still return a new state, but do so after resolving data, or some other async operation.

Here's a `reducers` factory function that takes a `fetchCount` endpoint via `props`, and returns an async `updateCount` reducer:

```javascript
const initialState = { count: 0 };

const reducers = ({ fetchCount }) => ({
  updateCount: async (state) => {
    const count = await fetchCount();
    return { ...state, count };
  };
});
```

The rest of our component looks like this:

```javascript
const render = ({ count, updateCount }) => (
  <>
    <span>{count}</span>
    <button onClick={updateCount}>Update</button>
  </>
);

export default stateComponent(initialState, reducers, render);
```

We'd call this component like so, ensuring we provide a `fetchCounter` function:

```javascript
<Counter fetchCounter={fetchCounter} />
```

### State via context (Beta)

`stateComponent` is great for creating components with local state, but sometimes we need a way to pass this state throughout our application.

The `stateContext` function does exactly this. It takes `initialState` and `reducers` arguments, and returns a `Provider` component and a `consumer` function.

Create a `stateContext` with the same `initialState` and `reducers` that we used earlier:

```javascript
import { stateContext } from 'fuck-this';

const initialState = { counter: 0 };

const reducers = {
  increment: (state, amount) => ({
    ...state,
    counter: state.counter + amount
  })
};

export default stateContext(initialState, reducers);
```

To provide this state to a subtree, we can use the `Provider` component that this function generates.

It works just like `React.createContext`'s `Provider`, except our state and actions have already been generated so there's no need to set `value`:

```javascript
import Counter from './Counter';

export default () => (
  <Counter.Provider>
    {/* Any children can subscribe to this store with Counter.Consumer */}
  </Counter.Provider>
);
```

This component can optionally accept `props` which can be used to initiate `initialState` and/or `reducers` as before.

```javascript
<Counter.Provider initialCount={1}>
```

We can subscribe any component to this state with the `consume` function:

```javascript
import Counter from './Counter';

const render = ({ counter, increment }) => (
  <>
    <span>{count}</span>
    <button onClick={() => increment(1)}>Update</button>
  </>
);

export default Counter.consume(render);
```

## API

### `stateComponent`

Used to create a stateful component.

```javascript
import { stateComponent } from 'fuck-this';
```

##### Type

```typescript
type Props = { [key: string]: any };
type State = { [key: string]: any };
type Reducers = {
  [key: string]: (state: State, payload: any) => State
};

type StateComponent = (
  initialState: State | (props: Props) => State,
  reducers: Reducers | (props: Props) => Reducers,
  render: (props: Props) => React.Node
) => React.Component;
```

### `stateContext` (Beta)

Used to create a state `Provider` component and `consume` higher-order component.

```javascript
import { stateContext } from 'fuck-this';
```

##### Type

```typescript
type Props = { [key: string]: any };
type State = { [key: string]: any };
type Reducers = {
  [key: string]: (state: State, payload: any) => State
};

type StateContext = (
  initialState: State | (props: Props) => State,
  reducers: Reducers | (props: Props) => Reducers
) => {
  Provider: React.Component,
  consume: (component: React.Component) => React.Component
};
```

### Reducer helpers

Fuck `this` provides some utility methods to make creating reducers for common data types simpler.

#### `toggle`

A function that will create a reducer that toggles a binary state.

##### Example

```javascript
import { toggle } from 'fuck-this';

const initialState = { isOpen: false };

const reducers = { toggleOpen: toggle('isOpen') };
```

##### Type

```typescript
(key: string) => (state: State) => State;
```

## TODOs

Some ideas on how to push this library/pattern forward:

* **Lifecycle events:** If we can expose lifecycle events in a pure way, this might be a nice extra. I personally feel like ReasonReact's `self` is too much of an encroachment of classiness into FP, but there's probably a pure solution here.

## FAQs

**Does this work with React < 16.3?**
No. `stateContext` uses the new context API. It's a tough old world I know but it's just a simple matter of not having time to support legacy environments.

**Browser support?**
Absolutely.

**Why "Fuck `this`"?**

In my opinion, there's a few problems with `this` and, specifically, `setState`.

With `this` **in general** I feel like the whole mess around execution context and needing to ensure we've bound certain functions in certain situations is indicative that there's a better, simpler, cleaner way.

This isn't to say that `this` doesn't have its virtues, just that my gut feel is that it's overused in a library that is `state => view`.

As for `setState`, it's messy and unpredictable.

It's fine(ish) for simple tasks but larger components can quickly grow littered with and it's hard to know what each one does. It's only up to convention that they're wrapped in a function that says what it does.

Each `setState` call can modify the state in any way it wishes. It can be hard to track down the source of changes.

With reducers, we keep all of our state dickery into a single place. The reducers themselves are pure, so we can test that they do exactly what they say they will. And because they're named, we know exactly what each one is supposed to do.

**No, I meant the "fuck". Do you honestly expect me to use this in a professional environment?**
Haha. IKR.
