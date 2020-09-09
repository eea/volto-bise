import React from 'react';
import cx from 'classnames';
import ConnectedChart from './ConnectedChart';

const ConnectedChartBlockView = (props) => {
  const { data = {}, barColors } = props;
  return (
    <div className={cx('block align', data.align)}>
      <div
        className={cx({
          'full-width': data.align === 'full',
        })}
      >
        <ConnectedChart data={data} barColors={barColors} />
      </div>
    </div>
  );
};

export default ConnectedChartBlockView;
