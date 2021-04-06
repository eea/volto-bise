import React from 'react';
import withProps from 'decorate-component-with-props';

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
  Tabs,
  MenuFilter,
  CheckboxItemComponent,
  // ViewSwitcherToggle,
  // CheckboxItemList,
  // MenuFilter,
  // RangeFilter,
  // TermQuery,
  // InputFilter,
  // HierarchicalMenuFilter,
  // NumericRefinementListFilter,
  // TopBar,
  // FacetFilter,
} from 'searchkit';
// import { Icon } from '@plone/volto/components';
// import tableSVG from '@plone/volto/icons/table.svg';

import { ListItem } from './Tiles'; //GridItem, TableView
import './styles.less';

/**
 * Displays a Checkbox Option which, when it has no key (key "") it displays a default string
 * "(No Biogeograhical Region)".
 * @param {object} props
 */
const BiogeographicalRegionOption = (props) => {
  if (props.itemKey.length === 0) {
    return <CheckboxItemComponent {...props} label="(No Region)" />;
  }
  return <CheckboxItemComponent {...props} />;
};

// /**
//  * Returns the label associated to a data type
//  * @param {string} val
//  */
// const valueToLabel = (val) => {
//   const data = [
//     { label: 'Documents', value: 'document' },
//     { label: 'Links', value: 'link' },
//     { label: 'Web Pages', value: 'article' },
//     { label: 'Species Info', value: 'species' },
//     { label: 'Habitat Types Info', value: 'habitat' },
//     { label: 'Sites Info', value: 'site' },
//     { label: 'Protected Area', value: 'protected_area' }, // hidden
//   ];
//   return data.filter((x) => x.value === val)[0].label;
// };

/**
 * Displays a checkbox w/ a label that replaces the default data type string.
 * @param {object} props
 */
// const RefinementOption = (props) => {
//   return (
//     <div
//       role="checkbox"
//       onKeyPress={() => {}}
//       className={props.bemBlocks
//         .option()
//         .state({ selected: props.active })
//         .mix(props.bemBlocks.container('item'))}
//       tabIndex={0}
//       aria-checked={props.active}
//     >
//       <label style={{ flexGrow: 1 }}>
//         <input
//           type="checkbox"
//           onClick={(...args) => {
//             return props.onClick(...args);
//           }}
//           checked={props.active}
//           className="sk-item-list-option__checkbox"
//         />
//         <span className={props.bemBlocks.option('text')}>
//           {valueToLabel(props.label)}
//         </span>
//       </label>
//       {/* <div className={props.bemBlocks.option('count')}>{props.count}</div> */}
//     </div>
//   );
// };
//
// /**
//  * Before showing the data types' filter sort its options well and the default
//  * behavior is to all be checked (this is the same as when all are unchecked,
//  * because the implicit operator is OR).
//  * @param {object} props
//  */
// const RefinementList = (props) => {
//   console.log('props.items', props.items);
//
//   const data = [
//     { order: 1, key: 'document' },
//     { order: 2, key: 'link' },
//     { order: 3, key: 'article' },
//     { order: 4, key: 'species' },
//     { order: 5, key: 'habitat' },
//     { order: 6, key: 'site' },
//     { order: 7, key: 'protected_area' }, // hidden
//   ];
//
//   let arr = [...props.items];
//   arr = arr.filter((x) => x.key !== 'protected_area');
//   arr = arr.sort((a, b) => {
//     console.log('A', a.key, 'B', b.key);
//
//     const ai = data.findIndex((x) => x.key === a.key);
//     const bi = data.findIndex((x) => x.key === b.key);
//     if (ai < 0 || isNaN(ai) || bi < 0 || isNaN(bi)) {
//       return 0;
//     }
//
//     return data[ai].order - data[bi].order;
//   });
//
//   let selection = [];
//   console.log('props.selectedItems', props.selectedItems);
//   if (Array.isArray(props.selectedItems)) {
//     const allKeys = arr.map((x) => x.key);
//     const activeCount = props.selectedItems.length;
//     let selectedItems = props.selectedItems.map((x) => x?.key);
//     if (activeCount === 0) {
//       selectedItems = allKeys;
//     } else {
//       selectedItems = props.selectedItems;
//       if (selectedItems.length === allKeys.length) {
//         selectedItems = [];
//
//         // TODO: do this in the selected filters view w/o reloading the page
//         const newLoc = window.location.href
//           .replace(/type\[\d+\]=[a-zA-Z0-9_]+/g, '')
//           .replace(/&&/g, '&')
//           .replace(/\?&/g, '?')
//           .replace(/[&?]$/, '');
//         if (newLoc !== window.location.href) {
//           window.location.href = newLoc;
//         }
//       }
//     }
//     selection = selectedItems;
//   }
//
//   return <CheckboxItemList {...props} items={arr} selectedItems={selection} />;
// };

const search_types = [
  // 'article',
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
  const url = data.es_host; //  || 'http://localhost:3000'
  const searchkit = React.useMemo(() => {
    return new SearchkitManager(url);
  }, [url]);

  React.useEffect(() => {
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
  }, [searchkit]);

  // searchkit.setQueryProcessor((plainQueryObject) => {
  //   console.log('QUERY', plainQueryObject);
  //   // query.bool.must = [];
  //   return plainQueryObject;
  // });

  // prefixQueryFields={[]}
  // queryOptions={{ analyzer: 'standard' }}

  return (
    <div>
      {url ? (
        <SearchkitProvider searchkit={searchkit}>
          <Layout>
            <LayoutBody>
              <LayoutResults>
                <SearchBox
                  autofocus={true}
                  searchOnChange={true}
                  // I am not sure if it is worth replacing the default value
                  // (_all) here, or what powers are best to give to each query
                  // field:
                  // queryFields={[
                  //   // 'title',
                  //   'name',
                  //   // 'query',
                  //   // 'scientific_name',
                  // ]}
                />
                <ActionBar>
                  <ActionBarRow>
                    <HitsStats
                      translations={{
                        'hitstats.results_found': '{hitCount} results found',
                      }}
                    />
                    {/* <ViewSwitcherToggle /> */}
                    <SortingSelector
                      options={[
                        { label: 'Relevance', field: '_score', order: 'desc' },
                        {
                          label: 'Latest',
                          field: 'published_on',
                          order: 'desc',
                        },
                        {
                          label: 'Earliest',
                          field: 'published_on',
                          order: 'asc',
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
                      exclude="BISE"
                    />
                  </ActionBarRow>
                </ActionBar>

                <ViewSwitcherHits
                  hitsPerPage={12}
                  sourceFilter={[]}
                  hitComponents={[
                    {
                      key: 'list',
                      title: 'List',
                      itemComponent: withProps(ListItem, {
                        data,
                      }),
                    },
                  ]}
                  scrollTo="body"
                />
                {/* We should get suggestions in NoHits component just for
                the 'title' field, and there are search results that do not
                have 'title' but 'name', 'query' or 'scientific_name', and
                because of this they are not displayed in the Hits component.
                Giving the alternative NoHits-s with 'suggestionsField' prop
                set to these other possible values, even though it is not
                displayed, it lets the search results appear in the Hits
                component for types that don't have the 'title' field. */}
                <NoHits suggestionsField="title" />

                <div style={{ display: 'none' }}>
                  <NoHits suggestionsField="name" />
                  {/* Uncommenting the following 2 lines breaks the search results
                  for 'Mediterranean gypsum scrubs' which should have as
                  first result's title, the same search string. */}
                  {/* <NoHits suggestionsField="query" /> */}
                  {/* <NoHits suggestionsField="scientific_name" /> */}
                </div>
                <Pagination showNumbers={true} />
              </LayoutResults>

              <SideBar>
                <h4>Filter results</h4>

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
              </SideBar>
            </LayoutBody>
          </Layout>
        </SearchkitProvider>
      ) : (
        'Please configure block ES url in sidebar'
      )}
    </div>
  );
};
export default DataCatalogueView;
/*

                <RefinementListFilter
                  id="type"
                  title="By Type"
                  field="_type"
                  size={10}
                  operator="OR"
                  // itemComponent={RefinementOption}
                  // listComponent={RefinementList}
                />

                <RefinementListFilter
                  id="bio_strategy"
                  title="By Biodiversity Strategy Targets"
                  field="targets.title"
                  size={4}
                />
                    // {
                    //   key: 'grid',
                    //   title: 'Grid',
                    //   itemComponent: withProps(GridItem, {
                    //     data,
                    //   }),
                    //   defaultOption: true,
                    // },
                    // {
                    //   key: 'table',
                    //   title: <Icon name={tableSVG} size="18px" />,
                    //   listComponent: withProps(TableView, {
                    //     data,
                    //   }),
                    // },
*/
