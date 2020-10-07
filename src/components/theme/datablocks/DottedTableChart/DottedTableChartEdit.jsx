import React from 'react';
import { SidebarPortal } from '@plone/volto/components'; // EditBlock
import InlineForm from '@plone/volto/components/manage/Form/InlineForm';
import { connectBlockToProviderData } from 'volto-datablocks/hocs';
import DottedTableChartView from './DottedTableChartView';
import { DottedTableChartSchema } from './schema';

/**
 * Integer GCD.
 * @param {number} a
 * @param {number} b
 */
const gcdNormal = (a, b) => {
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
};

/**
 * Integer LCM.
 * @param {number} a
 * @param {number} b
 */
const lcm = (a, b) => {
  return Math.abs(a * b) / gcdNormal(a, b);
};

/**
 * Rounds a floating point number to be used in the DottedTableChartEdit.
 * @example e.g. 1.2389 to 1.2.
 * @param {number} a
 */
const round = (a) => {
  // return Math.round(a * 100) / 100;
  return Math.round((a + Number.EPSILON) * 10) / 10;
};

/**
 * Returns the GCD of two floating point numbers.
 * @param {number} a
 * @param {number} b
 */
const gcd = (a, b) => {
  // We are using this round function everywhere to not get unrounded results at
  // any step.
  a = round(a);
  b = round(b);

  // If the numbers are integers we can compute their GCD in the normal, more
  // efficient way.
  const hasDa = Math.floor(a) !== a; // whether a has fractional digits
  const hasDb = Math.floor(b) !== b; // whether b has fractional digits

  if (!hasDa && !hasDb) {
    return gcdNormal(a, b);
  }

  // Else, make fractions from the two numbers.
  // The result we want is (GCD(a1, b1) / LCM(a2, b2)) where a1/a2 is equal to
  // the a number, and b1/b2 is equal to the b number.
  let x = a, // will be the number over the fraction line of a
    da, // will temporarily be the number of decimal places used by a
    db, // will temporarily be the number of decimal places used by b
    y = b; // will be the number over the fraction line of b

  if (hasDa) {
    da = a.toString().split('.')[1].length; // the number of decimal places used by a
  } else {
    da = 0;
  }

  if (hasDb) {
    db = b.toString().split('.')[1].length; // the number of decimal places used by b
  } else {
    db = 0;
  }

  // We multiply x and y with a common number to compute the GCD easier.
  if (da > db) {
    db = da;
  }
  if (db > da) {
    da = db;
  }

  // The number over the fraction line of a:
  x = round(a * Math.pow(10, da));
  // The number over the fraction line of b:
  y = round(b * Math.pow(10, db));

  // Using the formula: (GCD(a1, b1) / LCM(a2, b2))
  const g = round(gcdNormal(x, y));
  const l = round(lcm(Math.pow(10, da), Math.pow(10, db)));
  const rv = g / l;

  return rv;
};

class DottedTableChartEdit extends React.Component {
  getSchema = () => {
    const provider_data = this.props.provider_data || {};
    const schema = DottedTableChartSchema();

    const choices = Object.keys(provider_data)
      .sort()
      .map((n) => [n, n]);

    ['column_data', 'row_data', 'size_data'].forEach(
      (n) => (schema.properties[n].choices = choices),
    );

    const { row_data } = this.props.data;
    const possible_rows = Array.from(new Set(provider_data?.[row_data])).sort();

    schema.properties.row_colors.options = possible_rows.map((r) => ({
      id: r,
      title: r,
    }));

    const defaultDotValue = this.getDefaultDotValue();
    if (defaultDotValue) {
      schema.properties.dot_value.description = `Recommended value: ${defaultDotValue}`;
    } else {
      schema.properties.dot_value.description = '';
    }

    return schema;
  };

  getDataTree = () => {
    const { data, provider_data } = this.props;
    const { column_data, row_data, size_data } = data;

    const res = {};
    (provider_data?.[column_data] || []).forEach((cv, i) => {
      res[cv] = {
        ...res[cv],
        [provider_data?.[row_data]?.[i]]: provider_data?.[size_data]?.[i],
      };
    });
    return res;
  };

  getDefaultDotValue = () => {
    const { data, provider_data } = this.props;
    const { column_data, row_data } = data;

    const possible_columns = Array.from(
      new Set(provider_data?.[column_data]),
    ).sort();
    const possible_rows = Array.from(new Set(provider_data?.[row_data])).sort();

    const data_tree = this.getDataTree();

    if (
      possible_columns.length === 0 ||
      possible_rows.length === 0 ||
      typeof data_tree[possible_columns[0]][possible_rows[0]] !== 'string'
    ) {
      return null;
    }

    let auto_dot_value = -1;
    // This loop can be optimized by calculating the GCD only once with multiple
    // parameters.
    possible_columns.forEach((x) => {
      possible_rows.forEach((y) => {
        if (typeof data_tree[x][y] === 'string') {
          const num = parseFloat(data_tree[x][y]);
          if (auto_dot_value < 0) {
            auto_dot_value = num;
          } else {
            auto_dot_value = gcd(auto_dot_value, num);
          }
        }
      });
    });

    return auto_dot_value;
  };

  render() {
    const { block, data, selected, onChangeBlock } = this.props;

    const schema = this.getSchema();

    return (
      <div className="block">
        <div className="block-inner-wrapper" />

        <DottedTableChartView {...this.props} />

        <SidebarPortal selected={selected}>
          <InlineForm
            schema={schema}
            title={schema.title}
            onChangeField={(id, value) => {
              onChangeBlock(block, {
                ...data,
                [id]: value,
              });
            }}
            formData={data}
          />
        </SidebarPortal>
      </div>
    );
  }
}

export default connectBlockToProviderData(DottedTableChartEdit);
