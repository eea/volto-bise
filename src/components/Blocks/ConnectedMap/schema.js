export const MapSchema = {
  title: 'Line',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['map_service_url'],
    },
  ],

  properties: {
    map_service_url: {
      title: 'Map service URL',
      widget: 'url',
    },
  },

  required: ['url'],
};

export default MapSchema;
