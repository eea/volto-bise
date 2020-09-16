export const MapSchema = {
  title: 'Line',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['map_service_url', 'layer'],
    },
  ],

  properties: {
    map_service_url: {
      title: 'Map service URL',
      widget: 'url',
    },
    layer: {
      title: 'Map layer',
      choices: [],
    },
  },

  required: ['url'],
};

export default MapSchema;
