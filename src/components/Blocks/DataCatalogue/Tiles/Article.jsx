import React from 'react';

export const ArticleListItem = ({ source, bemBlocks }) => {
  return (
    <div className="catalogue-cell">
      <h4 className={`cell-title ${bemBlocks.item('title')}`}>
        <a
          target="_blank"
          rel="noreferrer"
          href={source.source_url}
          dangerouslySetInnerHTML={{ __html: source.title }}
        ></a>
      </h4>
      {source.title !== source.english_title && (
        <small
          className="cell-alternative-title"
          title="English title"
          dangerouslySetInnerHTML={{ __html: source.english_title }}
        ></small>
      )}
      <span className="cell-footer">
        <span className="cell-source">{source.site.name}</span> &middot;
        Published on {source.published_on}
      </span>
      {/* <strong>Web Page</strong> */}
    </div>
  );
};
