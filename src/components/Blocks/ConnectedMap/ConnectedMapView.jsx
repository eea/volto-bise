import React from 'react';
import { Style } from '@plone/volto/components';
import { PrivacyProtection } from 'volto-embed';

export default ({ data = {} }) => {
  console.log('data', data);
  return (
    <Style data={data}>
      <PrivacyProtection data={data}>
        <div>Hello</div>
      </PrivacyProtection>
    </Style>
  );
};
