import TabsTocNavigationView, {
  tabsTocSchemaExtender,
} from './TabsTocNavigationView';
import FlatTabsView from './FlatTabsView';

export default (config) => {
  config.blocks.blocksConfig.tabsBlock.extensions = [
    ...config.blocks.blocksConfig.tabsBlock.extensions,
    {
      id: 'tocnav',
      title: 'TOC Navigation',
      view: TabsTocNavigationView,
      schemaExtender: tabsTocSchemaExtender,
    },
    {
      id: 'flatpage',
      title: 'Flat page',
      view: FlatTabsView,
      schemaExtender: null,
    },
  ];

  return config;
};
