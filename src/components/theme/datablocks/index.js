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

  return [
    installDataTable,
    installBubbleChart,
    installDottedTableChart,
    installCountryFlag,
  ].reduce((acc, apply) => apply(acc), config);
};
