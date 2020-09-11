/**
 * ColorPicker component.
 * @module components/theme/datablocks/ConnectedChart/ColorPickerWidget
 */

import { FormFieldWrapper } from '@plone/volto/components';
import PropTypes from 'prop-types';
import React from 'react';
// import Loadable from 'react-loadable';
import { Dropdown, Button } from 'semantic-ui-react';
import { CirclePicker } from 'react-color';
import './style.less';

// const LoadableColorscalePicker = Loadable({
//   loader: () => import('react-colorscales'),
//   loading: () => <></>,
// });

// const LoadableColorscale = Loadable({
//   loader: () => import('react-colorscales'),
//   loading: () => <></>,
//   render: (loaded, props) => {
//     const Component = loaded.Colorscale;
//     return <Component {...props} />;
//   },
// });

/**
 * ColorPickerWidget component class.
 * @returns {string} Markup of the component.
 */
const ColorPickerWidget = ({
  id,
  title,
  required,
  description,
  error,
  value,
  defaultValue,
  onChange,
  onBlur,
  onClick,
  fieldSet,
  wrapped,
  colorscale,
}) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [selectedColor, setSelectedColor] = React.useState(
    defaultValue || '#00000000',
  );

  return (
    <FormFieldWrapper
      id={id}
      title={title}
      description={description}
      required={required}
      error={error}
      fieldSet={fieldSet}
      wrapped={wrapped}
      className={`color-picker-widget`}
    >
      <Dropdown
        open={dropdownOpen}
        onClose={() => {
          setDropdownOpen(false);
        }}
        // onMouseDown={(ev) => {
        //   ev.preventDefault();
        //   ev.stopPropagation();
        // }}
        trigger={
          <Button
            style={{
              backgroundColor: selectedColor,
              border: '0.1rem solid gray',
            }}
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
            }}
          />
        }
      >
        <Dropdown.Menu>
          {__CLIENT__ && (
            <CirclePicker
              id={`field-${id}`}
              // width={20} // not working
              // scaleLength={5}
              // name={id}
              color={value}
              onChange={(color) => {
                setSelectedColor(color);
                onChange(id, color);
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
ColorPickerWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onClick: PropTypes.func,
  wrapped: PropTypes.bool,
  colorscale: PropTypes.array,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
ColorPickerWidget.defaultProps = {
  description: null,
  required: false,
  error: [],
  value: '#00000000',
  onChange: () => {},
  onBlur: () => {},
  onClick: () => {},
  colorscale: null,
};

export default ColorPickerWidget;
