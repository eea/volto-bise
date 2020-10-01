import paintSVG from '@plone/volto/icons/table.svg';
import BubbleChartEdit from './BubbleChartEdit';
import BubbleChartView from './BubbleChartView';

export default (config) => {
  config.blocks.blocksConfig.bubbleChart = {
    id: 'bubbleChart',
    title: 'Bubble Chart',
    icon: paintSVG,
    group: 'bise',
    view: BubbleChartView,
    edit: BubbleChartEdit,
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
