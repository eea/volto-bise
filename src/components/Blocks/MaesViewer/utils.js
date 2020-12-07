import _ from 'lodash';
import { defaultHoverTemplate } from './constants';

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

const mapLongLevelNameToShort = (x) => {
  const obj = {
    'A - Marine habitats': 'Marine habitats',
    'B - Coastal habitats': 'Coastal habitats',
    'C - Inland surface waters': 'Inland waters',
    'D - Mires, bogs and fens': 'Mires, bogs and fens',
    'E - Grasslands and land dominated by forbs, mosses or lichens':
      'Grassland',
    'F - Heathland, scrub and tundra': 'Heathland',
    'G - Woodland, forest and other wooded land': 'Woodlands',
    'H - Inland unvegetated or sparsely vegetated habitats':
      'Inland unvegetated or sparsely vegetated habitats',
    'I - Arable land and market gardens': 'Cropland',
    'J - constructed, industrial and other artificial habitats': 'Urban',
  };
  return obj[x] || x;
};

const filterGettingOriginalIndices = (a, fn) => {
  return a
    .map((c, i) => [c, i])
    .filter(([c, i]) => fn(c, i))
    .map(([, i]) => i);
};

class ProviderData {
  static ecosystemColumnName = 'Ecosystem_level2';
  static countryColumnName = 'Country_name';

  /**
   * Takes an object like:
   *
   * { Area: [...], Source: [...] }
   *
   * where each item in the lists represents a table column value.
   */
  constructor(data) {
    this.data = data;
  }

  getColumnData(name) {
    return this.data[name];
  }

  getUniqueColumnData(name) {
    return _.uniq(this.data[name]);
  }

  getEcosystems() {
    return this.getUniqueColumnData(ProviderData.ecosystemColumnName);
  }

  getCountries() {
    return this.getUniqueColumnData(ProviderData.countryColumnName).concat(
      'EU',
    );
  }

  getCountriesColumn() {
    return this.getColumnData(ProviderData.countryColumnName);
  }

  forEachCountryAndLevel(fn) {
    const c = this.getCountries();
    const e = this.getEcosystems();
    c.forEach((country) => {
      e.forEach((level) => {
        fn(country, level);
      });
    });
  }

  getEcosystemForRowIndex(i) {
    return this.data[ProviderData.ecosystemColumnName][i];
  }

  hasEcosystemAtRowIndex(i, ecosystem) {
    return this.getEcosystemForRowIndex(i) === ecosystem;
  }

  getColumnNames() {
    return _.keys(this.data);
  }

  getCellValue(columnName, rowIndex) {
    return this.getColumnData(columnName)[rowIndex];
  }

  createRowObject(rowIndex) {
    const obj = {};
    this.getColumnNames().forEach((cn) => {
      obj[cn] = this.getCellValue(cn, rowIndex);
    });
    return obj;
  }

  rowSatisfiesFilters(index, filters) {
    const filtersResults = filters.map((f) => f(this.data, index));
    return filtersResults.every((t) => t);
  }

  /**
   * Filters the data. Given a country name and an array of filter functions
   * which receive two parameters, provider_data and rowIndex, returns an array
   * of objects containing the data for each matching row in the DataProvider.
   */
  query(country, filters) {
    const countriesColumn = this.getCountriesColumn();
    const filteredIndices = filterGettingOriginalIndices(
      countriesColumn,
      (c, i) => {
        return c === country && this.rowSatisfiesFilters(i, filters);
      },
    );
    const rowObjects = filteredIndices.map((i) => this.createRowObject(i));
    return rowObjects;
  }
}

export function mapByLevel(provider_data) {
  const pd = new ProviderData(provider_data);

  const byLevel = _.fromPairs(pd.getEcosystems().map((l) => [l, {}]));

  pd.forEachCountryAndLevel((country, level) => {
    const filters = [
      (provider_data, index) => pd.hasEcosystemAtRowIndex(index, level),
    ];
    const country_data = pd.query(country, filters);
    byLevel[level][country] = country_data;
  });

  return byLevel;
}

export function mapToAllEU(provider_data, byLevel) {
  const level2 = new Set(provider_data['Ecosystem_level2']);
  const countries = new Set(provider_data['Country_name']);
  const EUByLevel = Object.fromEntries(Array.from(level2).map((l) => [l, {}]));

  let totalArea = 0;

  level2.forEach((level) => {
    EUByLevel[level] = 0;

    countries.forEach((country) => {
      byLevel[level][country].forEach((x) => {
        EUByLevel[level] += parseFloat(x['Area (m2)']);
      });
    });

    totalArea += EUByLevel[level];
  });

  const EUByLevelPercents = _.fromPairs(
    _.map(Array.from(level2), (l) => {
      return [l, (EUByLevel[l] / totalArea) * 100];
    }),
  );

  return { EUByLevel, EUByLevelPercents };
}

export function makeTrace(
  level,
  levelData,
  index,
  focusOn,
  { hoverTemplate = defaultHoverTemplate },
) {
  const data = [
    ...Object.entries(levelData).filter(([k, v]) => k !== focusOn),
    [focusOn, levelData[focusOn]],
  ];

  const x = [...data.map(([k, v]) => v)];
  const y = [];
  y.length = x.length;
  y.fill(0);
  y[y.length - 1] = 0.25; // we "lift" this value to "highlight" it

  // first element: country name
  // second element: square kilometers (km2)
  // third element: square megameters (Mm2)
  const hovertext = _.map(data, (x) => [x[0], x[1] / 100, x[1] / 10000]);

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
  const ht = hoverTemplate
    .replace(/\{(.*?)country(.*?)\}/, '{$1customdata[0]$2}')
    .replace(/\{(.*?)km2(.*?)\}/, '{$1customdata[1]$2}')
    .replace(/\{(.*?)mm2(.*?)\}/, '{$1customdata[2]$2}');
  const res = {
    x,
    y,
    // hovertext,
    // See
    // https://plotly.com/javascript/reference/scatter/#scatter-hovertemplate
    hovertemplate: ht,
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

/**
 * @param {number} index
 * @param {number} finalPercent
 */
export function chartTileLayout(index, finalPercent) {
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

      // showticklabels: true,
      // automargin: true,
      // tickvals: [10000000000],
      // tickmode: 'array',
      // ticktext: ['0%'],
      // ticks: 'outside',
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
    annotations: [
      {
        xref: 'x',
        yref: 'paper',
        x: 0,
        y: 0.3,
        xanchor: 'right',
        yanchor: 'bottom',
        text: '0%',
        showarrow: false,
      },
      {
        xref: 'paper',
        yref: 'paper',
        x: 1,
        y: 0.3,
        xanchor: 'right',
        yanchor: 'bottom',
        text: `${Math.round(finalPercent).toFixed(0)}%`,
        showarrow: false,
      },
    ],
  };
}

export function makeChartTiles(
  provider_data,
  focusOn,
  focusEcosystem,
  { hoverTemplate },
) {
  if (!provider_data) return;
  const byLevel = mapByLevel(provider_data);
  const { EUByLevel, EUByLevelPercents } = mapToAllEU(provider_data, byLevel);

  const ecosystems = _.uniq(provider_data['Ecosystem_level2']);
  const countries = _.uniq(provider_data['Country_name']);

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
    byArea[level]['EU'] = EUByLevel[level];
  });

  const tiles = ecosystems
    .map((level, index) => {
      if (focusEcosystem && level !== focusEcosystem) return null;
      return {
        layout: chartTileLayout(index, EUByLevelPercents[level]),
        data: [
          makeTrace(level, byArea[level], index, focusOn, { hoverTemplate }),
        ],
        title: mapLongLevelNameToShort(level),
      };
    })
    .filter((c) => !!c);

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
