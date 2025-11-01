# Change Log - @scodi/slack

## 5.0.0

### Major Changes

- 9772c5a: Changed the package scope and name to use the @scodi scope
- 6727016: Changed the default Slack channel to #scodi
- 14b4d5d: Drop support for Node.js 18 and 19
- 9772c5a: Changed the environment variables prefix from HEART* to SCODI*

### Minor Changes

- abc69b2: Add compatibility with Node.js versions 21 to 23

### Patch Changes

- Updated dependencies [9772c5a]
- Updated dependencies [abc69b2]
- Updated dependencies [abc69b2]
- Updated dependencies [6727016]
- Updated dependencies [14b4d5d]
  - @scodi/common@5.0.0
  - @scodi/cli@5.0.0

This log was last generated on Sun, 08 Oct 2023 17:37:29 GMT and should not be manually modified.

## 4.0.1

Sun, 08 Oct 2023 17:37:29 GMT

### Patches

- Fix an issue where environment variables where not loaded.

## 4.0.0

Sun, 08 Oct 2023 13:58:00 GMT

### Breaking changes

- Add compatibility with Node.js versions 18, 19 and 20
- Node.js 18 LTS is now required: the previous Node.js version used (14) reached end-of-life
- Update the name of the environment variable used to define the access token in favor of SCODI_SLACK_ACCESS_TOKEN (instead of SCODI_SLACK_API_TOKEN)
- Add a SCODI\_ prefix to the environment variables names to avoid collisions
- Add the main numbers and some advices send back by the analysis modules
- Move to ES modules mechanism

## 3.4.0

Wed, 23 Nov 2022 19:51:43 GMT

### Minor changes

- Make the module compatible with the threshold feature introduced with @scodi/cli 3.3.0

## 3.3.0

Wed, 27 Jul 2022 13:43:15 GMT

### Minor changes

- The environment variable SLACK_CHANNEL_ID is now optional, and is set to #heart by default.

### Patches

- Increase the minimum Node.js version to the latest LTS (14.17.0)

## 3.2.1

Thu, 09 Apr 2020 09:17:20 GMT

### Patches

- Fix an issue where the module could not work with the new Slack Apps

## 3.2.0

Thu, 16 Jan 2020 14:51:38 GMT

### Minor changes

- Initial release of automated tests

### Patches

- Fix the notification message if there is no link to an online report
- Update the link to the purpose of Scodi in the README, to redirect to the fabernovel.com website instead of the wiki

## 3.1.0

Fri, 02 Aug 2019 12:02:44 GMT

### Minor changes

- Add service logo
- Add the service icon to the report notification
- Improve analysis service report

## 3.0.1

Fri, 19 Jul 2019 09:43:15 GMT

### Patches

- Fix an issue where the binary was not packaged when published to NPM

## 3.0.0

Fri, 19 Jul 2019 08:17:11 GMT

### Breaking changes

- Add Scodi CLI as a peer dependency: it must be installed to make this module usable
- Upgrade the minimum required version of Node.js to the active LTS: from >=8.0.0 to >=10.13.0
- Improve compatibility: starting from this version, every Scodi module shares the same major version number

### Minor changes

- Improve the module installation: it can now be installed as a devDependency
- Add environment variable creation from a .env file

### Patches

- Remove the contributing guide and the license: they are now available in the Scodi repository
- Remove unnecessary dependencies and scripts from package.json
- Update the readme to reflect the changes introduced by this major release
