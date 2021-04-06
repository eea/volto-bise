import React from 'react';
import { loadModules } from 'esri-loader';
import './styles.css';

const MODULES = [
  'esri/Map',
  'esri/views/MapView',
  'esri/layers/FeatureLayer',
  'esri/layers/MapImageLayer',
  // 'esri/widgets/Home',
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
  const [mapIsUpdating, setMapIsUpdating] = React.useState(false);
  const modules_loaded = React.useRef(false);

  // Load the ESRI JS API
  React.useEffect(() => {
    if (!modules_loaded.current) {
      modules_loaded.current = true;
      loadModules(MODULES, options).then((modules) => {
        const [Map, MapView, FeatureLayer, MapImageLayer] = modules;
        setModules({
          Map,
          MapView,
          FeatureLayer,
          MapImageLayer,
        });
      });
    }
  }, [setModules, options]);

  const layer_url = layer ? `${map_service_url}/${layer}` : null;

  const initial_map_filter_query = React.useRef(
    map_filters ? filterToWhereParams(map_filters) : null,
  );

  const esri = React.useMemo(() => {
    const { Map, MapView, FeatureLayer } = modules;

    if (!(FeatureLayer && layer_url)) return {};

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
      layerView.watch('updating', (val) => {
        setMapIsUpdating(true);
        layerView.queryExtent().then((results) => {
          if (results.count > 0) {
            setMapIsUpdating(false);
            view.goTo(results.extent);
          }
        });
      });
      if (initial_map_filter_query.current) {
        layerView.filter = {
          where: initial_map_filter_query.current,
        };
      }
    });

    return { view, map, layer };
  }, [modules, base_layer, layer_url]);

  const currentLayerView = esri.view?.layerViews?.items?.[0];
  React.useEffect(() => {
    if (!currentLayerView) return;

    if (currentLayerView && map_filters) {
      currentLayerView.filter = {
        where: filterToWhereParams(map_filters),
      };
    }
  }, [currentLayerView, layer, map_filters]);

  return (
    <div>
      <div>{mapIsUpdating ? 'Waiting for map server...' : ''}</div>
      <div ref={mapRef} className="esri-map"></div>
    </div>
  );
};
