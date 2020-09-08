import React, { Component } from 'react';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import schema from './schema';
import { connectBlockToProviderData } from 'volto-bise/hocs';
import MaesViewerView from './MaesViewerView';

class Edit extends Component {
  getSchema = (schema) => {
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

  // newSchema.properties.dynamic = {
  //   title: 'Je suis dynamic',
  // };
  // newSchema.fieldsets[0].fields.push('dynamic');
  // return newSchema;
  // };

  /**
   * If bar chart type in data is "bar":
   *    - display select "Custom color axis": X / Y
   *    - un control cu paleta de culori pe care sa o folosim
   *    - pt fiecare categorie (valoare) din axa X (sau Y), afisam cate un
   *    widget in care userul sa aleaga culoarea
   *    - store information, add it to the data that is passed to the chart
   *
   */

  render() {
    return (
      <div className="block selected">
        <div className="block-inner-wrapper" />

        <MaesViewerView data={this.props.data} />

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
