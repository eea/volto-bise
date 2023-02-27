/**
 * Navigation components.
 * @module components/theme/Navigation/Navigation
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isMatch } from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';
import { Menu, Dropdown } from 'semantic-ui-react';
import cx from 'classnames';
import {
  getBaseUrl,
  flattenToAppURL,
  hasApiExpander,
} from '@plone/volto/helpers';
import { getNavigation } from '@plone/volto/actions';
import config from '@plone/volto/registry';
import { withLocalStorage } from '@eeacms/volto-n2k/hocs';

const messages = defineMessages({
  closeMobileMenu: {
    id: 'Close menu',
    defaultMessage: 'Close menu',
  },
  openMobileMenu: {
    id: 'Open menu',
    defaultMessage: 'Open menu',
  },
});

const dropdownBlacklist = ['/natura2000'];

/**
 * Navigation container class.
 * @class Navigation
 * @extends Component
 */
class Navigation extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    getNavigation: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string,
        url: PropTypes.string,
        items: PropTypes.array,
      }),
    ).isRequired,
  };

  static defaultProps = {
    token: null,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Navigation
   */
  constructor(props) {
    super(props);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.closeMobileMenu = this.closeMobileMenu.bind(this);
    this.state = {
      isMobileMenuOpen: false,
      n2kLanguage: this.props.localStorage.get('N2K_LANGUAGE'),
    };
    this.container = React.createRef();
  }

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  componentDidMount() {
    const { settings } = config;
    if (!hasApiExpander('navigation', getBaseUrl(this.props.pathname))) {
      this.props.getNavigation(
        getBaseUrl(this.props.pathname),
        settings.navDepth,
      );
    }
  }

  handleClickOutsideNav = (event) => {
    if (
      this.container.current &&
      !this.container.current.contains(event.target)
    ) {
      this.setState({
        isMobileMenuOpen: false,
      });
    }
  };

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { settings } = config;
    if (
      nextProps.pathname !== this.props.pathname ||
      nextProps.token !== this.props.token
    ) {
      if (!hasApiExpander('navigation', getBaseUrl(this.props.pathname))) {
        this.props.getNavigation(
          getBaseUrl(nextProps.pathname),
          settings.navDepth,
        );
      }
      this.closeMobileMenu();
    }

    // Hide submenu on route change
    if (document.querySelector('body')) {
      document.querySelector('body').click();
    }
  }

  /**
   * Check if menu is active
   * @method isActive
   * @param {string} url Url of the navigation item.
   * @returns {bool} Is menu active?
   */
  isActive(url) {
    return (
      (url === '' && this.props.pathname === '/') ||
      (url !== '' && isMatch(this.props.pathname.split('/'), url.split('/')))
    );
  }

  /**
   * Toggle mobile menu's open state
   * @method toggleMobileMenu
   * @returns {undefined}
   */
  toggleMobileMenu() {
    this.setState({ isMobileMenuOpen: !this.state.isMobileMenuOpen }, () => {
      if (this.state.isMobileMenuOpen) {
        document.addEventListener('mousedown', this.handleClickOutsideNav);
      }
    });
  }

  /**
   * Close mobile menu
   * @method closeMobileMenu
   * @returns {undefined}
   */
  closeMobileMenu() {
    if (!this.state.isMobileMenuOpen) {
      return;
    }
    this.setState({ isMobileMenuOpen: false }, () => {
      document.removeEventListener('mousedown', this.handleClickOutsideNav);
    });
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    return (
      <nav className="navigation" ref={this.container}>
        <div className="hamburger-wrapper mobile only">
          <button
            className={cx('hamburger hamburger--collapse', {
              'is-active': this.state.isMobileMenuOpen,
            })}
            aria-label={
              this.state.isMobileMenuOpen
                ? this.props.intl.formatMessage(messages.closeMobileMenu, {
                    type: this.props.type,
                  })
                : this.props.intl.formatMessage(messages.openMobileMenu, {
                    type: this.props.type,
                  })
            }
            title={
              this.state.isMobileMenuOpen
                ? this.props.intl.formatMessage(messages.closeMobileMenu, {
                    type: this.props.type,
                  })
                : this.props.intl.formatMessage(messages.openMobileMenu, {
                    type: this.props.type,
                  })
            }
            type="button"
            onClick={this.toggleMobileMenu}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner" />
            </span>
          </button>
        </div>
        <Menu
          stackable
          pointing
          secondary
          className={
            this.state.isMobileMenuOpen
              ? 'open'
              : 'tablet computer large screen widescreen only'
          }
          onClick={this.closeMobileMenu}
          onBlur={() => this.closeMobileMenu}
        >
          {this.props.items
            .filter((item) => !['/natura2000'].includes(item.url))
            .map((item) => {
              const flatUrl = flattenToAppURL(item.url);
              const itemID = item.title.split(' ').join('-').toLowerCase();
              return item.items &&
                item.items.length &&
                !dropdownBlacklist.includes(item.url) ? (
                <Dropdown
                  id={itemID}
                  className={
                    this.isActive(flatUrl)
                      ? 'item firstLevel menuActive'
                      : 'item firstLevel'
                  }
                  key={flatUrl}
                  trigger={
                    <Link to={flatUrl === '' ? '/' : flatUrl} key={flatUrl}>
                      {item.title}
                    </Link>
                  }
                  item
                  simple
                >
                  {item.title === 'Countries' ? (
                    <Dropdown.Menu>
                      <div className="submenu-wrapper">
                        <div className="submenu countries-submenu">
                          {item.items.map((subsubitem) => {
                            const flatSubSubUrl = flattenToAppURL(
                              subsubitem.url,
                            );
                            return (
                              <Link
                                to={flatSubSubUrl === '' ? '/' : flatSubSubUrl}
                                title={subsubitem.title}
                                key={flatSubSubUrl}
                                className={
                                  this.isActive(flatSubSubUrl)
                                    ? 'item thirdLevel menuActive'
                                    : 'item thirdLevel'
                                }
                              >
                                {subsubitem.title}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </Dropdown.Menu>
                  ) : (
                    <Dropdown.Menu>
                      {item.items.map((subitem) => {
                        const flatSubUrl = flattenToAppURL(subitem.url);
                        const subItemID = subitem.title
                          .split(' ')
                          .join('-')
                          .toLowerCase();
                        return (
                          <Dropdown.Item key={flatSubUrl}>
                            <div className="secondLevel-wrapper">
                              <Link
                                id={subItemID}
                                to={flatSubUrl === '' ? '/' : flatSubUrl}
                                key={flatSubUrl}
                                className={
                                  this.isActive(flatSubUrl)
                                    ? 'item secondLevel menuActive'
                                    : 'item secondLevel'
                                }
                              >
                                {subitem.title}
                              </Link>
                            </div>
                            {subitem.items && (
                              <div className="submenu-wrapper">
                                <div className="submenu">
                                  {subitem.items.map((subsubitem) => {
                                    const flatSubSubUrl = flattenToAppURL(
                                      subsubitem.url,
                                    );
                                    return (
                                      <Link
                                        to={
                                          flatSubSubUrl === ''
                                            ? '/'
                                            : flatSubSubUrl
                                        }
                                        title={subsubitem.title}
                                        key={flatSubSubUrl}
                                        className={
                                          this.isActive(flatSubSubUrl)
                                            ? 'item thirdLevel menuActive'
                                            : 'item thirdLevel'
                                        }
                                      >
                                        {subsubitem.title}
                                      </Link>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  )}
                </Dropdown>
              ) : (
                <div
                  key={flatUrl}
                  className={
                    this.isActive(flatUrl)
                      ? 'item menuActive firstLevel'
                      : 'item firstLevel'
                  }
                >
                  <Link to={flatUrl === '' ? '/' : flatUrl}>{item.title}</Link>
                </div>
              );
            })}
          {__CLIENT__ &&
            (__DEVELOPMENT__ || window.env.RAZZLE_HAS_N2K_SECTION) && (
              <div
                id="natura2000"
                className={cx('item firstLevel', {
                  menuActive: this.isActive(
                    `/natura2000/${this.state.n2kLanguage}`,
                  ),
                })}
                role="listbox"
                tabIndex={0}
                aria-expanded={false}
              >
                <Link to={`/natura2000/${this.state.n2kLanguage}`}>
                  Natura 2000
                </Link>
              </div>
            )}
        </Menu>
      </nav>
    );
  }
}

export default compose(
  injectIntl,
  withLocalStorage,
  connect(
    (state) => {
      return {
        items: state.navigation.items,
        token: state?.userSession?.token,
      };
    },
    { getNavigation },
  ),
)(Navigation);
