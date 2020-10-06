import paintSVG from '@plone/volto/icons/table.svg';
import CountryFlagEdit from './CountryFlagEdit';
import CountryFlagView from './CountryFlagView';

export default (config) => {
  config.blocks.blocksConfig.countryFlag = {
    id: 'countryFlag',
    title: 'Country Flag',
    icon: paintSVG,
    group: 'bise',
    view: CountryFlagView,
    edit: CountryFlagEdit,
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
