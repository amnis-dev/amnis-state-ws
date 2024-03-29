# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.13.1](https://github.com/amnis-dev/amnis-state/compare/v0.13.0...v0.13.1) (2023-02-14)


### Features

* **Bearer:** Bearer tokens will attempt to renew when expired ([360826a](https://github.com/amnis-dev/amnis-state/commit/360826ad8f60e734bbf2a3314dda84cb821224ea))


### Bug Fixes

* **Deps:** Deps could not add alpha as a range ([83a66bb](https://github.com/amnis-dev/amnis-state/commit/83a66bb2a33551457f4f2cdbd4ac188d3e999d42))
* **Deps:** Packages now depend on redux toolkit alpha ([dc9a87c](https://github.com/amnis-dev/amnis-state/commit/dc9a87c55f52d1f58aaa4624dd549d82e9427ed3))
* **Types:** Fixed selector return types not inferring properly ([2b0f856](https://github.com/amnis-dev/amnis-state/commit/2b0f856584f6800f5df73690bc35678e5fb8ac31))

## [0.13.0](https://github.com/amnis-dev/amnis-state/compare/v0.12.3...v0.13.0) (2023-02-11)


### Features

* **Vite:** Replace old compile and test tools with vite and vitest ([e5ea4ce](https://github.com/amnis-dev/amnis-state/commit/e5ea4ceaf4b4e3780aad69c3632510341dae0980))
* **workflow:** Updated workflow with new project settings ([40460cd](https://github.com/amnis-dev/amnis-state/commit/40460cdb784fb31656ad4d54b44bd27b0ceca707))


### Bug Fixes

* **Build:** Build functions with new vite addition ([24bf1cf](https://github.com/amnis-dev/amnis-state/commit/24bf1cff9a648108f539a732f709ed54faf2067e))
* **workflow:** Possible fix for node install ([bf3a48c](https://github.com/amnis-dev/amnis-state/commit/bf3a48cb7580a63deefde9cec4b6b8a4258d71e9))
* **workflow:** Possible fix for node installs ([0fac174](https://github.com/amnis-dev/amnis-state/commit/0fac1742c674c902229e46b2355d660d41f23d4b))
* **workflow:** Possible fix for yarn install checksum errors ([8072d98](https://github.com/amnis-dev/amnis-state/commit/8072d9831af0dbbfb0800e5acfce9f17f7ef4850))

### [0.12.3](https://github.com/amnis-dev/amnis-state/compare/v0.12.2...v0.12.3) (2023-02-10)

### [0.12.2](https://github.com/amnis-dev/amnis-state/compare/v0.12.1...v0.12.2) (2023-02-10)


### Bug Fixes

* **Auth:** Last login date-time re-applied to user accounts ([a0b3ef9](https://github.com/amnis-dev/amnis-state/commit/a0b3ef9e7abcdf2666712bf2861e46bf66def3d3))

### [0.12.1](https://github.com/amnis-dev/amnis-state/compare/v0.12.0...v0.12.1) (2023-02-06)


### Features

* **Database:** Added additional query feature to database read operations ([ecc44e8](https://github.com/amnis-dev/amnis-state/commit/ecc44e88a36850d44d36628fc6e85d17c149b3dc))
* **System:** Added more system configurations ([b84006d](https://github.com/amnis-dev/amnis-state/commit/b84006d9c309d02aa0ed8f9ca3fe40c7a30c0239))


### Bug Fixes

* **System:** Fixed missing default system property ([b6fce7f](https://github.com/amnis-dev/amnis-state/commit/b6fce7fff87ebdafd0da79c53a025d5c6841b334))

## [0.12.0](https://github.com/amnis-dev/amnis-state/compare/v0.11.4...v0.12.0) (2023-01-28)


### Features

* **Data:** Initial data includes the initial create history of all the entities ([91b4fba](https://github.com/amnis-dev/amnis-state/commit/91b4fbae00719792851b08fec90fdf9fbb431192))
* **Grants:** Grants have been simplified and functions for filtering have been optimized ([acc0ab1](https://github.com/amnis-dev/amnis-state/commit/acc0ab18b02a42d7b121104018e905052c1b5e34))
* **History:** History entities can now capture create, update, and delete tasks ([0180136](https://github.com/amnis-dev/amnis-state/commit/01801362c486caed65cdf7d1940fd88407001988))
* **Read:** Refactored read processor ([525da72](https://github.com/amnis-dev/amnis-state/commit/525da724fb1ab8050033ebeeb667f61594e351b1))
* **State Middleware:** Added new middleware for filtering state on processers ([b4f363e](https://github.com/amnis-dev/amnis-state/commit/b4f363e2e73fa45909c1eb49645a48810856f0ac))
* **Update:** Refactored update processer with state middleware ([18dd491](https://github.com/amnis-dev/amnis-state/commit/18dd491e6d394091d0f355c12cd4c89e0ba9fe5d))

### [0.11.4](https://github.com/amnis-dev/amnis-state/compare/v0.11.3...v0.11.4) (2023-01-12)


### Features

* OTP requests now send without a verified email. ([aa7bae3](https://github.com/amnis-dev/amnis-state/commit/aa7bae3166cc4fa40aebaee0a7e2b19f8ee70286))
* Successful OTP challenges sent to emails will verify that email ([5b2ca10](https://github.com/amnis-dev/amnis-state/commit/5b2ca10697ddfa02c5d56ff6c9e2db2d785472fc))

### [0.11.3](https://github.com/amnis-dev/amnis-state/compare/v0.11.2...v0.11.3) (2023-01-12)


### Features

* Extended test to login after adding a credential ([07b2038](https://github.com/amnis-dev/amnis-state/commit/07b20388df7f808ac8da6debc22eb4fd3d6728b8))


### Bug Fixes

* Fixed issue with new credentials not being immediately cached ([6aa7a10](https://github.com/amnis-dev/amnis-state/commit/6aa7a10db5d582b027ff62669375d9819163768c))

### [0.11.2](https://github.com/amnis-dev/amnis-state/compare/v0.11.1...v0.11.2) (2023-01-12)


### Features

* OTP email send to the subjects email without passing in the matching email ([898c5eb](https://github.com/amnis-dev/amnis-state/commit/898c5eb494a192e8cc4032995ccc4a6b4f049206))

### [0.11.1](https://github.com/amnis-dev/amnis-state/compare/v0.11.0...v0.11.1) (2023-01-10)


### Bug Fixes

* Fixed issue with administrators not being able to update user passwords ([85e4243](https://github.com/amnis-dev/amnis-state/commit/85e424330ee1518f4dd87d8708de15bf4206214f))

## [0.11.0](https://github.com/amnis-dev/amnis-state/compare/v0.10.4...v0.11.0) (2023-01-08)


### Features

* Added authentication process for existing sessions to re-login with ([75805a3](https://github.com/amnis-dev/amnis-state/commit/75805a3270189fe50de2b9f791b6fd9bd628dce8))
* Added extra security to subject challenges ([c6bef90](https://github.com/amnis-dev/amnis-state/commit/c6bef90f865bd0f6999bb12a4075551f893f4b4a))
* Added handle to the redux state ([070d906](https://github.com/amnis-dev/amnis-state/commit/070d906117bb800f9b99372293013cd2960667bc))
* Added mocked tests for new auth processors ([58968ec](https://github.com/amnis-dev/amnis-state/commit/58968ec717cef22de88e273fbf22b3af1ece122c))
* Added new create auth process for creating new accounts ([a8a9457](https://github.com/amnis-dev/amnis-state/commit/a8a945700e19306e7ffee3085789768f8bda6ae5))
* Added new handle core type ([6d8b965](https://github.com/amnis-dev/amnis-state/commit/6d8b965b6e10e9968da1f2f7ad4155e9bc811024))
* Added new headers for signatures and challenges ([5cfe31f](https://github.com/amnis-dev/amnis-state/commit/5cfe31f767b6816723330bc5436b282c85fbde0d))
* Added new process for adding credentials to existing accounts ([3ec2881](https://github.com/amnis-dev/amnis-state/commit/3ec28817494fdf1394e8e2f0238602d97dd68fdd))
* Added new property to entities to show if they have ever been stored ([e1256f9](https://github.com/amnis-dev/amnis-state/commit/e1256f99c016503af24311b2bd417391dbdf96e3))
* Added processing for one-time-passcode challenged with tests ([7c55353](https://github.com/amnis-dev/amnis-state/commit/7c55353b4d64bb9b48996764f23f1e9d5a99207c))
* Added reducer to reference the latest added OTP ([3204a13](https://github.com/amnis-dev/amnis-state/commit/3204a13ec5d8c6d235b7d32fb3ee1d7742446f36))
* Challenges can generate and send one-time-passcodes ([103640f](https://github.com/amnis-dev/amnis-state/commit/103640fcb9768c7e41ed4f22e38ae764c30acd86))
* emails can be added to users upon registration ([eb14ac4](https://github.com/amnis-dev/amnis-state/commit/eb14ac43a326995827cc17e06ae64b74b8c1327f))
* refined adding auth credentials ([ae030db](https://github.com/amnis-dev/amnis-state/commit/ae030db896a09ac336aeea320605c23cfef6d68b))
* Updated processors with new authentication use and testing ([8b0f818](https://github.com/amnis-dev/amnis-state/commit/8b0f818a1f8271d66e243e955e37827e0cd12bf4))
* Upgraded schema generation tool to latest ([ece4f55](https://github.com/amnis-dev/amnis-state/commit/ece4f55e8fb3b4445f0d907160548e50a76bbe26))


### Bug Fixes

* Fixed issue with credential ID mutating during a registration event ([9482609](https://github.com/amnis-dev/amnis-state/commit/9482609c954a89db222a4cb0860afc21376b7546))
* Fixed linting issues from refactored challenge middleware ([197631b](https://github.com/amnis-dev/amnis-state/commit/197631b91732cfb55d83d71e3f2fd667c8f869a0))

### [0.10.4](https://github.com/amnis-dev/amnis-state/compare/v0.10.3...v0.10.4) (2022-12-14)


### Bug Fixes

* Fixed issue with session flags not flagging when a privileged account is used ([ae78cde](https://github.com/amnis-dev/amnis-state/commit/ae78cde0573f1d80d44061fe33467a4890c409a4))

### [0.10.3](https://github.com/amnis-dev/amnis-state/compare/v0.10.2...v0.10.3) (2022-12-14)


### Features

* Added success logs for delete operations ([d38f7b7](https://github.com/amnis-dev/amnis-state/commit/d38f7b7394c550d56979437b6be1fac187ea88ff))
* Added success messages on create and update operations ([4990b2f](https://github.com/amnis-dev/amnis-state/commit/4990b2fb265d92bc915cac005f1a7cb10a49962c))
* Refactored naming of processors ([e5e95ba](https://github.com/amnis-dev/amnis-state/commit/e5e95bac6d3780586293d1fbde718b09ac041e70))

### [0.10.2](https://github.com/amnis-dev/amnis-state/compare/v0.10.1...v0.10.2) (2022-12-13)


### Features

* Wrapping keys now use JWK exported key with AES-GCM encryption ([962a934](https://github.com/amnis-dev/amnis-state/commit/962a93404404d0e99ee7af75173ce561b406378b))

### [0.10.1](https://github.com/amnis-dev/amnis-state/compare/v0.10.0...v0.10.1) (2022-12-13)


### Features

* Added agent utility methods with localstorage persistence ([5e87ba3](https://github.com/amnis-dev/amnis-state/commit/5e87ba30fe89a2cec459be1ceae74279688db022))
* Added local storage interface for core package ([8c1be78](https://github.com/amnis-dev/amnis-state/commit/8c1be7884b5d48844c0b954e1fa2c0f7ae125a9f))


### Bug Fixes

* challenge fetches o longer cache ([f6543ac](https://github.com/amnis-dev/amnis-state/commit/f6543acbe06439aed4d5fdc1bca4a1260bdd2410))

## [0.10.0](https://github.com/amnis-dev/amnis-state/compare/v0.9.3...v0.10.0) (2022-12-11)


### Features

* Added refreshing middleware to create delete and update middleware ([700ec9c](https://github.com/amnis-dev/amnis-state/commit/700ec9cada3f16c122ca0f2c9d93dde3c51ccf91))
* Challenges can now be set for specific users ([a203142](https://github.com/amnis-dev/amnis-state/commit/a20314287d5c1d7b9e6a27b5db1e7d8e53c8eb62))
* Device is now an entity type ([2030ceb](https://github.com/amnis-dev/amnis-state/commit/2030ceb8e1e88e1e4605457c7ef7334666d73d7e))
* Refactor on entity creations ([b0d7a10](https://github.com/amnis-dev/amnis-state/commit/b0d7a10e61ed7684a8a182a66eb1a90f85c32b94))
* Refactored authentication and registration to use asymetric 2-factor credentials ([2ee2354](https://github.com/amnis-dev/amnis-state/commit/2ee235483cc35be9678f178f55a26af8764f60fc))
* Refactored challenge methods ([e68a659](https://github.com/amnis-dev/amnis-state/commit/e68a6597d3bd137b5483a409e3eb9c64e9f0a9fc))
* Renamed device entity to credential entity ([551c6fe](https://github.com/amnis-dev/amnis-state/commit/551c6feaec3148d7d8082af910a0168745547929))

### [0.9.3](https://github.com/amnis-dev/amnis-state/compare/v0.9.2...v0.9.3) (2022-11-30)


### Bug Fixes

* Fixed issue with diff comparison bugging when arrays are of zero length. ([5c89053](https://github.com/amnis-dev/amnis-state/commit/5c89053c3188f6b68be71d8b09a281787a05cfc5))

### [0.9.2](https://github.com/amnis-dev/amnis-state/compare/v0.9.1...v0.9.2) (2022-11-28)


### Features

* Added basic memory interfaces to core package ([e8d81c8](https://github.com/amnis-dev/amnis-state/commit/e8d81c8aea04297124bde9138bee8e821c3a25e4))
* Added ffmpeg install step for integrity workflow ([9292fda](https://github.com/amnis-dev/amnis-state/commit/9292fdacc66b7dccfca424a5c4f765749b2d620c))
* Added new send interface for emails and texts ([61f5e34](https://github.com/amnis-dev/amnis-state/commit/61f5e34e12c8dfd8dabf3332317190cc6b473cbb))
* Amnis Crypto is now part of the Amnis Core package ([3cafbd9](https://github.com/amnis-dev/amnis-state/commit/3cafbd9ae3119719e9d942259ed8978c87e1da76))
* Amnis DB and Amnis FS are now included with the Amnis Core package ([dc72caf](https://github.com/amnis-dev/amnis-state/commit/dc72caf8dba4ff4f6e9fbe4d926df7dc64926d48))
* Bearer reducer now has it's own wipe action ([79b4135](https://github.com/amnis-dev/amnis-state/commit/79b413558bbe4b5aac7a3f38e33107700d060b8d))
* Bearer state is also wiped from the core wipe action ([c60f3c2](https://github.com/amnis-dev/amnis-state/commit/c60f3c2a70f76d7ed159f19349a9274661d2bcbc))
* Large reorganization of amnis/core package ([0948fb8](https://github.com/amnis-dev/amnis-state/commit/0948fb8876b27fa0d6028b58c57414b26765dea5))


### Bug Fixes

* Fixed broken unit testing flow in integrity check ([b2bc3c0](https://github.com/amnis-dev/amnis-state/commit/b2bc3c0023bf40bdc1a24a9bf79fd556fa92e4ec))
* Fixed circular dependency issue in amnis core ([4af8672](https://github.com/amnis-dev/amnis-state/commit/4af86723544386101550bd037ebb6f67bc397ceb))

### [0.9.1](https://github.com/amnis-dev/amnis-state/compare/v0.9.0...v0.9.1) (2022-11-25)


### Bug Fixes

* Fixed issue with browser importing the node version of msw ([66ea5a7](https://github.com/amnis-dev/amnis-state/commit/66ea5a73b77275b24ad4150f7b8a1eac0e727d88))

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
* Renamed memory to databaseMemory for more clarity on the adapter type ([bd8b7cf](https://github.com/amnis-dev/amnis-state/commit/bd8b7cf211692b19ea0139efea7442cb597268b7))
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
