# Change Log - @scodi/common

## 5.0.0

### Major Changes

- 9772c5a: Changed the package scope and name to use the @scodi scope
- 14b4d5d: Drop support for Node.js 18 and 19

### Minor Changes

- abc69b2: Add compatibility with Node.js versions 21 to 23

This log was last generated on Sun, 08 Oct 2023 13:58:00 GMT and should not be manually modified.

## 4.0.0

Sun, 08 Oct 2023 13:58:00 GMT

### Breaking changes

- Add compatibility with Node.js versions 18, 19 and 20
- Node.js 18 LTS is now required: the previous Node.js version used (14) reached end-of-life
- Move to ES modules mechanism

### Minor changes

- The report can now store the raw results of the analysis modules

### Updates

- Update issues and repository URLs
- Add the new database listener module definition and database entities

## 3.3.0

Wed, 23 Nov 2022 19:51:43 GMT

### Minor changes

- Add the optional cors parameter to the startServer method of the ModuleServerInterface, and make the port parameter mandatory
- Add the threshold feature
- Add the input validation (previously located in @scodi/cli)

### Updates

- Updated the homepage field to redirect to the heart website and not to the gitlab repository. Changed the link "Read more about" of the README to redirect to the README of the repository. The old link redirected to an article that do not exist anymore.

## 3.1.2

Wed, 27 Jul 2022 13:43:15 GMT

### Patches

- Increase the minimum Node.js version to the latest LTS (14.17.0)

## 3.1.1

Thu, 09 Apr 2020 09:17:20 GMT

### Patches

- Improve unit test by using mocks instead of real HTTP requests

## 3.1.0

Thu, 16 Jan 2020 14:51:38 GMT

### Minor changes

- Initial release of automated tests

### Patches

- Update the link to the purpose of Scodi in the README, to redirect to the fabernovel.com website instead of the wiki

## 3.0.1

Fri, 19 Jul 2019 09:36:21 GMT

### Patches

- Fix an issue where the binary was not packaged when published to NPM

## 3.0.0

Fri, 19 Jul 2019 08:17:11 GMT

### Breaking changes

- Remove module loading, as it is now handled by Scodi CLI
- Upgrade the minimum required version of Node.js to the active LTS: from >=8.0.0 to >=10.13.0
- Improve compatibility: starting from this version, every Scodi module shares the same major version number

### Minor changes

- Initial release of environment variables creation from a .env file located under the root folder of the Scodi installation
- Improve the module installation: it can now be installed as a devDependency

### Patches

- Remove the contributing guide and the license: they are now available in the Scodi repository
- Remove unnecessary dependencies and scripts from package.json
