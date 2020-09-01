import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
// import { BlockEditForm } from 'volto-addons/BlockForm';

import schema from './schema';
import MaesViewerView from './MaesViewerView';

class Edit extends Component {
  render() {
    return (
      <div className="block selected">
        <div className="block-inner-wrapper" />

        <MaesViewerView data={this.props.data} />

        <SidebarPortal selected={this.props.selected}>
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
        </SidebarPortal>
      </div>
    );
  }
}

export default connect(null, {})(Edit);
