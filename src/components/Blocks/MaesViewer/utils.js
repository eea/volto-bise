export const colorscale = [
  'rgb(166,206,227)',
  'rgb(31,120,180)',
  'rgb(178,223,138)',
  'rgb(51,160,44)',
  'rgb(251,154,153)',
  'rgb(227,26,28)',
  'rgb(160,26,51)',
  'rgb(227,178,223)',
  'rgb(31,227,28)',
  'rgb(227,120,180)',
];

/**
 * Filters data. Given an object like:
 *
 * { Area: [...], Source: [...] }
 *
 * where each item in the list represents a table column value, returns a list
 * of objects, where each object represents the data for that index
 *
 */
export function query(provider_data, country, filters) {
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

export function mapByLevel(provider_data) {
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

export function makeTrace(level, levelData, index, focusOn) {
  const data = [
    ...Object.entries(levelData).filter(([k, v]) => k !== focusOn),
    [focusOn, levelData[focusOn]],
  ];

  const x = [...data.map(([k, v]) => v)];
  const y = [];
  y.length = x.length;
  y.fill(0);
  y[y.length - 1] = 0.25; // we "lift" this value to "highlight" it

  const hovertext = [...data.map(([k, v]) => k)];
  const text = [
    ...data.slice(0, data.length - 1).map((_) => null),
    `<b>${focusOn}</b>`,
  ];

  const marker = {
    symbol: [
      ...data.slice(0, data.length - 1).map((_) => null),
      'big-dot',
      // 'triangle-down',
    ],
    // See https://plotly.com/javascript/reference/scatter/#scatter-marker
    size: [...data.slice(0, data.length - 1).map((_) => 10), 10],
    opacity: [...data.slice(0, data.length - 1).map((_) => 0.8), 1],
    color: [
      ...data.slice(0, data.length - 1).map((_) => colorscale[index]),
      '#182844',
    ],
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

export function axesFromTemplate(prefix, count, tpl, getTitle) {
  const res = {};
  for (let x = 0; x < count; x++) {
    const rec = `${prefix}${x > 0 ? x + 1 : x}`;
    res[rec] = JSON.parse(JSON.stringify(tpl));
    // res[rec].title = { text: getTitle(x) };
  }
  res[prefix] = JSON.parse(JSON.stringify(tpl));
  return res;
}

export function chartTileLayout(index) {
  return {
    height: 60,
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
      showline: false,
      showgrid: false,
      zeroline: false,
      autorange: true,

      // fixedrange: true,
      // tickmode: 'linear',
      // nticks: 2,
      // tick0: 0,
      // ticks: 'outside',
      // showticklabels: true,
    },
    yaxis: {
      type: 'linear',
      range: [-0.3, 1], // needed to show the current country as a dot above the line
      visible: true,
      ticks: '',
      showgrid: false,
      gridwidth: 2,
      gridcolor: '#000',
      showline: true,
      zeroline: true,
      zerolinewidth: 2,
      zerolinecolor: '#000',
      showticklabels: false,
      // showdividers: true,
    },
  };
}

export function makeChartTiles(provider_data, focusOn) {
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

// unused, old version
// export function makeSubplotsChart(provider_data) {
//   if (!provider_data) return;
//   const byLevel = mapByLevel(provider_data);
//
//   const level2 = new Set(provider_data['Ecosystem_level2']);
//   const countries = new Set(provider_data['Country_name']);
//
//   const byArea = Object.fromEntries(Array.from(level2).map((l) => [l, {}]));
//   level2.forEach((level) => {
//     countries.forEach((country) => {
//       const recs = byLevel[level][country];
//       const total = recs.reduce(
//         (acc, rec) => acc + parseInt(rec['Area (m2)']),
//         0,
//       );
//       byArea[level][country] = total;
//     });
//   });
//
//   let layout = {
//     height: 560,
//     showlegend: false,
//     margin: {
//       l: 400,
//       r: 0,
//       t: 0,
//       b: 0,
//     },
//     pad: 10,
//     grid: {
//       xside: 'bottom',
//       yside: 'left',
//       rows: Object.keys(byLevel).length,
//       columns: 1,
//       ygap: 0.2,
//       roworder: 'bottom to top',
//       yaxes: Object.keys(byLevel).map(
//         (l, index) => `y${index > 0 ? index + 1 : ''}`,
//       ),
//       xaxes: Object.keys(byLevel).map(
//         (l, index) => `x${index > 0 ? index + 1 : ''}`,
//       ),
//       pattern: 'independent',
//     },
//     ...axesFromTemplate(
//       'xaxis',
//       Object.keys(byLevel).length,
//       {
//         // this axis is shared
//         visible: true,
//         ticks: '',
//         showline: false,
//         showgrid: false,
//         zeroline: false,
//         autorange: true,
//         // fixedrange: true,
//         showticklabels: false,
//       },
//       (index) => '',
//     ),
//     ...axesFromTemplate(
//       'yaxis',
//       Object.keys(byLevel).length,
//       {
//         type: 'category',
//         visible: true,
//         ticks: '',
//         showline: false,
//         showgrid: true,
//         gridwidth: 2,
//         zeroline: false,
//         gridcolor: '#000',
//         showticklabels: false,
//       },
//       (index) => Object.keys(byLevel)[index],
//     ),
//     annotations: [...makeAnnotations(byLevel)],
//   };
//
//   const traces = Array.from(level2).map((level, index) =>
//     makeTrace(level, byArea[level], index),
//   );
//
//   return { layout, data: traces };
// }
// export function makeAnnotations(byLabel) {
//   const len = Object.keys(byLabel).length;
//   return Object.keys(byLabel).map((label, index) => {
//     return {
//       xref: 'paper',
//       yref: 'paper',
//       x: -0.06,
//       // y: 0,
//       y: (1 / (len - 1)) * index,
//       xanchor: 'right',
//       // yanchor: 'bottom',
//       text: label,
//       showarrow: false,
//       // ay: (10 * index) / 2,
//     };
//   });
// }
//
