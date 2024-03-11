import codeSVG from '@plone/volto/icons/code.svg';
import MaesViewerView from './MaesViewerView';
import MaesViewerEdit from './MaesViewerEdit';

const config = (config) => {
  config.blocks.blocksConfig.maesviewer = {
    id: 'maesviewer',
    title: 'MAES Viewer',
    icon: codeSVG,
    group: 'custom_addons',
    view: MaesViewerView,
    edit: MaesViewerEdit,
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

export default config;
