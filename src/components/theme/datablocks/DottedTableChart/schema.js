export const DottedTableChartSchema = () => ({
  title: 'Dotted Table Chart',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['description'], // title, 'underline'
    },
    {
      id: 'source',
      title: 'Data source',
      fields: [
        'provider_url',
        'column_data',
        'row_data',
        'size_data',
        'dot_value',
      ], // , 'max_count'
    },
    // {
    //   id: 'styling',
    //   title: 'Styling',
    //   fields: ['show_header', 'striped', 'bordered', 'compact_table'],
    // },
  ],

  properties: {
    description: {
      title: 'Description',
      widget: 'slate_richtext',
    },
    provider_url: {
      widget: 'pick_provider',
      title: 'Data provider',
    },
    dot_value: {
      title: 'Dot value',
      widget: 'number',
      default: 10,
    },
    column_data: {
      title: 'Columns',
      choices: [],
    },
    row_data: {
      title: 'Rows',
      choices: [],
    },
    size_data: {
      title: 'Size data',
      choices: [],
    },
    // title: {
    //   title: 'Title',
    // },
    // max_count: {
    //   title: 'Max results',
    //   type: 'number',
    //   default: 5,
    // },
    // show_header: {
    //   title: 'Show header?',
    //   type: 'boolean',
    // },
    // striped: {
    //   title: 'Color alternate rows',
    //   type: 'boolean',
    // },
    // bordered: {
    //   title: 'Remove table border',
    //   type: 'boolean',
    // },
    // compact_table: {
    //   title: 'Compact table',
    //   type: 'boolean',
    // },
    // underline: {
    //   title: 'Title underline',
    //   type: 'boolean',
    // },
  },

  required: ['provider_url'],
});

export default DottedTableChartSchema;
