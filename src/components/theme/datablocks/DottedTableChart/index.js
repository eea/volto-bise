import tableSVG from '@plone/volto/icons/table.svg';
import DottedTableChartEdit from './DottedTableChartEdit';
import DottedTableChartView from './DottedTableChartView';

export default (config) => {
  config.blocks.blocksConfig.dottedTableChart = {
    id: 'dottedTableChart',
    title: 'Dotted Table Chart',
    icon: tableSVG,
    group: 'custom_addons',
    view: DottedTableChartView,
    edit: DottedTableChartEdit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };
  return config;
};
