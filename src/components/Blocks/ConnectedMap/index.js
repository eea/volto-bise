import codeSVG from '@plone/volto/icons/code.svg';
import ConnectedMapEdit from './ConnectedMapEdit';
import ConnectedMapView from './ConnectedMapView';
import SelectWidget from './SelectWidget';

export default (config) => {
  config.blocks.blocksConfig.connectedmap = {
    id: 'connectedmap',
    title: 'Connected Map',
    icon: codeSVG,
    group: 'custom_addons',
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
  config.widgets.widget.bise_select = SelectWidget;
  return config;
};
