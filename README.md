# volto-bise

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
