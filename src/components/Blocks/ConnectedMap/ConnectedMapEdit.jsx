import React, { Component } from 'react';
import { connect } from 'react-redux';

import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';

import MapSchema from './schema';
import ConnectedMapView from './ConnectedMapView';
import { addPrivacyProtectionToSchema } from 'volto-embed';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';

class Edit extends Component {
  componentDidUpdate(prevProps, prevState) {
    this.refresh();
  }

  refresh = () => {
    const { service_info, layer_info } = this.props;
    const { map_service_url, layer } = this.props.data || {};
    const layer_url = `${map_service_url}/${layer}`;

    if (map_service_url && !service_info) {
      this.props.getProxiedExternalContent(
        `${map_service_url}?f=json`,
        null,
        map_service_url,
      );
    }

    if (map_service_url && !layer_info) {
      this.props.getProxiedExternalContent(
        `${layer_url}?f=json`,
        null,
        layer_url,
      );
    }
  };

  deriveSchemaFromProps = () => {
    const schema = JSON.parse(JSON.stringify(MapSchema));
    const choices = (this.props.service_info?.layers || []).map((l) => [
      l.id.toString(),
      l.name,
    ]);
    schema.properties.layer.choices = choices;

    const fields = (this.props.layer_info?.fields || []).filter(
      (f) => f.type === 'esriFieldTypeString',
    );

    schema.fieldsets[0] = {
      ...MapSchema.fieldsets[0],
      fields: [
        ...MapSchema.fieldsets[0].fields,
      ],
    };
    schema.fieldsets[1] = {
      ...MapSchema.fieldsets[1],
      fields: [
        ...fields.map(({ name }) => `f_${name}`),
      ],
    };

    const uniqueValues = (
      this.props.layer_info?.drawingInfo?.renderer?.uniqueValueInfos || []
    ).map((s) => [s.value.toString(), s.label]);

    fields.forEach((f) => {
      schema.properties[`f_${f.name}`] = {
        title: f.name,
        choices: uniqueValues,
      };
    });

    return schema;
  };

  render() {
    return (
      <div className="block selected">
        <div className="block-inner-wrapper" />

        <ConnectedMapView data={this.props.data} />

        <SidebarPortal selected={this.props.selected}>
          <InlineForm
            schema={addPrivacyProtectionToSchema(this.deriveSchemaFromProps())}
            title={MapSchema.title}
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
    const { data = {} } = props;
    const { map_service_url, layer } = data || {};
    const layer_url = map_service_url ? `${map_service_url}/${layer}` : null;

    return {
      service_info: subrequests[map_service_url]?.data,
      layer_info: layer_url ? subrequests[layer_url]?.data : null,
    };
  },
  { getProxiedExternalContent },
)(Edit);
