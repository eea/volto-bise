import React from 'react';
import { Table } from 'semantic-ui-react';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import { serializeNodes } from 'volto-slate/editor/render';
import './styles.less';

const DottedTableChartView = (props) => {
  const { data, provider_data } = props;
  const {
    description,
    column_data,
    row_data,
    size_data,
    dot_value,
    row_colors = {},
  } = data;

  const possible_columns = Array.from(
    new Set(provider_data?.[column_data]),
  ).sort();
  const possible_rows = Array.from(new Set(provider_data?.[row_data])).sort();

  const data_tree = React.useMemo(() => {
    const res = {};
    (provider_data?.[column_data] || []).forEach((cv, i) => {
      res[cv] = {
        ...res[cv],
        [provider_data?.[row_data]?.[i]]: provider_data?.[size_data]?.[i],
      };
    });
    return res;
  }, [column_data, provider_data, row_data, size_data]);

  const renderDots = (value, color) => {
    const dotValue = parseFloat(dot_value);
    const val = parseFloat(value);
    const arraySize = Math.ceil(Math.max(val / dotValue, 1));

    return (
      <div className="dot-cells">
        {val && dotValue && Math.floor(val / dotValue)
          ? new Array(arraySize)
              .fill(1)
              .map((_, i) => (
                <div key={i} style={{ backgroundColor: color }}></div>
              ))
          : ''}
      </div>
    );
  };

  return (
    <div className="dotted-table-chart">
      <div className={`${data.underline ? 'with-border' : ''}`}>
        {description ? serializeNodes(description) : ''}
      </div>
      <div className="inner">
        {!!provider_data && column_data && row_data && size_data ? (
          <Table
            textAlign="left"
            striped={data.striped}
            className={`${data.bordered ? 'no-borders' : ''}
    ${data.compact_table ? 'compact-table' : ''}`}
          >
            <Table.Header>
              <Table.Row>
                <Table.Cell key="first-cell"></Table.Cell>
                {possible_columns.map((v, y) => (
                  <Table.HeaderCell key={`${v}-${y}`}>{v}</Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {possible_rows.map((row, i) => (
                <Table.Row key={`${row}-${i}`}>
                  <Table.HeaderCell key="first-cell">{row}</Table.HeaderCell>
                  {possible_columns.map((col, y) => (
                    <Table.Cell verticalAlign="top" key={`${col}-${y}`}>
                      {renderDots(data_tree[col][row], row_colors?.[row])}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default connectBlockToProviderData(DottedTableChartView);
