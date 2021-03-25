/**
 * View title block.
 * @module components/manage/Blocks/Title/View
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * View title block class.
 * @class View
 * @extends Component
 */

const View = ({ id, properties, data }) => {
  return (
    <>
      {properties.image
        ? ''
        : [
            !data.hide_title ? (
              <h1 key={`header-${id}`} className="documentFirstHeading">
                {properties.title}
              </h1>
            ) : (
              ''
            ),
          ]}
    </>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  properties: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default View;
