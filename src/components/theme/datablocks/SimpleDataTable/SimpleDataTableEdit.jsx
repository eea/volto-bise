import React, { Component } from 'react';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import SimpleDataTableSchema from './schema';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import SimpleDataTableView from './SimpleDataTableView';

class Edit extends Component {
  getSchema = () => {
    const schema = SimpleDataTableSchema();
    // TODO: create picker for columns to include
    const { provider_data } = this.props;
    if (!provider_data) return schema;

    const choices = Array.from(Object.keys(provider_data).sort()).map((n) => [
      n,
      n,
    ]);

    schema.properties.columns.schema.properties.column.choices = choices;
    return schema;
  };

  render() {
    const schema = this.getSchema();
    return (
      <div className="block">
        <div className="block-inner-wrapper" />

        <SimpleDataTableView data={this.props.data} />

        <SidebarPortal selected={this.props.selected}>
          <InlineForm
            schema={this.getSchema()}
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
