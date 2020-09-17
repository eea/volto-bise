export const MapSchema = {
  title: 'ESRI Layer Map',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['map_service_url', 'base_layer', 'layer'],
    },
    {
      id: 'filters',
      title: 'Map Filters',
      fields: [],
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
      choices: [],
    },
  },

  required: ['url'],
};

export default MapSchema;
