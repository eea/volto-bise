import React, { useState } from 'react';
import DefaultTabsRenderer, {
  messages,
} from '@eeacms/volto-tabs-block/Tabs/DefaultTabsRenderer';
import { Tab, Grid } from 'semantic-ui-react';
import { injectIntl } from 'react-intl';
import cx from 'classnames';
import { map } from 'lodash';
import { blocks } from '~/config';
import { getBaseUrl } from '@plone/volto/helpers';

import VisibilitySensor from 'react-visibility-sensor';
import AnchorLink from 'react-anchor-link-smooth-scroll';

const splitBlocksByTOC = (blockIds, blocksContent) => {
  // find position of first block id where block content is text with h2
  let cursor = blockIds.findIndex((blockId, index) => {
    if (blocksContent[blockId]['@type'] !== 'slate') return false;

    const content = blocksContent[blockId];
    if (!content.value) {
      return false;
    }
    const blockType = content.value[0].type;
    return blockType === 'h2';
  });
  if (cursor === -1) cursor = blockIds.length - 1;
  return [blockIds.slice(0, cursor), blockIds.slice(cursor)];
};

const HEADLINES = ['h2', 'h3'];

let BlocksWithToc = ({ blockIds, blocksContent, intl, content, pathname }) => {
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
                  const Block =
                    blocks.blocksConfig[blocksContent?.[blockId]?.['@type']]?.[
                      'view'
                    ] || null;
                  const block = blocksContent[blockId];
                  if (block['@type'] !== 'slate' || !block.value) return '';
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
                blocks.blocksConfig[blocksContent?.[blockId]?.['@type']]?.[
                  'view'
                ] || null;
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

BlocksWithToc = injectIntl(BlocksWithToc);

const TabsTocNavigationView = (props) => {
  const renderTab = React.useCallback(
    ({
      index,
      tab,
      tabsLayout,
      properties,
      intl,
      blocksFieldname,
      pathname,
    }) => {
      const blockIds = tabsLayout[index] || [];
      // const blocklist = blockIds.map((blockId) => {
      //   return [blockId, properties[blocksFieldname]?.[blockId]];
      // });
      const blocksContent = properties[blocksFieldname];
      const [preambleIds, contentIds] = splitBlocksByTOC(
        blockIds,
        blocksContent,
      );
      return (
        <Tab.Pane>
          {map(preambleIds, (block) => {
            const Block =
              blocks.blocksConfig[
                properties[blocksFieldname]?.[block]?.['@type']
              ]?.['view'] || null;
            return Block !== null ? (
              <Block
                key={block}
                id={block}
                properties={properties}
                data={properties[blocksFieldname][block]}
                path={getBaseUrl(pathname || '')}
              />
            ) : (
              <div key={block}>
                {intl.formatMessage(messages.unknownBlock, {
                  block: properties[blocksFieldname]?.[block]?.['@type'],
                })}
              </div>
            );
          })}

          <BlocksWithToc
            content={properties}
            blockIds={contentIds}
            blocksContent={blocksContent}
            pathname={pathname}
          />
        </Tab.Pane>
      );
    },
    [],
  );

  return <DefaultTabsRenderer {...props} renderTab={renderTab} />;
};

export default TabsTocNavigationView;
