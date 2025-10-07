[![npm](https://img.shields.io/npm/v/%40fabernovel%2Fheart-ssllabs-server
 "Scodi SSL Labs Server on npmjs.com")](https://www.npmjs.com/package/@fabernovel/heart-ssllabs-server)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=scodi-ssllabs-server&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=scodi-ssllabs-server)
[![Known Vulnerabilities](https://snyk.io/test/github/bgatellier/scodi/badge.svg?targetFile=packages/ssllabs-server/package.json)](https://snyk.io/test/github/bgatellier/scodi?targetFile=packages/ssllabs-server/package.json "View known vulnerabilities")

# Description

_Scodi SSL Labs Server_ is an _analysis_ module of _Scodi_, which analyses URLs with _[Qualys SSL Labs server](https://www.ssllabs.com/ssltest/index.html)_.

Read more about [the purpose, design and general installation of _Scodi_](https://github.com/bgatellier/scodi#readme).

# Usage

## Standalone

1. Install the package

    ```bash
    npm install @scodi/ssllabs-server
    ```

    If you are using Yarn, npm < 7 or PNPM < 8, you also have to install _[Scodi CLI](https://www.npmjs.com/package/@scodi/cli)_ (which is automatically installed in more recent versions of these packages managers):

    ```bash
    npm install @scodi/cli
    ```

2. Start an analysis

    ```bash
    npx scodi ssllabs-server --config '{"host":"ipcc.ch"}'
    ```

    OR 

    ```bash
    npx scodi ssllabs-server --config config.json
    ```

    The analysis configuration follows the JSON format and  the [Invoke assessment and check progress API documentation](https://github.com/ssllabs/ssllabs-scan/blob/master/ssllabs-api-docs-v3.md#invoke-assessment-and-check-progress).

## Github Action

If you're using Github, you can simplify the integration of Scodi in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).
