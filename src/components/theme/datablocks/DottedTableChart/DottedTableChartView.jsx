import React from 'react';
import { Popup, Table } from 'semantic-ui-react';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import { filterDataByParameters, connectToDataParameters } from '../utils';
import { compose } from 'redux';
import { serializeNodes } from 'volto-slate/editor/render';
import FormattedValue from '../FormattedValue';
import { DEFAULT_MAX_DOT_COUNT } from './constants';
import './styles.less';

const DottedTableChartView = (props) => {
  const { data, provider_data, connected_data_parameters } = props;

  const filteredData =
    filterDataByParameters(provider_data, connected_data_parameters) || {};

  const {
    description,
    column_data,
    row_data,
    size_data,
    row_colors = {},
    text_template,
    specifier,
  } = data;

  const possible_columns = Array.from(
    new Set(filteredData?.[column_data]),
  ).sort();
  const possible_rows = Array.from(new Set(filteredData?.[row_data])).sort();

  const data_tree = React.useMemo(() => {
    const res = {};
    (filteredData?.[column_data] || []).forEach((cv, i) => {
      res[cv] = {
        ...res[cv],
        [filteredData?.[row_data]?.[i]]: filteredData?.[size_data]?.[i],
      };
    });
    return res;
  }, [column_data, filteredData, row_data, size_data]);

  // stores the last computed dot size
  const dotSizeRef = React.useRef();

  const getDotsCountForValue = React.useCallback((val) => {
    if (typeof val === 'string') {
      val = parseFloat(val);
    }
    return val / dotSizeRef.current;
  }, []);

  const renderDots = (value, color) => {
    const dotValue = (dotSizeRef.current = getDotSize());
    const val = parseFloat(value);
    const arraySize = Math.ceil(
      Math.max(getDotsCountForValue(val) / dotSizeRef.current, 1),
    );

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

  const getMaxValue = React.useCallback(() => {
    let max = 0;
    // This loop can be optimized.
    possible_columns.forEach((x) => {
      possible_rows.forEach((y) => {
        if (typeof data_tree[x][y] === 'string') {
          const num = parseFloat(data_tree[x][y]);
          max = Math.max(max, num);
        }
      });
    });
    return max;
  }, [possible_columns, possible_rows, data_tree]);

  /**
   * Computes a dot size for the user's max_dot_count piece of information
   * and uses, as a fallback, the old dot_value field's value.
   */
  const getDotSize = React.useCallback(() => {
    if (
      possible_columns.length === 0 ||
      possible_rows.length === 0 ||
      typeof data_tree[possible_columns[0]][possible_rows[0]] !== 'string'
    ) {
      return null;
    }

    if (!data.max_dot_count) {
      return getMaxValue() / DEFAULT_MAX_DOT_COUNT;
    }

    return getMaxValue() / data.max_dot_count;
  }, [
    possible_columns,
    possible_rows,
    data_tree,
    data.max_dot_count,
    getMaxValue,
  ]);

  return (
    <div className="dotted-table-chart">
      <div className={`${data.underline ? 'with-border' : ''}`}>
        {description ? serializeNodes(description) : ''}
      </div>
      <div className="inner">
        {!!filteredData && column_data && row_data && size_data ? (
          <Table
            textAlign="left"
            striped={data.striped}
            className={`unstackable ${data.bordered ? 'no-borders' : ''}
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
                  <Table.HeaderCell
                    key="first-cell"
                    style={{ color: row_colors?.[row] }}
                  >
                    {row}
                  </Table.HeaderCell>
                  {possible_columns.map((col, y) => (
                    <Table.Cell
                      verticalAlign="top"
                      key={`${col}-${y}`}
                      style={{
                        // hack from https://stackoverflow.com/a/3542470/258462
                        height: '1px',

                        padding: '0',
                      }}
                    >
                      <Popup
                        content={
                          // it might happen that the FormattedValue component returns empty string because of the input data
                          <>
                            Value:{' '}
                            <FormattedValue
                              textTemplate={text_template}
                              value={data_tree[col][row]}
                              specifier={specifier}
                            />
                          </>
                        }
                        trigger={
                          <div
                            style={{
                              // hack from https://stackoverflow.com/a/3542470/258462
                              height: '100%',

                              padding: '0.78571429em', // value taken from SUIR's collections/table.less (possibly needs to be changed if compact table style is implemented in DottedTableChartView)
                            }}
                          >
                            {renderDots(data_tree[col][row], row_colors?.[row])}
                          </div>
                        }
                      />
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

export default compose(
  connectBlockToProviderData,
  connectToDataParameters,
)(DottedTableChartView);
