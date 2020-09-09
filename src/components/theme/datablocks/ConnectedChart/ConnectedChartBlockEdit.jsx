import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock

import ChartEditor from 'volto-plotlycharts/Widget/ChartEditor';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import _ from 'lodash';

import schema from './schema';
import { biseColorscale } from './config';

class Edit extends Component {
  getSchema = (chartData, schema) => {
    if (chartData.data.length > 0 && chartData.data[0].type === 'bar') {
      let usedSchema = JSON.parse(JSON.stringify(schema || {}));

      // TODO: do not show No Value choice:
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

      usedSchema.properties.categorical_colorscale = {
        title: 'Categorical color scale',
        type: 'colorscale',
      };
      usedSchema.fieldsets[usedSchema.fieldsets.length - 1].fields.push(
        'categorical_colorscale',
      );

      // TODO: the same based on user input for Y
      // TODO: chioce "No Value" should not be available

      // for each unique value on the X axis
      const xValues = chartData.data[0].x;
      const xNoDupl = _.uniq(xValues);
      let idx = 1;
      for (const val of xNoDupl) {
        // create a field for it for the end-user
        const id = 'x_' + idx;

        const choices = (
          this.props.data.categorical_colorscale || biseColorscale
        ).map((x, i) => [x, i + 1]);

        usedSchema.properties[id] = {
          title: val.toString(),
          choices,
        };
        usedSchema.fieldsets[usedSchema.fieldsets.length - 1].fields.push(id);

        ++idx;
      }

      // console.log('props', this.props);

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
              if (id.startsWith('x_') || id.startsWith('y_')) {
                const xValues = chartData.data[0].x; // TODO: or y
                const xNoDupl = _.uniq(xValues);

                // index from the array of uniques
                let idx = Number(id.substring(2));

                const barColors = this.props.data.barColors || [];

                // for each index in xValues where it is xNoDupl[idx]
                // put it in barColors there
                for (let i = 0; i < xValues.length; ++i) {
                  if (xValues[i] === xNoDupl[idx]) {
                    barColors[i] = value;
                  }
                }

                this.props.onChangeBlock(this.props.block, {
                  ...this.props.data,
                  barColors,
                });

                // console.log('NEW PROPS', this.props);

                return;
              }
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
