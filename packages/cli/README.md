[![npm](https://img.shields.io/npm/v/%40fabernovel%2Fheart-cli
 "Scodi CLI on npmjs.com")](https://www.npmjs.com/package/@fabernovel/heart-cli)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=scodi-cli&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=scodi-cli)
[![Known Vulnerabilities](https://snyk.io/test/github/bgatellier/scodi/badge.svg?targetFile=packages/cli/package.json)](https://snyk.io/test/github/bgatellier/scodi?targetFile=packages/cli/package.json "View known vulnerabilities")

# Description

_Scodi CLI_ is the control module of _Scodi_. It allows every other module to work together, and is able to control the _Scodi API_ and the _analysis_ packages.

Note that you must install an _analysis_ module too, to have a minimum viable installation of _Scodi_.

Read more about [the description and design of _Scodi_](https://github.com/bgatellier/scodi#readme).

# Usage

## Standalone

1. Install the package

    ```bash
    npm install @scodi/cli
    ```

2. Displays the list of commands you can use, regarding your installed packages

    ```bash
    npx scodi --help
    ```

  The list of available commands change each time you install an _analysis_ module or _Scodi API_.

## Github Action

If you're using Github, you can simplify the integration of Scodi in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).
