import React from 'react';
import cx from 'classnames';
import { connectBlockToProviderData } from './hooks';
import { Grid } from 'semantic-ui-react';
import loadable from '@loadable/component';
import { serializeNodes } from 'volto-slate/editor/render';
import {
  customSelectStyles,
  DropdownIndicator,
  Option,
  selectTheme,
} from '@plone/volto/components/manage/Widgets/SelectStyling';

const Select = loadable(() => import('react-select'));
const LoadablePlot = loadable(() => import('react-plotly.js'));

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

function makeTrace(level, levelData, index, focusOn) {
  console.log(focusOn);
  const data = [
    ...Object.entries(levelData).filter(([k, v]) => k !== focusOn),
    [focusOn, levelData[focusOn]],
  ];

  const x = [...data.map(([k, v]) => v)];
  const y = [];
  y.length = x.length;
  y.fill(0);

  const hovertext = [...data.map(([k, v]) => k)];
  const text = [
    ...data.slice(0, data.length - 1).map((_) => null),
    `<b>${focusOn}</b>`,
  ];

  const marker = {
    symbol: [
      ...data.slice(0, data.length - 1).map((_) => null),
      'triangle-down',
    ],
    // See https://plotly.com/javascript/reference/scatter/#scatter-marker
    size: [...data.slice(0, data.length - 1).map((_) => 8), 16],
  };
  const res = {
    x,
    y,
    // hovertext,
    // See
    // https://plotly.com/javascript/reference/scatter/#scatter-hovertemplate
    hovertemplate: '%{customdata}: %{x:.2f}<extra></extra>',
    hoverinfo: 'y',
    customdata: hovertext,
    name: level,
    type: 'scatter',
    // needed for subplots!!
    // xaxis: `x${index > 0 ? index + 1 : ''}`,
    // yaxis: `y${index > 0 ? index + 1 : ''}`,
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

function makeSubplotsChart(provider_data) {
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
    height: 560,
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

function chartTileLayout(index) {
  return {
    height: 50,
    showlegend: false,
    margin: {
      l: 0,
      r: 0,
      t: 0,
      b: 0,
    },
    pad: 0,
    xaxis: {
      visible: true,
      ticks: '',
      showline: false,
      showgrid: false,
      zeroline: false,
      autorange: true,
      // fixedrange: true,
      showticklabels: false,
    },
    yaxis: {
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
  };
}

function makeChartTiles(provider_data, focusOn) {
  if (!provider_data) return;
  const byLevel = mapByLevel(provider_data);

  const ecosystems = Array.from(new Set(provider_data['Ecosystem_level2']));
  const countries = Array.from(new Set(provider_data['Country_name']));

  const byArea = Object.fromEntries(ecosystems.map((l) => [l, {}]));
  ecosystems.forEach((level) => {
    countries.forEach((country) => {
      const recs = byLevel[level][country];
      const total = recs.reduce(
        (acc, rec) => acc + parseInt(rec['Area (m2)']),
        0,
      );
      byArea[level][country] = total;
    });
  });

  const tiles = ecosystems.map((level, index) => {
    return {
      layout: chartTileLayout(index),
      data: [makeTrace(level, byArea[level], index, focusOn)],
      title: level,
    };
  });

  return tiles;
}

const SelectCountry = (props) => {
  const { id, onChange, data } = props;
  const countries = Array.from(new Set(data['Country_name']));
  const options = countries.map((c) => ({ label: c, value: c }));
  return (
    <Select
      id={`field-${id}`}
      name={id}
      className="react-select-container"
      classNamePrefix="react-select"
      isMulti={id === 'roles' || id === 'groups'}
      options={options}
      styles={customSelectStyles}
      theme={selectTheme}
      components={{ DropdownIndicator, Option }}
      defaultValue={null}
      onChange={onChange}
    />
  );
};

const View = ({ data, provider_data, id, ...rest }) => {
  const [focusOn, setFocusOn] = React.useState();
  const chart = React.useRef();
  const [multiCharts, setMultiCharts] = React.useState([]);
  React.useEffect(() => {
    if (provider_data) {
      setMultiCharts(makeChartTiles(provider_data, focusOn));
    }
  }, [provider_data, focusOn]);

  return (
    <div className={cx('block align', data.align)}>
      <div
        className={cx({
          'full-width': data.align === 'full',
        })}
      >
        <h3>{data.title}</h3>
        {/* <div className="block-wrapper">{JSON.stringify(data)}</div> */}

        <Grid columns={12}>
          <Grid.Row>
            <Grid.Column width={8}>
              {provider_data
                ? multiCharts.map((chart, index) => {
                    return (
                      <>
                        <div>{chart.title}</div>
                        <LoadablePlot
                          key={index}
                          data={chart.data}
                          layout={chart.layout}
                          frames={[]}
                          config={{
                            displayModeBar: false,
                            editable: false,
                            responsive: false,
                            // useResizeHandler: true,
                          }}
                        />
                      </>
                    );
                  })
                : ''}
            </Grid.Column>
            <Grid.Column width={4} flated="right">
              {provider_data && (
                <SelectCountry
                  data={provider_data}
                  id={`${id}-select-country`}
                  onChange={(data) => {
                    setFocusOn(data.value);
                  }}
                  defaultValue={
                    focusOn ? { value: focusOn, label: focusOn } : null
                  }
                />
              )}
              <div>{serializeNodes(data.description)}</div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </div>
  );
};

export default connectBlockToProviderData(View);

// {provider_data && chart.current && (
//   <LoadablePlot
//     data={chart.current.data}
//     layout={chart.current.layout}
//     frames={[]}
//     config={{
//       displayModeBar: false,
//       editable: false,
//       responsive: true,
//       // useResizeHandler: true,
//     }}
//   />
// )}
