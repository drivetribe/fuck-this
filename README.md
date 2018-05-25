# Retrostate

**A stateful, functional React component microlibrary.**

[![npm](https://img.shields.io/npm/v/fuck-this.svg?style=flat-square)](https://www.npmjs.com/package/fuck-this) [![npm](https://img.shields.io/npm/dm/fuck-this.svg?style=flat-square)](https://www.npmjs.com/package/fuck-this)

<!-- TOC -->

- [About](#about)
- [Features](#features)
- [Get started](#get-started)
  - [Installation](#installation)
  - [Counter example](#counter-example)
  - [Initialising state via `props`](#initialising-state-via-props)
- [API](#api)
  - [stateComponent](#statecomponent)
    - [initialState](#initialstate)
    - [reducers](#reducers)
    - [render](#render)
  - [stateContext (Experimental)](#statecontext-experimental)
  - [Reducer helpers](#reducer-helpers)
    - [toggle](#toggle)
- [TODOs](#todos)
- [FAQs](#faqs)

<!-- /TOC -->

## About

Retrostate is a microlibrary for creating stateful, functional React components.

It's inspired (via an ajar window) by the approaches taken in [ReasonReact](https://github.com/reasonml/reason-react) and [Hyperapp](https://github.com/hyperapp/hyperapp).

It looks like this:

```javascript
import { stateComponent } from 'retrostate';

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

## Get started

### Installation

Fuck `this` can be installed via your favourite package manager as `retrostate`:

```bash
npm install retrostate
```

You can also use Retrostate in CodePen or locally by including the script from `https://unpkg.com/retrostate@0.1.0`.

### Counter example

To cover the basics of Retrostate, let's create a simple counter component. You've probably made a few of these in your time.

First let's define our initial state as a plain object:

```javascript
const initialState = { counter: 0 };
```

### Initialising state via `props`

So far we've defined `initialState` as an object. It can also be defined as a function that returns an object. This function is provided `props`, the same `props` that are provided to your component by its parent:

```javascript
const initialState = ({ initialCount }) => ({ count: initialCount });
```

Now when we use the exported function we can set `initialCount` and that'll be used to create `count`:

```javascript
<StatefulComponent initialCount={1} />
```

## API

### stateComponent

#### initialState

#### reducers

#### render

### stateContext (Experimental)

### Reducer helpers

Retrostate provides some utility methods to make creating reducers for common data types simpler.

#### toggle

A function that will create a reducer that toggles a binary state.

##### Example

```javascript
import { toggle } from 'retrostate';

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

In my opinion, there's a few problems with `this` and, specifically, `setState`:

1.

**No, I meant the "fuck". Do you honestly expect me to use this in a professional setting?**
You should definitely have bigger fish to fry. Chill your beans.
