const SimpleDataTableSchema = () => ({
  title: 'DataConnected Table',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['description'], // title
    },
    {
      id: 'source',
      title: 'Data source',
      fields: ['provider_url', 'max_count', 'columns'],
    },
    {
      id: 'styling',
      title: 'Styling',
      fields: [
        'show_header',
        'underline',
        'striped',
        'bordered',
        'compact_table',
      ],
    },
  ],

  properties: {
    columns: {
      title: 'Columns',
      description: 'Leave empty to show all columns',
      isMulti: true,
      choices: [],
      widget: 'multi_select',
    },
    description: {
      title: 'Description',
      widget: 'slate_richtext',
      description: 'Allows rich text formatting',
    },
    provider_url: {
      widget: 'pick_provider',
      title: 'Data provider',
    },
    max_count: {
      title: 'Max results',
      widget: 'number',
      defaultValue: 5,
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
});

export default SimpleDataTableSchema;
