# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.9.0](https://github.com/amnis-dev/amnis-state/compare/v0.8.3...v0.9.0) (2022-11-25)


### Features

* Renamed and refactored encryption slice to key slice ([8738740](https://github.com/amnis-dev/amnis-state/commit/8738740fb66622d595bd71c355f17dc1394d9fa2))
* Simplified mock services setup with new mock service interface ([e7fbe2d](https://github.com/amnis-dev/amnis-state/commit/e7fbe2d395e71bd49ceca2d8d8a015b3e0c42062))


### Bug Fixes

* Refined history and diff comparison logic on reducers and selectors ([97a6c1b](https://github.com/amnis-dev/amnis-state/commit/97a6c1b5eb8cbbbcf0e8a3c08c00b83eb913266b))
* Resolve build issue with importing msw/node ([d1293c8](https://github.com/amnis-dev/amnis-state/commit/d1293c8846afb54a1cb35ed71af5fb9b861589d8))

### [0.8.3](https://github.com/amnis-dev/amnis-state/compare/v0.8.2...v0.8.3) (2022-11-24)


### Features

* Added new reducer matcher for logout events ([bedf297](https://github.com/amnis-dev/amnis-state/commit/bedf297f5e4b200d9139b48223c4c5645c656477))
* Added public key property to user entities ([63011af](https://github.com/amnis-dev/amnis-state/commit/63011af3ba6920c75b07a0999a38025bcb226589))
* Asymmetric signatures now use elliptic curve algorithms for signing ([d00b9d7](https://github.com/amnis-dev/amnis-state/commit/d00b9d7ac2f6d288ec7a7e7dcfeaf8151726d9f8))
* Core bearer token removes itself from state on logout ([59472c0](https://github.com/amnis-dev/amnis-state/commit/59472c0d07b6e72e9af2cad07a86bda105300db0))
* Crypto package now exports utility methods ([38ca7e5](https://github.com/amnis-dev/amnis-state/commit/38ca7e587726f1be12e9280aaf059638ab6c87d9))
* Improvement on mocked unit tests ([2e40c23](https://github.com/amnis-dev/amnis-state/commit/2e40c236618a50c94cbe4c9e66ef736b4bcec706))

### [0.8.2](https://github.com/amnis-dev/amnis-state/compare/v0.8.1...v0.8.2) (2022-11-23)


### Features

* Added precommit script to install newly updated workspace versions on release ([9d327e3](https://github.com/amnis-dev/amnis-state/commit/9d327e338de2d09a51568c46496ebaa43f2b0ae7))
* Added step to commit files after install during a release ([510b35e](https://github.com/amnis-dev/amnis-state/commit/510b35ee19d8fa7a98da959dc0b9e7ea7b2b4076))


### Bug Fixes

* Fixed issue with different password encodings on node and browser ([d4f5388](https://github.com/amnis-dev/amnis-state/commit/d4f538884d0094ede1d4c7f174950ed83cc04a3d))
* Fixed missing flag for committing new changes on release ([699ee9c](https://github.com/amnis-dev/amnis-state/commit/699ee9c9ae298277bed8a8e36693ccd5fb4346b7))

### [0.8.1](https://github.com/amnis-dev/amnis-state/compare/v0.8.0...v0.8.1) (2022-11-22)


### Bug Fixes

* Appended missing api slice to the react module ([a1e2565](https://github.com/amnis-dev/amnis-state/commit/a1e256587cc0e498cb521f1459753c90ee1366b1))
* Fixed import of node:crypto by default ([b142767](https://github.com/amnis-dev/amnis-state/commit/b142767bcd4c2c1756c0086d5d9994cbd5dbb767))
* Fixed node: prefix on import causing webpack to fail ([84d72d3](https://github.com/amnis-dev/amnis-state/commit/84d72d33778feb3a78ffc522f3dfd890981d7345))

## [0.8.0](https://github.com/amnis-dev/amnis-state/compare/v0.7.5...v0.8.0) (2022-11-21)


### Features

* Added mocks for amnis core endpoints ([ed66dad](https://github.com/amnis-dev/amnis-state/commit/ed66dad371d3570f9993a489c8747de4d3894390))
* Added more options to configure api mocking ([f3e6419](https://github.com/amnis-dev/amnis-state/commit/f3e64196e70a0115e7cc543070ef810c6ca76fc2))
* Added more RSA methods ([c4481ba](https://github.com/amnis-dev/amnis-state/commit/c4481ba6d4b81881ffbbf9dcead4e60b44eaf217))
* Added new package for mocking api calls ([54c53ae](https://github.com/amnis-dev/amnis-state/commit/54c53aed88ef15b88b18986f9cf7aac886040120))
* Added tests for some crypto methods ([6294b79](https://github.com/amnis-dev/amnis-state/commit/6294b79862b1a4af96188cacfec086fd9d9b4076))
* Added yarn cache files for faster installs ([b2a2db5](https://github.com/amnis-dev/amnis-state/commit/b2a2db5f280b981c58a8a488d7ef1ee612ec1610))
* API settings can be configured dynamically using the api reducer ([5fadce3](https://github.com/amnis-dev/amnis-state/commit/5fadce3ca2ab77c9cf296509bb80bb7c643bb083))
* Completed new crypto interface for processor context ([03e4374](https://github.com/amnis-dev/amnis-state/commit/03e437489a6d704a9dd156266e076d9b2828a423))
* Completed refactor with unimplemented crypto interface for environment-base cryptography ([d12259a](https://github.com/amnis-dev/amnis-state/commit/d12259a7ec377747f01774c986cc8af8caca7c28))
* Created common interface type for cryptographic logic ([42876ee](https://github.com/amnis-dev/amnis-state/commit/42876ee6320ee71d1fa40831593b30e77114837c))
* Major refactor in creating state entities ([694c0c5](https://github.com/amnis-dev/amnis-state/commit/694c0c5c0c4ac3f800f89a9bfe4877ed731d2434))
* Minor refactoring of api reducers and matcher ([07d0252](https://github.com/amnis-dev/amnis-state/commit/07d02528189147cfad98ac599fcfb9f5b96f4a33))
* Refactored crypto package to utilize webcrypto ([af3e070](https://github.com/amnis-dev/amnis-state/commit/af3e070d40b6f7df1188bd2db43764cf6a7fd944))
* Removed jsonwebtoken as a dependency ([bdd65f8](https://github.com/amnis-dev/amnis-state/commit/bdd65f83678e1368da47cb30a819aff6063b2048))
* Renamed Amnis Mocks to Amnis Mock ([efcd9c4](https://github.com/amnis-dev/amnis-state/commit/efcd9c4c645dc1c7f8a9b79b7e253efcfc369c74))
* updated api configurations to be more generic ([66b9102](https://github.com/amnis-dev/amnis-state/commit/66b910245da0bbec4d38ecd4f61617596dbda6b9))
* upgraded to yarn 2 berry version ([0947358](https://github.com/amnis-dev/amnis-state/commit/0947358c321954f3a71ccc46e47c5b7e441a4aa8))


### Bug Fixes

* Fixed build orders and refactored crypto. ([8817810](https://github.com/amnis-dev/amnis-state/commit/8817810d2e0cea025ee0bdd6bbd239cdb5f7b776))
* Fixed issue with committed flag switching on and off ([1bbf430](https://github.com/amnis-dev/amnis-state/commit/1bbf4306ba28f0d68c9df71d498253c1f2b9adff))
* Fixed issue with the word logout included with a test name not running ([312d409](https://github.com/amnis-dev/amnis-state/commit/312d4095124002a72533e7135d5b939ca2878a4f))
* Fixed issues with linting ([d861d39](https://github.com/amnis-dev/amnis-state/commit/d861d39af586a13a57cfbd3938d3347d4a27a007))
* Fixed linting issues with new asym crypto methods ([ac4cb35](https://github.com/amnis-dev/amnis-state/commit/ac4cb3534b11a9cb57ca166d1a9ad2c1e0713f5f))
* Fixed password hashing method to encode into base64 ([67f8b06](https://github.com/amnis-dev/amnis-state/commit/67f8b06fb9253061f2c43ee38ac9b8002b5d4352))
* Resolved build errors with Crypto package ([8e78804](https://github.com/amnis-dev/amnis-state/commit/8e788040fe7692dd08b26c59116cc5d12d5d6aba))
* Set MSW as an external package during build ([102e434](https://github.com/amnis-dev/amnis-state/commit/102e43449af47f8d995b93ca647a58078dd67082))
* Updated yarn lock file ([69ad917](https://github.com/amnis-dev/amnis-state/commit/69ad917b07982d9b28962e0ac182b46e55612e32))
* Updated yarn lock with new workspace dependencies ([9d83f7f](https://github.com/amnis-dev/amnis-state/commit/9d83f7fe370577121b67e34a5d32add3bdc36706))

### [0.7.5](https://github.com/amnis-dev/amnis-state/compare/v0.7.4...v0.7.5) (2022-11-12)


### Features

* Added meta information for comparing entity changes ([239590b](https://github.com/amnis-dev/amnis-state/commit/239590b8ec34638a7fc30781f57120e8b25f4094))
* Added new diff comparison method ([0c5ecf5](https://github.com/amnis-dev/amnis-state/commit/0c5ecf5a9302fdcc8e33baa85f8816c66510d1ec))
* Added record for storing original local data copies ([0f9a124](https://github.com/amnis-dev/amnis-state/commit/0f9a124a277ae0646a595ea7a00b3ce70e567ab4))
* API updated responses will clear comparison data when committed ([8973951](https://github.com/amnis-dev/amnis-state/commit/8973951b1ca512096766f5cc11feaeed08ddad5b))
* Core selectors now added to each redux slice ([88f301e](https://github.com/amnis-dev/amnis-state/commit/88f301ec25ab1e821c6287d5af051f57ca222afb))
* Optimized selector functions with caching ([21edec6](https://github.com/amnis-dev/amnis-state/commit/21edec6816ce72a83059ace32253b9db9ae0b345))
* Removed dead code in Amnis State package ([f35d821](https://github.com/amnis-dev/amnis-state/commit/f35d821942af2b1c930c50e7e3e7369041853a8c))

### [0.7.4](https://github.com/amnis-dev/amnis-state/compare/v0.7.3...v0.7.4) (2022-11-11)


### Features

* Amnis API now exports utility methods ([4c1f299](https://github.com/amnis-dev/amnis-state/commit/4c1f2991c3efc0616c410ee2d461e9f2df068c55))
* Updated api calls to properly use mutations vs queries ([7835182](https://github.com/amnis-dev/amnis-state/commit/7835182e101940ae47163da569a37eafa7f91992))

### [0.7.3](https://github.com/amnis-dev/amnis-state/compare/v0.7.2...v0.7.3) (2022-11-11)


### Features

* Core now includes all redux toolkit tools that behave with ESM and TypeScript ([8e8ad2d](https://github.com/amnis-dev/amnis-state/commit/8e8ad2d257a5161f7a0852f02cde0e3ce653da02))

### [0.7.2](https://github.com/amnis-dev/amnis-state/compare/v0.7.1...v0.7.2) (2022-11-11)


### Bug Fixes

* Resolve issue with type glitch when file names name too many stop characters ([5a38202](https://github.com/amnis-dev/amnis-state/commit/5a38202fc46767b2f9f9f6fe9a82ef527ac5a58d))

### [0.7.1](https://github.com/amnis-dev/amnis-state/compare/v0.7.0...v0.7.1) (2022-11-11)


### Bug Fixes

* Fixed typing issues with react api ([0b7ff9b](https://github.com/amnis-dev/amnis-state/commit/0b7ff9b660d57abe7efd0a6e18d99f1054366244))

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
