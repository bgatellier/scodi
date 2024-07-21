# Description

_Scodi Observatory_ is an _analysis_ module of _Scodi_, which analyses URLs with _[Mozilla Observatory](https://observatory.mozilla.org/)_.

Read more about [the description and design of _Scodi_](https://github.com/bgatellier/scodi#readme).

# Usage

## Standalone

1. Install the package

    ```bash
    npm install @scodi/observatory
    ```

    If you are using Yarn, npm < 7 or PNPM < 8, you also have to install _[Scodi CLI](https://www.npmjs.com/package/@scodi/cli)_ (which is automatically installed in more recent versions of these packages managers):

    ```bash
    npm install @scodi/cli
    ```

2. [Optional] Customize the _Mozilla Observatory_ scanner

    By default, the scanner used is the public one, but you can use your own: [from a local codebase](https://github.com/mozilla/http-observatory#running-a-scan-from-the-local-codebase-without-db-for-continuous-integration) or [with Docker](https://github.com/mozilla/http-observatory#running-a-local-scanner-with-docker).

    In this case, you must provide the following env values:
    ```dotenv
    HEART_OBSERVATORY_API_URL=
    HEART_OBSERVATORY_ANALYZE_URL=
    ```

3. Start an analysis

    ```bash
    npx heart observatory --config '{"host": "heart.fabernovel.com"}'
    ```

    OR 

    ```bash
    npx heart observatory --config config.json
    ```

    The analysis configuration follows the JSON format and  the [Invoke assessment API Documentation](https://github.com/mozilla/http-observatory/blob/master/httpobs/docs/api.md#invoke-assessment).

## Github Action

If you're using Github, you can simplify the integration of Scodi in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).
