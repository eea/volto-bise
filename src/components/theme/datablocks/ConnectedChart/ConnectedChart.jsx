/*
 * The most basic connected block chart
 */

import { addAppURL } from '@plone/volto/helpers';
import {
  // getConnectedDataParametersForContext,
  // getConnectedDataParametersForProvider,
  getConnectedDataParametersForPath,
} from 'volto-datablocks/helpers';
import { connect } from 'react-redux';
import { settings } from '~/config';
import React, { useEffect } from 'react'; // , useState
import { getDataFromProvider } from 'volto-datablocks/actions';
import loadable from '@loadable/component';
import { biseColorscale } from './config';
import _ from 'lodash';

const LoadablePlot = loadable(() => import('react-plotly.js'));

function mixProviderData(chartData, providerData, parameters) {
  const providerDataColumns = Object.keys(providerData);

  console.log('mix', parameters);
  const res = (chartData || []).map((trace) => {
    Object.keys(trace).forEach((tk) => {
      const originalColumn = tk.replace(/src$/, '');
      if (
        tk.endsWith('src') &&
        Object.keys(trace).includes(originalColumn) &&
        typeof trace[tk] === 'string' &&
        providerDataColumns.includes(trace[tk])
      ) {
        let values = providerData[trace[tk]];

        trace[originalColumn] = values;

        if (!(parameters && parameters.length)) return;

        // TODO: we assume a single parameter
        const {
          i: filterName,
          v: [filterValue],
        } = parameters[0];

        // tweak transformation filters using data parameters
        (trace.transforms || []).forEach((transform) => {
          if (transform.targetsrc === filterName && filterValue) {
            transform.value = filterValue;
            transform.target = providerData[transform.targetsrc];
          }
        });
      }
    });

    return trace;
  });
  return res;
}

/*
 * @param { object } data The chart data, layout,  extra config, etc.
 * @param { boolean } useLiveData Will update the chart with the data from the provider
 * @param { boolean } filterWithDataParameters Will filter live data with parameters from context
 *
 */
function ConnectedChart(props) {
  // need to bind them in this closure, useEffect depends on them;
  const provider_url = props.data.provider_url; //|| props.chartDataFromVis?.provider_url;
  const url = props.data.url;
  const getDataFromProvider = props.getDataFromProvider;

  const source_url = props.source;

  // NOTE: this is a candidate for a HOC, withProviderData
  useEffect(() => {
    if (provider_url) getDataFromProvider(provider_url || url);
  }, [provider_url, url, source_url, props.data, getDataFromProvider]);

  const chartData = props.data.chartData;

  const useLiveData =
    typeof props.useLiveData !== 'undefined' ? props.useLiveData : true;

  const propsLayout = props.data && props.data.layout ? props.data.layout : {};

  let layout = chartData?.layout ? chartData.layout : propsLayout;

  layout = {
    ...layout,
    autosize: true,
    dragmode: false,
    font: {
      ...layout.font,
      family: settings.chartLayoutFontFamily || "'Roboto', sans-serif",
    },
  };

  if (layout.xaxis)
    layout.xaxis = {
      ...layout.xaxis,
      fixedrange: true,
      hoverformat: props.hoverFormatXY || '.3s',
    };
  if (layout.yaxis)
    layout.yaxis = {
      ...layout.yaxis,
      hoverformat: props.hoverFormatXY || '.3s',
      fixedrange: true,
    };

  // TODO: only use fallback data if chartData.data.url doesn't exist
  // or the connected_data_parameters don't exist

  // debugger;
  let data =
    props.providerData && useLiveData
      ? mixProviderData(
          (chartData || {}).data,
          props.providerData,
          props.connected_data_parameters,
        )
      : (chartData || {}).data || [];
  data = data.map((trace) => ({
    ...trace,
    textfont: {
      ...trace.textfont,
      family: settings.chartDataFontFamily || "'Roboto', sans-serif",
    },
  }));

  // console.log('data', data);
  // console.log('layout', layout);

  // if the chart is a bar chart and has bar_colors set
  const isCategoricalBarChart = React.useCallback(() => {
    return typeof props.data.bar_colors === 'object';
  }, [props.data.bar_colors]);

  // take the selected colorscale (or a default colorscale)
  const getCategoricalColorScale = React.useCallback(() => {
    return props.data.categorical_colorscale || biseColorscale;
  }, [props.data.categorical_colorscale]);

  // data - chart data
  const resetCategoricalColors = React.useCallback((data) => {
    // reset the color list in the chart data
    data[0].marker = data[0].marker || {};
    data[0].marker.color = [];
  }, []);

  if (isCategoricalBarChart()) {
    const cs = getCategoricalColorScale();
    resetCategoricalColors(data);

    // put colors into the chart

    const axis = props.data.categorical_axis;

    const axisData = chartData.data[0][axis];
    // compute the unique
    const u = _.uniq(axisData);
    // for each val on axis (unique or non-unique)
    for (let i = 0; axisData && i < axisData.length; ++i) {
      // get the value
      const val = axisData[i];
      // find the index of it in the unique
      const idx = u.findIndex((x) => x === val);
      // get all the props associated to uniques (x_9, y_17 etc.)
      // split them with _ and take the second piece, e.g. 9 or 17,
      // convert it to a number
      const ci = props.data.bar_colors[axis + '_' + (idx + 1)];
      /// Object.keys(props.data.bar_colors).map((x) =>
      //  Number(x.split('_')[1])///,
      //);
      // const colorIndex = props.data.bar_colors[axis + '_' + ci];
      data[0].marker.color[i] = cs[ci - 1];
    }
    // console.log('COLORS', data[0].marker.color);
  } else if (data[0]) {
    resetCategoricalColors(data);
  }

  const chart = (
    <LoadablePlot
      data={data}
      layout={layout}
      frames={[]}
      config={{
        displayModeBar: false,
        editable: false,
        responsive: false,
        // useResizeHandler: true,
      }}
    />
  );

  return <>{__CLIENT__ && chartData && data && layout ? chart : ''}</>;
}

function getProviderData(state, props) {
  let path =
    props?.data?.provider_url || props?.data?.url || props?.url || null;

  if (!path) return;

  path = `${path}/@connector-data`;
  const url = `${addAppURL(path)}/@connector-data`;

  const data = state.data_providers?.data || {};
  const res = path ? data[path] || data[url] : [];
  return res;
}

export default connect(
  (state, props) => {
    const providerData = getProviderData(state, props);

    const providerUrl = props?.data?.provider_url || props?.data?.url || null;

    const FILTER = true; // this is a filter??
    const byPath =
      getConnectedDataParametersForPath(
        state.connected_data_parameters,
        providerUrl,
        FILTER,
      ) || {};

    const connected_data_parameters = byPath[FILTER];

    return {
      providerData,
      connected_data_parameters,
    };
  },
  { getDataFromProvider }, // getContent,
)(ConnectedChart);
