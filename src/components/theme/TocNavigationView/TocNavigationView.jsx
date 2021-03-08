import { defineMessages, injectIntl } from 'react-intl';
import React, { useState } from 'react';
import cx from 'classnames';
import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  getBaseUrl,
} from '@plone/volto/helpers';
import config from '@plone/volto/registry';
import { map } from 'lodash';
import { Grid } from 'semantic-ui-react';
import VisibilitySensor from 'react-visibility-sensor';
import AnchorLink from 'react-anchor-link-smooth-scroll';

const messages = defineMessages({
  unknownBlock: {
    id: 'Unknown Block',
    defaultMessage: 'Unknown Block {block}',
  },
});

const splitBlocksByTOC = (blockIds, blocksContent) => {
  // find position of first block id where block content is text with h2

  let cursor = blockIds.findIndex((blockId, index) => {
    if (blocksContent[blockId]['@type'] !== 'slate') return false;

    const content = blocksContent[blockId];
    if (!content.value) {
      console.log('view wrong block', content);
      return false;
    }
    const blockType = content.value[0].type;
    return blockType === 'h2';
  });
  return [blockIds.slice(0, cursor), blockIds.slice(cursor)];
};

const HEADLINES = ['h2', 'h3'];

let BlocksWithToc = ({ blockIds, blocksContent, intl, content, location }) => {
  let [activeId, setActiveId] = useState(null);
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
                  if (!block.value) return null;
                  const slateBlock = block.value[0];
                  const { type } = slateBlock;
                  const text = slateBlock.children[0].text;
                  const textId = 'tocNav-' + index;
                  if (!HEADLINES.includes(type)) return null;
                  return (
                    <AnchorLink
                      key={blockId}
                      href={'#' + textId}
                      offset={10}
                      className={cx(`toc-nav-header link-${type}`, {
                        selected: activeId === textId,
                      })}
                    >
                      {text}
                    </AnchorLink>
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
                console.log('block not slate', block);
                return null;
              }
              const blockType = block.value[0].type;
              const textId = 'tocNav-' + index;
              const isheadline = HEADLINES.includes(blockType);
              return Block !== null ? (
                <VisibilitySensor
                  scrollCheck={true}
                  resizeCheck={true}
                  scrollThrottle={100}
                  minTopValue={800}
                  partialVisibility={true}
                  offset={{ top: 10 }}
                  intervalDelay={3000}
                  key={blockId}
                >
                  {({ isVisible }) => {
                    if (isheadline && textId && isVisible)
                      customSetActive(textId);
                    return (
                      <div id={`${isheadline ? textId : ''}`}>
                        <Block
                          key={blockId}
                          properties={content}
                          data={blocksContent[blockId]}
                          path={getBaseUrl(location?.pathname || '')}
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

BlocksWithToc = injectIntl(BlocksWithToc);

const TocNavView = ({ content, location, intl }) => {
  const blocksFieldname = getBlocksFieldname(content);
  const blocksLayoutFieldname = getBlocksLayoutFieldname(content);
  const blockIds = content[blocksLayoutFieldname].items;
  const blocksContent = content[blocksFieldname];
  const [preambleIds, contentIds] = splitBlocksByTOC(blockIds, blocksContent);
  return (
    <div id="page-document" className="ui container">
      {map(preambleIds, (block) => {
        const Block =
          config.blocks.blocksConfig[
            content[blocksFieldname]?.[block]?.['@type']
          ]?.['view'] || null;
        return Block !== null ? (
          <Block
            key={block}
            id={block}
            properties={content}
            data={content[blocksFieldname][block]}
            path={getBaseUrl(location?.pathname || '')}
          />
        ) : (
          <div key={block}>
            {intl.formatMessage(messages.unknownBlock, {
              block: content[blocksFieldname]?.[block]?.['@type'],
            })}
          </div>
        );
      })}
      <BlocksWithToc
        content={content}
        blockIds={contentIds}
        blocksContent={blocksContent}
        location={location}
      />
    </div>
  );
};

export default injectIntl(TocNavView);
