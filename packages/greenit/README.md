# Description

_Scodi GreenIT_ is an _analysis_ module of _Scodi_, which analyses URLs with _[GreenIT](https://chrome.google.com/webstore/detail/greenit-analysis/mofbfhffeklkbebfclfaiifefjflcpad)_.

Read more about [the description and design of _Scodi_](https://github.com/bgatellier/scodi#readme).

# Usage

## Standalone

1. Install the package

    ```bash
    npm install @scodi/greenit
    ```

    If you are using Yarn, npm < 7 or PNPM < 8, you also have to install _[Scodi CLI](https://www.npmjs.com/package/@scodi/cli)_ (which is automatically installed in more recent versions of these packages managers):

    ```bash
    npm install @scodi/cli
    ```

2. Start an analysis

    ```bash
    npx scodi greenit --config '{"url":"https://www.ipcc.ch/"}'
    ```

    OR 

    ```bash
    npx scodi greenit --config config.json
    ```

    The analysis configuration follows the JSON format and has the following keys:

    ```jsonc
    {
        "url": "https://www.ipcc.ch/",
        // optional - Report language. Default: "en"
        // possible values: "en", "fr"
        "language": "fr",
        // optional - Timeout for an analysis of a URL in ms. Default: 180000
        "timeout": 180000,
        // optional - Number of retry when an analysis of a URL fail. Default: 2
        "retry": 2,
        // optional - Hardware to simulate. Default: "desktop"
        // possible values: "desktop", "galaxyS9", "galaxyS20", "iPhone8", "iPhone8Plus", "iPhoneX", "iPad"
        "device": "galaxyS20"
    }
    ```

## Github Action

If you're using Github, you can simplify the integration of Scodi in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).

# Disclaimer

The LCA values used by GreenIT to evaluate environmental impacts are not under free license - &copy; Frédéric Bordage

Please also refer to the mentions provided in the code files for specifics on the IP regime.
