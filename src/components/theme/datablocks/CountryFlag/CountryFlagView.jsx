import React from 'react';
import flags from './load-flags';
import countryNames from './data/countries.json';
import './styles.less';

const CountryFlagView = ({ data = {} }) => {
  const { country_name, render_as, show_name, show_flag } = data;
  const Tag = render_as ? render_as.toLowerCase() : 'h2';
  return (
    <div className="country-flag">
      {!country_name ? (
        'no country'
      ) : show_flag ? (
        <img
          alt={countryNames[country_name]}
          src={flags[country_name.toLowerCase()]}
        />
      ) : (
        ''
      )}
      {country_name && show_name ? <Tag>{countryNames[country_name]}</Tag> : ''}
    </div>
  );
};
export default CountryFlagView;
