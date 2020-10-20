import tableSVG from '@plone/volto/icons/table.svg';
import TreemapView from './TreemapView';
import TreemapEdit from './TreemapEdit';

export default (config) => {
  config.blocks.blocksConfig.treemapChart = {
    id: 'treemapChart',
    title: 'Treemap',
    icon: tableSVG,
    group: 'bise',
    view: TreemapView,
    edit: TreemapEdit,
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
