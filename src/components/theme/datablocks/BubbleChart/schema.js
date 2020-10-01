const BubbleChartSchema = {
  title: 'Bubble Chart',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['description'], // title
    },
    {
      id: 'source',
      title: 'Data source',
      fields: ['provider_url', 'size_column', 'label_column'],
    },
    {
      id: 'styling',
      title: 'Styling',
      fields: ['height'],
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
    size_column: {
      title: 'Size column',
      choices: [],
    },
    label_column: {
      title: 'Label column',
      choices: [],
    },
    height: {
      title: 'Height',
      description: 'CSS height, for ex: 400px or 60vh.',
    },
  },

  required: ['provider_url'],
};

export default BubbleChartSchema;
