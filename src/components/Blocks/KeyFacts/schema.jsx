// import React from 'react';

const LineSchema = {
  title: 'Line',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['upper', 'lower'],
    },
  ],

  properties: {
    upper: {
      title: 'Upper text',
      widget: 'slate_richtext',
    },
    lower: {
      title: 'Lower',
      widget: 'slate_richtext',
    },
  },

  required: ['upper', 'lower'],
};

const KeyFactsSchema = {
  title: 'KeyFacts',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: [
        'message',
        'message_link_text',
        'message_link',
        'lines',
        'align',
      ],
    },
  ],

  properties: {
    lines: {
      widget: 'object_list',
      title: 'Lines',
      // this is an invention, should confront with dexterity serializer
      schema: LineSchema,
    },
    align: {
      title: 'Alignment',
      widget: 'align',
      type: 'string',
    },
    message: {
      type: 'string',
      title: 'Key message',
    },
    message_link_text: {
      type: 'string',
      title: 'Key message link text',
    },
    message_link: {
      widget: 'object_by_path',
      title: 'Key message link',
    },
  },

  required: ['lines'],
};

export default KeyFactsSchema;
