import React from 'react';
import { loadModules } from 'esri-loader';
import './styles.css';

const MODULES = [
  'esri/Map',
  'esri/views/MapView',
  'esri/layers/FeatureLayer',
  // 'esri/widgets/Home',
  // 'esri/layers/MapImageLayer',
  // 'esri/geometry/Extent',
  // 'esri/views/layers/support/FeatureFilter',
];

export default (props) => {
  const { data } = props;
  const options = {
    css: true,
  };
  const mapRef = React.useRef();
  const [modules, setModules] = React.useState({});
  const loaded = React.useRef(false);

  React.useEffect(() => {
    if (!loaded.current) {
      loaded.current = true;
      loadModules(MODULES, options).then((modules) => {
        const [
          Map,
          MapView,
          FeatureLayer,
          // Home,
          // MapImageLayer,
          // Extent,
          // FeatureFilter,
        ] = modules;
        setModules({
          Map,
          MapView,
          FeatureLayer,
          // Home,
          // MapImageLayer,
          // Extent,
          // FeatureFilter,
        });
      });
    }
  }, [setModules, options]);

  const layer_url = `${data.map_service_url}/${data.layer}`;
  const { base_layer } = data;

  console.log(props.data);

  React.useEffect(() => {
    const { Map, MapView, FeatureLayer } = modules;
    if (!FeatureLayer) return;

    let layer = new FeatureLayer({
      url: layer_url,
    });
    const map = new Map({
      basemap: base_layer || 'hybrid',
      layers: [layer],
    });
    const view = new MapView({
      container: mapRef.current,
      map,
    });
    view.whenLayerView(layer).then((layerView) => {
      console.log('yes', layerView);
      layerView.filter = {
        where: `Country_co = '${data.f_Country_co}'`,
      };
    });
  }, [modules, layer_url, base_layer, data]);

  return <div ref={mapRef} className="esri-map"></div>;
};
