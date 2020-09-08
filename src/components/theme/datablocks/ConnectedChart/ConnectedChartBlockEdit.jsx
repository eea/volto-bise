import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock

import ChartEditor from 'volto-plotlycharts/Widget/ChartEditor';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import schema from './schema';

class Edit extends Component {
  getSchema = (chartData, schema) => {
    if (chartData.data.length > 0 && chartData.data[0].type === 'bar') {
      let usedSchema = JSON.parse(JSON.stringify(schema || {}));
      usedSchema.properties.categorical_axis = {
        title: 'Categorical axis',
        choices: [
          ['x', 'X'],
          ['y', 'Y'],
        ],
      };
      usedSchema.fieldsets[usedSchema.fieldsets.length - 1].fields.push(
        'categorical_axis',
      );
      return usedSchema;
    }

    return schema;
  };

  render() {
    const chartData = this.props.data.chartData || {
      layout: {},
      frames: [],
      data: [],
    };

    let usedSchema = this.getSchema(chartData, schema);

    return (
      <div className="block selected">
        <div className="block-inner-wrapper" />
        <ChartEditor
          value={chartData}
          provider_url={this.props.data?.url}
          onChangeValue={(value) => {
            this.props.onChangeBlock(this.props.block, {
              ...this.props.data,
              chartData: JSON.parse(JSON.stringify(value)),
            });
          }}
        />
        <SidebarPortal selected={this.props.selected}>
          <InlineForm
            schema={usedSchema}
            title={usedSchema.title}
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
