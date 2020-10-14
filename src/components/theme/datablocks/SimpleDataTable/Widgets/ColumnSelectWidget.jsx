import SelectWidget from './SelectWidget';
import { connect } from 'react-redux';

export default connect((state, props) => {
  const map_service_url = props.objectvalue?.map_service_url;
  if (!map_service_url) return [];

  const { data } = state.content.subrequests?.[map_service_url] || {};
  if (!data) return [];

  const { layers = [] } = data;
  const choices = layers.map((l) => [
    { ...l, title: l.name, token: l.id.toString() },
    l.name,
  ]);

  return {
    choices,
  };
}, null)(SelectWidget);
