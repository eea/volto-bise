import React from 'react';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import DottedTableChartView from './DottedTableChartView';
import { DottedTableChartSchema } from './schema';

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

    return schema;
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
