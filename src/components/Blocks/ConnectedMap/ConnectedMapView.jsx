import React from 'react';
import { Style } from '@plone/volto/components';
import { PrivacyProtection } from 'volto-embed';
import Webmap from './Webmap';

export default ({ data = {}, ...rest }) => {
  // console.log('data', data);
  return (
    <Style data={data}>
      <PrivacyProtection data={data}>
        <Webmap {...rest} data={data} />
      </PrivacyProtection>
    </Style>
  );
};
