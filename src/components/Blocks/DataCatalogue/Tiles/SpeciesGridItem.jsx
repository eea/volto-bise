import React from 'react';

const SpeciesGridItem = ({ source }) => {
  console.log('source', source);
  return (
    <div>
      <a href={source._uri}>{source.scientific_name}</a>
      <div>
        {`${source.species_group} group and belonging to genus ${source.genus}`}
      </div>
    </div>
  );
};
export default SpeciesGridItem;
