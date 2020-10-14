import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock

import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import ChartEditorWidget from './Widget';
import VisibilitySensor from 'react-visibility-sensor';

import schema from './schema';

class Edit extends Component {
  chartNode = React.createRef();

  render() {
    const chartData = this.props.data.chartData || {
      layout: {},
      frames: [],
      data: [],
    };

    // partialVisibility={true}
    return (
      <>
        <div className="connected-chart" ref={this.chartNode}>
          <VisibilitySensor
            partialVisibility={true}
            offset={{ top: 10 }}
            delayedCall={true}
          >
            {({ isVisible, visibilityRect }) => {
              return (
                <div>
                  {isVisible ? (
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
                  ) : (
                    'a'
                  )}
                </div>
              );
            }}
          </VisibilitySensor>
        </div>

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
