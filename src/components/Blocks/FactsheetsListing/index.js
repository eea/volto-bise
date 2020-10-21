import codeSVG from '@plone/volto/icons/code.svg';
import FactsheetsListingView from './FactsheetsListingView';
import FactsheetsListingEdit from './FactsheetsListingEdit';

export default (config) => {
  config.blocks.blocksConfig.biseFactsheetListing = {
    id: 'biseFactsheetListing',
    title: 'Factsheets Listing',
    icon: codeSVG,
    group: 'custom_addons',
    view: FactsheetsListingView,
    edit: FactsheetsListingEdit,
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
