import React, { Component } from 'react';
import FactsheetsListingView from './FactsheetsListingView';
import schema from './schema';
import { SidebarPortal } from '@plone/volto/components';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

class Edit extends Component {
  render() {
    const { selected, block, data, onChangeBlock } = this.props;
    return (
      <div className="block">
        <div className="block-inner-wrapper" />
        <FactsheetsListingView data={this.props.data} />
        <SidebarPortal selected={selected}>
          <InlineForm
            schema={schema}
            title={schema.title}
            onChangeField={(id, value) => {
              onChangeBlock(block, {
                ...data,
                [id]: value,
              });
            }}
            formData={data}
          />
        </SidebarPortal>
      </div>
    );
  }
}

export default Edit;
