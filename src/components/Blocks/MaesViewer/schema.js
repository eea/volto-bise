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
      fields: ['provider_url', 'ecosystem'],
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
    ecosystem: {
      title: 'Ecosystem',
      choices: [],
    },
  },

  required: ['provider_url'],
};

export default MaesViewerSchema;
