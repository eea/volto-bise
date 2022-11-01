# volto-bise

[![Releases](https://img.shields.io/github/v/release/eea/volto-bise)](https://github.com/eea/volto-bise/releases)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-bise%2Fmaster&subject=master)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-bise/job/master/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-bise-master&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-bise-master)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-bise-master&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-bise-master)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-bise-master&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-bise-master)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-bise-master&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-bise-master)

[![Pipeline](https://ci.eionet.europa.eu/buildStatus/icon?job=volto-addons%2Fvolto-bise%2Fdevelop&subject=develop)](https://ci.eionet.europa.eu/view/Github/job/volto-addons/job/volto-bise/job/develop/display/redirect)
[![Lines of Code](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-bise-develop&metric=ncloc)](https://sonarqube.eea.europa.eu/dashboard?id=volto-bise-develop)
[![Coverage](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-bise-develop&metric=coverage)](https://sonarqube.eea.europa.eu/dashboard?id=volto-bise-develop)
[![Bugs](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-bise-develop&metric=bugs)](https://sonarqube.eea.europa.eu/dashboard?id=volto-bise-develop)
[![Duplicated Lines (%)](https://sonarqube.eea.europa.eu/api/project_badges/measure?project=volto-bise-develop&metric=duplicated_lines_density)](https://sonarqube.eea.europa.eu/dashboard?id=volto-bise-develop)

[Volto](https://github.com/plone/volto) add-on

## Features

An addon for Volto specific to the BISE website.

## Notes to developers

### 4th of November, 2020

We are depending directly on plotly.js 1.57.0 instead of the latest 1.57.1 because it has a regression that is specific to our use case.

When displaying the MAES Viewer block (more precisely the MAES Viewer View component) it crashes the web application with error:

> Cannot convert undefined or null to object

This error seems to be coming from the `InnerLoadable` inside `@loadable/component` package but this bug is not reproducible in a simple `create-react-app` test project.

More precisely, the error is thrown in the `InnerLoadable` component created by `Context.Consumer` which is used in `Unknown` created by `ForwardRef` which is used in `ForwardRef` created at `MaesViewerView.jsx:93`. This line contains the tag for the component passed through `@loadable/component`: `<LoadablePlot ...`.

![Imgur](https://i.imgur.com/tgBvpP2.png)

More info can be found in:

1. [this closed GitHub issue](https://github.com/plotly/plotly.js/issues/5243);
2. [our PR related to this](https://github.com/eea/volto-bise/pull/32);
3. [the changelog for v1.57.1](https://github.com/plotly/plotly.js/releases/tag/v1.57.1);
   1. in the changelog there seems to be [only one relevant change](https://github.com/plotly/plotly.js/pull/5223).

## Getting started

### Try volto-bise with Docker

1. Get the latest Docker images

   ```
   docker pull plone
   docker pull plone/volto
   ```

1. Start Plone backend

   ```
   docker run -d --name plone -p 8080:8080 -e SITE=Plone -e PROFILES="profile-plone.restapi:blocks" plone
   ```

1. Start Volto frontend

   ```
   docker run -it --rm -p 3000:3000 --link plone -e ADDONS="@eeacms/volto-bise" plone/volto
   ```

1. Go to http://localhost:3000

### Add volto-bise to your Volto project

1. Make sure you have a [Plone backend](https://plone.org/download) up-and-running at http://localhost:8080/Plone

1. Start Volto frontend

- If you already have a volto project, just update `package.json`:

  ```JSON
  "addons": [
      "@eeacms/volto-bise"
  ],

  "dependencies": {
      "@eeacms/volto-bise": "^1.0.0"
  }
  ```

- If not, create one:

  ```
  npm install -g yo @plone/generator-volto
  yo @plone/volto my-volto-project --addon @eeacms/volto-bise
  cd my-volto-project
  ```

1. Install new add-ons and restart Volto:

   ```
   yarn
   yarn start
   ```

1. Go to http://localhost:3000

1. Happy editing!

## Release

See [RELEASE.md](https://github.com/eea/volto-bise/blob/master/RELEASE.md).

## How to contribute

See [DEVELOP.md](https://github.com/eea/volto-bise/blob/master/DEVELOP.md).

## Copyright and license

The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

See [LICENSE.md](https://github.com/eea/volto-bise/blob/master/LICENSE.md) for details.

## Funding

[European Environment Agency (EU)](http://eea.europa.eu)
