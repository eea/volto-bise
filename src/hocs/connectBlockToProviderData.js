import React from 'react';
import { getDataFromProvider } from 'volto-datablocks/actions';
import { useDispatch, useSelector } from 'react-redux';

export function connectBlockToProviderData(WrappedComponent) {
  return (props) => {
    const dispatch = useDispatch();
    const { provider_url } = props.data;
    const provider_data = useSelector((state) => {
      const url = `${provider_url}/@connector-data`;
      return provider_url ? state.data_providers?.data?.[url] : null;
    });

    React.useEffect(() => {
      if (provider_url && !provider_data)
        dispatch(getDataFromProvider(provider_url));
    });
    return <WrappedComponent {...props} provider_data={provider_data} />;
  };
}

export default connectBlockToProviderData;
