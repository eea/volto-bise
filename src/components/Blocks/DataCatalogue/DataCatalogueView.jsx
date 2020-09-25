import React from 'react';
import withProps from 'decorate-component-with-props';

import _ from 'lodash';

import {
  ActionBar,
  ActionBarRow,
  BoolShould,
  FilteredQuery,
  GroupedSelectedFilters,
  HitsStats,
  Layout,
  LayoutBody,
  LayoutResults,
  NoHits,
  Pagination,
  RefinementListFilter,
  ResetFilters,
  SearchBox,
  SearchkitManager,
  SearchkitProvider,
  SideBar,
  SortingSelector,
  TermsQuery,
  ViewSwitcherHits,
  ViewSwitcherToggle,
  DynamicRangeFilter,
  CheckboxItemList,
  // MenuFilter,
  // RangeFilter,
  // TermQuery,
  // InputFilter,
  // HierarchicalMenuFilter,
  // NumericRefinementListFilter,
  // TopBar,
  // FacetFilter,
} from 'searchkit';
import { Icon } from '@plone/volto/components';
import tableSVG from '@plone/volto/icons/table.svg';

import { GridItem, ListItem, TableView } from './Tiles';
import './styles.less';

/**
 * Returns the label associated to a data type
 * @param {string} val
 */
const valueToLabel = (val) => {
  const data = [
    { label: 'Documents', value: 'document' },
    { label: 'Links', value: 'link' },
    { label: 'Web Pages', value: 'article' },
    { label: 'Species Info', value: 'species' },
    { label: 'Habitat Types Info', value: 'habitat' },
    { label: 'Sites Info', value: 'site' },
    { label: 'Protected Area', value: 'protected_area' }, // hidden
  ];
  return data.filter((x) => x.value === val)[0].label;
};

/**
 * Displays a checkbox w/ a label that replaces the default data type string.
 * @param {object} props
 */
const RefinementOption = (props) => {
  return (
    <div
      role="checkbox"
      onKeyPress={() => {}}
      className={props.bemBlocks
        .option()
        .state({ selected: props.active })
        .mix(props.bemBlocks.container('item'))}
      tabIndex={0}
      aria-checked={props.active}
    >
      <label style={{ flexGrow: 1 }}>
        <input
          type="checkbox"
          onClick={props.onClick}
          checked={props.active}
          className="sk-item-list-option__checkbox"
        />
        <span className={props.bemBlocks.option('text')}>
          {valueToLabel(props.label)}
        </span>
      </label>
      <div className={props.bemBlocks.option('count')}>{props.count}</div>
    </div>
  );
};

/**
 * Before showing the data types' filter sort its options well.
 * @param {object} props
 */
const RefinementList = (props) => {
  const data = [
    { order: 1, key: 'document' },
    { order: 2, key: 'link' },
    { order: 3, key: 'article' },
    { order: 4, key: 'species' },
    { order: 5, key: 'habitat' },
    { order: 6, key: 'site' },
    { order: 7, key: 'protected_area' }, // hidden
  ];

  let arr = Array.from(props.items);
  arr = arr.filter((x) => x.key !== 'protected_area');
  arr = arr.sort((a, b) => {
    return (
      data[data.findIndex((x) => x.key === a.key)].order -
      data[data.findIndex((x) => x.key === b.key)].order
    );
  });
  return <CheckboxItemList {...props} items={arr} />;
};

const search_types = [
  'article',
  'document',
  'link',
  // 'site',
  'news',
  // 'country',
  // 'biogen_region',
  'habitat',
  'protected_area',
  'species',
];

const DataCatalogueView = (props) => {
  const { data } = props;
  const url = data.es_host || 'http://localhost:3000';
  const searchkit = React.useMemo(() => {
    return new SearchkitManager(url);
  }, [url]);

  // const searchkit = new SearchkitManager("/")
  searchkit.addDefaultQuery((query) => {
    return query.addQuery(
      FilteredQuery({
        filter: BoolShould([
          TermsQuery('_type', search_types),
          // TermQuery('colour', 'orange'),
        ]),
      }),
    );
  });

  // prefixQueryFields={[]}
  // queryOptions={{ analyzer: 'standard' }}

  return (
    <div>
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <LayoutBody>
            <LayoutResults>
              <SearchBox
                autofocus={true}
                searchOnChange={true}
                queryFields={['title']}
              />
              <ActionBar>
                <ActionBarRow>
                  <HitsStats
                    translations={{
                      'hitstats.results_found': '{hitCount} results found',
                    }}
                  />
                  <ViewSwitcherToggle />
                  <SortingSelector
                    options={[
                      { label: 'Relevance', field: '_score', order: 'desc' },
                      {
                        label: 'Latest Modifications',
                        field: 'modified',
                        order: 'desc',
                      },
                      {
                        label: 'Earliest Modifications',
                        field: 'modified',
                        order: 'asc',
                      },
                    ]}
                  />
                </ActionBarRow>

                <ActionBarRow>
                  <GroupedSelectedFilters />
                  <ResetFilters />
                </ActionBarRow>
              </ActionBar>

              <ViewSwitcherHits
                hitsPerPage={12}
                highlightFields={['title', 'description']}
                sourceFilter={[]}
                hitComponents={[
                  // {
                  //   key: 'grid',
                  //   title: 'Grid',
                  //   itemComponent: withProps(GridItem, {
                  //     data,
                  //   }),
                  //   defaultOption: true,
                  // },
                  {
                    key: 'list',
                    title: 'List',
                    itemComponent: withProps(ListItem, {
                      data,
                    }),
                  },
                  // {
                  //   key: 'table',
                  //   title: <Icon name={tableSVG} size="18px" />,
                  //   listComponent: withProps(TableView, {
                  //     data,
                  //   }),
                  // },
                ]}
                scrollTo="body"
              />
              <NoHits suggestionsField={'title'} />
              <Pagination showNumbers={true} />
            </LayoutResults>
            <SideBar>
              <h4>Filter results</h4>

              <RefinementListFilter
                id="type"
                title="By Type"
                field="_type"
                size={10}
                operator="OR"
                itemComponent={RefinementOption}
                listComponent={RefinementList}
              />

              <RefinementListFilter
                id="countries"
                title="By Country"
                field="countries.name"
                size={4}
              />

              <RefinementListFilter
                id="bioregions"
                title="By Biogeographical Region"
                field="biographical_region"
                size={4}
              />

              <RefinementListFilter
                id="language"
                title="By Language"
                field="languages.name"
                size={4}
              />

              <RefinementListFilter
                id="species"
                title="By Species Group"
                field="species_group"
                size={4}
              />

              <RefinementListFilter
                id="taxonomy"
                title="By Taxonomic Rank"
                field="taxonomic_rank"
                size={4}
              />

              <RefinementListFilter
                id="genus"
                title="By Genus"
                field="genus"
                size={4}
              />

              <DynamicRangeFilter
                id="published"
                title="By Published Year"
                field="published_on"
                size={4}
                showHistogram={true}
                rangeFormatter={(n) => {
                  if (n) {
                    const d = new Date(n);
                    return d.getFullYear();
                  }
                  return n;
                }}
              />

              {/* <RefinementListFilter */}
              {/*   id="bio_strategy" */}
              {/*   title="By Biodiversity Strategy Targets" */}
              {/*   field="targets.title" */}
              {/*   size={4} */}
              {/* /> */}
            </SideBar>
          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    </div>
  );
};
export default DataCatalogueView;
