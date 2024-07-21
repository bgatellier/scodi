# Scodi MySQL

_Scodi MySQL_ is a _listener_ module of _Scodi_, which reacts to the end of an analysis and stores the results of an analysis in a MySQL database.

Note that you must install an _analysis_ module too, to have a minimum viable installation of _Scodi_.

Read more about [the description and design of _Scodi_](https://github.com/bgatellier/scodi#readme).

# Usage

## Standalone

1. Install the package and an _analysis_ module, for example _[Scodi GreenIT](https://www.npmjs.com/package/@scodi/greenit)_

    ```bash
    npm install @scodi/greenit @scodi/mysql
    ```

    If you are using Yarn, npm < 7 or PNPM < 8, you also have to install _[Scodi CLI](https://www.npmjs.com/package/@scodi/cli)_ (which is automatically installed in more recent versions of these packages managers):

    ```bash
    npm install @scodi/cli
    ```

2. In the project root folder, create a `.env` file with the database connection information set as a URL

    ```dotenv
    HEART_MYSQL_DATABASE_URL=mysql://login:password@127.0.0.1:3306
    ```

3. Start an analysis

    ```bash
    npx heart greenit --config '{"url":"https://www.fabernovel.com"}'
    ```

    OR 

    ```bash
    npx heart greenit --config config.json
    ```

    Once the analysis is done, the results are stored in your _MySQL_ database.

## Github Action

If you're using Github, you can simplify the integration of Scodi in your CI scripts by using the [Github Action](https://github.com/marketplace/actions/heart-webpages-evaluation).
