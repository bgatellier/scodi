# Description

_Scodi Lighthouse_ is an _analysis_ module of _Scodi_, which analyses URLs with _[Google Lighthouse](https://developers.google.com/web/tools/lighthouse/)_.

Read more about [the description and design of _Scodi_](https://github.com/bgatellier/scodi#readme).

# Usage

## Standalone

1. Install the package

    ```bash
    npm install @scodi/lighthouse
    ```

    If you are using Yarn, npm < 7 or PNPM < 8, you also have to install _[Scodi CLI](https://www.npmjs.com/package/@scodi/cli)_ (which is automatically installed in more recent versions of these packages managers):

    ```bash
    npm install @scodi/cli
    ```

2. Start an analysis

    ```bash
    npx scodi lighthouse --config '{"url":"https://www.ipcc.ch"}'
    ```

    OR 

    ```bash
    npx scodi lighthouse --config config.json
    ```

    The analysis configuration follows the JSON format and has the following keys:

    ```jsonc
    {
        "url": "https://www.ipcc.ch/",
        // optional - customize Google Lighthouse
        // see https://github.com/GoogleChrome/lighthouse/blob/master/docs/configuration.md#lighthouse-configuration
        "config": {
          "extends": "lighthouse:default",
          "settings": {
            "onlyAudits": [
              "first-meaningful-paint",
              "speed-index",
              "first-cpu-idle",
              "interactive"
            ]
          }
        }
    }
    ```

## Github Action

If you're using Github, you can simplify the integration of Scodi in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).
