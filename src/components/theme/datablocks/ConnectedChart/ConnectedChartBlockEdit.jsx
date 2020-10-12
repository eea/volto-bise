import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock

// import ChartEditor from 'volto-plotlycharts/Widget/ChartEditor';
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import ChartEditorWidget from 'volto-plotlycharts/Widget/Widget';

import schema from './schema';

class Edit extends Component {
  render() {
    const chartData = this.props.data.chartData || {
      layout: {},
      frames: [],
      data: [],
    };

    return (
      <>
        <ChartEditorWidget
          title="Plotly Chart"
          required={true}
          value={{
            ...chartData,
            provider_url: this.props.data?.url,
          }}
          id={`field-plotlychart-${this.props.block}`}
          onChange={(id, value) => {
            this.props.onChangeBlock(this.props.block, {
              ...this.props.data,
              url: value.provider_url,
              chartData: JSON.parse(JSON.stringify(value)),
            });
          }}
        />
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
      </>
    );
  }
}

export default connect(null, {})(Edit);
//
//      <ChartEditor
//        value={chartData}
//        provider_url={this.props.data?.url}
//        onChangeValue={(value) => {
//          this.props.onChangeBlock(this.props.block, {
//            ...this.props.data,
//            chartData: JSON.parse(JSON.stringify(value)),
//          });
//        }}
//      />
