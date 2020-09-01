const MaesViewerSchema = {
  title: 'Edit MAES Viewer',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'description'],
    },
    {
      id: 'source',
      title: 'Data source',
      fields: ['provider_url'],
    },
  ],

  properties: {
    title: {
      title: 'Title',
      widget: 'string',
    },
    description: {
      title: 'Description',
      widget: 'slate_richtext',
    },
    provider_url: {
      widget: 'pick_provider',
      title: 'Data provider',
    },
  },

  required: ['provider_url'],
};

export default MaesViewerSchema;
