const Schema = {
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['block_title', 'cols'],
    },
  ],
  properties: {
    block_title: {
      title: 'Title',
    },
    cols: {
      title: 'Number of columns',
      widget: 'number',
    },
  },
  required: [],
};
export default Schema;
