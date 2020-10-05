import { DefaultView } from '@plone/volto/components';

import {
  FactsheetDatabaseListing,
  installKeyFacts,
  installMaesViewer,
  installConnectedMap,
  installDataCatalogue,
  installTabsBlockExtensions,
  installDataComponents,
} from './components';
import NumberWidget from './components/Widgets/Number';
import SimpleColorPicker from './components/Widgets/SimpleColorPicker';

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
  config.blocks.blocksConfig.columnsBlock.available_colors = [];

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
  //
  config.widgets.widget.number = NumberWidget;
  if (!config.widgets.widget.simple_color) {
    config.widgets.widget.simple_color = SimpleColorPicker;
  }

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
