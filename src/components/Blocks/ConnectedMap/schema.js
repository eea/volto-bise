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
      title: 'Map service url',
      widget: 'url',
    },
  },

  required: ['url'],
};
