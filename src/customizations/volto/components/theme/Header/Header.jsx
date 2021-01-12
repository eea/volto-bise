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

import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { injectIntl } from 'react-intl';

import {
  Anontools,
  Logo,
  Navigation,
  SearchWidget,
  Breadcrumbs,
} from '@plone/volto/components';

import HeaderImage from 'volto-bise/components/theme/Header/HeaderImage';

import { TabletSearchWidget } from '../SearchWidget/SearchWidget';

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
      windowWidth: 0,
      searchText: '',
    };
    this.handleWindowSizeChange = this.handleWindowSizeChange.bind(this);
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

  componentDidMount() {
    this.handleWindowSizeChange();
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange() {
    let windowWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
    this.setState({ windowWidth });
  }

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
   * Submit handler
   * @method onSubmit
   * @param {event} event Event object.
   * @returns {undefined}
   */
  onSubmit = (event) => {
    this.props.history.push(`/search?SearchableText=${this.state.searchText}`);
    event.preventDefault();
    this.setState({ searchPopupVisible: false });
  };

  /**
   * On change text
   * @method onChangeText
   * @param {object} event Event object.
   * @param {string} value Text value.
   * @returns {undefined}
   */
  onChangeText = (event, { value }) => {
    this.setState({
      searchText: value,
    });
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const defaultHeaderImage = this.props.defaultHeaderImage;
    let headerImageUrl = defaultHeaderImage?.image || defaultHeaderImage;
    const { windowWidth } = this.state;
    const isStickyHeader = windowWidth < 1654;
    return (
      <div>
        <Segment
          basic
          role="banner"
          className={cx(
            'header-wrapper',
            isStickyHeader ? 'sticky-header' : '',
          )}
        >
          <Container>
            <div className="header">
              <div className="logo-nav-wrapper">
                <div className="logo">
                  <Logo />
                </div>
                <div className="tools-search-wrapper">
                  {/* <TabletSearchWidget */}
                  {/*   onSubmit={this.onSubmit} */}
                  {/*   onChangeText={this.onChangeText} */}
                  {/*   searchText={this.state.searchText} */}
                  {/* /> */}
                  {/* <SearchWidget */}
                  {/*   pathname={this.props.pathname} */}
                  {/*   className="search" */}
                  {/*   displayMode="mobile" */}
                  {/* ></SearchWidget> */}
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
                  {/* <SearchWidget */}
                  {/*   pathname={this.props.pathname} */}
                  {/*   className="search" */}
                  {/*   displayMode="desktop" */}
                  {/* /> */}
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

export default compose(
  withRouter,
  injectIntl,
)(
  connect((state) => ({
    token: state.userSession.token,
  }))(Header),
);
