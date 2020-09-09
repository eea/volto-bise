import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock

import ChartEditor from 'volto-plotlycharts/Widget/ChartEditor';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import _ from 'lodash';

import schema from './schema';
import { biseColorscale } from './config';

class Edit extends Component {
  // componentDidMount() {
  //   // this.props.onChangeBlock(this.props.block, {
  //   //   ...this.props.data,
  //   //   bar_colors: [],
  //   // });
  // }

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
        default: this.props.data.categorical_axis || 'x',
      };
      usedSchema.fieldsets[usedSchema.fieldsets.length - 1].fields.push(
        'categorical_axis',
      );

      usedSchema.properties.categorical_colorscale = {
        title: 'Categorical color scale',
        type: 'colorscale',
        default: this.props.data.categorical_colorscale,
      };
      usedSchema.fieldsets[usedSchema.fieldsets.length - 1].fields.push(
        'categorical_colorscale',
      );

      // TODO: the same based on user input for Y

      // for each unique value on the X axis
      const xValues = chartData.data[0].x;
      const xNoDupl = _.uniq(xValues);

      // for each color in the selected colorscale, create an option for it
      const choices = (
        this.props.data.categorical_colorscale || biseColorscale
      ).map((x, i) => [i + 1, `Colour #${i + 1}`]);

      let idx = 1;
      // for each non-duplicate value
      for (const val of xNoDupl) {
        // create a field for it for the end-user
        const id = 'x_' + idx; // TODO: replace with y_ when it is the case

        // console.log('bar_colors', this.props.data.bar_colors);
        // console.log('xValues and val', { xValues, val });

        // a color is already set for it
        let index = this.props.data.bar_colors?.[
          xValues.findIndex((x) => x === val)
        ];

        if (typeof index !== 'number') {
          index = 1;
        }

        usedSchema.properties[id] = {
          widget: 'flexible_choices',
          title: val.toString(),
          hasNoValueItem: false,
          choices,
          default: index - 1,
        };
        usedSchema.fieldsets[usedSchema.fieldsets.length - 1].fields.push(id);

        ++idx;
      }

      // console.log('props', this.props);

      return usedSchema;
    }

    return schema;
  };

  // computes bar colors based on values of the given axis and the value that changed (id, value)
  getBarColorsAfterChange = (xValues, id, value) => {
    const xNoDupl = _.uniq(xValues);

    // index from the array of uniques
    let idx = Number(id.substring(2)) - 1;

    const bar_colors = this.props.data.bar_colors || [];

    // for each index in xValues where it is xNoDupl[idx]
    // put it in bar_colors there
    for (let i = 0; i < xValues.length; ++i) {
      if (xValues[i] === xNoDupl[idx]) {
        bar_colors[i] = value;
      }
    }
    return bar_colors;
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
              // some x color changed by user
              const isAxisX = id.startsWith('x_');
              // some y color changed by user
              const isAxisY = id.startsWith('y_');

              // if some x or y color changed by user
              if (isAxisX || isAxisY) {
                // take all the given axis values
                const xValues = chartData.data[0][isAxisX ? 'x' : 'y'];
                // update the colors on that axis
                this.props.onChangeBlock(this.props.block, {
                  ...this.props.data,
                  bar_colors: this.getBarColorsAfterChange(xValues, id, value),
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
