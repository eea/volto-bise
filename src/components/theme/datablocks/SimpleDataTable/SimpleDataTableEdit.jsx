import React, { Component } from 'react';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import schema from './schema';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import SimpleDataTableView from './SimpleDataTableView';

class Edit extends Component {
  getSchema = (schema) => {
    // TODO: create picker for columns to include
    return schema;
    if (!this.props.provider_data) return schema;
    const provider_data = this.props.provider_data || {};

    const select_field = 'Ecosystem_level2';
    const choices = Array.from(
      new Set(provider_data?.[select_field] || []),
    ).map((n) => [n, n]);

    const newSchema = JSON.parse(JSON.stringify(schema));
    newSchema.properties.ecosystem.choices = choices;
    return newSchema;
  };

  render() {
    return (
      <div className="block">
        <div className="block-inner-wrapper" />

        <SimpleDataTableView data={this.props.data} />

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