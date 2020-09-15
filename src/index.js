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
} from './components';

export default (config) => {
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

  return [installKeyFacts, installMaesViewer].reduce(
    (acc, apply) => apply(acc),
    config,
  );
};
