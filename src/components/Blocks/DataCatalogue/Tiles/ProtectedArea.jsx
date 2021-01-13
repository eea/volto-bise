import React from 'react';

export const ProtectedAreaListItem = ({ source, bemBlocks }) => {
  return (
    <div className="catalogue-cell">
      <h4 className={`cell-title ${bemBlocks.item('title')}`}>
        <a target="_blank" rel="noreferrer" href={source.uri}>
          {source.name} (code: {source.code})
        </a>
      </h4>
      <div>
        Countries:{' '}
        <i>
          {source.countries
            .reduce((a, c) => {
              return a + c.name + ', ';
            }, '')
            .replace(/, $/, '')}
        </i>
      </div>
      <div>
        <i>{source.species.length}</i> species
      </div>
      <span className="cell-footer">
        <span className="cell-source">{source.site.name}</span> &middot;
        Published on {source.published_on} in <i>{source.source_db}</i>
      </span>
    </div>
  );
};
