import { DefaultView } from '@plone/volto/components';

import chartIcon from '@plone/volto/icons/world.svg';

import {
  ChildrenTabsView,
  FactsheetDatabaseListing,
  TabsTocNavigationView,
  ConnectedChartBlockView,
  ConnectedChartBlockEdit,
  DataQueryFilterView,
  DataQueryFilterEdit,
  installKeyFacts,
  installMaesViewer,
  installConnectedMap,
  installDataCatalogue,
  installDataTable,
} from './components';

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
      children_tabs_view: ChildrenTabsView,
    },
  };

  config.blocks.groupBlocksOrder.push({ id: 'bise', title: 'BISE specific' });

  config.blocks.blocksConfig.tabsBlock.extensions.push({
    id: 'tocnav',
    title: 'TOC Navigation',
    view: TabsTocNavigationView,
    schemaExtender: null,
  });

  config.blocks.blocksConfig.connected_plotly_chart = {
    id: 'connected_plotly_chart',
    title: 'Connected Plotly Chart',
    view: ConnectedChartBlockView,
    edit: ConnectedChartBlockEdit,
    icon: chartIcon,
    group: 'bise',
    sidebarTab: 1,
  };

  config.blocks.blocksConfig.dataqueryfilter = {
    id: 'dataqueryfilter',
    title: 'DataQuery Filter',
    view: DataQueryFilterView,
    edit: DataQueryFilterEdit,
    icon: chartIcon,
    group: 'bise',
    sidebarTab: 1,
  };

  // TODO: these are just examples that work well when simply uncommented (see
  // the StyleMenu plugin in eea/volto-slate):
  // config.settings.slate.styleMenu.inlineStyles = [
  //   ...config.settings.slate.styleMenu.inlineStyles,
  //   { cssClass: 'cool-inline-text', label: 'Cool Inline Text' },
  //   { cssClass: 'red-inline-text', label: 'Red Inline Text' },
  // ];
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
    installDataTable,
  ].reduce((acc, apply) => apply(acc), config);
};
