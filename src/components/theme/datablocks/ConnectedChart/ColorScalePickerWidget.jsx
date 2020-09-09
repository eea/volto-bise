/**
 * ColorScalePicker component.
 * @module components/theme/datablocks/ConnectedChart/ColorScalePickerWidget
 */

import { FormFieldWrapper } from '@plone/volto/components';
import PropTypes from 'prop-types';
import React from 'react';
import Loadable from 'react-loadable';
import { Dropdown, Button } from 'semantic-ui-react';
import './style.less';

const LoadableColorscalePicker = Loadable({
  loader: () => import('react-colorscales'),
  loading: () => <></>,
});

const LoadableColorscale = Loadable({
  loader: () => import('react-colorscales'),
  loading: () => <></>,
  render: (loaded, props) => {
    const Component = loaded.Colorscale;
    return <Component {...props} />;
  },
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
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [selectedColorScale, setSelectedColorScale] = React.useState(value);

  return (
    <FormFieldWrapper
      id={id}
      title={title}
      description={description}
      required={required}
      error={error}
      fieldSet={fieldSet}
      wrapped={wrapped}
      className={`color-scale-picker-widget`}
    >
      <Dropdown
        open={dropdownOpen}
        onClose={() => {
          setDropdownOpen(false);
        }}
        trigger={
          <LoadableColorscale
            colorscale={selectedColorScale}
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
            }}
          />
        }
      >
        <Dropdown.Menu>
          {__CLIENT__ && (
            <LoadableColorscalePicker
              id={`field-${id}`}
              width={20} // not working
              scaleLength={5}
              name={id}
              colorscale={value}
              onChange={(colorScale) => {
                setSelectedColorScale(colorScale);
                onChange(id, colorScale);
              }}
            />
          )}
        </Dropdown.Menu>
      </Dropdown>
    </FormFieldWrapper>
  );
};

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
  value: [
    'rgb(166,206,227)',
    'rgb(31,120,180)',
    'rgb(178,223,138)',
    'rgb(51,160,44)',
    'rgb(251,154,153)',
    'rgb(227,26,28)',
    'rgb(160,26,51)',
    'rgb(227,178,223)',
    'rgb(31,227,28)',
    'rgb(227,120,180)',
  ],
  onChange: () => {},
  onBlur: () => {},
  onClick: () => {},
};

export default ColorScalePickerWidget;
