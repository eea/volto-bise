/**
 * Header component.
 * @module components/theme/Header/Header
 */

import React, { Component } from 'react';
import { Container, Segment } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Portal } from 'react-portal';

import cx from 'classnames';

import {
  Anontools,
  Logo,
  Navigation,
  SearchWidget,
  Breadcrumbs,
} from '@plone/volto/components';

import HeaderImage from 'volto-bise/components/theme/Header/HeaderImage';

/**
 * Header component class.
 * @class Header
 * @extends Component
 */
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHomepage: this.props.actualPathName === '/',
    };
  }
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    token: PropTypes.string,
    pathname: PropTypes.string.isRequired,
    actualPathName: PropTypes.string.isRequired,
    defaultHeaderImage: PropTypes.any,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    token: null,
  };

  componentWillMount() {
    if (typeof window !== "undefined") {
      window.addEventListener('resize', this.handleWindowSizeChange);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.actualPathName !== this.props.actualPathName) {
      this.setState({
        isHomepage: nextProps.actualPathName === '/',
      });
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.actualPathName !== this.props.actualPathName) {
      this.setState({
        isHomepage: this.props.actualPathName === '/',
      });
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */

  render() {
    const defaultHeaderImage = this.props.defaultHeaderImage;
    let headerImageUrl = defaultHeaderImage?.image || defaultHeaderImage;
    const { width } = this.state;
    const isStickyHeader = width < 1654;
    return (
      <div>
        <Segment
           basic
           role="banner"
           className={cx('header-wrapper', (isStickyHeader)
              ? 'sticky-header'
              : ''
            )}
          >
          <Container>
            <div className="header">
              <div className="logo-nav-wrapper">
                <div className="logo">
                  <Logo />
                </div>
                <div className="tools-search-wrapper">
                  <Navigation
                    pathname={this.props.pathname}
                    navigation={this.props.navigationItems}
                  />
                  {!this.props.token && (
                    <Portal
                      node={
                        __CLIENT__ && document.querySelector('#footer_links')
                      }
                    >
                      <Anontools />
                    </Portal>
                  )}
                  {/*<div className="search">
                    <SearchWidget pathname={this.props.pathname} />
                  </div>*/}
                </div>
              </div>
            </div>
          </Container>
        </Segment>
        <div>
          <div
            className={`header-bg ${
              this.state.isHomepage ? 'homepage' : 'contentpage'
            }`}
          >
            {!this.state.isHomepage && (
              <div style={{ position: 'relative' }}>
                <Breadcrumbs pathname={this.props.pathname} />
                <HeaderImage url={headerImageUrl} {...this.props} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect((state) => ({
  token: state.userSession.token,
}))(Header);
