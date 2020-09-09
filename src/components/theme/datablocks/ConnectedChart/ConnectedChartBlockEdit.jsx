import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock

import ChartEditor from 'volto-plotlycharts/Widget/ChartEditor';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import _ from 'lodash';

import schema from './schema';
import { biseColorscale } from './config';

class Edit extends Component {
  componentDidMount() {
    this.props.onChangeBlock(this.props.block, {
      ...this.props.data,
      barColors: [],
    });
  }

  getSchema = (chartData, schema) => {
    if (chartData.data.length > 0 && chartData.data[0].type === 'bar') {
      let usedSchema = JSON.parse(JSON.stringify(schema || {}));

      usedSchema.properties.categorical_axis = {
        widget: 'flexible_choices',
        title: 'Categorical axis',
        choices: [
          ['x', 'X'],
          ['y', 'Y'],
        ],
        hasNoValueItem: false,
        default: this.props.data.barColorsCategoricalAxis, // TODO: save this
      };
      usedSchema.fieldsets[usedSchema.fieldsets.length - 1].fields.push(
        'categorical_axis',
      );

      usedSchema.properties.categorical_colorscale = {
        title: 'Categorical color scale',
        type: 'colorscale',
        default: this.props.data.barColorsColorscale, // TODO: save this
      };
      usedSchema.fieldsets[usedSchema.fieldsets.length - 1].fields.push(
        'categorical_colorscale',
      );

      // TODO: the same based on user input for Y

      // for each unique value on the X axis
      const xValues = chartData.data[0].x;
      const xNoDupl = _.uniq(xValues);

      const choices = (
        this.props.data.categorical_colorscale || biseColorscale
      ).map((x, i) => [x, `Colour #${i + 1}`]); // TODO: do not remember the color but the selected index in the selected colorscale

      let idx = 1;
      for (const val of xNoDupl) {
        // create a field for it for the end-user
        const id = 'x_' + idx;

        usedSchema.properties[id] = {
          widget: 'flexible_choices',
          title: val.toString(),
          hasNoValueItem: false,
          choices,
          default: { label: choices?.[0][1], value: choices?.[0][0] },
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
              const isAxisX = id.startsWith('x_');
              const isAxisY = id.startsWith('y_');
              if (isAxisX || isAxisY) {
                const xValues = chartData.data[0][isAxisX ? 'x' : 'y'];
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
              } else {
                this.props.onChangeBlock(this.props.block, {
                  ...this.props.data,
                  [id]: value,
                });
              }
            }}
            formData={this.props.data}
          />
        </SidebarPortal>
      </div>
    );
  }
}

export default connect(null, {})(Edit);
