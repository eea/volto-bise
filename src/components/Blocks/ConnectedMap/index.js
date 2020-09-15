import codeSVG from '@plone/volto/icons/code.svg';
import ConnectedMapEdit from './ConnectedMapEdit';
import ConnectedMapView from './ConnectedMapView';

export default (config) => {
  config.blocks.blocksConfig.connectedmap = {
    id: 'connectedmap',
    title: 'Connected Map',
    icon: codeSVG,
    group: 'bise',
    view: ConnectedMapView,
    edit: ConnectedMapEdit,
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
