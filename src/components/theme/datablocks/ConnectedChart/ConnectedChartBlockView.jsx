import React from 'react';
import cx from 'classnames';
import ConnectedChart from './ConnectedChart';

const ConnectedChartBlockView = (props) => {
  const {
    data = {},
    bar_colors,
    categorical_colorscale,
    categorical_axis,
  } = props;
  return (
    <div className={cx('block align', data.align)}>
      <div
        className={cx({
          'full-width': data.align === 'full',
        })}
      >
        <ConnectedChart
          data={data}
          bar_colors={bar_colors}
          categorical_colorscale={categorical_colorscale}
          categorical_axis={categorical_axis}
        />
      </div>
    </div>
  );
};

export default ConnectedChartBlockView;
