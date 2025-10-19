
<p align="center">A command-line tool to industrialize web quality measurement.</p>

[![npm](https://img.shields.io/npm/v/%40fabernovel%2Fheart-cli?logo=npm "List Scodi packages on npmjs.com")](https://www.npmjs.com/search?q=%40fabernovel%2Fheart)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=scodi-cli&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=scodi-cli "View coverage details")
[![Known Vulnerabilities](https://snyk.io/test/github/bgatellier/scodi/badge.svg?targetFile=packages/cli/package.json)](https://snyk.io/test/github/bgatellier/scodi?targetFile=packages/cli/package.json "View known vulnerabilities")

# Description

Scodi is a tool that centralize the use of famous web quality measurement services ([_Google Lighthouse_](https://pagespeed.web.dev/), [_GreenIT Analysis_](https://www.ecoindex.fr/) or [_Mozilla Observatory_](https://observatory.mozilla.org/)) in a unique CLI.

With his modular approach, it makes easy to process the analysis results into a database to track metrics over time.

Moreover the command-line interface allows a smooth integration into a CI/CD chain.

# Example of use

Exemple scenario:
- analyze <https://www.ipcc.ch/> using the _Google Lighthouse_ service.
- store the results in a _MySQL_ database.

## Manual, with NPM packages

1. Install the packages
    
    ```bash
    npm install @scodi/lighthouse @scodi/mysql
    ```

2. Set the credentials for MySQL (database URL)
    
    ```bash
    echo SCODI_MYSQL_DATABASE_URL=login:password@127.0.0.1:3306 >> .env
    ```

3. Start the analysis

    ```bash
    npx scodi lighthouse --config '{"url":"https://www.ipcc.ch/"}'
    ```

Once the analysis is over, the results will be stored in a `report` table, which you can exploit with tools like _Grafana_:

![Analyzed URL, overall grade over 100, several metrics like Speed Index, First Contentful Paint and advices for improvements](./docs/images/mysql.png)

For more options, have a look at the help by using `npx scodi -h`

## Packaged, with the Docker image

Scodi is also available as a [Docker image](https://hub.docker.com/r/fabernovel/heart).

With the example scenario given previously, the Docker image is used as follow:

```shell
docker run --rm\
    --env SCODI_MYSQL_DATABASE_URL=login:password@127.0.0.1:3306\
    fabernovel/heart:latest\
    lighthouse --config '{"url":"https://www.ipcc.ch"}' --only-listeners=mysql
```

## Automated, with the GitHub Action

If you're using GitHub, you can simplify the integration of Scodi in your CI scripts by using the [GitHub Action](https://github.com/marketplace/actions/heart-webpages-evaluation).

With the example scenario given previously, the GitHub Action is used as follow:

```yaml
- uses: faberNovel/heart-action@v4
  with:
    analysis_service: lighthouse
    listener_services_only: mysql
    mysql_database_url: ${{ secrets.MYSQL_DATABASE_URL }}
```

# Design

_Scodi_ has been designed to be as light as possible, which explains its modular approach: you only install what you need.

To do so, _Scodi_ is divided in 3 types of packages.

## packages types

| Type | Mission | Example |
| ------ | ------ | ------ |
| Runner | Starts an analysis | using the CLI or the HTTP API |
| Analysis | Analyzes URLs using third-party services | using _GreenIT Analysis_ |
| Listener | Do thing with the results of the analysis | store them into a _MySQL_ database |

**The minimum setup you need to run _Scodi_, is to have the _Scodi CLI_ _runner_ module and a single _analysis_ module.**

## packages list

| Name | Type | Purpose |
| ------ | ------ | ------ |
| [Scodi API](./packages/api/) | Runner | Exposes an HTTP API that starts an analysis when it is requested |
| [Scodi CLI](./packages/cli/) | Runner | Control the other modules by using a CLI |
| [Scodi GreenIT](./packages/greenit/) | Analysis | Analyzes URLs with [GreenIT Analysis](https://chrome.google.com/webstore/detail/greenit-analysis/mofbfhffeklkbebfclfaiifefjflcpad?hl=en) |
| [Scodi Lighthouse](./packages/lighthouse/) | Analysis | Analyzes URLs with [Google Lighthouse](https://developers.google.com/web/tools/lighthouse) |
| [Scodi Observatory](./packages/observatory/) | Analysis | Analyzes URLs with [Mozilla Observatory](https://observatory.mozilla.org/) |
| [Scodi SSL Labs Server](./packages/ssllabs-server/) | Analysis | Analyzes URLs with [Qualys SSL Labs Server](https://www.ssllabs.com/ssltest/) |
| [Scodi MySQL](./packages/mysql/) | Listener | Stores the results of the analysis into a [MySQL](https://www.mysql.com) database |
