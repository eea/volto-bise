/**
 * ColorScalePicker component.
 * @module components/theme/datablocks/ConnectedChart/ColorScalePickerWidget
 */

import { FormFieldWrapper } from '@plone/volto/components';
import PropTypes from 'prop-types';
import React from 'react';
import Loadable from 'react-loadable';
// import { Input } from 'semantic-ui-react';
// import { ColorscalePicker } from 'react-colorscales';

const LoadableColorscalePicker = Loadable({
  loader: () => import('react-colorscales'),
  loading: () => <div>Loading...</div>,
  // render(loaded, props) {
  //   let Component = loaded.ColorscalePicker;
  //   return <Component {...props} />;
  // },
});

/**
 * ColorScalePickerWidget component class.
 * @returns {string} Markup of the component.
 */
const ColorScalePickerWidget = ({
  id,
  title,
  required,
  description,
  error,
  value,
  onChange,
  onBlur,
  onClick,
  fieldSet,
  wrapped,
  minLength,
  maxLength,
}) => (
  <FormFieldWrapper
    id={id}
    title={title}
    description={description}
    required={required}
    error={error}
    fieldSet={fieldSet}
    wrapped={wrapped}
  >
    {__CLIENT__ && (
      <LoadableColorscalePicker
        id={`field-${id}`}
        name={id}
        colorscale={value}
        onChange={(colorScale) => {
          onChange(id, colorScale);
        }}
      />
    )}
  </FormFieldWrapper>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
ColorScalePickerWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  wrapped: PropTypes.bool,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
ColorScalePickerWidget.defaultProps = {
  description: null,
  required: false,
  error: [],
  value: [],
  onChange: () => {},
  onBlur: () => {},
  onClick: () => {},
  minLength: null,
  maxLength: null,
};

export default ColorScalePickerWidget;
