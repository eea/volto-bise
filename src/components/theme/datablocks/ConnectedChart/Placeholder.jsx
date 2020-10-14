import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';

export const Placeholder = ({ children, ...rest }) => {
  const nodeRef = React.useRef();
  const sizeRef = React.useRef({});

  React.useLayoutEffect(() => {
    if (nodeRef.current) {
      setTimeout(() => {
        const height = nodeRef.current?.el?.clientHeight;
        const width = nodeRef.current?.el?.clientWidth;
        if (height && width) {
          const size = {
            height: `${height}px`,
            width: `${width}px`,
          };
          sizeRef.current = size;
        }
      }, 500);
    }
  });

  return (
    <VisibilitySensor {...rest}>
      {({ isVisible }) => {
        if (isVisible) {
          return children?.({ nodeRef });
        }
        return <div style={sizeRef?.current}>&times;</div>;
      }}
    </VisibilitySensor>
  );
};

export default Placeholder;
