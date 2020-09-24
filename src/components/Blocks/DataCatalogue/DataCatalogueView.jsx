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
  console.log('VAL', val);
  return data.filter((x) => x.value === val)[0].label;
};

const DataTypeListFilter = ({ id, title, field, size, onChange }) => {
  const data = React.useMemo(() => {
    return [
      { label: 'Documents', value: 'document' },
      { label: 'Links', value: 'link' },
      { label: 'Web Pages', value: 'article' },
      { label: 'Species Info', value: 'species' },
      { label: 'Habitat Types Info', value: 'habitat' },
      { label: 'Sites Info', value: 'site' },
    ];
  }, []);

  const [checkedValues, setCheckedValues] = React.useState([]);

  const handleClick = React.useCallback(
    (value, checked) => {
      let changedData;
      if (checked) {
        changedData = [...checkedValues.concat(value)];
      } else {
        changedData = [
          ...checkedValues.filter((x) => {
            return x !== value;
          }),
        ];
      }
      setCheckedValues(changedData);
      onChange(changedData);
    },
    [checkedValues, onChange],
  );

  return (
    <div className="data-type-list-filter-box">
      <strong>{title}</strong>
      <ul>
        {data.map((d) => {
          return (
            <li>
              <p>
                <label role="presentation">
                  <input
                    type="checkbox"
                    value={d.value}
                    onClick={(ev) => {
                      handleClick(d.value, ev.target.checked);
                    }}
                  ></input>
                  {d.label}
                </label>
              </p>
            </li>
          );
        })}
      </ul>
      {JSON.stringify(checkedValues)}
    </div>
  );
};

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

const search_types = [
  'article',
  'document',
  'link',
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
  // const [selectedDataTypes, setSelectedDataTypes] = React.useState(
  //   search_types,
  // );

  // const searchkit = new SearchkitManager("/")
  searchkit.addDefaultQuery((query) => {
    return query.addQuery(
      FilteredQuery({
        filter: BoolShould([
          TermsQuery('_type', search_types /* selectedDataTypes */),
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

              {/* <DataTypeListFilter
                id="type"
                title="By type"
                field="_type"
                size={4}
                onChange={(vals) => {
                  setSelectedDataTypes(vals);
                }}
              ></DataTypeListFilter> */}

              <RefinementListFilter
                id="type"
                title="By type"
                field="_type"
                size={10}
                operator="OR"
                itemComponent={RefinementOption}
              />

              <RefinementListFilter
                id="countries"
                title="By country"
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
