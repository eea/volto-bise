const Schema = {
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['block_title', 'es_host'],
    },
  ],
  properties: {
    block_title: {
      title: 'Title',
    },
    es_host: {
      title: 'ES Host',
      widget: 'url',
    },
  },
  required: [],
};
export default Schema;
