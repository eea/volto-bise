import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock

import ChartEditor from 'volto-plotlycharts/Widget/ChartEditor';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import _ from 'lodash';

import schema from './schema';
import { biseColorscale } from './config';

class Edit extends Component {
  constructor(props) {
    super(props);

    this.color_fields = {};
  }

  handleFieldChange = (chartData, id, value) => {
    // some x color changed by user
    const isAxisX = id.startsWith('x_');
    // some y color changed by user
    const isAxisY = id.startsWith('y_');

    // if some x or y color changed by user
    if (isAxisX || isAxisY) {
      this.color_fields[id] = value;

      const axis = isAxisX ? 'x' : 'y';
      // take all the given axis values
      const xValues = chartData.data[0][axis];

      // update the colors on that axis
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        bar_colors: this.getBarColors(axis, xValues, this.color_fields),
      });
    } else if (
      chartData.data &&
      typeof chartData.data[0] !== 'undefined' &&
      chartData.data[0].type !== 'bar'
    ) {
      this.color_fields = {};
      const obj = { ...this.props.data, [id]: value };
      delete obj.categorical_axis;
      delete obj.categorical_colorscale;
      delete obj.bar_colors;
      this.props.onChangeBlock(this.props.block, obj);
    } else {
      this.props.onChangeBlock(this.props.block, {
        ...this.props.data,
        [id]: value,
      });
    }
  };

  alterSchemaForBarChart = (chartData, schema) => {
    let usedSchema = JSON.parse(JSON.stringify(schema || {}));

    usedSchema.properties.categorical_axis = {
      widget: 'flexible_choices',
      title: 'Categorical axis',
      choices: [
        ['x', 'X'],
        ['y', 'Y'],
      ],
      hasNoValueItem: true,
      default:
        this.props.data.categorical_axis === 'x'
          ? 0
          : this.props.data.categorical_axis === 'y'
          ? 1
          : 2,
    };
    usedSchema.fieldsets[usedSchema.fieldsets.length - 1].fields.push(
      'categorical_axis',
    );

    if (!this.props.data.categorical_axis) {
      return usedSchema;
    }

    usedSchema.properties.categorical_colorscale = {
      title: 'Categorical color scale',
      type: 'colorscale',
      default: this.props.data.categorical_colorscale,
    };
    usedSchema.fieldsets[usedSchema.fieldsets.length - 1].fields.push(
      'categorical_colorscale',
    );

    const axis = this.props.data.categorical_axis;

    // for each unique value on the X axis
    const xValues = chartData.data[0][axis];
    const xNoDupl = _.uniq(xValues);

    // for each color in the selected colorscale, create an option for it
    const choices = (
      this.props.data.categorical_colorscale || biseColorscale
    ).map((x, i) => [i + 1, `Colour #${i + 1}`]);

    let idx = 1;
    // for each non-duplicate value
    for (const val of xNoDupl) {
      // create a field for it for the end-user
      const id = this.props.data.categorical_axis + '_' + idx;

      // a color is already set for it
      const color = this.props.data.bar_colors?.[id];

      usedSchema.properties[id] = {
        widget: 'flexible_choices',
        title: val.toString(),
        hasNoValueItem: false,
        choices,
        default: color
          ? choices.findIndex(([i, l]) => i === color)
          : idx <= choices.length
          ? idx - 1
          : 0,
      };
      usedSchema.fieldsets[usedSchema.fieldsets.length - 1].fields.push(id);

      if (color) {
        this.color_fields[id] = color;
      } else {
        this.color_fields[id] = idx <= choices.length ? idx : 1;
        // update the colors on that axis

        // this is done in another place in code in the main if branch above,
        // and if we put this call to onChangeBlock in there too, we get render
        // in render in render in etc.
        this.props.onChangeBlock(this.props.block, {
          ...this.props.data,
          bar_colors: this.getBarColors(axis, xValues, this.color_fields),
        });
      }

      ++idx;
    }

    return usedSchema;
  };

  hasBarChart(chartData) {
    return chartData.data.length > 0 && chartData.data[0].type === 'bar';
  }

  getSchema = (chartData, schema) => {
    if (this.hasBarChart(chartData)) {
      return this.alterSchemaForBarChart(chartData, schema);
    }

    return schema;
  };

  /**
   * @param {string} axis 'x' or 'y'
   * @param {string[]} xValues All values on given axis.
   * @param {object} relevantFields Each key is an id like x_5 (but not y_0) and the value is a color.
   * @returns {string[]} Colors for each value in xValues.
   */
  getBarColors = (axis, xValues, relevantFields) => {
    return relevantFields;
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
            onChangeField={(id, value) =>
              this.handleFieldChange(chartData, id, value)
            }
            formData={this.props.data}
          />
        </SidebarPortal>
      </div>
    );
  }
}

export default connect(null, {})(Edit);
