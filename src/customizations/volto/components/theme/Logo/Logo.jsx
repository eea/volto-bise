/**
 * Logo component.
 * @module components/theme/Logo/Logo
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';
import { Image } from 'semantic-ui-react';

import BISELogo from './Logo.svg';

const messages = defineMessages({
  site: {
    id: 'Site',
    defaultMessage: 'Site',
  },
  plonesite: {
    id: 'BISE Homepage',
    defaultMessage: 'BISE Homepage',
  },
});

/**
 * Logo component class.
 * @function Logo
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component.
 */
const Logo = ({ intl }) => (
  <Link to="/" title={intl.formatMessage(messages.site)}>
    <Image
      src={BISELogo}
      alt={intl.formatMessage(messages.plonesite)}
      title={intl.formatMessage(messages.plonesite)}
      height={64}
      width={192}
    />
  </Link>
);

export default injectIntl(Logo);
