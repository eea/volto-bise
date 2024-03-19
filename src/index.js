import React from 'react';

import installLink from '@plone/volto-slate/editor/plugins/AdvancedLink';

import { DefaultView } from '@plone/volto/components';

import InpageNavigation from './customizations/volto/components/theme/InpageNavigation/InpageNavigation';

import {
  FactsheetDatabaseListing,
  installKeyFacts,
  installMaesViewer,
  installConnectedMap,
  installDataCatalogue,
  installFactsheetListingView,
} from './components';

import NumberWidget from './components/Widgets/Number';
import SimpleColorPicker from './components/Widgets/SimpleColorPicker';
import MultiSelectWidget from './components/Widgets/MultiSelectWidget';
import TextAlign from './components/Widgets/TextAlign';
import ObjectListWidget from './components/Widgets/ObjectList';
import AttachedImageWidget from './components/Widgets/AttachedImage';

import Header from './customizations/volto/components/theme/Header/Header';
import Footer from './customizations/volto/components/theme/Footer/Footer';

import './slate-styles.css';
import './box-styles.less';

import TitleBlockEdit from './customizations/volto/components/manage/Blocks/Title/Edit';
import TitleBlockView from './customizations/volto/components/manage/Blocks/Title/View';

const installStyles = (config) => {
  config.settings.plotlyChartsColorScale = [
    '#ee252c',
    '#d5e843',
    '#33b540',
    '#352d4e',
    '#f9ae79',
    '#87d6cb',
    ...(config.settings.plotlyChartsColorScale || []),
  ];

  config.blocks.blocksConfig.columnsBlock =
    config.blocks.blocksConfig.columnsBlock || {};
  config.blocks.blocksConfig.columnsBlock.available_colors = [
    '#3c8000',
    '005248',
    '#f4cf01',
    '#ffffff',
    '#f7f7f7',
    '#EFEFEF',
    '#FAD0C3',
    '#FEF3BD',
    '#C1E1C5',
    '#BEDADC',
    '#C4DEF6',
    '#000000',
  ];

  config.settings.available_colors = [
    '#1f6237',
    '#3c8000',
    '005248',
    '#3B7F02',
    '#7AC943',
    '#88c24f',
    '#77ba72',
    '#f2a70e',
    '#f4cf01',
    '#ed1834',
    '#264069',
    '#013C60',
    '#44a2d6',
    '#4e8fa6',
    '#8d8d8d',
    '#636363',
    '#ffffff',
    '#f7f7f7',
    '#EFEFEF',
    '#FAD0C3',
    '#FEF3BD',
    '#C1E1C5',
    '#BEDADC',
    '#BED3F3',
    '#000000',
  ];

  config.settings.slate = config.settings.slate || {};
  config.settings.slate.styleMenu = config.settings.slate.styleMenu || {};
  config.settings.slate.styleMenu.inlineStyles = [
    ...(config.settings.slate.styleMenu?.inlineStyles || []),
    { cssClass: 'white-text', label: 'White text' },
    { cssClass: 'n2k-green-text', label: 'N2k green text' },
    { cssClass: 'primary-big-text', label: 'Big text' },
    { cssClass: 'medium-text', label: 'Medium text' },
    { cssClass: 'dark-green-text', label: 'Dark green text' },
    { cssClass: 'light-green-text', label: 'Light green text' },
    { cssClass: 'vivid-green-text', label: 'Vivid green text' },
    { cssClass: 'blue-text', label: 'Blue text' },
    { cssClass: 'red-text', label: 'Red text' },
    { cssClass: 'yellow-text', label: 'Yellow text' },
    { cssClass: 'grey-text', label: 'Grey text' },
  ];
  // config.settings.slate.styleMenu.blockStyles = [
  //   ...config.settings.slate.styleMenu.blockStyles,
  //   { cssClass: 'green-block-text', label: 'Green Text' },
  //   { cssClass: 'underline-block-text', label: 'Underline Text' },
  // ];

  return config;
};

const config = (config) => {
  config.settings.navDepth = 3;

  config.settings.allowed_cors_destinations = [
    ...(config.settings.allowed_cors_destinations || []),
    'trial.discomap.eea.europa.eu',
    'marine.discomap.eea.europa.eu',
  ];

  // config.settings.backendResourceMatch = [
  //   ...(config.settings.backendResourceMatch || []),
  //   (request) => request.path.match(/(.*)\/@@rdf/),
  // ];

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

  config.settings.appExtras = [
    ...(config.settings.appExtras || []),
    {
      match: '/**',
      component: InpageNavigation,
    },
  ];

  config.widgets.widget.number = NumberWidget;

  if (!config.widgets.widget.simple_color) {
    config.widgets.widget.simple_color = SimpleColorPicker;
  }

  if (!config.widgets.widget.multi_select) {
    config.widgets.widget.multi_select = MultiSelectWidget;
  }

  if (!config.widgets.widget.simple_text_align) {
    config.widgets.widget.simple_text_align = TextAlign;
  }

  if (!config.widgets.widget.objectlist) {
    config.widgets.widget.objectlist = ObjectListWidget;
  }

  if (!config.widgets.widget.attachedimage) {
    config.widgets.widget.attachedimage = AttachedImageWidget;
  }

  config.settings.pluggableStyles = [
    ...(config.settings.pluggableStyles || []),
    {
      id: 'borderBlock',
      title: 'Border',
      cssClass: 'border-block',
    },
    {
      id: 'horizontalLine',
      title: 'Horizontal line',
      cssClass: 'horizontal-line',
    },
    {
      id: 'dividedBlock',
      title: 'Divided',
      cssClass: 'divided-block',
    },
    {
      id: 'shadedBlock',
      title: 'Shaded & Divided',
      cssClass: 'shaded-block',
    },
    {
      id: 'padded',
      title: 'Padded',
      cssClass: 'padded',
    },
    {
      id: 'marginless',
      title: 'Marginless',
      cssClass: 'marginless',
    },
    {
      id: 'roundedBlock',
      title: 'Rounded image',
      cssClass: 'rounded-block',
    },
    {
      id: 'mobileReversed',
      title: 'Mobile reversed',
      cssClass: 'mobile-reversed',
    },
    {
      id: 'relevantLink',
      title: 'Relevant link',
      cssClass: 'relevant-link',
    },
    {
      id: 'n2kList',
      title: 'N2k list',
      cssClass: 'n2k-list',
    },
    {
      id: 'n2kGreenBorder',
      title: 'N2k green border',
      cssClass: 'n2k-green-border',
    },
    {
      id: 'n2kCircle',
      title: 'N2k circle',
      cssClass: 'n2k-circle',
    },
  ];

  config.settings.themes = {
    ...(config.settings.themes || {}),
    default: {
      Header: Header,
      Footer: Footer,
      Breadcrumbs: () => <></>,
    },
  };

  delete config.blocks.blocksConfig.data_connected_embed;
  delete config.blocks.blocksConfig.discodata_connector_block;

  // TODO: Add volto-block-style
  config.blocks.blocksConfig.title.edit = TitleBlockEdit;
  config.blocks.blocksConfig.title.view = TitleBlockView;

  // Install advanced link
  config = installLink(config);
  const toolbarButtons = config.settings.slate.toolbarButtons || [];
  const linkIndex = toolbarButtons.indexOf('link');
  const advancedLinkIndex = toolbarButtons.indexOf('a');
  toolbarButtons.splice(linkIndex, 1, 'a');
  toolbarButtons.splice(advancedLinkIndex, 1);

  return [
    installDataCatalogue,
    installKeyFacts,
    installMaesViewer,
    installConnectedMap,
    installStyles,
    installFactsheetListingView,
  ].reduce((acc, apply) => apply(acc), config);
};

export default config;
