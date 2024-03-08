/**
 * View image block.
 * @module components/manage/Blocks/Image/View
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';
import './style.less';

/**
 * View image block class.
 * @class View
 * @extends Component
 */
const View = ({ data, detached }) => (
  <div className="block-image wrapper">
    {data.title ? (
      <p
        className={cx('title', { 'has-color': !!data.titleColor })}
        style={{ ...(data.titleColor ? { color: data.titleColor } : {}) }}
      >
        {data.title}
      </p>
    ) : (
      ''
    )}
    <p
      className={cx(
        'block image align',
        {
          center: !Boolean(data.align),
          detached,
          'with-border': !!data.title || data.withBorder,
          'rounded-border': data.roundedBorder,
        },
        data.align,
      )}
    >
      {data.url && (
        <>
          {(() => {
            const image = (
              <img
                className={cx({
                  'full-width': data.align === 'full',
                  large: data.size === 'l',
                  medium: data.size === 'm',
                  small: data.size === 's',
                })}
                src={
                  isInternalURL(data.url)
                    ? // Backwards compat in the case that the block is storing the full server URL
                      (() => {
                        if (data.size === 'l')
                          return `${flattenToAppURL(data.url)}/@@images/image`;
                        if (data.size === 'm')
                          return `${flattenToAppURL(
                            data.url,
                          )}/@@images/image/preview`;
                        if (data.size === 's')
                          return `${flattenToAppURL(
                            data.url,
                          )}/@@images/image/mini`;
                        return `${flattenToAppURL(data.url)}/@@images/image`;
                      })()
                    : data.url
                }
                alt={data.alt || ''}
                loading="lazy"
              />
            );
            if (data.href) {
              if (!isInternalURL(data.href)) {
                return (
                  <a
                    target={data.openLinkInNewTab ? '_blank' : null}
                    href={data.href}
                    rel="noopener"
                  >
                    {image}
                  </a>
                );
              } else {
                return (
                  <Link
                    to={flattenToAppURL(data.href)}
                    target={data.openLinkInNewTab ? '_blank' : null}
                  >
                    {image}
                  </Link>
                );
              }
            } else {
              return image;
            }
          })()}
        </>
      )}
    </p>
  </div>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default View;
