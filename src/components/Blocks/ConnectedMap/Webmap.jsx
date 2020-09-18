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

export const filterToWhereParams = (map_filters) => {
  //  `Country_co = 'DK'`
  let acc = '';
  Object.keys(map_filters).forEach((name) => {
    if (map_filters[name]) {
      if (acc) acc += ' AND ';
      acc += `${name} = '${map_filters[name]}' `;
    }
  });

  return acc;
};

export default (props) => {
  const { map_filters, map_service_url, layer, base_layer } = props;
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
        const [Map, MapView, FeatureLayer] = modules;
        setModules({
          Map,
          MapView,
          FeatureLayer,
        });
      });
    }
  }, [setModules, options]);

  const layer_url = `${map_service_url}/${layer}`;
  const [currentView, setCurrentView] = React.useState();
  const [currentLayerView, setCurrentLayerView] = React.useState();

  React.useEffect(() => {
    if (currentLayerView) return;
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
    setCurrentView(view);
    view.whenLayerView(layer).then((layerView) => {
      console.log('make current', layerView);
      layerView.watch('updating', (val) => {
        layerView.queryExtent().then((results) => {
          console.log('go to extent', results.extent);
          view.goTo(results.extent);
        });
      });
      if (map_filters) {
        const where = filterToWhereParams(map_filters);
        console.log('where', where);
        layerView.filter = {
          where,
        };
      }
      setCurrentLayerView(layerView);
    });
  }, [modules, layer_url, base_layer, map_filters, currentLayerView]);

  React.useEffect(() => {
    if (map_filters && currentLayerView) {
      const where = filterToWhereParams(map_filters);
      console.log('where', where);
      currentLayerView.filter = {
        where,
      };

      currentLayerView.watch('updating', (val) => {
        currentLayerView.queryExtent().then((results) => {
          console.log('go to extent', results.extent);
          currentView.goTo(results.extent);
        });
      });
    }
  }, [map_filters, currentLayerView, currentView]);

  return <div ref={mapRef} className="esri-map"></div>;
};
