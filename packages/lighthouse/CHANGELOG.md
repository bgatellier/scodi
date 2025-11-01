# Change Log - @scodi/lighthouse

## 5.0.0

### Major Changes

- 9772c5a: Changed the package scope and name to use the @scodi scope
- dceddb2: Upgrade lighthouse to version 12
- 14b4d5d: Drop support for Node.js 18 and 19

### Minor Changes

- abc69b2: Add compatibility with Node.js versions 21 to 23

### Patch Changes

- b5f9c58: Improve install size and compatibility: use the same browser as the greenit-cli dependency
- b5f9c58: Improve the --debug option by adding a log about the path to the browser used to analyze the webpage
- Updated dependencies [9772c5a]
- Updated dependencies [abc69b2]
- Updated dependencies [abc69b2]
- Updated dependencies [6727016]
- Updated dependencies [14b4d5d]
  - @scodi/common@5.0.0
  - @scodi/cli@5.0.0

This log was last generated on Sun, 08 Oct 2023 13:58:00 GMT and should not be manually modified.

## 4.0.0

Sun, 08 Oct 2023 13:58:00 GMT

### Breaking changes

- Add compatibility with Node.js versions 18, 19 and 20
- Node.js 18 LTS is now required: the previous Node.js version used (14) reached end-of-life
- Move to ES modules mechanism

### Minor changes

- The module embed the Google Chrome browser
- Upgrade to lighthouse 11

## 3.1.1

Wed, 14 Dec 2022 16:41:26 GMT

### Patches

- Fix a bug where Chrome could sometimes timeout in CI

### Updates

- Update issues and repository URLs

## 3.1.0

Wed, 23 Nov 2022 19:51:43 GMT

### Minor changes

- Make the module compatible with the threshold feature introduced with @scodi/cli 3.3.0
- Update Google Lighthouse to get Web Core Vitals calculation

### Updates

- Updated the homepage field to redirect to the heart website and not to the gitlab repository. Changed the link "Read more about" of the README to redirect to the README of the repository. The old link redirected to an article that do not exist anymore.
- Updating dependency @scodi/core from `^3.1.1` to `^3.2.0`

## 3.0.2

Wed, 27 Jul 2022 13:43:15 GMT

### Patches

- Increase the minimum Node.js version to the latest LTS (14.17.0)

## 3.0.1

Thu, 09 Apr 2020 09:17:20 GMT

### Patches

- Improve the description of the analysis configuration in the README
- Fix an issue where some error messages did not appear when an analysis failed

### Updates

- Add unit tests

## 3.0.0

Thu, 16 Jan 2020 14:51:38 GMT

### Breaking changes

- Introduce the Google Lighthouse module

### Minor changes

- Initial release of automated tests
