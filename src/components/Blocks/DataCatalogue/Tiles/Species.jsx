import React from 'react';

export const SpeciesGridItem = ({ source }) => {
  return (
    <div>
      <a href={source._uri}>{source.scientific_name}</a>
      <div>
        {`${source.species_group} group and belonging to genus ${source.genus}`}
      </div>
    </div>
  );
};

export const SpeciesListItem = ({ source }) => {
  return (
    <div>
      <a href={source._uri}>{source.scientific_name}</a>
      <div>
        {`${source.species_group} group and belonging to genus ${source.genus}`}
      </div>
    </div>
  );
};
