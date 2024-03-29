/* eslint-disable react/jsx-no-target-blank */
/**
 * Footer component.
 * @module components/theme/Footer/Footer
 */

import React from 'react';
import { Container, Segment, Grid } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import LogoImage from '@plone/volto/components/theme/Logo/Logo.svg';

import { LazyLoadImage } from 'react-lazy-load-image-component';

import ecLogo from '../../../../../static/ec.png';
import eeaLogo from '../../../../../static/eea.png';
import wiseLogo from '../../../../../static/wise.svg';
import fiseLogo from '../../../../../static/forest.svg';
import ccaLogo from '../../../../../static/climate_adapt.svg';

/**
 * Component to display the footer.
 * @function Footer
 * @param {Object} intl Intl object
 * @returns {string} Markup of the component
 */
const Footer = ({ intl }) => (
  <Segment role="contentinfo" vertical padded className="footerWrapper">
    <Container>
      <div className="footer-top-wrapper">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column mobile={16} tablet={10} computer={10}>
              <ul className="footer-nav" id="footer_links">
                <li>
                  <Link className="item" to="/">
                    <FormattedMessage id="home" defaultMessage="Home" />
                  </Link>
                </li>
                <li>
                  <a className="item" href={`mailto:bise@eea.europa.eu`}>
                    Contact
                  </a>
                </li>
                <li>
                  <Link className="item" to="/sitemap">
                    <FormattedMessage id="sitemap" defaultMessage="Sitemap" />
                  </Link>
                </li>
                <li>
                  <Link className="item" to="/legal-and-privacy-notice">
                    <FormattedMessage
                      id="legal_notice"
                      defaultMessage="Privacy and legal notice"
                    />
                  </Link>
                </li>
              </ul>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={2} computer={2}>
              <img
                className="bise-footer"
                src={LogoImage}
                alt="BISE"
                height={50}
                width={150}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>

      <div className="site-info">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column
              mobile={16}
              tablet={16}
              computer={5}
              className="information"
            >
              <div>
                <p>
                  The Biodiversity information system for Europe is a
                  partnership between <br /> the{' '}
                  <a
                    href="https://ec.europa.eu/"
                    target="_blank"
                    rel="noopener"
                  >
                    European Commission
                  </a>{' '}
                  and the{' '}
                  <a
                    href="https://www.eea.europa.eu/"
                    target="_blank"
                    rel="noopener"
                  >
                    European Environment Agency.
                  </a>
                </p>{' '}
              </div>
              <div className="site-info-logos">
                <a href="https://ec.europa.eu/">
                  <LazyLoadImage
                    className="footerLogo"
                    src={ecLogo}
                    title="European Commission"
                    alt="European Commission"
                  />
                </a>
                <a href="https://www.eea.europa.eu/">
                  <LazyLoadImage
                    className="footerLogo"
                    src={eeaLogo}
                    title="European Environment Agency"
                    alt="European Environment Agency"
                  />
                </a>
              </div>
            </Grid.Column>

            <Grid.Column
              mobile={16}
              tablet={16}
              computer={7}
              className="other-information"
            >
              <div>
                <p>Other European Information Systems</p>
              </div>
              <div className="footerLogos">
                <a href="https://water.europa.eu/">
                  <LazyLoadImage
                    className="footerLogo"
                    src={wiseLogo}
                    title="Water Information System for Europe"
                    alt="Water Information System for Europe"
                  />
                </a>
                <a href="https://forest.eea.europa.eu/">
                  <LazyLoadImage
                    className="footerLogo"
                    src={fiseLogo}
                    title="Forest Information System for Europe"
                    alt="Forest Information System for Europe"
                  />
                </a>
                <a href="https://climate-adapt.eea.europa.eu/">
                  <LazyLoadImage
                    className="footerLogo"
                    src={ccaLogo}
                    title="Climate-Adapt"
                    alt="Climate-Adapt"
                  />
                </a>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    </Container>
  </Segment>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Footer.propTypes = {
  /**
   * i18n object
   */
};

export default injectIntl(Footer);
