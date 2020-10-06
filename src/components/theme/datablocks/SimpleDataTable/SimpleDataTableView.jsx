import { Table } from 'semantic-ui-react';
import React from 'react';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import { serializeNodes } from 'volto-slate/editor/render';

const SimpleDataTableView = (props) => {
  const { data = {}, provider_data = {} } = props;
  const { show_header, description, max_count } = data;

  // TODO: sorting
  const row_size = Math.min(
    max_count
      ? typeof max_count !== 'number'
        ? parseInt(max_count)
        : max_count
      : max_count,
    provider_data && provider_data[Object.keys(provider_data)[0]]?.length,
  );

  const columns = Object.keys(provider_data || {});

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
                {columns.map((name) => (
                  <Table.HeaderCell key={name}>{name}</Table.HeaderCell>
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
                  {Object.keys(provider_data).map((k, j) => (
                    <Table.Cell
                      key={`${i}-${k}`}
                      textAlign={j === 0 ? 'left' : 'right'}
                    >
                      {provider_data[k][i]}
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

export default connectBlockToProviderData(SimpleDataTableView);