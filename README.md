<div align="center">

{
<img width="150" hight="150" src="static/amnis-logo-256.png" alt="Amnis logo" />
}

</div>

<h1 align="center">Amnis State</h1>

<p align="center">
  A redux-based data management system for node-based applications.
</p>

<div align="center">

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/amnis-dev/amnis-state/blob/main/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@amnis/state/latest.svg)](https://www.npmjs.com/package/@amnis/state)
[![npm downloads](https://img.shields.io/npm/dm/@amnis/state.svg)](https://www.npmjs.com/package/@amnis/state)

Workflows

[![Integrity Check](https://github.com/amnis-dev/amnis-state/actions/workflows/integrity-check.yml/badge.svg)](https://github.com/amnis-dev/amnis-state/actions/workflows/integrity-check.yml)
[![Package](https://github.com/amnis-dev/amnis-state/actions/workflows/package.yml/badge.svg)](https://github.com/amnis-dev/amnis-state/actions/workflows/package.yml)

</div>

## Installation

### Prerequisite

This library requires [Redux Toolkit](https://github.com/reduxjs/redux-toolkit) to implement Redux state logic.

```sh
# NPM
npm install @reduxjs/toolkit

# Yarn
yarn add @reduxjs/toolkit
```

### Add the Package

Amnis State is available as an [npm package](https://www.npmjs.com/package/@amnis/state).

```sh
# NPM
npm install @amnis/state

# Yarn
yarn add @amnis/state
```

## Basic Setup

Amnis State can be quickly setup by adding the library's reducers and middlewares to your Redux store. Importing these resources depends on the runtime environment of your project.

There are three ways to import the reducers and middlewares...

### Browser Runtime

Use this import if you are running your project within a browser environment.

```typescript
import { reducerMap, reducerMiddleware } from '@amnis-state/env.browser';
```

### Browser Runtime (with React)

Use this import if you are running your project within a browser environment with React components.

```typescript
import { reducerMap, reducerMiddleware } from '@amnis-state/env.react';
```

### Node.js Runtime

Use this import if you are running your project within a Node.js environment.

```typescript
import { reducerMap, reducerMiddleware } from '@amnis-state/env.node';
```

### Example: Redux Toolkit Configuration 

```typescript
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { reducerMap, reducerMiddleware } from '@amnis-state/env.[runtime]';

/**
 * Setup your Redux store.
 */
const rootReducer = combineReducers(reducerMap);

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware().concat(reducerMiddleware)
  ),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
```