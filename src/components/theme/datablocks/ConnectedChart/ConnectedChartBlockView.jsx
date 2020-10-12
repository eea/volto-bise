import React from 'react';
import ConnectedChart from './ConnectedChart';

const ConnectedChartBlockView = (props) => {
  const { data = {} } = props;
  return <ConnectedChart data={data} />;
};

export default ConnectedChartBlockView;
