import React from 'react';
import { connect } from 'react-redux';
import { Style } from '@plone/volto/components';
import { PrivacyProtection } from '@eeacms/volto-embed';
import { getProxiedExternalContent } from '@eeacms/volto-corsproxy/actions';
import Webmap from './Webmap';

const ConnectedMapView = ({ data = {}, ...rest }) => {
  const { map_filters, map_service_url, layer, base_layer } = data;
  return (
    <Style data={data}>
      <PrivacyProtection data={data}>
        <Webmap
          map_filters={map_filters}
          map_service_url={map_service_url}
          base_layer={base_layer}
          layer={layer}
        />
      </PrivacyProtection>
    </Style>
  );
};

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
)(ConnectedMapView);
