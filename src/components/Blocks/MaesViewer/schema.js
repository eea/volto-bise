import React from 'react';
import { defaultHoverTemplate } from './constants';

const MaesViewerSchema = () => ({
  title: 'Edit MAES Viewer',

  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['title', 'description'],
    },
    {
      id: 'source',
      title: 'Data source',
      fields: ['provider_url', 'ecosystem', 'hoverTemplate'],
    },
  ],

  properties: {
    title: {
      title: 'Title',
      widget: 'string',
    },
    description: {
      title: 'Description',
      widget: 'slate_richtext',
    },
    provider_url: {
      widget: 'pick_provider',
      title: 'Data provider',
    },
    ecosystem: {
      title: 'Ecosystem',
      choices: [],
    },
    hoverTemplate: {
      title: 'Hover template',
      description: (
        <div>
          {'You can use %{country}, %{km2} and %{mm2}.'}
          <br />
          See{' '}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/d3/d3-3.x-api-reference/blob/master/Formatting.md#d3_format"
          >
            D3 format documentation
          </a>
        </div>
      ),
      defaultValue: defaultHoverTemplate,
    },
  },

  required: ['provider_url'],
});

export default MaesViewerSchema;
