import { Component } from 'react';
import { connect } from 'react-redux';

import { MapSchema, MapFiltersSchema } from './schema';
import { addPrivacyProtectionToSchema } from '@eeacms/volto-embed';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';

class SchemaProvider extends Component {
  componentDidMount() {
    this.refresh();
  }
  componentDidUpdate() {
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
    const schema = MapSchema();
    const mapFiltersSchema = MapFiltersSchema();

    const choices = (this.props.service_info?.layers || []).map((l) => [
      l.id.toString(),
      l.name,
    ]);
    schema.properties.layer.choices = choices;

    const uniqueValues = (
      this.props.layer_info?.drawingInfo?.renderer?.uniqueValueInfos || []
    ).map((s) => [s.value.toString(), s.label]);

    const fields = (this.props.layer_info?.fields || []).filter(
      (f) => f.type === 'esriFieldTypeString',
    );

    const fieldset = {
      id: 'filters',
      title: 'Map filters',
      fields: ['map_filters'],
    };
    schema.fieldsets.push(fieldset);
    schema.properties.map_filters = {
      title: 'Map filters',
      widget: 'object',
      schema: mapFiltersSchema,
    };

    mapFiltersSchema.fieldsets[0].fields = [...fields.map(({ name }) => name)];

    fields.forEach(({ name }) => {
      mapFiltersSchema.properties[name] = {
        title: name,
        choices: uniqueValues,
      };
    });
    return schema;
  };

  render() {
    const schema = addPrivacyProtectionToSchema(this.deriveSchemaFromProps());
    return this.props.children(schema);
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
)(SchemaProvider);
