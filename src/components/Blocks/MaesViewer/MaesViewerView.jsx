import React from 'react';
import cx from 'classnames';

const View = ({ data }) => {
  return (
    <div
      className={cx(
        'block align',
        {
          center: !Boolean(data.align),
        },
        data.align,
      )}
    >
      <div
        className={cx({
          'full-width': data.align === 'full',
        })}
      >
        <div className="block-wrapper">{JSON.stringify(data)}</div>
      </div>
    </div>
  );
};

export default View;
