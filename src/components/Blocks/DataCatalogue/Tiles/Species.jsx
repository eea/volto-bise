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
    <div className="catalogue-cell">
      <h4 className="cell-title">
        <a target="_blank" href={source.uri} rel="noreferrer">
          {source.scientific_name}
        </a>
      </h4>

      <p>
        <strong>{source.species_group}</strong> group and belonging to genus{' '}
        <strong>{source.genus}</strong>.
      </p>

      <div className="cell-footer">
        <span className="cell-source">{source.site.name}</span> &middot;
        Authorship by {source.authorship}
      </div>

      {/* <strong>Species</strong> */}
    </div>
  );
};
