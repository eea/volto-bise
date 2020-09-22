export const MapFiltersSchema = () => ({
  title: 'Map filters',
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [],
    },
  ],
  properties: {},
  required: [],
});

export const MapSchema = () => ({
  title: 'ESRI Layer Map',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['map_service_url', 'base_layer', 'layer', 'align'],
    },
  ],

  properties: {
    map_service_url: {
      title: 'Map service URL',
      widget: 'url',
    },
    base_layer: {
      title: 'Base topographic layer',
      choices: [
        'dark-gray',
        'dark-gray-vector',
        'gray',
        'gray-vector',
        'hybrid',
        'national-geographic',
        'oceans',
        'osm',
        'satellite',
        'streets',
        'streets-navigation-vector',
        'streets-night-vector',
        'streets-relief-vector',
        'streets-vector',
        'terrain',
        'topo',
        'topo-vector',
      ].map((n) => [n, n]),
    },
    layer: {
      title: 'Map layer',
      widget: 'bise_select',
      choices: [],
    },
    align: {
      widget: 'align',
      title: 'Alignment',
    },
  },

  required: ['url'],
});
