import React, { Component } from 'react';

import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import ConnectedMapView from './ConnectedMapView';
import SchemaProvider from './SchemaProvider';

class Edit extends Component {
  render() {
    return (
      <>
        <ConnectedMapView data={this.props.data} />

        <SidebarPortal selected={this.props.selected}>
          <SchemaProvider {...this.props}>
            {(schema) => (
              <InlineForm
                schema={schema}
                title={schema.title}
                onChangeField={(id, value) => {
                  this.props.onChangeBlock(this.props.block, {
                    ...this.props.data,
                    [id]: value,
                  });
                }}
                formData={this.props.data}
              />
            )}
          </SchemaProvider>
        </SidebarPortal>
      </>
    );
  }
}

export default Edit;
