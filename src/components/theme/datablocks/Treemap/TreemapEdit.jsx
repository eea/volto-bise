import React, { Component } from 'react';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import schema from './schema';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import TreemapView from './TreemapView';

class Edit extends Component {
  getSchema = (schema) => {
    if (!this.props.provider_data) return schema;
    const provider_data = this.props.provider_data || {};

    const choices = Object.keys(provider_data).map((n) => [n, n]);

    const newSchema = JSON.parse(JSON.stringify(schema));
    newSchema.properties.size_column.choices = choices;
    newSchema.properties.label_column.choices = choices;
    newSchema.properties.parent_column.choices = choices;
    return newSchema;
  };

  render() {
    return (
      <div className="block">
        <div className="block-inner-wrapper" />

        <TreemapView data={this.props.data} />

        <SidebarPortal selected={this.props.selected}>
          <InlineForm
            schema={this.getSchema(schema)}
            title={schema.title}
            onChangeField={(id, value) => {
              this.props.onChangeBlock(this.props.block, {
                ...this.props.data,
                [id]: value,
              });
            }}
            formData={this.props.data}
          />
        </SidebarPortal>
      </div>
    );
  }
}

export default connectBlockToProviderData(Edit);
