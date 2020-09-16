import React from 'react';
import { loadModules } from 'esri-loader';

const MODULES = [
  'esri/Map',
  'esri/views/MapView',
  'esri/widgets/Home',
  'esri/layers/MapImageLayer',
  'esri/geometry/Extent',
  'esri/views/layers/support/FeatureFilter',
  'esri/layers/FeatureLayer',
];

export default (props) => {
  const options = {
    css: true,
  };
  const [modules, setModules] = React.useState({});
  const loaded = React.useRef(false);

  React.useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      loadModules(MODULES, options).then((modules) => {
        const [
          Map,
          MapView,
          Home,
          MapImageLayer,
          Extent,
          FeatureFilter,
          FeatureLayer,
        ] = modules;
        setModules({
          Map,
          MapView,
          Home,
          MapImageLayer,
          Extent,
          FeatureFilter,
          FeatureLayer,
        });
      });
    }
  }, [modules, setModules, options]);

  // console.log(modules);
  return <div>Webmap</div>;
};
