import ConnectedChartBlockView from './ConnectedChart/ConnectedChartBlockView';
import ConnectedChartBlockEdit from './ConnectedChart/ConnectedChartBlockEdit';
import DataQueryFilterView from './DataQueryFilter/DataQueryFilterView';
import DataQueryFilterEdit from './DataQueryFilter/DataQueryFilterEdit';
import installDataTable from './SimpleDataTable';
import installBubbleChart from './BubbleChart';
import installDottedTableChart from './DottedTableChart';
import installCountryFlag from './CountryFlag';

import chartIcon from '@plone/volto/icons/world.svg';

export default (config) => {
  config.blocks.blocksConfig.connected_plotly_chart = {
    id: 'connected_plotly_chart',
    title: 'Connected Plotly Chart',
    view: ConnectedChartBlockView,
    edit: ConnectedChartBlockEdit,
    icon: chartIcon,
    group: 'bise',
    sidebarTab: 1,
  };

  config.blocks.blocksConfig.dataqueryfilter = {
    id: 'dataqueryfilter',
    title: 'DataQuery Filter',
    view: DataQueryFilterView,
    edit: DataQueryFilterEdit,
    icon: chartIcon,
    group: 'bise',
    sidebarTab: 1,
  };

  // The colorscale above translated into hex colors:
  config.settings.biseColorscale = [
    // from mockup as of 19th of October, 2020:
    '#ee252c',
    '#d5e843',
    '#33b540',
    '#352d4e',
    '#f9ae79',
    '#87d6cb',

    // other colors:
    '#a6cee3',
    '#1f78b4',
    '#b2df8a',
    '#33a02c',
    '#fb9a99',
    '#e31a1c',
    '#a01a33',
    '#e3b2df',
    '#1fe31c',
    '#e378b4',
  ];

  return [
    installDataTable,
    installBubbleChart,
    installDottedTableChart,
    installCountryFlag,
  ].reduce((acc, apply) => apply(acc), config);
};
