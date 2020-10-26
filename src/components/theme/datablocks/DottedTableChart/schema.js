import { settings } from '~/config';

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
        'max_dot_count',
      ],
    },
    {
      id: 'styling',
      title: 'Styling',
      fields: ['row_colors'],
    },
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
    max_dot_count: {
      title: 'Maximum dot count',
      widget: 'number',
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
    row_colors: {
      title: 'Colors',
      widget: 'option_mapping',
      field_props: {
        widget: 'simple_color',
        available_colors: settings.available_colors,
      },
      options: [],
    },
  },

  required: ['provider_url'],
});

export default DottedTableChartSchema;
