import React, { Component } from 'react';
import { compose } from 'redux';
import cx from 'classnames';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import MaesViewerSchema from './schema';
import { connectToProviderData } from '@eeacms/volto-datablocks/hocs';
import MaesViewerView from './MaesViewerView';
import { defaultHoverTemplate } from './constants';

class Edit extends Component {
  constructor(props) {
    super(props);
    this.schema = MaesViewerSchema();
  }

  getSchema = () => {
    if (!this.props.provider_data) return this.schema;
    const provider_data = this.props.provider_data || {};

    const select_field = 'Ecosystem_level2';
    const choices = Array.from(
      new Set(provider_data?.[select_field] || []),
    ).map((n) => [n, n]);

    const newSchema = this.schema;
    newSchema.properties.ecosystem.choices = choices;

    if (this.props.data && !this.props.data.hoverTemplate) {
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        hoverTemplate: defaultHoverTemplate,
      });
    }

    return newSchema;
  };

  render() {
    const schema = this.getSchema();
    return (
      <div className={cx('block', { selected: this.props.selected })}>
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

export default compose(connectToProviderData)(Edit);
