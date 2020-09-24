import React from 'react';

export const SiteListItem = ({ source, bemBlocks }) => {
  return (
    <div className="catalogue-cell">
      <h4 className={`cell-title ${bemBlocks.item('title')}`}>
        <a target="_blank" rel="noreferrer" href={source.uri}>
          {source.name}
        </a>
      </h4>
      <iframe
        src=""
        title={source.name} // this should be something unique
        data-code={source.code}
        scrolling="no"
        style={{ height: '380px', width: '100%' }}
      ></iframe>
      <div className="cell-footer">
        <span className="cell-source">{source.site.name}</span> &middot;{' '}
      </div>
      {/* <strong>Protected site</strong> */}
    </div>
  );
};
