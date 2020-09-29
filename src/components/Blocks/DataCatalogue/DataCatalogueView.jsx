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
  DynamicRangeFilter,
  CheckboxItemList,
  Tabs,
  MenuFilter,
  CheckboxItemComponent,
  SearchkitComponent,
  FacetAccessor,
  // ViewSwitcherToggle,
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

const dataTypesInformation = [
  { label: 'Documents', value: 'document', order: 1 },
  { label: 'Links', value: 'link', order: 2 },
  { label: 'Web Pages', value: 'article', order: 3 },
  { label: 'Species Info', value: 'species', order: 4 },
  { label: 'Habitat Types Info', value: 'habitat', order: 5 },
  { label: 'Sites Info', value: 'site', order: 6 },
  { label: 'Protected Area', value: 'protected_area', order: 7 }, // hidden
];

/**
 * Displays a Checkbox Option which, when it has no key (key "") it displays a
 * default string "(No Region)".
 * @param {object} props
 */
const BiogeographicalRegionOption = (props) => {
  if (props.itemKey.length === 0) {
    return <CheckboxItemComponent {...props} label="(No Region)" />;
  }
  return <CheckboxItemComponent {...props} />;
};

/**
 * Displays a checkbox w/ a label that replaces the default data type string.
 * @param {object} props
 */
const RefinementOption = (props) => {
  /**
   * Returns the label associated to a data type
   * @param {string} val
   */
  const valueToLabel = React.useCallback((val) => {
    return dataTypesInformation.filter((x) => x.value === val)[0].label;
  }, []);

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
          onClick={(...args) => {
            return props.onClick(...args);
          }}
          checked={props.active}
          className="sk-item-list-option__checkbox"
        />
        <span className={props.bemBlocks.option('text')}>
          {valueToLabel(props.label)}
        </span>
      </label>
      {/* <div className={props.bemBlocks.option('count')}>{props.count}</div> */}
    </div>
  );
};

/**
 * Before showing the data types' filter sort its options well and the default
 * behavior is to all be checked (this is the same as when all are unchecked,
 * because the implicit operator is OR).
 */
const RefinementList = class extends SearchkitComponent {
  constructor(props) {
    super(props);

    // this.dataTypeInfo = this.getSortedFilteredDataTypeInfo();
    // this.allKeys = this.dataTypeInfo.map((x) => x.key);
    let selectedKeys = null; // this.selectedItemsFilter(this.allKeys);
    this.state = {
      selectedKeys,
    };
  }

  // componentDidMount() {
  //   // NOTE: here, this.dataTypeInfo and this.allKeys are both empty arrays
  //   this.refreshSelectedKeys();
  // }

  componentDidUpdate(prevProps) {
    if (prevProps.items !== this.props.items) {
      this.dataTypeInfo = this.getSortedFilteredDataTypeInfo();
      this.allKeys = this.dataTypeInfo.map((x) => x.key);
      this.refreshSelectedKeys();
    }
  }

  resetDataTypeFilter = (shouldPerformSearch = true) => {
    const sk = this.searchkit;

    if (typeof sk === 'undefined') {
      return false;
    }

    const filters = sk.accessors.accessors.filter((x) => x.key === 'type');
    for (const x of filters) {
      // console.log('GROZAV', x);
      sk.removeAccessor(x);
    }

    if (shouldPerformSearch) {
      return sk.performSearch(true, true);
    }

    return true;
  };

  toggleItem = (key) => {
    const sk = this.searchkit;

    if (typeof sk === 'undefined') {
      return false;
    }

    const filters = sk.accessors.accessors.filter((x) => x.key === 'type');

    if (filters.length === 0) {
      const newAccessor = new FacetAccessor('type', {
        operator: 'OR',
        field: '_type',
        size: 10,
        id: 'type',
        title: 'By Type',
        // itemComponent={RefinementOption}
        // listComponent={RefinementList
      });
      sk.addAccessor(newAccessor);
      filters.push(newAccessor);
    }

    // console.log('FILTERS', filters);
    for (const x of filters) {
      x.state = x.state.toggle(key);
    }

    console.log('L1', this.props.selectedItems);
    this.refreshSelectedKeys(false).then(() => {
      console.log('L2', this.props.selectedItems);
      sk.performSearch(true, true).then(() => {
        console.log('L3', this.props.selectedItems);
      });
    });

    return true;
  };

  refreshSelectedKeys = (shouldPerformSearch = true) => {
    return new Promise((resolve, reject) => {
      // this transforms [... full ...] into []
      const initialSelectedCount = this.props.selectedItems.length;
      let selectedKeys = this.selectedItemsFilter(this.allKeys);

      const initialSelectedKeys = this.state.selectedKeys;

      this.setState({ selectedKeys: null }, () => {
        this.setState({ selectedKeys }, () => {
          if (_.isEqual(initialSelectedKeys, selectedKeys)) {
            resolve();
            return;
          }

          // console.log('SELECTED KEYS', this.state.selectedKeys);
          if (
            this.allKeys.length > 0 &&
            initialSelectedCount === this.allKeys.length &&
            this.state.selectedKeys.length === 0
          ) {
            // debugger;
            this.resetDataTypeFilter(true).then(resolve);
          } else {
            // this.resetDataTypeFilter(false);
            resolve();
          }
        });
      });
    });
  };

  render() {
    // console.log('PROPS.ITEMS', this.props.items);
    // console.log('ITEMS', this.props.items);
    // console.log('SELECTED ITEMS', this.props.selectedItems);

    // let dataTypeInfo = this.getSortedFilteredDataTypeInfo();
    // const allKeys = dataTypeInfo.map((x) => x.key);
    // let selectedKeys = this.selectedItemsFilter(allKeys);

    // console.log('!!! ITEMS', arr);
    // console.log('!!! SELECTED ITEMS', selectedKeys);

    return (
      <CheckboxItemList
        {...this.props}
        items={this.dataTypeInfo}
        selectedItems={this.state.selectedKeys || []}
        toggleItem={this.toggleItem}
        multiselect={true}
      />
    );
  }

  getSortedFilteredDataTypeInfo = () => {
    let arr = this.props.items.filter((x) => x.key !== 'protected_area');
    arr = arr.sort((a, b) => {
      const ai = dataTypesInformation.findIndex((x) => x.value === a.key);
      const bi = dataTypesInformation.findIndex((x) => x.value === b.key);

      if (ai < 0 || isNaN(ai) || bi < 0 || isNaN(bi)) {
        return 0;
      }

      return dataTypesInformation[ai].order - dataTypesInformation[bi].order;
    });
    return arr;
  };

  /**
   * Adjusts the selected items list.
   * Called when a checkbox for a data type is clicked.
   * @param {string[]} allKeys
   */
  selectedItemsFilter = (allKeys) => {
    // console.log('ALL KEYUS', allKeys);
    // this.props.selectedItems is of type string[]
    let selectedKeys;
    const selectedCount = this.props.selectedItems.length;
    if (selectedCount === 0) {
      selectedKeys = allKeys;
      // this.resetDaaTypeFilter();
    } else if (selectedCount <= allKeys.length) {
      if (selectedCount === allKeys.length) {
        selectedKeys = [];
        // this.resetDataTypeFilter(false);
        // this.reset();
        // selectedKeys = allKeys;
      } else {
        selectedKeys = this.props.selectedItems.map((x) => x);
      }
    } else if (selectedCount > allKeys.length) {
      console.error(
        'We thought something was impossible, but it is possible actually.',
      );
    }

    // if (typeof this.searchkit !== 'undefined') {
    //   console.log(
    //     'ACCESSORS',
    //     this.searchkit.accessors.accessors.filter((x) => x.key === 'type'),
    //   );
    // }
    return selectedKeys;
  };
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
  // TODO: show this instead of supposing that the default URL is good? "Please configure the block's ElasticSearch URL in the sidebar."
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

  // searchkit.setQueryProcessor((plainQueryObject) => {
  //   console.log('QUERY', plainQueryObject);
  //   // query.bool.must = [];
  //   return plainQueryObject;
  // });

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
                  {/* <ViewSwitcherToggle /> */}
                  {/* TODO: new sort options: Sorted ascending by publish date, Sorted ascending by added date */}
                  <SortingSelector
                    options={[
                      {
                        label: 'Sorted by relevance',
                        field: '_score',
                        order: 'desc',
                        defaultOption: true,
                      },
                      // {
                      //   label: 'Latest Modifications',
                      //   field: 'modified',
                      //   order: 'desc',
                      // },
                      // {
                      //   label: 'Earliest Modifications',
                      //   field: 'modified',
                      //   order: 'asc',
                      // },
                      {
                        label: 'Sorted by publish date',
                        field: 'published_on',
                        order: 'desc',
                      },
                      {
                        label: 'Sorted by added date',
                        field: 'created_at',
                        order: 'desc',
                      },
                    ]}
                  />
                </ActionBarRow>

                <ActionBarRow>
                  <GroupedSelectedFilters />
                  <ResetFilters />
                </ActionBarRow>

                <ActionBarRow>
                  <MenuFilter
                    showCount={true}
                    id="siteName"
                    title="By Site Name"
                    field="site.name"
                    listComponent={Tabs}
                  />
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
                itemComponent={BiogeographicalRegionOption}
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
                    // `d` is the local time
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
