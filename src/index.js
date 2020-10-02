import { DefaultView } from '@plone/volto/components';

import {
  // ChildrenTabsView,
  FactsheetDatabaseListing,
  installKeyFacts,
  installMaesViewer,
  installConnectedMap,
  installDataCatalogue,
  // installDataTable,
  installTabsBlockExtensions,
  // installBubbleChart,
  installDataComponents,
} from './components';

import './slate-styles.css';

export default (config) => {
  config.settings.allowed_cors_destinations = [
    ...(config.settings.allowed_cors_destinations || []),
    'trial.discomap.eea.europa.eu',
    'marine.discomap.eea.europa.eu',
  ];
  config.views = {
    ...config.views,
    contentTypesViews: {
      ...config.views.contentTypesViews,
      'Plone Site': DefaultView,
    },
    layoutViews: {
      ...config.views.layoutViews,
      factsheet_database_listing_view: FactsheetDatabaseListing,
      // children_tabs_view: ChildrenTabsView,
    },
  };

  config.blocks.groupBlocksOrder.push({ id: 'bise', title: 'BISE specific' });

  config.settings.slate.styleMenu.inlineStyles = [
    ...config.settings.slate.styleMenu.inlineStyles,
    { cssClass: 'primary-big-text', label: 'Big text' },
    { cssClass: 'green-text', label: 'Green text' },
    { cssClass: 'blue-text', label: 'Blue text' },
  ];
  // config.settings.slate.styleMenu.blockStyles = [
  //   ...config.settings.slate.styleMenu.blockStyles,
  //   { cssClass: 'green-block-text', label: 'Green Text' },
  //   { cssClass: 'underline-block-text', label: 'Underline Text' },
  // ];

  return [
    installKeyFacts,
    installMaesViewer,
    installConnectedMap,
    installDataCatalogue,
    // installDataTable,
    // installBubbleChart,
    installTabsBlockExtensions,
    installDataComponents,
  ].reduce((acc, apply) => apply(acc), config);
};
