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

  config.blocks.blocksConfig.columnsBlock.available_colors = [
    '#3c8000', '#f4cf01', '#ffffff', '#f7f7f7', '#EFEFEF', '#FAD0C3', '#FEF3BD',
    '#C1E1C5', '#BEDADC', '#C4DEF6', '#000000',
  ];

  config.settings.available_colors = [
    '#1f6237', '#3c8000', '#88c24f', '#77ba72', '#f2a70e', '#f4cf01', '#ed1834',
    '#44a2d6', '#4e8fa6', '#8d8d8d', '#ffffff', '#f7f7f7', '#EFEFEF', '#FAD0C3',
    '#FEF3BD', '#C1E1C5', '#BEDADC', '#BED3F3', '#000000',
  ];

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
