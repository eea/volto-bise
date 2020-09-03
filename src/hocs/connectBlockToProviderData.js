import React from 'react';
import { getDataFromProvider } from 'volto-datablocks/actions';
import { useDispatch, useSelector } from 'react-redux';

export function connectBlockToProviderData(WrappedComponent) {
  return (props) => {
    console.log('HOC presentation component rendering');
    const dispatch = useDispatch();

    // the URL is always available
    const { provider_url } = props.data;

    // true or false, whether the data is being loaded or not (if it is not
    // loaded it is false, if it has been loading but it finished/stopped, it is
    // false)
    const isPending = useSelector((state) => {
      console.group('isPending selector');
      // the URL for getting whether the provider URL is pending is this (verified):
      const url = `${provider_url}`;
      const rv = provider_url
        ? state.data_providers?.pendingConnectors?.[url]
        : false;
      console.log('isPending', rv);
      console.groupEnd();
      return rv;
    });

    // this is the actual data, it is loaded well but multiple times
    const provider_data = useSelector((state) => {
      // the URL for getting the data is verified to be this:
      const url = `${provider_url}/@connector-data`;
      return provider_url ? state.data_providers?.data?.[url] : null;
    });

    React.useEffect(() => {
      console.group('effect');
      console.log('effect', { provider_url, provider_data, isPending });
      // if the URL is available, the data is loaded and it is not being loaded
      if (provider_url && !provider_data && !isPending) {
        console.log('effect running');
        // run the getDataFromProvider action (this should make isPending true,
        // but the reducer middleware does something wrong)
        dispatch(getDataFromProvider(provider_url));
      }
      console.groupEnd();
    });
    return <WrappedComponent {...props} provider_data={provider_data} />;
  };
}

export default connectBlockToProviderData;
