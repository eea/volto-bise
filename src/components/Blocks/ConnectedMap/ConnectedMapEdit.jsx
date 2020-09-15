import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import schema from './schema';
import ConnectedMapView from './ConnectedMapView';
import { addPrivacyProtectionToSchema } from 'volto-embed';

class Edit extends Component {
  render() {
    return (
      <div className="block selected">
        <div className="block-inner-wrapper" />

        <ConnectedMapView data={this.props.data} />

        <SidebarPortal selected={this.props.selected}>
          <InlineForm
            schema={addPrivacyProtectionToSchema(schema)}
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

export default connect(null, {})(Edit);
