const Schema = {
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['block_title', 'columns'],
    },
  ],
  properties: {
    block_title: {
      title: 'Title',
    },
    columns: {
      title: 'Number of columns',
      widget: 'number',
    },
  },
  required: [],
};
export default Schema;
