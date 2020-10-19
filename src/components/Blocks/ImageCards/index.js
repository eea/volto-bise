import codeSVG from '@plone/volto/icons/code.svg';

import ImageCardsView from './ImageCardsView';
import ImageCardsEdit from './ImageCardsEdit';

export default (config) => {
  config.blocks.blocksConfig.imagecards = {
    id: 'imagecards',
    title: 'Image Cards',
    icon: codeSVG,
    group: 'bise',
    view: ImageCardsView,
    edit: ImageCardsEdit,
    restricted: false,
    mostUsed: false,
    sidebarTab: 1,
    security: {
      addPermission: [],
      view: [],
    },
  };
  return config;
};
