import React from 'react';
import { getBlockData } from 'volto-bise/actions';
import { useDispatch, useSelector } from 'react-redux';

const withBlockData = (WrappedComponent) => (props) => {
  const { id, path } = props;
  const dispatch = useDispatch();
  const blockData = useSelector((state) => state.blockdata[id]);

  React.useEffect(() => {
    if (!blockData) dispatch(getBlockData(path, id)); // || blockData.error
  }, [blockData, dispatch, id, path]);

  return <WrappedComponent {...props} data={blockData?.data || {}} />;
};

export default withBlockData;
