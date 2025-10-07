[![npm](https://img.shields.io/npm/v/%40fabernovel%2Fheart-slack
 "Scodi Slack on npmjs.com")](https://www.npmjs.com/package/@fabernovel/heart-slack)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=scodi-slack&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=scodi-slack)
[![Known Vulnerabilities](https://snyk.io/test/github/bgatellier/scodi/badge.svg?targetFile=packages/slack/package.json)](https://snyk.io/test/github/bgatellier/scodi?targetFile=packages/slack/package.json "View known vulnerabilities")

# Description

_Scodi Slack_ is a _listener_ module of _Scodi_, which reacts to the end of an analysis by sending the results to a _[Slack](https://slack.com)_ channel.

Note that you must install an _analysis_ module too, to have a minimum viable installation of _Scodi_.

Read more about [the description and design of _Scodi_](https://github.com/bgatellier/scodi#readme).

# Usage

## Standalone

1. Install the package and an _analysis_ module, for example _[Scodi GreenIT](https://www.npmjs.com/package/@scodi/greenit)_

    ```bash
    npm install @scodi/greenit @scodi/slack
    ```

    If you are using Yarn, npm < 7 or PNPM < 8, you also have to install _[Scodi CLI](https://www.npmjs.com/package/@scodi/cli)_ (which is automatically installed in more recent versions of these packages managers):

    ```bash
    npm install @scodi/cli
    ```

2. In the project root folder, create a `.env` file with the Slack Access token

    ```dotenv
    SCODI_SLACK_ACCESS_TOKEN=My_Slack_Access_Token
    ```

3. [Optional] Customize the Slack channel

    By default the `scodi` channel is used, but you can customize it by adding the `SCODI_SLACK_CHANNEL_ID` variable to your .env file:
    ```dotenv
    SCODI_SLACK_CHANNEL_ID=my-custom-channel
    ```

    Note that the channel identifier must follows the format and rules indicated in [the Slack API documentation](https://api.slack.com/methods/chat.postMessage#channels).

4. Start an analysis

    ```bash
    npx scodi greenit --config '{"url":"https://www.ipcc.ch"}'
    ```

    OR 

    ```bash
    npx scodi greenit --config config.json
    ```

    Once the analysis is done, a notification is sent to your _Slack_ channel.

## Github Action

If you're using Github, you can simplify the integration of Scodi in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).
