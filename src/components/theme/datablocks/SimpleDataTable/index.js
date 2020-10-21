import tableSVG from '@plone/volto/icons/table.svg';
import SimpleDataTableEdit from './SimpleDataTableEdit';
import SimpleDataTableView from './SimpleDataTableView';

export default (config) => {
  config.blocks.blocksConfig.simpleDataConnectedTable = {
    id: 'simpleDataConnectedTable',
    title: 'Data Table',
    icon: tableSVG,
    group: 'custom_addons',
    view: SimpleDataTableView,
    edit: SimpleDataTableEdit,
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
