import React from 'react';
import { getBlockData } from 'volto-bise/actions';
import { useDispatch, useSelector } from 'react-redux';
import { getBaseUrl } from '@plone/volto/helpers';

const withBlockData = (WrappedComponent) => (props) => {
  const { id } = props;
  const dispatch = useDispatch();
  const blockData = useSelector((state) => state.blockdata[id]);
  const pathname = useSelector((state) => state.router.location.pathname);

  React.useEffect(() => {
    if (!blockData) {
      dispatch(getBlockData(getBaseUrl(pathname), id)); // || blockData.error
    }
  }, [blockData, dispatch, id, pathname]);

  // console.log('data', blockData, props.data);
  return <WrappedComponent {...props} data={blockData?.data || props.data} />;
};

export default withBlockData;
