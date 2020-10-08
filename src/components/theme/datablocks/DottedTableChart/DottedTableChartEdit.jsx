import React from 'react';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import DottedTableChartView from './DottedTableChartView';
import { DottedTableChartSchema } from './schema';

const MAXIMUM_DOT_COUNT = 15;

/**
 * Rounds a floating point number to be used in the DottedTableChartEdit.
 * @example e.g. 1.2389 to 1.2.
 * @param {number} a
 */
const round = (a) => {
  return Math.round(a * 10) / 10;
};

class DottedTableChartEdit extends React.Component {
  getSchema = () => {
    const provider_data = this.props.provider_data || {};
    const schema = DottedTableChartSchema();

    const choices = Object.keys(provider_data)
      .sort()
      .map((n) => [n, n]);

    ['column_data', 'row_data', 'size_data'].forEach(
      (n) => (schema.properties[n].choices = choices),
    );

    const { row_data } = this.props.data;
    const possible_rows = Array.from(new Set(provider_data?.[row_data])).sort();

    schema.properties.row_colors.options = possible_rows.map((r) => ({
      id: r,
      title: r,
    }));

    const defaultDotValue = this.getDefaultDotValue();
    if (defaultDotValue) {
      schema.properties.dot_value.description = `Recommended value: ${defaultDotValue.toLocaleString()}`;
      if (!this.props.data.dot_value) {
        this.props.data.dot_value = defaultDotValue.toString();
      }
    } else {
      delete schema.properties.dot_value.description;
    }

    return schema;
  };

  /**
   * Returns the data based on which the edit form is filled.
   */
  getDataTree = () => {
    const { data, provider_data } = this.props;
    const { column_data, row_data, size_data } = data;

    const res = {};
    (provider_data?.[column_data] || []).forEach((cv, i) => {
      res[cv] = {
        ...res[cv],
        [provider_data?.[row_data]?.[i]]: provider_data?.[size_data]?.[i],
      };
    });
    return res;
  };

  /**
   * Uses this.possible_columns, this.possible_rows and this.data_tree.
   */
  getMaxValue = () => {
    let max = 0;
    // This loop can be optimized by calculating the GCD only once with multiple
    // parameters.
    this.possible_columns.forEach((x) => {
      this.possible_rows.forEach((y) => {
        if (typeof this.data_tree[x][y] === 'string') {
          const num = parseFloat(this.data_tree[x][y]);
          max = Math.max(max, num);
        }
      });
    });
    return max;
  };

  /**
   * Computes a default minimum dot_value piece of information.
   */
  getDefaultDotValue = () => {
    const { data, provider_data } = this.props;
    const { column_data, row_data } = data;

    this.possible_columns = Array.from(
      new Set(provider_data?.[column_data]),
    ).sort();
    this.possible_rows = Array.from(new Set(provider_data?.[row_data])).sort();

    this.data_tree = this.getDataTree();

    if (
      this.possible_columns.length === 0 ||
      this.possible_rows.length === 0 ||
      typeof this.data_tree[this.possible_columns[0]][this.possible_rows[0]] !==
        'string'
    ) {
      return null;
    }

    return round(this.getMaxValue() / MAXIMUM_DOT_COUNT);
  };

  render() {
    const { block, data, selected, onChangeBlock } = this.props;

    const schema = this.getSchema();

    return (
      <div className="block">
        <div className="block-inner-wrapper" />

        <DottedTableChartView {...this.props} />

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

export default connectBlockToProviderData(DottedTableChartEdit);
