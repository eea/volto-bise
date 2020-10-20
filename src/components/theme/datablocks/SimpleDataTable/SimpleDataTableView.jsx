import { Table } from 'semantic-ui-react';
import { compose } from 'redux';
import React from 'react';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import { serializeNodes } from 'volto-slate/editor/render';
import FormattedValue from './FormattedValue';
import { filterDataByParameters, connectToDataParameters } from '../utils';

import './styles.less';

const getAlignmentOfColumn = (col, idx) => {
  return typeof col !== 'string' && col.textAlign
    ? col.textAlign
    : idx === 0
    ? 'left'
    : 'right';
};

const getNameOfColumn = (col) => {
  return typeof col === 'string' ? col : col.column;
};

const getTitleOfColumn = (col) => {
  return typeof col === 'string' ? col : col.title || getNameOfColumn(col);
};

const selectedColumnValidator = (allColDefs) => (colDef) => {
  return typeof colDef === 'string'
    ? false
    : allColDefs.includes(colDef?.column);
};

const getCellValue = (tableData, colDef, rowIndex) => {
  return typeof colDef === 'string' ? (
    tableData[colDef]?.[rowIndex]
  ) : (
    <FormattedValue
      textTemplate={colDef.textTemplate}
      value={tableData[colDef.column]?.[rowIndex]}
      specifier={colDef.specifier}
    />
  );
};

const SimpleDataTableView = (props) => {
  const { data = {}, provider_data = {}, connected_data_parameters } = props;
  const { show_header, description, max_count, columns } = data;

  // TODO: sorting
  const row_size = Math.min(
    max_count
      ? typeof max_count !== 'number'
        ? parseInt(max_count) || 5
        : max_count
      : max_count || 5,
    provider_data && provider_data[Object.keys(provider_data)[0]]?.length,
  );

  const providerColumns = Object.keys(provider_data || {});
  const sureToShowAllColumns = !Array.isArray(columns) || columns.length === 0;
  const validator = selectedColumnValidator(providerColumns);
  const selectedColumns = sureToShowAllColumns
    ? providerColumns
    : columns.filter(validator);

  const tableData = connected_data_parameters
    ? filterDataByParameters(provider_data, connected_data_parameters)
    : provider_data;

  return (
    <div className="simple-data-table">
      <div className={`table-title ${data.underline ? 'title-border' : ''}`}>
        {description ? serializeNodes(description) : ''}
      </div>
      {row_size ? (
        <Table
          textAlign="left"
          striped={data.striped}
          className={`${data.bordered ? 'no-borders' : ''}
          ${data.compact_table ? 'compact-table' : ''}`}
        >
          {show_header ? (
            <Table.Header>
              <Table.Row>
                {selectedColumns.map((colDef, j) => (
                  <Table.HeaderCell
                    key={getNameOfColumn(colDef)}
                    className={getAlignmentOfColumn(colDef, j)}
                  >
                    {getTitleOfColumn(colDef)}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
          ) : (
            ''
          )}
          <Table.Body>
            {row_size > 0 && Array(row_size)
              .fill()
              .map((_, i) => (
                <Table.Row key={i}>
                  {selectedColumns.map((colDef, j) => (
                    <Table.Cell
                      key={`${i}-${getNameOfColumn(colDef)}`}
                      textAlign={getAlignmentOfColumn(colDef, j)}
                    >
                      {getCellValue(tableData, colDef, i)}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
          </Table.Body>
        </Table>
      ) : (
        'No results'
      )}
    </div>
  );
};

export default compose(
  connectBlockToProviderData,
  connectToDataParameters,
)(SimpleDataTableView);
