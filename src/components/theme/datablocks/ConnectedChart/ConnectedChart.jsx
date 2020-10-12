/*
 * The most basic connected block chart
 */

import React from 'react'; // , useState
import { connect } from 'react-redux';
import { addAppURL } from '@plone/volto/helpers';
import {
  // getConnectedDataParametersForContext,
  // getConnectedDataParametersForProvider,
  getConnectedDataParametersForPath,
} from 'volto-datablocks/helpers';
import { settings } from '~/config';
import { getDataFromProvider } from 'volto-datablocks/actions';
import loadable from '@loadable/component';
import VisibilitySensor from 'react-visibility-sensor';

const LoadablePlot = loadable(() => import('react-plotly.js'));

function mixProviderData(chartData, providerData, parameters) {
  const providerDataColumns = Object.keys(providerData);

  // console.log('mix', parameters);
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
  React.useEffect(() => {
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

  const nodeRef = React.useRef();
  const sizeRef = React.useRef({});

  React.useLayoutEffect(() => {
    if (nodeRef.current) {
      setTimeout(() => {
        const height = nodeRef.current?.el?.clientHeight;
        const width = nodeRef.current?.el?.clientWidth;
        if (height && width) {
          const size = {
            height: `${height}px`,
            width: `${width}px`,
          };
          sizeRef.current = size;
        }
      }, 500);
    }
  });

  const [update, setUpdate] = React.useState(true);

  return (
    <div>
      <VisibilitySensor
        className="connected-chart"
        partialVisibility={true}
        offset={{ top: 10 }}
        delayedCall={true}
        onChange={() => setUpdate(!update)}
      >
        {({ isVisible }) =>
          isVisible ? (
            <div className="connected-chart-wrapper">
              <LoadablePlot
                ref={nodeRef}
                data={data}
                layout={layout}
                frames={[]}
                config={{
                  displayModeBar: false,
                  editable: false,
                  responsive: true,
                  useResizeHandler: true,
                }}
                style={{
                  maxWidth: '100%',
                  margin: 'auto',
                }}
              />
            </div>
          ) : (
            <div style={sizeRef.current}>x</div>
          )
        }
      </VisibilitySensor>
    </div>
  );

  // return <>{__CLIENT__ && chartData && data && layout ? chart : ''}</>;
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
