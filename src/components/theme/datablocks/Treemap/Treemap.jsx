/*
 * The most basic connected block chart
 */

import React from 'react';
import { compose } from 'redux';
import { connectAnythingToProviderData } from 'volto-datablocks/hocs';
import loadable from '@loadable/component';
import { filterDataByParameters, connectToDataParameters } from '../utils';
import Placeholder from 'volto-bise/components/theme/Placeholder/Placeholder';

import { settings } from '~/config';

// import './fixes.css';

const LoadablePlot = loadable(() =>
  import(
    /* webpackChunkName: "bise-react-plotly" */
    'react-plotly.js'
  ),
);

/*
 * @param { object } data The chart data, layout,  extra config, etc.
 * @param { boolean } useLiveData Will update the chart with the data from the provider
 * @param { boolean } filterWithDataParameters Will filter live data with parameters from context
 *
 */
function Treemap(props) {
  const layout = {
    autosize: true,
    dragmode: false,
    font: {
      family: settings.chartLayoutFontFamily || "'Roboto', sans-serif",
    },
  };

  let { connected_data_parameters, provider_data = {}, data = {} } = props;
  const { size_column, parent_column, label_column } = data;

  provider_data = provider_data || {};
  const filteredData = filterDataByParameters(
    provider_data,
    connected_data_parameters,
  );

  let traces = [
    {
      type: 'treemap',
      labels: filteredData[label_column] || [],
      parents: filteredData[parent_column] || [],
      values: filteredData[size_column] || [],
      marker: {
        pad: {
          // t: 100,
        },
      },
    },
  ];

  return (
    <div>
      <Placeholder
        getDOMElement={(val) => {
          return val?.el;
        }}
        className="connected-chart"
        partialVisibility={true}
        offset={{ top: -100, bottom: -100 }}
        delayedCall={true}
      >
        {({ nodeRef }) => (
          <div className="connected-chart-wrapper">
            <LoadablePlot
              ref={nodeRef}
              data={traces}
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
        )}
      </Placeholder>
    </div>
  );
}

export default compose(
  connectAnythingToProviderData(
    // injects provider_data
    (props) => props.data.url || props.data.provider_url,
  ),
  connectToDataParameters,
)(Treemap);
