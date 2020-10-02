import React from 'react';
import {
  messages,
  getMenu,
  GRID,
} from '@eeacms/volto-tabs-block/Tabs/DefaultTabsRenderer';
import { Tab, Menu } from 'semantic-ui-react';
import { useIntl } from 'react-intl';
import { blocks } from '~/config';
import { getBaseUrl, getBlocksFieldname } from '@plone/volto/helpers';
import AnchorLink from 'react-anchor-link-smooth-scroll';

const FlatTabsView = (props) => {
  const {
    tabsLayout,
    globalActiveTab,
    mode,
    properties,
    pathname,
    onTabChange,
    tabs,
    block,
  } = props;

  const intl = useIntl();

  const blocksFieldname = getBlocksFieldname(properties);

  const renderTab = React.useCallback(
    ({
      index,
      tab,
      tabsLayout,
      properties,
      intl,
      blocksFieldname,
      pathname,
      block,
    }) => {
      const blockIds = tabsLayout[index] || [];
      const blocklist = blockIds.map((blockId) => {
        return [blockId, properties[blocksFieldname]?.[blockId]];
      });
      return (
        <section id={`section-${block}-${index}`}>
          {blocklist.map(([blockId, blockData]) => {
            const Block = blocks.blocksConfig[blockData['@type']]?.view;
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
        </section>
      );
    },
    [],
  );
  const menu = getMenu(props);
  const tabRenderer = props.renderTab || renderTab;

  return tabs.length ? (
    mode === 'view' ? (
      <>
        <Menu>
          {tabs.map((tab, index) => (
            <Menu.Item>
              <AnchorLink href={`#section-${block}-${index}`}>
                {tab.title}
              </AnchorLink>
            </Menu.Item>
          ))}
        </Menu>
        {tabs.map((tab, index) =>
          tabRenderer({
            index,
            tab,
            tabsLayout,
            properties,
            intl,
            blocksFieldname,
            pathname,
            block,
          }),
        )}
      </>
    ) : (
      <Tab
        grid={GRID}
        menu={menu}
        onTabChange={onTabChange}
        activeIndex={globalActiveTab}
        panes={tabs.map((tab, index) => ({
          // render: () => mode === 'view' && renderTab(index, child),
          render: () =>
            mode === 'view' &&
            tabRenderer({
              index,
              tab,
              tabsLayout,
              properties,
              intl,
              blocksFieldname,
              pathname,
            }),
          menuItem: tab.title,
        }))}
      />
    )
  ) : (
    <>
      <hr className="block section" />
      {mode === 'view'
        ? tabRenderer({
            index: 0,
            tab: {},
            tabsLayout,
            properties,
            intl,
            blocksFieldname,
            pathname,
          })
        : ''}
    </>
  );
};

export default FlatTabsView;
