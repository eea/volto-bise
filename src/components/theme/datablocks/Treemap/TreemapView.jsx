import React from 'react';
import Treemap from './Treemap';
import { withBlockData } from 'volto-bise/hocs';

const TreemapView = (props) => {
  const { data = {} } = props;
  return <Treemap data={data} />;
};

export default React.memo(withBlockData(TreemapView));
