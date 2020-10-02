const SimpleDataTableSchema = {
  title: 'DataConnected Table',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['description', 'underline'], // title
    },
    {
      id: 'source',
      title: 'Data source',
      fields: ['provider_url', 'max_count'],
    },
    {
      id: 'styling',
      title: 'Styling',
      fields: ['show_header', 'striped', 'bordered', 'compact_table'],
    },
  ],

  properties: {
    // title: {
    //   title: 'Title',
    // },
    description: {
      title: 'Description',
      widget: 'slate_richtext',
    },
    provider_url: {
      widget: 'pick_provider',
      title: 'Data provider',
    },
    max_count: {
      title: 'Max results',
      type: 'number',
      default: 5,
    },
    show_header: {
      title: 'Show header?',
      type: 'boolean',
    },
    striped: {
      title: 'Color alternate rows',
      type: 'boolean',
    },
    bordered: {
      title: 'Remove table border',
      type: 'boolean',
    },
    compact_table: {
      title: 'Compact table',
      type: 'boolean',
    },
    underline: {
      title: 'Title underline',
      type: 'boolean',
    },
  },

  required: ['provider_url'],
};

export default SimpleDataTableSchema;
