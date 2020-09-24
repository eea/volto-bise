import React from 'react';

export const ArticleListItem = ({ source, bemBlocks }) => {
  return (
    <div>
      <a href={source.source_url}>
        <h2
          className={bemBlocks.item('title')}
          dangerouslySetInnerHTML={{ __html: source.title }}
        ></h2>
      </a>
      <div></div>
    </div>
  );
};
