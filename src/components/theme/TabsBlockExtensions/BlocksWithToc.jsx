import React from 'react';
import { Grid } from 'semantic-ui-react';
import cx from 'classnames';
import VisibilitySensor from 'react-visibility-sensor';
import AnchorLink from 'react-anchor-link-smooth-scroll';
import { defineMessages } from 'react-intl';

import { map } from 'lodash';
import config from '@plone/volto/registry';
import { getBaseUrl } from '@plone/volto/helpers';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

const BlocksWithToc = ({
  blockIds,
  blocksContent,
  intl,
  content,
  pathname,
}) => {
  let [activeId, setActiveId] = React.useState(null);
  const customSetActive = (value) => {
    return setActiveId(value);
  };
  return (
    <div>
      <Grid className="toc-navigation">
        <Grid.Row>
          <Grid.Column width={3} className="sidebar-wrapper">
            <div className="toc-sidebar">
              <div className="toc-nav">
                {map(blockIds, (blockId, index) => {
                  const block = blocksContent[blockId];
                  if (block['@type'] !== 'slate' || !block.value) return '';
                  const slateBlock = block.value[0];
                  const { type, children = {} } = slateBlock;
                  const text = children[0].text;
                  const textId = 'tocNav-' + index;
                  const headings = ['h2', 'h3', 'h4'];
                  const tocDescription = type === 'h4';
                  if (!headings.includes(type)) return null;
                  return (
                    <>
                      {!tocDescription ? (
                        <AnchorLink
                          key={blockId}
                          href={`#${textId}`}
                          offset={10}
                          className={cx(`toc-nav-header link-${type}`, {
                            selected: activeId === textId,
                          })}
                        >
                          {text}
                        </AnchorLink>
                      ) : (
                        <span className="toc-description">{text}</span>
                      )}
                    </>
                  );
                })}
              </div>
            </div>
          </Grid.Column>
          <Grid.Column width={9} className="toc-content">
            {map(blockIds, (blockId, index) => {
              const Block =
                config.blocks.blocksConfig[
                  blocksContent?.[blockId]?.['@type']
                ]?.['view'] || null;
              const block = blocksContent[blockId];
              if (block['@type'] !== 'slate' || !block.value) {
                return (
                  <Block
                    key={blockId}
                    properties={content}
                    data={blocksContent[blockId]}
                    path={getBaseUrl(pathname || '')}
                  />
                );
              }
              const { type } = block.value[0];
              const textId = 'tocNav-' + index;
              const headings = ['h2', 'h3'];
              const isHeadline = headings.includes(type);
              return Block !== null ? (
                <VisibilitySensor
                  scrollCheck={true}
                  resizeCheck={true}
                  scrollThrottle={100}
                  minTopValue={800}
                  partialVisibility={true}
                  offset={{ top: 10 }}
                  intervalDelay={2000}
                  key={blockId}
                  onChange={(isVisible) => {
                    if (isHeadline && textId && isVisible)
                      customSetActive(textId);
                  }}
                >
                  {({ isVisible }) => {
                    return (
                      <div {...(isHeadline ? { id: textId } : {})}>
                        <Block
                          key={blockId}
                          properties={content}
                          data={blocksContent[blockId]}
                          path={getBaseUrl(pathname || '')}
                        />
                      </div>
                    );
                  }}
                </VisibilitySensor>
              ) : (
                <div key={blockId}>
                  {intl.formatMessage(messages.unknownBlock, {
                    block: blocksContent?.[blockId]?.['@type'],
                  })}
                </div>
              );
            })}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default BlocksWithToc;
