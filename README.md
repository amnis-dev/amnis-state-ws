<div align="center">

{
<img width="150" hight="150" src="static/amnis-logo-256.png" alt="Amnis logo" />
}

</div>

<h1 align="center">Amnis State</h1>

<p align="center">
  A Redux-based data management system for Node.js applications.
</p>

<div align="center">

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/amnis-dev/amnis-state/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@amnis/state/latest.svg)](https://www.npmjs.com/package/@amnis/state)
[![npm downloads](https://img.shields.io/npm/dm/@amnis/state.svg)](https://www.npmjs.com/package/@amnis/state)

Workflows

[![Integrity Check](https://github.com/amnis-dev/amnis-state/actions/workflows/integrity-check.yml/badge.svg)](https://github.com/amnis-dev/amnis-state/actions/workflows/integrity-check.yml)
[![Package](https://github.com/amnis-dev/amnis-state/actions/workflows/package.yml/badge.svg)](https://github.com/amnis-dev/amnis-state/actions/workflows/package.yml)

</div>

## About

Amnis State is a library of extensible data structures and logic for complex applications. It contains typings, validations, actions, reducers, authentication, authorization, processing, and persistent storage methods. The target is to simplify important patterns in enterprise-level JavaScript applications.

Amnis State is framework independent. For example, the library can be used with [Express](https://github.com/expressjs/express), [React](https://github.com/facebook/react/), [Angular](https://github.com/angular/angular), or anything else. It can be utilized within a Browser or Node.js runtime (with or without a UI layer).

## Important Notice

This package is still in the Alpha stages of development. Expect frequent breaking changes as this library is being refined. I expect to have a stable beta release for Amnis State by the beginning of 2023.
## Installation

### Prerequisites

This library requires [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) to implement a state containment system.

```sh
# NPM
npm install @reduxjs/toolkit

# Yarn
yarn add @reduxjs/toolkit
```

It is highly recommended to [understand the logic and principles of Redux](https://redux.js.org/introduction/getting-started). It will help with customizing and extending this library for your specific project needs.

### Add the Package

Amnis State is available as an [npm package](https://www.npmjs.com/package/@amnis/state).

```sh
# NPM
npm install @amnis/state

# Yarn
yarn add @amnis/state
```

## Basic Setup

Amnis State can be quickly setup by adding the library's reducers and middlewares to your Redux store.

There are three ways to import the Redux reducers and middlewares based on your runtime environment...

### Browser Runtime

Use this import if you are running your project within a browser environment.

```typescript
import { set } from '@amnis/state/env.browser';
```

### Browser Runtime (with React)

Use this import if you are running your project within a browser environment leveraging React components.

```typescript
import { set } from '@amnis/state/env.react';
```

### Node.js Runtime

Use this import if you are running your project within a Node.js environment.

```typescript
import { set } from '@amnis/state/env.node';
```

### Example: Redux Toolkit Configuration

```typescript
/**
 * store.ts
 */
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { set } from '@amnis/state/env.[runtime]';

/**
 * Setup your Redux store.
 */
const rootReducer = combineReducers(set.reducers);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat(set.middleware)
  ),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
```

## Future Plans

### Pure ESM

This project will be transitioning to [Pure ESM](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). I'm waiting for [Redux](https://redux.js.org/), [Redux Toolkit](https://redux-toolkit.js.org/), and [Jest](https://jestjs.io/) to fully support it.

### Bun Runtime

There will be plans to ensure this package is optimized for the [Bun runtime environment](https://bun.sh/) as well as [Node.js](https://nodejs.org/).