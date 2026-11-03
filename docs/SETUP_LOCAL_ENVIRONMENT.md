# Setup your local environment

## Install the requirements

Scodi uses [Proto](https://moonrepo.dev/proto) as its toolchain manager. Proto will install all required tools (Bun, Moon, etc.) automatically.

To install Proto:

```shell
curl -fsSL https://moonrepo.dev/install.sh | bash
```

Or on Windows (PowerShell):

```powershell
iwr https://moonrepo.dev/install.ps1 -useb | iex
```

_Scodi_ is a monorepo managed with [Moon](https://moonrepo.dev/), and uses [Bun](https://bun.sh/) as its runtime and package manager.

## Clone the repository

```shell
git clone git@github.com:bgatellier/scodi.git
```

## Install the dependencies

From the root directory, Proto will automatically install the correct versions of all tools defined in `.prototools`.

Run the following command to install dependencies:

```shell
bun install
```

This will install all workspace dependencies using Bun.

## Build the packages

As the code is written using TypeScript, it has to be compiled into plain JavaScript.

To do so, Moon provides a build task. Run the following command from the root directory:

```shell
moon run :build
```

This will build all packages that need to be built.
