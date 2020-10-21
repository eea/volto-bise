import codeSVG from '@plone/volto/icons/code.svg';
import DataCatalogueEdit from './DataCatalogueEdit';
import DataCatalogueView from './DataCatalogueView';

export default (config) => {
  config.blocks.blocksConfig.biseCatalogue = {
    id: 'biseCatalogue',
    title: 'Search Catalogue',
    icon: codeSVG,
    group: 'custom_addons',
    view: DataCatalogueView,
    edit: DataCatalogueEdit,
    restricted: false,
    mostUsed: false,
    blockHasOwnFocusManagement: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };

  return config;
};
