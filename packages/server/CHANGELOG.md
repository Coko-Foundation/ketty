# [1.45.0](https://gitlab.coko.foundation/ketida/server/compare/v1.44.1...v1.45.0) (2025-02-06)


### Features

* db field ([885a8ef](https://gitlab.coko.foundation/ketida/server/commit/885a8ef1dddc152ef1cb689c070bef3b48dfe7dd))

## [1.42.2](https://gitlab.coko.foundation/ketida/server/compare/v1.42.1...v1.42.2) (2024-12-12)


### Bug Fixes

* ui text ([294fad8](https://gitlab.coko.foundation/ketida/server/commit/294fad8265b86cb9979a037a87793e31da1979cb))

# [1.41.0](https://gitlab.coko.foundation/ketida/server/compare/v1.40.0...v1.41.0) (2024-11-13)


### Bug Fixes

* **api/graphql:** delete old translation file for a language when uploading new one ([6b6e237](https://gitlab.coko.foundation/ketida/server/commit/6b6e2378df18b3ca0d5429064bd6322a59469a7a))
* **api/graphql:** use language code for translation file name ([44631eb](https://gitlab.coko.foundation/ketida/server/commit/44631eb239c706424b20400a17beb9aa407e17a1))


### Features

* add default english language strings for translations ([89e0505](https://gitlab.coko.foundation/ketida/server/commit/89e0505c5bca6852a77808a45f79652f5024964c))

# [1.40.0](https://gitlab.coko.foundation/ketida/server/compare/v1.39.0...v1.40.0) (2024-11-04)


### Features

* **models:** add migration to rename lategrey-\>slategrey ([d189329](https://gitlab.coko.foundation/ketida/server/commit/d1893293433f61ea690f5697798c182458300440))

# [1.39.0](https://gitlab.coko.foundation/ketida/server/compare/v1.38.9...v1.39.0) (2024-10-29)


### Bug Fixes

* **api/graphql:** create new mutation to rename book component ([a28cf5e](https://gitlab.coko.foundation/ketida/server/commit/a28cf5efd77acb33839ee3f08aa0d526a3be7fe4))


### Features

* update pagedjs microservice version and env variables ([0cc79b4](https://gitlab.coko.foundation/ketida/server/commit/0cc79b401b177846e8664cf494543ad24f9f83f3))

# [1.36.0](https://gitlab.coko.foundation/ketida/server/compare/v1.35.0...v1.36.0) (2024-07-24)


### Bug Fixes

* **controllers:** pass 4th parameter as null when adding component to newly created book ([fde8da1](https://gitlab.coko.foundation/ketida/server/commit/fde8da138a96fb90ca841a865eeb8df0b6f9b416))


### Features

* comments for book components ([399d717](https://gitlab.coko.foundation/ketida/server/commit/399d717c93f699e911191fb8449d81a84a96fa85))

# [1.35.0](https://gitlab.coko.foundation/ketida/server/compare/v1.34.6...v1.35.0) (2024-07-22)


### Features

* **controllers:** add option to create new chapter at a specific position ([fa8932c](https://gitlab.coko.foundation/ketida/server/commit/fa8932ce6b74e82b52cb6ec2e01211328ba0ec5a))

## [1.34.6](https://gitlab.coko.foundation/ketida/server/compare/v1.34.5...v1.34.6) (2024-07-16)


### Bug Fixes

* **controllers:** remove dot from xls file extensions ([70d9a97](https://gitlab.coko.foundation/ketida/server/commit/70d9a97b746e90251c297a2156a251574d065b10))

## [1.34.5](https://gitlab.coko.foundation/ketida/server/compare/v1.34.4...v1.34.5) (2024-07-11)


### Bug Fixes

* **controllers:** reduce section array length during embedding uploading and saving ([00efba7](https://gitlab.coko.foundation/ketida/server/commit/00efba71cd5cdd08b1c76f58281f2d0f5b78fb86))

## [1.34.4](https://gitlab.coko.foundation/ketida/server/compare/v1.34.3...v1.34.4) (2024-07-10)


### Bug Fixes

* fix chunk upload for files with lots of headings or no headings ([caf6470](https://gitlab.coko.foundation/ketida/server/commit/caf64705f766f9e414e7e1dfc884e7ade17ff46a))

## [1.34.3](https://gitlab.coko.foundation/ketida/server/compare/v1.34.2...v1.34.3) (2024-07-05)


### Bug Fixes

* **api/graphql:** emit kb-updated event when deleting documents ([fee965d](https://gitlab.coko.foundation/ketida/server/commit/fee965d2e0ed7824e8c6cd2aa5a9385d48d0d33c))

## [1.34.1](https://gitlab.coko.foundation/ketida/server/compare/v1.34.0...v1.34.1) (2024-06-26)


### Bug Fixes

* **controllers:** add index to filename if duplicated in book's KB ([12798a4](https://gitlab.coko.foundation/ketida/server/commit/12798a47edca4626e3199441969f26c4fecd655a))

# [1.34.0](https://gitlab.coko.foundation/ketida/server/compare/v1.33.5...v1.34.0) (2024-06-25)


### Bug Fixes

* **docker:** add pgvector in Dockerfile for local developmnet ([90b5996](https://gitlab.coko.foundation/ketida/server/commit/90b5996d624e1ae369e6ea8036405bcc0cec8ac6))
* put pgvector installation inside main Dockerfile ([a017a61](https://gitlab.coko.foundation/ketida/server/commit/a017a61d1a05d29143360b5e0c5109d0db391cce))
* update dockerfile ([685537f](https://gitlab.coko.foundation/ketida/server/commit/685537f3f09f2f226c3a1facf9fe9dd713b8a44e))

## [1.33.5](https://gitlab.coko.foundation/ketida/server/compare/v1.33.4...v1.33.5) (2024-06-19)


### Bug Fixes

* use alpine node in Dockerfile to install java dependency ([b5db452](https://gitlab.coko.foundation/ketida/server/commit/b5db452c3391bea36cc05d41cb218dbd00e08a78))

## [1.33.4](https://gitlab.coko.foundation/ketida/server/compare/v1.33.3...v1.33.4) (2024-06-18)

### Bug Fixes

- **docker:** change node image to be able to run apt-get ([35f63da](https://gitlab.coko.foundation/ketida/server/commit/35f63da65406f17dbbc8b2c511c7f35dc943c614))

## [1.33.2](https://gitlab.coko.foundation/ketida/server/compare/v1.33.1...v1.33.2) (2024-06-14)

### Bug Fixes

- update dockerfile ([662d671](https://gitlab.coko.foundation/ketida/server/commit/662d6711eafa7aa4f148f85ff5506c9403267106))

## [1.33.1](https://gitlab.coko.foundation/ketida/server/compare/v1.33.0...v1.33.1) (2024-06-14)

### Bug Fixes

- put pgvector installation inside main Dockerfile ([229eef3](https://gitlab.coko.foundation/ketida/server/commit/229eef3603d30a1d88f950e0986e6cddcfddb4e7))

# [1.33.0](https://gitlab.coko.foundation/ketida/server/compare/v1.32.0...v1.33.0) (2024-06-14)

### Features

- create knowledge base and introduce embeddings for RAG ([27aa554](https://gitlab.coko.foundation/ketida/server/commit/27aa55413f52cc8100f6710016d68739f1103451))

# [1.32.0](https://gitlab.coko.foundation/ketida/server/compare/v1.31.0...v1.32.0) (2024-06-10)

### Features

- Enable and disable KB flow ([5df8835](https://gitlab.coko.foundation/ketida/server/commit/5df8835753ba572a4e40f709f33bd06a8655f69a))

# [1.30.0](https://gitlab.coko.foundation/ketida/server/compare/v1.29.3...v1.30.0) (2024-06-03)

### Features

- Autogenerate 1st chapter, return book component when creating one ([a2a8077](https://gitlab.coko.foundation/ketida/server/commit/a2a8077a1f9f17a2d5d2461597866d063f66e8cf))

## [1.29.3](https://gitlab.coko.foundation/ketida/server/compare/v1.29.2...v1.29.3) (2024-05-28)

### Bug Fixes

- **api/graphql:** return error instead of throwing it in permisson shield ([997bca2](https://gitlab.coko.foundation/ketida/server/commit/997bca2c3ba5e6c4fa2effa0962cadb6e854977a))

## [1.29.2](https://gitlab.coko.foundation/ketida/server/compare/v1.29.1...v1.29.2) (2024-05-27)

### Bug Fixes

- **api/graphql:** return different error when book is deleted ([07847d4](https://gitlab.coko.foundation/ketida/server/commit/07847d47626534137b63dfe5dc179accd227775e))

# [1.29.0](https://gitlab.coko.foundation/ketida/server/compare/v1.28.0...v1.29.0) (2024-05-02)

### Features

- store book settings for customised AI writing prompts ([dd154f2](https://gitlab.coko.foundation/ketida/server/commit/dd154f2879e8d0f29ea8a16064aa07d96326112d))

# [1.28.0](https://gitlab.coko.foundation/ketida/server/compare/v1.27.0...v1.28.0) (2024-04-25)

### Features

- **api/graphql:** include new user team in graphql response for createBook mutation ([44dc01f](https://gitlab.coko.foundation/ketida/server/commit/44dc01fe1303f6e1147765e9c46407d5c9b71e1d))

# [1.27.0](https://gitlab.coko.foundation/ketida/server/compare/v1.26.1...v1.27.0) (2024-04-19)

### Features

- Share book by email, send email invite to existing users ([047f203](https://gitlab.coko.foundation/ketida/server/commit/047f20301f0be4ac6a512c11920b7dd59544f236))

## [1.26.1](https://gitlab.coko.foundation/ketida/server/compare/v1.26.0...v1.26.1) (2024-04-17)

### Bug Fixes

- **controllers:** remove admin permission to see all books ([7c2f1ca](https://gitlab.coko.foundation/ketida/server/commit/7c2f1caa8f2e614c90939bf7b630ef06446e2129))

# [1.25.0](https://gitlab.coko.foundation/ketida/server/compare/v1.24.0...v1.25.0) (2024-03-13)

### Features

- remove authsome dependency, replace with custom authorization ([c698cd5](https://gitlab.coko.foundation/ketida/server/commit/c698cd5287b31f09fe3fe9631139e2934451a937))

# [1.24.0](https://gitlab.coko.foundation/ketida/server/compare/v1.23.1...v1.24.0) (2024-03-09)

### Features

- ai designer setting and api ([c6f5744](https://gitlab.coko.foundation/ketida/server/commit/c6f5744f342df742d10e439c2fa5ee9eb65174a6))
- new openAi endpoint ([05367d5](https://gitlab.coko.foundation/ketida/server/commit/05367d5771f636418b8593d5dac02fa9cb5fb52b))

### Performance Improvements

- **controllers:** use model gpt-4 for open ai calls ([b6448bc](https://gitlab.coko.foundation/ketida/server/commit/b6448bc062356772c966f6ad6ffd9d70ce10de4c))

# [1.23.0](https://gitlab.coko.foundation/ketida/server/compare/v1.22.0...v1.23.0) (2024-02-27)

# [1.22.0](https://gitlab.coko.foundation/ketida/server/compare/v1.21.0...v1.22.0) (2024-02-01)

# [1.21.0](https://gitlab.coko.foundation/ketida/server/compare/v1.20.3...v1.21.0) (2024-01-24)

### Features

- init locks improvements ([ebf86b6](https://gitlab.coko.foundation/ketida/server/commit/ebf86b6d05a1fa62853e125b9b05fd40137762bb))

## [1.20.3](https://gitlab.coko.foundation/ketida/server/compare/v1.20.2...v1.20.3) (2024-01-19)

### Bug Fixes

- **services:** fix export to epub for ketida v1 ([00aca19](https://gitlab.coko.foundation/ketida/server/commit/00aca19cc4585ef6c0dae63671b948cbf4209f53))

## [1.20.2](https://gitlab.coko.foundation/ketida/server/compare/v1.20.1...v1.20.2) (2024-01-15)

### Bug Fixes

- make template checks case insensitive and migrate everything to lower case ([b2325ba](https://gitlab.coko.foundation/ketida/server/commit/b2325ba1a470944f9674b2b13c560986c54ef08b))

## [1.20.1](https://gitlab.coko.foundation/ketida/server/compare/v1.20.0...v1.20.1) (2024-01-12)

### Bug Fixes

- fix export to epub for ketida v1 ([d3d5d32](https://gitlab.coko.foundation/ketida/server/commit/d3d5d32fd46ddabfb14e2263219510c731e8fdd2))

# [1.20.0](https://gitlab.coko.foundation/ketida/server/compare/v1.19.1...v1.20.0) (2024-01-12)

### Bug Fixes

- remove unused title from addBookComponent ([7d602bf](https://gitlab.coko.foundation/ketida/server/commit/7d602bfb624c70922d9c5fb7cf6a190ef1d31d74))
- **services:** added new env variable for fixing ws function ([024a86f](https://gitlab.coko.foundation/ketida/server/commit/024a86ff03d958d716b5273de24f555a889e04ec))

## [1.19.1](https://gitlab.coko.foundation/ketida/server/compare/v1.19.0...v1.19.1) (2024-01-10)

### Bug Fixes

- try to recreate template files ([5702010](https://gitlab.coko.foundation/ketida/server/commit/5702010ecf7d331871084a9d7a1cf5be333ddc41))

# [1.19.0](https://gitlab.coko.foundation/ketida/server/compare/v1.18.0...v1.19.0) (2023-12-22)

# [1.18.0](https://gitlab.coko.foundation/ketida/server/compare/v1.17.0...v1.18.0) (2023-12-19)

# [1.17.0](https://gitlab.coko.foundation/ketida/server/compare/v1.16.1...v1.17.0) (2023-12-18)

### Bug Fixes

- copyright page isbn list ([7fc56a6](https://gitlab.coko.foundation/ketida/server/commit/7fc56a62da55adefdbae56803522f651b3d829aa))
- export empty book ([f8be87c](https://gitlab.coko.foundation/ketida/server/commit/f8be87c481eafd3e6950241944ffd4b5f4d00935))
- isbn html list structure ([288145d](https://gitlab.coko.foundation/ketida/server/commit/288145d64fdb9872abdeb414b748fae216a16c94))
- isbn html structure ([5716a00](https://gitlab.coko.foundation/ketida/server/commit/5716a00325411119d124595f98d5c2e111e858d1))

## [1.16.1](https://gitlab.coko.foundation/ketida/server/compare/v1.16.0...v1.16.1) (2023-12-13)

### Bug Fixes

- missing custom env variable ([651b47e](https://gitlab.coko.foundation/ketida/server/commit/651b47ea4c76922c8de11c0ac276ec75acc37a6b))

# [1.16.0](https://gitlab.coko.foundation/ketida/server/compare/v1.15.1...v1.16.0) (2023-12-13)

## [1.15.1](https://gitlab.coko.foundation/ketida/server/compare/v1.15.0...v1.15.1) (2023-12-12)

### Bug Fixes

- better handling of isbns for epubs and orphan isbn clean-ups ([d6a481d](https://gitlab.coko.foundation/ketida/server/commit/d6a481d850c8454248d5d74f367b26c17546e019))
- improvment on orhpan isbn clean-up ([eb99e29](https://gitlab.coko.foundation/ketida/server/commit/eb99e296a21a715dcbdd030b0688de1d27e81c5a))

# [1.15.0](https://gitlab.coko.foundation/ketida/server/compare/v1.14.1...v1.15.0) (2023-12-11)

### Bug Fixes

- add space between isbns, clean args from function ([4cacbc6](https://gitlab.coko.foundation/ketida/server/commit/4cacbc640ba72315a28fdfcc7e40631ddc60ca31))
- export page isbn ([a23c20e](https://gitlab.coko.foundation/ketida/server/commit/a23c20e51a8a2bb6b8e3ab00691b37c33815cae2))
- export profile ([08f16a8](https://gitlab.coko.foundation/ketida/server/commit/08f16a8aeab3bdb6d758a48e48e46494835af603))
- export profile isbn ([0159a88](https://gitlab.coko.foundation/ketida/server/commit/0159a887c65ed55813297b0b259836d85f4aefba))
- export profile page ([80de985](https://gitlab.coko.foundation/ketida/server/commit/80de98525500bc6527be1690046731d7b19e8075))
- **server:** export multiple isbn fields ([e01b1d5](https://gitlab.coko.foundation/ketida/server/commit/e01b1d5699aca1b87683a8461c10dea13e9a4eda))
- **server:** export multiple isbn fields ([f2036c5](https://gitlab.coko.foundation/ketida/server/commit/f2036c57aa0448318f83d78639826a51b618cea2))
- **server:** multiple isbn fields ([dd67022](https://gitlab.coko.foundation/ketida/server/commit/dd6702209a7c1adb6504c8fb213694b405b06621))
- **server:** multiple isbn fields ([7fa33b6](https://gitlab.coko.foundation/ketida/server/commit/7fa33b6c626c450c72796064d558851c6c181658))
- set default value of job queue flag to true ([2a9d1f0](https://gitlab.coko.foundation/ketida/server/commit/2a9d1f0023efc66f2529ff32298b4008175f28c4))
- take into account isbn flag for the case of epub ([b164a1f](https://gitlab.coko.foundation/ketida/server/commit/b164a1f678d938e9750df031a98a41644dc8d7cf))

### Features

- export profile isbn ([cd84a22](https://gitlab.coko.foundation/ketida/server/commit/cd84a22be4391e613f41a62bb52f8292030d6081))
- export profile isbn ([3609471](https://gitlab.coko.foundation/ketida/server/commit/3609471196e3342900c82e9270a32e07d2ecdc4a))
- multiple isbns ([d8b50f1](https://gitlab.coko.foundation/ketida/server/commit/d8b50f1f6ea1208f0c5e51ef9de0945de9d7e3ba))
- **server:** export multiple isbn fields ([937912d](https://gitlab.coko.foundation/ketida/server/commit/937912dbec6b65ce8206b960185d2c4e1744b83e))
- **server:** export multiple isbn fields ([5ac980e](https://gitlab.coko.foundation/ketida/server/commit/5ac980e7c7a9540ac6080ae1af3038e0c62cce89))
- **server:** multiple isbn fields ([a13cf29](https://gitlab.coko.foundation/ketida/server/commit/a13cf29b36779a4b42f0c94b4277042762c88810))
- **server:** multiple isbn fields ([6fa95c3](https://gitlab.coko.foundation/ketida/server/commit/6fa95c3b8a8fe73ba4fc5497637a6083e0f6a29b))
- **server:** multiple isbn fields ([d30c865](https://gitlab.coko.foundation/ketida/server/commit/d30c86532b16facbb2f207f7cc7756feb64405e0))
- **server:** multiple isbn fields ([aa6aa69](https://gitlab.coko.foundation/ketida/server/commit/aa6aa69720c09c12333ff445476f0f64ec3ce006))
- **server:** multiple isbn fields ([cf98b3e](https://gitlab.coko.foundation/ketida/server/commit/cf98b3e87271fe447e603bc962badb021be6f8c0))
- **server:** multiple isbn fields ([d215ed5](https://gitlab.coko.foundation/ketida/server/commit/d215ed57084a44de3a8bd691916f7e460e06d9c4))
- **server:** multiple isbn fields ([0da8907](https://gitlab.coko.foundation/ketida/server/commit/0da8907b5e4dedc73ecf8f84c1654d46fd65c02e))

# [1.14.0](https://gitlab.coko.foundation/ketida/server/compare/v1.14.0...v1.14.1) (2023-12-06)

### Chore

update to latest coko server

# [1.14.0](https://gitlab.coko.foundation/ketida/server/compare/v1.13.3...v1.14.0) (2023-12-05)

### Bug Fixes

- **server:** delete book in processing crashes app ([bc46b9a](https://gitlab.coko.foundation/ketida/server/commit/bc46b9acf9117ffb8d2bc149fba71bc89dede66f))
- **server:** delete book in processing crashes app ([61c94d5](https://gitlab.coko.foundation/ketida/server/commit/61c94d529f300253573403c728ab5e5e763e9315))

## [1.13.3](https://gitlab.coko.foundation/ketida/server/compare/v1.13.2...v1.13.3) (2023-11-30)

### Bug Fixes

- always fetch new template css and create thumbnail ([2b1d67b](https://gitlab.coko.foundation/ketida/server/commit/2b1d67be7b658c680db950a29c8945d912c105ac))

## [1.13.2](https://gitlab.coko.foundation/ketida/server/compare/v1.13.1...v1.13.2) (2023-11-29)

### Bug Fixes

- **models:** trimsize null is valid option ([eccbfa0](https://gitlab.coko.foundation/ketida/server/commit/eccbfa0045416cc5335c209f91d081444d4b5718))

## [1.13.1](https://gitlab.coko.foundation/ketida/server/compare/v1.13.0...v1.13.1) (2023-11-28)

### Bug Fixes

- **api/graphql:** export permissions fix ([9a254ff](https://gitlab.coko.foundation/ketida/server/commit/9a254fffa113a0df61999f74dd51ff595bf47225))

# [1.13.0](https://gitlab.coko.foundation/ketida/server/compare/v1.12.4...v1.13.0) (2023-11-28)

### Bug Fixes

- deterministic id for h2 ([01f7688](https://gitlab.coko.foundation/ketida/server/commit/01f7688228fbea56c8840cea11dea6f4c90927f0))
- lulu connection ([61725e7](https://gitlab.coko.foundation/ketida/server/commit/61725e770ee5ea93c6f932c4b00f3ea3ab6f725c))

### Features

- add insync value to lulu profile ([3e1a976](https://gitlab.coko.foundation/ketida/server/commit/3e1a976331df453dd1e9c9f13f5fe972c3449bf4))
- export profile models with tests and graphql init ([54c126e](https://gitlab.coko.foundation/ketida/server/commit/54c126e567b543bdc8fa4c9aab926bd9c4514e58))
- **models:** export profile model added ([cb6b7f1](https://gitlab.coko.foundation/ketida/server/commit/cb6b7f14bacab5ea52334e64d43a4c56c3fa2422))
- upload to external providers init ([f3a7aaf](https://gitlab.coko.foundation/ketida/server/commit/f3a7aaff843d3dfbd8785ed19cddb3a2c7ccff2d))

## [1.12.4](https://gitlab.coko.foundation/ketida/server/compare/v1.12.3...v1.12.4) (2023-11-01)

### Bug Fixes

- **api/graphql:** configurable heartbeat added ([4d67d86](https://gitlab.coko.foundation/ketida/server/commit/4d67d864d9fb6c1c51a83c76ad07fc20b55287ab))

## [1.12.3](https://gitlab.coko.foundation/ketida/server/compare/v1.12.2...v1.12.3) (2023-10-18)

### Bug Fixes

- **api/graphql:** added missing handlers for seting book component status ([42b9080](https://gitlab.coko.foundation/ketida/server/commit/42b9080666c5e0ff0de99eadf8102fe812d34d73))
- introduce flow for conversion error ([55ee0f8](https://gitlab.coko.foundation/ketida/server/commit/55ee0f8aa10aceb1790c7b4d453ed87a81011ba8))

## [1.12.2](https://gitlab.coko.foundation/ketida/server/compare/v1.12.1...v1.12.2) (2023-10-03)

### Bug Fixes

- added ai toggle and minor refactoring ([51cf293](https://gitlab.coko.foundation/ketida/server/commit/51cf293a944a2c3928bb576a9ce8f654a0fedc64))
- **api/graphql:** broadcast the correct event, update dep in compose files ([b5811c0](https://gitlab.coko.foundation/ketida/server/commit/b5811c007996816ae49bbfbac704c0dd9bf29cfe))
- **api/graphql:** subscriptions added for updating admin user ([7d4b665](https://gitlab.coko.foundation/ketida/server/commit/7d4b66543d2f73736c0a13880ed35e4aec75201c))

## [1.12.1](https://gitlab.coko.foundation/ketida/server/compare/v1.12.0...v1.12.1) (2023-09-20)

### Bug Fixes

- **api/graphql:** added permissions for chatgpt ([500a504](https://gitlab.coko.foundation/ketida/server/commit/500a504d8f797994260e76e4ba6b8500ea6ad120))
- **controllers:** remove title from copyright page ([6d57a8a](https://gitlab.coko.foundation/ketida/server/commit/6d57a8a2af6412e45528d0ead195c67280232e98))
- fix linting error ([c47b918](https://gitlab.coko.foundation/ketida/server/commit/c47b918387837f80686ac668636ccb0eea4193d8))

# [1.12.0](https://gitlab.coko.foundation/ketida/server/compare/v1.11.2...v1.12.0) (2023-08-21)

### Bug Fixes

- dont show note type for ketida 2 ([252726c](https://gitlab.coko.foundation/ketida/server/commit/252726cbff2ff65e2e360817b254b99cbe8752b0))
- fixed linting error ([113b717](https://gitlab.coko.foundation/ketida/server/commit/113b717bd64cac990f8eb0b294d91cd1ed07374e))
- fixes for the auto generation of copyright page ([a1ee8a5](https://gitlab.coko.foundation/ketida/server/commit/a1ee8a54cc0654e2dff12fa057a66fbbc11ff51e))
- minor text corrections and missing returns ([994598d](https://gitlab.coko.foundation/ketida/server/commit/994598d0730314c54153c08e2043a2a53942f696))

### Features

- added yarn script to delete template from db and file server ([99a0f7a](https://gitlab.coko.foundation/ketida/server/commit/99a0f7ae3d83ba1d99e9e396efe6b399be4965f0))

## [1.11.2](https://gitlab.coko.foundation/ketida/server/compare/v1.11.1...v1.11.2) (2023-08-11)

### Bug Fixes

- **api/graphql:** subscriptions workarround, send only entities id ([9c1d4bd](https://gitlab.coko.foundation/ketida/server/commit/9c1d4bd1856e4f649ae9f6ac842206845cb1cc00))
- fixes for 722 and 723 ([19b28c1](https://gitlab.coko.foundation/ketida/server/commit/19b28c18dcce6fc780b4378666eb8e1c1f34a9d4))
- undefined check for podMetadata ([e93d41e](https://gitlab.coko.foundation/ketida/server/commit/e93d41eed647f369195ad64b9e2b4d4891ca06e6))

## [1.11.1](https://gitlab.coko.foundation/ketida/server/compare/v1.11.0...v1.11.1) (2023-08-04)

### Bug Fixes

- fix for permissions ([b96acc0](https://gitlab.coko.foundation/ketida/server/commit/b96acc0ff23337d05287d5ac13ca8617858cad0c))
- fix in permissions when user undefined ([8278ef7](https://gitlab.coko.foundation/ketida/server/commit/8278ef74de30c46ece30d1fdf0e0c1cc8cf9e0a3))

# [1.11.0](https://gitlab.coko.foundation/ketida/server/compare/v1.10.0...v1.11.0) (2023-08-02)

### Bug Fixes

- added missing permission and metadata field ([716affe](https://gitlab.coko.foundation/ketida/server/commit/716affe1a086c1ea7b5716d91ddf165f4a4824d4))
- **api/graphql:** add missing subtitle field to book metadata schema ([9094941](https://gitlab.coko.foundation/ketida/server/commit/90949419635fd7eb0917ef17e2d987d651487db3))
- correction of permissions for delete component and broadcasting book updated ([706da21](https://gitlab.coko.foundation/ketida/server/commit/706da210fec9920163794437d0c6e0156e1d52d4))
- include thumbnailID in user books response ([f989ef4](https://gitlab.coko.foundation/ketida/server/commit/f989ef487aec9c479f4e9d4402958040c6058fc0))
- minor fixes for 716 ([ed6d9bb](https://gitlab.coko.foundation/ketida/server/commit/ed6d9bb1e8321644036644cbb04d474c1ee805db))
- remove console statement ([a7a622d](https://gitlab.coko.foundation/ketida/server/commit/a7a622dbf003e8ab892ab8781c7736c705c5f382))
- thumbnail fix and templates fix ([0bb35d2](https://gitlab.coko.foundation/ketida/server/commit/0bb35d2918684b2dadfb288ecf06160f172e919f))
- update subtitle handler ([aec708c](https://gitlab.coko.foundation/ketida/server/commit/aec708cbb9db66e33bfe0e989eff79ea7b4a5c64))
- various fixes needed for permissions ([0ad79d3](https://gitlab.coko.foundation/ketida/server/commit/0ad79d34e177ab53aea8ab4491a484d3e1fc735c))

### Features

- added upload book thumbnail backend ([b518b2a](https://gitlab.coko.foundation/ketida/server/commit/b518b2a59d2f62992a1af1347ef7d71f30032cfe))
- permissions for pod ([9489eab](https://gitlab.coko.foundation/ketida/server/commit/9489eabf6250d446ce5001af4a3eeda0046f8683))
- replace existing thumbnail if exists ([3f7cf2f](https://gitlab.coko.foundation/ketida/server/commit/3f7cf2f3f80178f5e002ecdc20cd3de75df8a29a))

# [1.10.0](https://gitlab.coko.foundation/ketida/server/compare/v1.9.0...v1.10.0) (2023-07-20)

### Bug Fixes

- cover case with no trim size ([3ed5494](https://gitlab.coko.foundation/ketida/server/commit/3ed5494af03830a06038dcf97c1cb8f2336a2648))

### Features

- store template defaults and filter by trim size ([aeb7583](https://gitlab.coko.foundation/ketida/server/commit/aeb758376975e4d4418f86f5f68f2e64fde90778))

# [1.9.0](https://gitlab.coko.foundation/ketida/server/compare/v1.8.1...v1.9.0) (2023-07-17)

### Features

- Add mutation for setting book status ([3197dd8](https://gitlab.coko.foundation/ketida/server/commit/3197dd855729e4d10605c41f686e52e96c874aa5))
- add options for controlling pagedjs microservice ([93db614](https://gitlab.coko.foundation/ketida/server/commit/93db614a67bf559a94faaca2224eebd0ddf6689d))
- Implement setAssociatedTemplate mutation for books ([1fe56d8](https://gitlab.coko.foundation/ketida/server/commit/1fe56d85a904afc3b2e95458d280a5ce07df1d17))

## [1.8.1](https://gitlab.coko.foundation/ketida/server/compare/v1.8.0...v1.8.1) (2023-07-05)

### Bug Fixes

- passing authors consistently for the case of epub ([9b996cf](https://gitlab.coko.foundation/ketida/server/commit/9b996cf818879b3455938bd6ad91ead71657c6bb))

# [1.8.0](https://gitlab.coko.foundation/ketida/server/compare/v1.7.0...v1.8.0) (2023-07-04)

### Bug Fixes

- **api/graphql:** do not wrap user data inside user key ([0ca958d](https://gitlab.coko.foundation/ketida/server/commit/0ca958dd47e54163c1c1feb703c50dde5ff559da))
- **api/graphql:** pass correct variables to updateTeamMemberStatus ([9bba135](https://gitlab.coko.foundation/ketida/server/commit/9bba1357c7664286e0cab35414c5bc2cc7a22ccd))
- **api/graphql:** pass the correct params in exporter ([bc00a85](https://gitlab.coko.foundation/ketida/server/commit/bc00a856e5ad3c5542b9e2dd4d9d6157c42642c4))
- **api/graphql:** remove subscription addTeamMembers ([1975ef3](https://gitlab.coko.foundation/ketida/server/commit/1975ef316fd0479c233a6e2bab4d9864e1710d37))
- **api/graphql:** return correct object for subscription ([e9361c4](https://gitlab.coko.foundation/ketida/server/commit/e9361c46ec213d0c8aedad471aff16380390099d))
- **api/graphql:** team update subscriptions ([42fcb82](https://gitlab.coko.foundation/ketida/server/commit/42fcb827af769453d2e9bfd61bd3e719f194f79a))
- **controllers:** correct serch logic implemented ([0b97db1](https://gitlab.coko.foundation/ketida/server/commit/0b97db1f8dd228004262843812a8905fdcb571ef))
- **controllers:** fix image handler for xsweet and linting error ([8f6a187](https://gitlab.coko.foundation/ketida/server/commit/8f6a18719b0422a09f381e0acb257dcba855b9fc))
- **controllers:** minor fixes in export and htmlGenerator ([f2be61c](https://gitlab.coko.foundation/ketida/server/commit/f2be61cd0d6cba13d1308f368cdade51c7adfc38))

### Features

- added copyrights-page to book division ([92741a8](https://gitlab.coko.foundation/ketida/server/commit/92741a87a596df6064808b0d2d7c6e8b8edd69c5))
- added status property to team members ([0be3c07](https://gitlab.coko.foundation/ketida/server/commit/0be3c0701e0680426dadbf31ce7a0d4c533791a9))
- added title-page to book division ([04d2158](https://gitlab.coko.foundation/ketida/server/commit/04d2158878972bf5df49dfefbb28b21643338f38))
- additional export options added ([a5aed8e](https://gitlab.coko.foundation/ketida/server/commit/a5aed8e8174c341d5976e4bf5c83da4914951cf6))
- **api/graphql:** exporter functionality added, templates creation corrected ([c301067](https://gitlab.coko.foundation/ketida/server/commit/c3010670585bcc3b170c5d6e7a35205b3fb666a3))
- **api/graphql:** mutation to add team members ([ae197a9](https://gitlab.coko.foundation/ketida/server/commit/ae197a974c85c9a71c0c675363a7926b01ad6c62))
- **Book:** Add status property to Book model ([3fb0145](https://gitlab.coko.foundation/ketida/server/commit/3fb014596f360431257a486b75658a1d25d07c19))
- **controllers:** auto copyrights page added ([c8c3cae](https://gitlab.coko.foundation/ketida/server/commit/c8c3cae99cfa2674701bd4ef6ea0d5f5e71d6e09))
- for POD client auto generate copyright page ([5b66beb](https://gitlab.coko.foundation/ketida/server/commit/5b66bebe2b0a0d800ac626d0d4892318fafa6b25))
- for POD client auto generate copyright page ([f68fcf5](https://gitlab.coko.foundation/ketida/server/commit/f68fcf5be8c726f07c9d94968a1733adea98682c))
- for POD client auto generate title page ([dd41139](https://gitlab.coko.foundation/ketida/server/commit/dd4113917f732df2a8f59e95d0dd8fec74c0995a))
- implement code review feedbacks ([edb1a8a](https://gitlab.coko.foundation/ketida/server/commit/edb1a8a16414080edc141034a26db33f15229d25))
- modified searchUser method, added exactMatch for POD usecase ([64cbf35](https://gitlab.coko.foundation/ketida/server/commit/64cbf3532d0c91cf97f49eb0a57adef09bdad437))
- pod query for templates and graphql schema additions ([b1c9709](https://gitlab.coko.foundation/ketida/server/commit/b1c9709db6c2d9dea5f1dcfebf38def296edc60c))
- removed extra check for exactMatch ([9cd3b76](https://gitlab.coko.foundation/ketida/server/commit/9cd3b767b78fbc890387e23d13618455847c858d))
- removed unused variable ([4c7116b](https://gitlab.coko.foundation/ketida/server/commit/4c7116b3c2948c2cb5572094b1de5abc3807d66a))
- use config to fetch pod enabled state and other feedbacks ([3cf7dcf](https://gitlab.coko.foundation/ketida/server/commit/3cf7dcf5afcc59c9070c629be5a1a57887b76146))

# [1.7.0](https://gitlab.coko.foundation/ketida/server/compare/v1.6.0...v1.7.0) (2023-05-24)

### Bug Fixes

- fixes for permissions and getBooks ([e21f96a](https://gitlab.coko.foundation/ketida/server/commit/e21f96aeac28245db2cbfcea85cd9dabc19208ed))
- fixes for the testing env ([3eaa148](https://gitlab.coko.foundation/ketida/server/commit/3eaa1480a8bb2c3abc861abd8b9ea2036fd9b62a))
- fixes needed for pod client interactions ([cfa133a](https://gitlab.coko.foundation/ketida/server/commit/cfa133a1221fbbefcb3c717fb027297097206ddc))

# [1.6.0](https://gitlab.coko.foundation/ketida/server/compare/v1.5.0...v1.6.0) (2023-05-16)

### Bug Fixes

- clean slashes in templates config ([d55ad69](https://gitlab.coko.foundation/ketida/server/commit/d55ad69e8ddfbd0691fefcf75d41463828349067))
- fixes in templates configuration and cleanups ([db1fff1](https://gitlab.coko.foundation/ketida/server/commit/db1fff1cd6b69cfcf04a4beed9e497ea0e53bbb4))
- **models:** getbooks query fix ([02f35a1](https://gitlab.coko.foundation/ketida/server/commit/02f35a16f6ca102f6a3c74434f950629205d97a8))

### Features

- added new teams and permissions for lulu ([fbdfddb](https://gitlab.coko.foundation/ketida/server/commit/fbdfddb62a3b9715ba1268e07affc1c0b77fc7d6))
- added pagination support ([0fa76f0](https://gitlab.coko.foundation/ketida/server/commit/0fa76f06a3a5dd9b69bf474faa99d86577b4c5e6))
- added pagination support ([51074a2](https://gitlab.coko.foundation/ketida/server/commit/51074a237dc97d551a7a0b5a64dad9ba5dd10c4a))
- make collectionId optional for books ([0dd7241](https://gitlab.coko.foundation/ketida/server/commit/0dd72414b21b031e9cdfdcaa5f07e0341fd441fd))
- removed unwanted changes ([346b0b7](https://gitlab.coko.foundation/ketida/server/commit/346b0b740ef4179c7844c9cd674cd1a7e40ce372))
- removed unwanted changes ([c75feb5](https://gitlab.coko.foundation/ketida/server/commit/c75feb52ad28852fb279ac13ca0d4f3ae7342770))
- updated getBooks query and made collectionId optional ([c0cc050](https://gitlab.coko.foundation/ketida/server/commit/c0cc05033eb0e52375cf7e912f0722f1fa883e4f))
- updated getBooks query and made collectionId optional ([07a6b1d](https://gitlab.coko.foundation/ketida/server/commit/07a6b1dae162e8c83de8a1318cb6c80e017cffab))
- updates to lulu permissions based on feedback ([cf36167](https://gitlab.coko.foundation/ketida/server/commit/cf36167910746bdf6abf96f456bc1bb6dacdfde6))

# [1.5.0](https://gitlab.coko.foundation/ketida/server/compare/v1.4.1...v1.5.0) (2023-05-03)

## [1.4.1](https://gitlab.coko.foundation/ketida/server/compare/v1.4.0...v1.4.1) (2023-04-11)

### Bug Fixes

- **controllers:** improve epub accessibility ([5363d82](https://gitlab.coko.foundation/ketida/server/commit/5363d82d16af01f72863c2d8ad21dec5b448ced6))
- **controllers:** more accessibility improvements ([df051bd](https://gitlab.coko.foundation/ketida/server/commit/df051bd82e58dcf1a456039c8551941cd0e2d5c7))
- fix for corrupted svg files ([e8aedbd](https://gitlab.coko.foundation/ketida/server/commit/e8aedbd247b189e4b6d05c2eaff6a3a1486c2589))

# [1.4.0](https://gitlab.coko.foundation/ketida/server/compare/v1.3.3...v1.4.0) (2023-04-04)

### Features

- **controllers:** support of nested headings in toc ([4803076](https://gitlab.coko.foundation/ketida/server/commit/48030760af15cc82b8f8d8dd085264bf64c53c38))

## [1.3.3](https://gitlab.coko.foundation/ketida/server/compare/v1.3.2...v1.3.3) (2023-04-04)

### Bug Fixes

- fixes in permissions ([1e9b9ce](https://gitlab.coko.foundation/ketida/server/commit/1e9b9cefc4d40060971bf11d80500732a27056fb))

## [1.3.2](https://gitlab.coko.foundation/ketida/server/compare/v1.3.1...v1.3.2) (2023-03-29)

### Bug Fixes

- **controllers:** handle orphan files inside getContent ([0cb7865](https://gitlab.coko.foundation/ketida/server/commit/0cb7865d1d8b0ab7f225e9570de8b7fd1d93e604))
- **controllers:** handle orphan images on export and in content ([b312787](https://gitlab.coko.foundation/ketida/server/commit/b3127873e7cf2620aeee990812afc93673526aa1))

## [1.3.1](https://gitlab.coko.foundation/ketida/server/compare/v1.3.0...v1.3.1) (2023-03-29)

### Bug Fixes

- **controllers:** ensure unique image declartion for epub opf ([6409f35](https://gitlab.coko.foundation/ketida/server/commit/6409f35605c79c6f65d5f425bc8d075867f15865))

# [1.3.0](https://gitlab.coko.foundation/ketida/server/compare/v1.2.3...v1.3.0) (2023-03-29)

### Features

- add chatgpt support ([715b13d](https://gitlab.coko.foundation/ketida/server/commit/715b13ddbf1d16ac9c731d48d1e7135f880e6ccb))
