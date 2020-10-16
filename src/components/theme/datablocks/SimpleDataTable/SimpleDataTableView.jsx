import { Table } from 'semantic-ui-react';
import { compose } from 'redux';
import React from 'react';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import { serializeNodes } from 'volto-slate/editor/render';
import FormattedValue from './FormattedValue';
import { filterDataByParameters, connectToDataParameters } from '../utils';

import './styles.css';

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
  const selectedColumns =
    Array.isArray(columns) && columns.length > 0
      ? columns.filter((c) =>
          typeof c === 'string' ? null : providerColumns.includes(c?.column),
        )
      : providerColumns;

  const tableData = connected_data_parameters
    ? filterDataByParameters(provider_data, connected_data_parameters)
    : provider_data;

  return (
    <div className="simple-data-table">
      <div className={`${data.underline ? 'with-border' : ''}`}>
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
                {selectedColumns.map((coldef, j) => (
                  <Table.HeaderCell
                    key={getNameOfColumn(coldef)}
                    className={getAlignmentOfColumn(coldef, j)}
                  >
                    {getTitleOfColumn(coldef)}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
          ) : (
            ''
          )}
          <Table.Body>
            {Array(row_size)
              .fill()
              .map((_, i) => (
                <Table.Row key={i}>
                  {selectedColumns.map((coldef, j) => (
                    <Table.Cell
                      key={`${i}-${getNameOfColumn(coldef)}`}
                      textAlign={getAlignmentOfColumn(coldef, j)}
                    >
                      {typeof coldef === 'string' ? (
                        tableData[coldef]?.[i]
                      ) : (
                        <FormattedValue
                          textTemplate={coldef.textTemplate}
                          value={tableData[coldef.column]?.[i]}
                          specifier={coldef.specifier}
                        />
                      )}
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
