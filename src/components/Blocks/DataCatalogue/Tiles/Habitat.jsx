import React from 'react';

export const HabitatListItem = ({ source, bemBlocks }) => {
  return (
    <div className="catalogue-cell">
      <h4 className="cell-title">
        <a target="_blank" rel="noreferrer" href={source.uri}>
          {source.name}
        </a>
      </h4>

      <div className="cell-footer">
        <span className="cell-source">{source.site.name}</span> &middot; Habitat
        type with code{' '}
        {source.natura2000_code !== undefined
          ? source.natura2000_code
          : source.habitat_code}
      </div>
    </div>
  );
};
