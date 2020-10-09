const TitleSchema = {
  title: 'Title settings',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['hide_title']
    },
  ],

  properties: {
    hide_title: {
      title: 'Hide title',
      description: 'Hide page title on View',
      type: 'boolean',
    },
  },
  required: [],
};

export default TitleSchema;
