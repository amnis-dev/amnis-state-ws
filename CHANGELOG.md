# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.7.0](https://github.com/amnis-dev/amnis-state/compare/v0.6.0...v0.7.0) (2022-11-10)


### Features

* Committed entities are flagged true when saved to the database through an api call ([242ed6a](https://github.com/amnis-dev/amnis-state/commit/242ed6a7070f97a7c9c455dcca4dc2d224554fda))
* Initial meta state for reducers are now built with a common method ([5881a47](https://github.com/amnis-dev/amnis-state/commit/5881a473bffd561cc7e847c49d2dab0dc8279492))


### Bug Fixes

* Fixed type issue with react api query hooks ([3740fae](https://github.com/amnis-dev/amnis-state/commit/3740fae8e3a4c49ffe1706c36201ab35fb7e8ec1))

## [0.6.0](https://github.com/amnis-dev/amnis-state/compare/v0.5.8...v0.6.0) (2022-11-08)


### Features

* Fixed missing fs package from build process ([e5e19a0](https://github.com/amnis-dev/amnis-state/commit/e5e19a05a0dbc3f181401120f4341786fc95b8dc))
* Renamed memory to dbmemory for more clarity on the adapter type ([bd8b7cf](https://github.com/amnis-dev/amnis-state/commit/bd8b7cf211692b19ea0139efea7442cb597268b7))
* Updated IO Context to include a file system adapter ([9d0ccea](https://github.com/amnis-dev/amnis-state/commit/9d0ccea0876e5f41cbb5d0b6a31ba296c663b0bc))


### Bug Fixes

* Updated tsconfig.build to include @amnis/fs package ([1b1a101](https://github.com/amnis-dev/amnis-state/commit/1b1a1016b9e0436d84fd7b462a73c7234b13dd8b))

### [0.5.8](https://github.com/amnis-dev/amnis-state/compare/v0.5.7...v0.5.8) (2022-11-04)


### Features

* Added contact data to profiles on registration and for default data ([fdb6d34](https://github.com/amnis-dev/amnis-state/commit/fdb6d34d72af082af462cd58fbd56190b586b70a))
* Amnis DB and Amnis FS are now included with Amnis State package ([4b87203](https://github.com/amnis-dev/amnis-state/commit/4b8720344c8b3f3bbbacbb18dc8b8e6857d5042f))


### Bug Fixes

* Fixed typo in profile data type ([7b84a8d](https://github.com/amnis-dev/amnis-state/commit/7b84a8d7dff8126eea66600d0c588a9c8f47ddf8))

### [0.5.7](https://github.com/amnis-dev/amnis-state/compare/v0.5.6...v0.5.7) (2022-10-30)


### Features

* All services and packages function with rollup builds ([1d48ba0](https://github.com/amnis-dev/amnis-state/commit/1d48ba0f4040766383f9f08eade4bb4a19dcd91e))

### [0.5.6](https://github.com/amnis-dev/amnis-state/compare/v0.5.5...v0.5.6) (2022-10-28)


### Features

* Added tests for Amnis Process processes and added more meaninging for initial data ([dd43cb3](https://github.com/amnis-dev/amnis-state/commit/dd43cb3e283e665d526945433706e5e418b57cb3))


### Bug Fixes

* Fixed system tests with newly added executive role ([8d484b3](https://github.com/amnis-dev/amnis-state/commit/8d484b3157f4abd2473dacc1ac38c772b41b40a3))
* Removed outdated data model for initial database setup ([1fe5ca1](https://github.com/amnis-dev/amnis-state/commit/1fe5ca1cd1ef733843ff3ded77a1b13980a51b0c))
* Resolved type issue in registration unit tests ([8a1a342](https://github.com/amnis-dev/amnis-state/commit/8a1a34255ba4d50cfbe78ea4fa1d33077e26dc7a))

### [0.5.5](https://github.com/amnis-dev/amnis-state/compare/v0.5.4...v0.5.5) (2022-10-27)

### [0.5.4](https://github.com/amnis-dev/amnis-state/compare/v0.5.3...v0.5.4) (2022-10-27)


### Features

* Implemented dynamic api urls. ([6314097](https://github.com/amnis-dev/amnis-state/commit/63140974cfdbd0303f9ccb3b42b7dc3aa1920ad3))

### [0.5.3](https://github.com/amnis-dev/amnis-state/compare/v0.5.2...v0.5.3) (2022-10-26)


### Features

* Removed outdated bcrypt package in favor of native node functions ([9bae451](https://github.com/amnis-dev/amnis-state/commit/9bae451d94b84a716a9e8d0f6d50978553318eba))

### [0.5.2](https://github.com/amnis-dev/amnis-state/compare/v0.5.1...v0.5.2) (2022-10-25)


### Features

* Updated dependency imports for bcypt ([1cecac8](https://github.com/amnis-dev/amnis-state/commit/1cecac88ea6c74cdfeada99b4ece86cec8d7df46))

### [0.5.1](https://github.com/amnis-dev/amnis-state/compare/v0.5.0...v0.5.1) (2022-10-25)


### Features

* Updated bundled outputs to transform commonjs to ES6 ([16d13f3](https://github.com/amnis-dev/amnis-state/commit/16d13f3148bbc3589a48a9fac28e1b9b75e9eaee))

## [0.5.0](https://github.com/amnis-dev/amnis-state/compare/v0.4.10...v0.5.0) (2022-10-25)


### Features

* Added minor and major release scripts ([195a099](https://github.com/amnis-dev/amnis-state/commit/195a099702560326675a5e3a24c09687d8169e33))


### Bug Fixes

* Fixed broken jest tests when importing redux-toolkit ESM modules ([b34d6b5](https://github.com/amnis-dev/amnis-state/commit/b34d6b545d2c0ceb13454ca3c39b73445432e58b))
* Imports ESM modules of Redux Toolkit. ([5175fb5](https://github.com/amnis-dev/amnis-state/commit/5175fb5fb5bb56ffc6df99f7492f8dabc891b5a7))

### [0.4.10](https://github.com/amnis-dev/amnis-state/compare/v0.4.9...v0.4.10) (2022-10-25)


### Features

* Enforced index imports for all projects to resolve mistakes in builds ([0cef5ce](https://github.com/amnis-dev/amnis-state/commit/0cef5ce7873ae0e42bb1ca1fab8e95fd12919066))

### [0.4.9](https://github.com/amnis-dev/amnis-state/compare/v0.4.8...v0.4.9) (2022-10-25)


### Features

* Combined type definitions with ESM library output ([0a40bc1](https://github.com/amnis-dev/amnis-state/commit/0a40bc14101005a2fabbc8a80a21d3d7508792b3))

### [0.4.8](https://github.com/amnis-dev/amnis-state/compare/v0.4.7...v0.4.8) (2022-10-25)


### Bug Fixes

* Fixed missing import issue when compiling with NCC or with any kind of resolved bundling. ([40aab13](https://github.com/amnis-dev/amnis-state/commit/40aab13ed03642c4ba4692dcc2468823ca7a0594))

### [0.4.7](https://github.com/amnis-dev/amnis-state/compare/v0.4.6...v0.4.7) (2022-10-24)


### Features

* Added missing exports and react talored api to packages. ([d3707b3](https://github.com/amnis-dev/amnis-state/commit/d3707b322f08725d6f54b1c99e13a2f55f9096df))

### [0.4.6](https://github.com/amnis-dev/amnis-state/compare/v0.4.5...v0.4.6) (2022-10-21)


### Features

* Added more organization to the project packages and fixed builds by remove exports from Core and Api from Amnis State ([4d90d41](https://github.com/amnis-dev/amnis-state/commit/4d90d41767ea5e1db69d2d62550a117c66eff712))
* renamed sets to convey which package they're from ([f3a3429](https://github.com/amnis-dev/amnis-state/commit/f3a3429860bba48c049314d4366e2fa197b85a0a))


### Bug Fixes

* Fixed broken build from exporting redux toolkit exports ([e187596](https://github.com/amnis-dev/amnis-state/commit/e187596f5750f8c72618d2cbd69180b7ba428ee5))

### [0.4.5](https://github.com/amnis-dev/amnis-state/compare/v0.4.4...v0.4.5) (2022-10-20)


### Features

* Included additional exports for Amnis Process and Amnis Core ([cc0e57a](https://github.com/amnis-dev/amnis-state/commit/cc0e57a5c59b9c10b5526a5326dec6be984f13f1))

### [0.4.4](https://github.com/amnis-dev/amnis-state/compare/v0.4.4-alpha.5...v0.4.4) (2022-10-20)


### Features

* Allow imports from index.js paths. ([03e4e91](https://github.com/amnis-dev/amnis-state/commit/03e4e91842be881e7b8941bb9ca771d5f3cae592))

### [0.4.4-alpha.5](https://github.com/amnis-dev/amnis-state/compare/v0.4.4-alpha.4...v0.4.4-alpha.5) (2022-10-20)


### Bug Fixes

* Added missing types folder in packages ([529dc07](https://github.com/amnis-dev/amnis-state/commit/529dc07d7d56dbfc5c46edd89fbe1b4be976fe9c))

### [0.4.4-alpha.4](https://github.com/amnis-dev/amnis-state/compare/v0.4.4-alpha.3...v0.4.4-alpha.4) (2022-10-20)


### Features

* Updated output location for library and type files for the Amnis Core package. ([6e06ac9](https://github.com/amnis-dev/amnis-state/commit/6e06ac95477e29d75256b8d08a1e2d11ef76f847))


### Bug Fixes

* Fixed unresolved typings for ESM imports. ([a533e6a](https://github.com/amnis-dev/amnis-state/commit/a533e6aa8315ce6cbe58d5c4d0458a5e9d34b8ba))

### [0.4.4-alpha.3](https://github.com/amnis-dev/amnis-state/compare/v0.4.4-alpha.2...v0.4.4-alpha.3) (2022-10-20)


### Features

* Bumped amnis configuration packages. ([17c2729](https://github.com/amnis-dev/amnis-state/commit/17c2729c6e9934af9ddfabddca3c9ef8a4fcd302))

### [0.4.4-alpha.2](https://github.com/amnis-dev/amnis-state/compare/v0.4.4-alpha.1...v0.4.4-alpha.2) (2022-10-17)


### Bug Fixes

* Fixed module issue with standard version ([64f5248](https://github.com/amnis-dev/amnis-state/commit/64f5248c83d69e582e67203eb8ca6dede2074345))

### [0.4.4-alpha.1](https://github.com/amnis-dev/amnis-state/compare/v0.4.4...v0.4.4-alpha.1) (2022-10-17)

### [0.4.4](https://github.com/amnis-dev/amnis-state/compare/v0.4.4-alpha.0...v0.4.4) (2022-10-17)


### Bug Fixes

* Bumped failed automated version updates. ([be12191](https://github.com/amnis-dev/amnis-state/commit/be12191c23b075fbc7809356679d86b020e1f44a))

### [0.4.4-alpha.0](https://github.com/amnis-dev/amnis-state/compare/v0.4.3...v0.4.4-alpha.0) (2022-10-17)


### Features

* Refactor project to ECMAScript Modules ([#3](https://github.com/amnis-dev/amnis-state/issues/3)) ([ed11b4f](https://github.com/amnis-dev/amnis-state/commit/ed11b4f92881af212281ea504df3111a3f24108a))

### [0.4.3](https://github.com/amnis-dev/amnis-state/compare/v0.4.2...v0.4.3) (2022-10-15)


### Features

* Updated package export configurations ([3757fdd](https://github.com/amnis-dev/amnis-state/commit/3757fdd894bc674bc87b4647022a310e92c4b972))
* Updated package export configurations ([cc050b4](https://github.com/amnis-dev/amnis-state/commit/cc050b411d4ec45ef516a8297f5d6e7b0aec8d02))


### Bug Fixes

* Enabled public access flag for NPM publishing ([1c92c95](https://github.com/amnis-dev/amnis-state/commit/1c92c95d24064e66a02c0ef7072b911ac7c3bbf5))

### [0.4.2](https://github.com/amnis-dev/amnis-state/compare/v0.4.1...v0.4.2) (2022-10-14)

### [0.4.1](https://github.com/amnis-dev/amnis-state/compare/v0.4.1-alpha.3...v0.4.1) (2022-10-14)


### Features

* Publishing no longer performs a dry run and versioning is no longer alpha. ([a265c1f](https://github.com/amnis-dev/amnis-state/commit/a265c1fabbded2111548cfe6dd457488f8d8b212))

### [0.4.1-alpha.3](https://github.com/amnis-dev/amnis-state/compare/v0.4.1-alpha.2...v0.4.1-alpha.3) (2022-10-14)


### Features

* Added lerna workspace tools and refactored packages ([c72d4d3](https://github.com/amnis-dev/amnis-state/commit/c72d4d301162c0cf9dc8f962ae00b2a477d5c383))


### Bug Fixes

* Added nominals as exports to fix build issues within TypeScript parsing. ([9a7876a](https://github.com/amnis-dev/amnis-state/commit/9a7876a2fdca444fadae11e41da0383f657351db))

### [0.4.1-alpha.2](https://github.com/amnis-dev/amnis-state/compare/v0.4.1-alpha.1...v0.4.1-alpha.2) (2022-10-13)


### Features

* Created automation for releasing standard versions with changelog updates. ([a80e533](https://github.com/amnis-dev/amnis-state/commit/a80e5330f41c78341e8446b3c4b212deed5226fb))

### [0.4.1-alpha.1](https://github.com/amnis-dev/amnis-state/compare/v0.4.1-alpha.0...v0.4.1-alpha.1) (2022-10-13)

### [0.4.1-alpha.0](https://github.com/amnis-dev/amnis-state/compare/v0.4.1-0...v0.4.1-alpha.0) (2022-10-13)

### [0.4.1-0](https://github.com/amnis-dev/amnis-state/compare/v0.4.0...v0.4.1-0) (2022-10-13)

## [0.4.0](https://github.com/amnis-dev/amnis-state/compare/v0.4.0-alpha.3...v0.4.0) (2022-10-13)


### Features

* Added core routing type of specifying navigation routes in the web address bar ([f07df6b](https://github.com/amnis-dev/amnis-state/commit/f07df6b12e4c1d96d742f5217a974bd667ae1b9f))
* Added file system package ([66e1b73](https://github.com/amnis-dev/amnis-state/commit/66e1b73fa094948e877cfd7e49c84e02a6c27451))
* Added tree capability to id references ([ec4c124](https://github.com/amnis-dev/amnis-state/commit/ec4c124c968479212c4693c41f75b36c6c1c00b4))


### Bug Fixes

* Fixed typescript errors ([244bee6](https://github.com/amnis-dev/amnis-state/commit/244bee6ac937e2a58f001908c0b90943f8f2603d))
* Fixed typescript issue in memory db ([820e8b5](https://github.com/amnis-dev/amnis-state/commit/820e8b5f9c70030793cec45955cbb8fbdae99116))
