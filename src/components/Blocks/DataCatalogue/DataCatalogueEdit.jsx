import React from 'react';
import schema from './schema';
import { SidebarPortal, InlineForm } from '@plone/volto/components';
import DataCatalogueView from './DataCatalogueView';

const DataCatalogueEdit = (props) => {
  const { selected, block, data, onChangeBlock } = props;
  console.log('content', props);
  return (
    <div>
      {/* <DataCatalogueView {...props} /> */}
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
};

export default DataCatalogueEdit;
