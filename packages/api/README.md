[![npm](https://img.shields.io/npm/v/%40fabernovel%2Fheart-api
 "Scodi API on npmjs.com")](https://www.npmjs.com/package/@fabernovel/heart-api)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=scodi-api&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=scodi-api)
[![Known Vulnerabilities](https://snyk.io/test/github/bgatellier/scodi/badge.svg?targetFile=packages/api/package.json)](https://snyk.io/test/github/bgatellier/scodi?targetFile=packages/api/package.json "View known vulnerabilities")

# Description

_Scodi API_ is a _runner_ module of _Scodi_, which exposes an HTTP API that starts an analysis when it is requested.

Note that you must install an _analysis_ module too, to have a minimum viable installation of _Scodi_.

Read more about [the description and design of _Scodi_](https://github.com/bgatellier/scodi#readme).

# Usage

1. Install the package and an _analysis_ module, for example _[Scodi GreenIT](https://www.npmjs.com/package/@scodi/greenit)_

    ```bash
    npm install @scodi/api @scodi/greenit
    ```

    If you are using Yarn, npm < 7 or PNPM < 8, you also have to install _[Scodi CLI](https://www.npmjs.com/package/@scodi/cli)_ (which is automatically installed in more recent versions of these packages managers):

    ```bash
    npm install @scodi/cli
    ```

2. Start the server

    ```bash
    npx scodi api
    ```

    You now have an HTTP server listening to `127.0.0.1:3000`, with a `/greenit` endpoint where you could `POST` your analysis configuration (JSON-formatted) to start an analysis.

    You can change the default port with the `--port` option, and specify HTTP CORS headers with the `--cors` one.

3. Start an analysis

    ```http
    POST /greenit
    Content-type: application/json
    {
      "config": {
        "url": "https://www.ipcc.ch"
      }
    }
    ```

    The analysis configuration set with the request's body follows the JSON format, and depends of the analysis module; read their README.