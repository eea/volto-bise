import codeSVG from '@plone/volto/icons/code.svg';
import KeyFactsView from './KeyFactsView';
import KeyFactsEdit from './KeyFactsEdit';

const config = (config) => {
  config.blocks.blocksConfig.keyfacts = {
    id: 'keyfacts',
    title: 'Key Facts',
    icon: codeSVG,
    group: 'custom_addons',
    view: KeyFactsView,
    edit: KeyFactsEdit,
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
