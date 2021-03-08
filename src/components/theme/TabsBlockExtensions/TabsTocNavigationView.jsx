import React from 'react';
import DefaultTabsRenderer, {
  messages,
} from '@eeacms/volto-tabs-block/Tabs/DefaultTabsRenderer';
import { Tab } from 'semantic-ui-react';
import { map } from 'lodash';
import config from '@plone/volto/registry';
import { getBaseUrl } from '@plone/volto/helpers';

import BlocksWithToc from './BlocksWithToc';

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
      const blocklist = blockIds.map((blockId) => {
        return [blockId, properties[blocksFieldname]?.[blockId]];
      });
      const blocksContent = properties[blocksFieldname];
      const [preambleIds, contentIds] = splitBlocksByTOC(
        blockIds,
        blocksContent,
      );

      return tab.tocnav_view ? (
        <Tab.Pane>
          {map(preambleIds, (block) => {
            const Block =
              config.blocks.blocksConfig[
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
            intl={intl}
          />
        </Tab.Pane>
      ) : (
        <Tab.Pane>
          {blocklist.map(([blockId, blockData]) => {
            const Block = config.blocks.blocksConfig[blockData['@type']]?.view;
            return Block !== null ? (
              <>
                <Block
                  key={blockId}
                  id={blockId}
                  properties={properties}
                  data={blockData}
                  path={getBaseUrl(pathname || '')}
                />
              </>
            ) : (
              <div key={blockId}>
                {intl.formatMessage(messages.unknownBlock, {
                  block: blockData?.['@type'],
                })}
              </div>
            );
          })}
        </Tab.Pane>
      );
    },
    [],
  );

  return <DefaultTabsRenderer {...props} renderTab={renderTab} />;
};

function addTocNavOption(schema) {
  const [first, ...rest] = schema.fieldsets;
  return {
    ...schema,
    fieldsets: [
      {
        ...first,
        fields: [...first.fields, 'tocnav_view'],
      },
      ...rest,
    ],
    properties: {
      ...schema.properties,
      tocnav_view: {
        title: 'Enable/Disable TOC navigation view',
        type: 'boolean',
      },
    },
  };
}

export function tabsTocSchemaExtender(schema) {
  const { tabs } = schema.properties;
  return {
    ...schema,
    properties: {
      ...schema.properties,
      tabs: {
        ...tabs,
        schema: addTocNavOption(tabs.schema),
      },
    },
  };
}

export default TabsTocNavigationView;
