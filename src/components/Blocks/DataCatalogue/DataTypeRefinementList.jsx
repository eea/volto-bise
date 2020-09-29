import React from 'react';

import { SearchkitComponent, FacetAccessor, CheckboxItemList } from 'searchkit';

import _ from 'lodash';

import { DataTypesInformation } from './constants';

/**
 * Before showing the data types' filter sort its options well and the default
 * behavior is to all be checked (this is the same as when all are unchecked,
 * because the implicit operator is OR).
 */
export const RefinementList = class extends SearchkitComponent {
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

    // console.log('L1', this.props.selectedItems);
    this.refreshSelectedKeys(false).then(() => {
      console.log('L2', this.props.selectedItems);
      sk.performSearch(true, true).then(() => {
        // console.log('L3', this.props.selectedItems);
      });
    });

    return true;
  };

  refreshSelectedKeys = (shouldPerformSearch = true) => {
    return new Promise((resolve, reject) => {
      // this transforms [... full ...] into []
      const initialSelectedCount = this.props.selectedItems.length;
      const initialSelectedKeys = this.props.selectedItems.map((x) => x);
      // console.log('this.allKeys', this.allKeys);
      let selectedKeys = this.selectedItemsFilter(this.allKeys);

      // console.log('INITIAL', initialSelectedKeys, 'NOW', selectedKeys);

      this.setState(
        (state, props) => {
          return { selectedKeys: null };
        },
        () => {
          console.log('SETTING', selectedKeys);
          this.setState(
            (state, props) => ({ selectedKeys }),
            () => {
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
            },
          );
        },
      );
    });
  };

  render() {
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
      const ai = DataTypesInformation.findIndex((x) => x.value === a.key);
      const bi = DataTypesInformation.findIndex((x) => x.value === b.key);

      if (ai < 0 || isNaN(ai) || bi < 0 || isNaN(bi)) {
        return 0;
      }

      return DataTypesInformation[ai].order - DataTypesInformation[bi].order;
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
      console.log('===:', selectedCount, allKeys.length);
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
