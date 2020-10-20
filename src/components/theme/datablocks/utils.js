import { connect } from 'react-redux';
import {
  getConnectedDataParametersForContext,
  getConnectedDataParametersForProvider,
  getConnectedDataParametersForPath,
} from 'volto-datablocks/helpers';

/**
 * filterDataByParameters.
 *
 * Filters provider data by connected data parameters
 *
 * @param {} providerData
 * @param {} parameters
 */
export function filterDataByParameters(providerData, parameters) {
  if (!(parameters && parameters.length)) return providerData;

  const filter = parameters.find((f) => {
    // finds any available filter that matches the data
    let { i: index } = f;
    index = index.toLowerCase().replace('taxonomy_', '');
    return Object.keys(providerData || {})
      .map((k) => k.toLowerCase())
      .includes(index);
  });
  if (!filter) return providerData;

  let {
    i: filterName,
    v: [filterValue],
  } = filter;

  filterName = filterName.replace('taxonomy_', '');
  const fixedFilterName = Object.keys(providerData).find(
    (k) => k.toLowerCase() === filterName.toLowerCase(),
  );
  if (!fixedFilterName) {
    console.warn(`providerData has no such column: ${filterName}`, parameters);
    console.log(providerData);
    return providerData;
  }
  const index = providerData[fixedFilterName]
    .map((v, i) => (v === filterValue ? i : null))
    .filter((n) => n !== null);
  const res = {};
  Object.keys(providerData).forEach((k) => {
    res[k] = index.map((n) => providerData[k][n]);
  });

  return res;
}

/**
 * mixProviderData.
 *
 * Mixes provider data with saved chart data, optionally filtered by connected
 * data parameters. To be used in a plotly chart
 *
 * @param {} chartData
 * @param {} providerData
 * @param {} parameters
 */
export function mixProviderData(chartData, providerData, parameters) {
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

        const filter = parameters.find((f) => {
          // finds any available filter that matches the data
          let { i: index } = f;
          index = index.toLowerCase().replace('taxonomy_', '');
          return Object.keys(providerData || {})
            .map((k) => k.toLowerCase())
            .includes(index);
        });
        if (!filter) return providerData;

        let {
          i: filterName,
          v: [filterValue],
        } = filter;

        filterName = filterName.replace('taxonomy_', '');

        const real_index =
          providerDataColumns.find((n) => n.toLowerCase() === filterName) ||
          filterName;

        // console.log('filter', filterName, real_index, filterValue);

        // tweak transformation filters using data parameters
        (trace.transforms || []).forEach((transform) => {
          if (transform.targetsrc === real_index && filterValue) {
            transform.value = filterValue;
            transform.target = providerData[transform.targetsrc];
          }
        });
      }
    });

    return trace;
  });
  // console.log('res', res);
  return res;
}

export const connectToDataParameters = connect((state, props) => {
  // console.log('props', props);
  const providerUrl = props?.data?.provider_url || props?.data?.url || null;

  const FILTER = true; // this is a filter??
  const byPath =
    getConnectedDataParametersForPath(
      state.connected_data_parameters,
      providerUrl,
      FILTER,
    ) || {};

  // console.log('byPath', byPath);
  const byProvider = getConnectedDataParametersForProvider(
    state.connected_data_parameters,
    providerUrl,
  );
  const byContext = getConnectedDataParametersForContext(
    state.connected_data_parameters,
    state.router.location.pathname,
  );
  // console.log('byContext', byContext);

  const connected_data_parameters =
    providerUrl !== null
      ? byPath
        ? byPath[FILTER] || byContext || byProvider
        : byContext || byProvider
      : null;

  // console.log(
  //   'final connected_data_parameters',
  //   providerUrl,
  //   connected_data_parameters,
  // );
  return {
    connected_data_parameters,
  };
}, null);
