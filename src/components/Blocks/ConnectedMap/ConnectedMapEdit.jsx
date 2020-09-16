import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import schema from './schema';
import ConnectedMapView from './ConnectedMapView';
import { addPrivacyProtectionToSchema } from 'volto-embed';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';

class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      layers: [],
    };

    this.addServiceInfo = this.addServiceInfo.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const url = this.props.data?.map_service_url;
    if (url && !this.props.service_info) {
      this.props.getProxiedExternalContent(`${url}?f=json`, null, url);
    }

    const { service_info = {} } = this.props;
    const data = service_info.data || {};
    if ((this.state.layers || []).length === 0 && data.layers) {
      this.setState({ layers: data.layers });
    }
  }

  addServiceInfo(schema) {
    if (this.state.layers) {
      const choices = this.state.layers.map((l) => [l.name, l.value]);
      schema.properties.layer.choices = choices;
    }
    return schema;
  }

  render() {
    return (
      <div className="block selected">
        <div className="block-inner-wrapper" />

        {JSON.stringify(this.props.service_info, null, 2)}
        <ConnectedMapView data={this.props.data} />

        <SidebarPortal selected={this.props.selected}>
          <InlineForm
            schema={addPrivacyProtectionToSchema(this.addServiceInfo(schema))}
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

export default connect(
  (state, props) => {
    const subrequests = state.content.subrequests;
    return {
      service_info: subrequests[props.data?.map_service_url],
    };
  },
  { getProxiedExternalContent },
)(Edit);
