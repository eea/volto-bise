import React from 'react';

export const LinkListItem = ({ source, bemBlocks }) => {
  return (
    <div className="catalogue-cell">
      <h4 className={`cell-title ${bemBlocks.item('title')}`}>
        <a target="_blank" rel="noreferrer" href={source.uri}>
          {source.name}
        </a>
      </h4>
      {source.title != source.english_title && (
        <small
          className="cell-alternative-title"
          title="English title"
          dangerouslySetInnerHTML={{ __html: source.english_title }}
        ></small>
      )}
      <div
        className="cell-description"
        dangerouslySetInnerHTML={{ __html: source.description }}
      ></div>
      <div className="cell-footer">
        <span className="cell-source">{source.site.name}</span> &middot;
        Published on {source.published_on}
      </div>
      {/* <strong>Link</strong> */}
    </div>
  );
};
