import React from 'react';
import cx from 'classnames';
import { connectBlockToProviderData } from './hooks';

import Loadable from 'react-loadable';
const LoadablePlot = Loadable({
  loader: () => import('react-plotly.js'),
  loading() {
    return <div>Loading chart...</div>;
  },
});

/**
 * Filters data. Given an object like:
 *
 * { Area: [...], Source: [...] }
 *
 * where each item in the list represents a table column value, returns a list
 * of objects, where each object represents the data for that index
 *
 */
function query(provider_data, country, filters) {
  const res = [];

  const countries_row = provider_data['Country_name'];

  countries_row.forEach((name, index) => {
    if (name === country) {
      const truth = filters.map((f) => f(provider_data, index));
      if (truth.every((t) => t)) {
        const obj = {};
        Object.keys(provider_data).forEach((k) => {
          obj[k] = provider_data[k][index];
        });
        res.push(obj);
      }
    }
  });

  return res;
}

function mapByLevel(provider_data) {
  const level2 = new Set(provider_data['Ecosystem_level2']);
  const countries = new Set(provider_data['Country_name']);
  const byLevel = Object.fromEntries(Array.from(level2).map((l) => [l, {}]));
  countries.forEach((country) => {
    level2.forEach((level) => {
      const filters = [
        (provider_data, index) =>
          provider_data['Ecosystem_level2'][index] === level,
      ];
      const country_data = query(provider_data, country, filters);
      byLevel[level][country] = country_data;
    });
  });
  return byLevel;
}

function makeTrace(level, levelData, index) {
  const data = [
    ...Object.entries(levelData).filter(([k, v]) => k !== 'Portugal'),
    ['Portugal', levelData['Portugal']],
  ];

  const x = [...data.map(([k, v]) => v)];
  const y = [];
  y.length = x.length;
  y.fill(0);

  const hovertext = [...data.map(([k, v]) => k)];
  const text = [
    ...data.slice(0, data.length - 1).map((_) => null),
    '<b>PT</b>',
  ];

  const marker = {
    symbol: [
      ...data.slice(0, data.length - 1).map((_) => null),
      'diamond-tall',
    ],
    // See https://plotly.com/javascript/reference/scatter/#scatter-marker
    size: [...data.slice(0, data.length - 1).map((_) => 8), 16],
  };
  const res = {
    x,
    y,
    hovertext,
    name: level,
    type: 'scatter',
    xaxis: `x${index > 0 ? index + 1 : ''}`,
    yaxis: `y${index > 0 ? index + 1 : ''}`,
    mode: 'markers+text',
    text,
    marker,
    textposition: 'top center',
  };
  return res;
}

function axesFromTemplate(prefix, count, tpl, getTitle) {
  const res = {};
  for (let x = 0; x < count; x++) {
    const rec = `${prefix}${x > 0 ? x + 1 : x}`;
    res[rec] = JSON.parse(JSON.stringify(tpl));
    // res[rec].title = { text: getTitle(x) };
  }
  res[prefix] = JSON.parse(JSON.stringify(tpl));
  return res;
}

function makeAnnotations(byLabel) {
  const len = Object.keys(byLabel).length;
  return Object.keys(byLabel).map((label, index) => {
    return {
      xref: 'paper',
      yref: 'paper',
      x: -0.06,
      // y: 0,
      y: (1 / (len - 1)) * index,
      xanchor: 'right',
      // yanchor: 'bottom',
      text: label,
      showarrow: false,
      // ay: (10 * index) / 2,
    };
  });
}

function makeChart(provider_data) {
  if (!provider_data) return;
  const byLevel = mapByLevel(provider_data);

  const level2 = new Set(provider_data['Ecosystem_level2']);
  const countries = new Set(provider_data['Country_name']);

  const byArea = Object.fromEntries(Array.from(level2).map((l) => [l, {}]));
  level2.forEach((level) => {
    countries.forEach((country) => {
      const recs = byLevel[level][country];
      const total = recs.reduce(
        (acc, rec) => acc + parseInt(rec['Area (m2)']),
        0,
      );
      byArea[level][country] = total;
    });
  });

  let layout = {
    height: 600,
    showlegend: false,
    margin: {
      l: 400,
      r: 0,
      t: 0,
      b: 0,
    },
    pad: 10,
    grid: {
      xside: 'bottom',
      yside: 'left',
      rows: Object.keys(byLevel).length,
      columns: 1,
      ygap: 0.2,
      roworder: 'bottom to top',
      yaxes: Object.keys(byLevel).map(
        (l, index) => `y${index > 0 ? index + 1 : ''}`,
      ),
      xaxes: Object.keys(byLevel).map(
        (l, index) => `x${index > 0 ? index + 1 : ''}`,
      ),
      pattern: 'independent',
    },
    ...axesFromTemplate(
      'xaxis',
      Object.keys(byLevel).length,
      {
        // this axis is shared
        visible: true,
        ticks: '',
        showline: false,
        showgrid: false,
        zeroline: false,
        autorange: true,
        // fixedrange: true,
        showticklabels: false,
      },
      (index) => '',
    ),
    ...axesFromTemplate(
      'yaxis',
      Object.keys(byLevel).length,
      {
        type: 'category',
        visible: true,
        ticks: '',
        showline: false,
        showgrid: true,
        gridwidth: 2,
        zeroline: false,
        gridcolor: '#000',
        showticklabels: false,
      },
      (index) => Object.keys(byLevel)[index],
    ),
    annotations: [...makeAnnotations(byLevel)],
  };

  const traces = Array.from(level2).map((level, index) =>
    makeTrace(level, byArea[level], index),
  );

  return { layout, data: traces };
}

const View = ({ data, provider_data, id, ...rest }) => {
  const chart = React.useRef();
  React.useEffect(() => {
    if (provider_data && !chart.current) {
      chart.current = makeChart(provider_data);
      console.log('chart', chart.current);
    }
  });

  return (
    <div
      className={cx(
        'block align',
        {
          center: !Boolean(data.align),
        },
        data.align,
      )}
    >
      <div
        className={cx({
          'full-width': data.align === 'full',
        })}
      >
        {/* <div className="block-wrapper">{JSON.stringify(data)}</div> */}
        {provider_data && chart.current ? (
          <LoadablePlot
            data={chart.current.data}
            layout={chart.current.layout}
            frames={[]}
            config={{
              displayModeBar: false,
              editable: false,
              responsive: true,
              // useResizeHandler: true,
            }}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default connectBlockToProviderData(View);
