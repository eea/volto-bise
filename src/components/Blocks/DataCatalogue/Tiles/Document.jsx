import React from 'react';

export const DocumentListItem = ({ source, bemBlocks }) => {
  const catalogueHost =
    window.Catalogue?.host || 'https://catalogue.biodiversity.europa.eu';

  return (
    <div className="catalogue-cell">
      <h4 className="cell-title">
        <a
          target="_blank"
          rel="noreferrer"
          href={`${catalogueHost}${source.file_name}`}
        >
          <sup className="cell-document-type">
            {source.content_type.includes('/')
              ? source.content_type.split('/')[1]
              : source.content_type}
          </sup>{' '}
          <span dangerouslySetInnerHTML={{ __html: source.title }}></span>
        </a>
        {source.title !== source.english_title && (
          <small
            className="cell-alternative-title"
            title="English title"
            dangerouslySetInnerHTML={{ __html: source.english_title }}
          ></small>
        )}
      </h4>

      <div className="cell-summary">
        {/* source.file_name.substring(source.file_name.lastIndexOf('/') + 1, source.file_name.length) */}

        {source.highlight !== undefined &&
          source.highlight.attachment.length > 0 && (
            <div className="att-preview">
              {/* <strong>Matches found in the document:</strong> */}

              <ol>
                {source.highlight.attachment.map((h) => {
                  return (
                    <li
                      dangerouslySetInnerHTML={{
                        __html: `... ${h.replace(/(<canvas>)/gi, '')} ...`,
                      }}
                    ></li>
                  );
                })}
              </ol>
            </div>
          )}
      </div>

      <div className="cell-footer">
        <span className="cell-source">{source.site.name}</span> &middot;
        Published on {source.published_on}
      </div>

      {/* <strong>Document</strong> */}
    </div>
  );
};
