import { DefaultView } from '@plone/volto/components';

import codeSVG from '@plone/volto/icons/code.svg';
import chartIcon from '@plone/volto/icons/world.svg';

import {
  ChildrenTabsView,
  FactsheetDatabaseListing,
  TocNavigationView,
  KeyFactsView,
  KeyFactsEdit,
  MaesViewerView,
  MaesViewerEdit,
  ConnectedChartBlockView,
  ConnectedChartBlockEdit,
  DataQueryFilterView,
  DataQueryFilterEdit,
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
      toc_nav_view: TocNavigationView,
      children_tabs_view: ChildrenTabsView,
    },
  };

  config.blocks.groupBlocksOrder.push({ id: 'bise', title: 'BISE specific' });

  config.blocks.blocksConfig.keyfacts = {
    id: 'keyfacts',
    title: 'Key Facts',
    icon: codeSVG,
    group: 'bise',
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
  config.blocks.blocksConfig.maesviewer = {
    id: 'maesviewer',
    title: 'MAES Viewer',
    icon: codeSVG,
    group: 'bise',
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

  return config;
};
