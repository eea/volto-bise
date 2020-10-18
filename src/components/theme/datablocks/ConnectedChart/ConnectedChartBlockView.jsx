import React from 'react';
import ConnectedChart from './ConnectedChart';
import { withBlockData } from 'volto-bise/hocs';

const ConnectedChartBlockView = (props) => {
  const { data = {} } = props;
  return <ConnectedChart data={data} />;
};

export default React.memo(withBlockData(ConnectedChartBlockView));
