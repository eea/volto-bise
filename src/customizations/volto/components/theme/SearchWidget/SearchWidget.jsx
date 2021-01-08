/**
 * Search widget component.
 * @module components/theme/SearchWidget/SearchWidget
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Input, Button, Grid } from 'semantic-ui-react';
import { compose } from 'redux';
import { PropTypes } from 'prop-types';
import { defineMessages, injectIntl, useIntl } from 'react-intl';

import cx from 'classnames';

import { Icon } from '@plone/volto/components';
import zoomSVG from 'volto-bise/icons/search.svg';

import { createPortal } from 'react-dom';

const messages = defineMessages({
  search: {
    id: 'Search',
    defaultMessage: 'Search',
  },
  searchSite: {
    id: 'Search Site',
    defaultMessage: 'Search all site ...',
  },
});

/**
 * SearchWidget component class.
 * @class SearchWidget
 * @extends Component
 */
class SearchWidget extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    pathname: PropTypes.string.isRequired,
    /**
     * One of 'desktop' (the default) and 'mobile'.
     */
    displayMode: PropTypes.string.isRequired,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs SearchWidget
   */
  constructor(props) {
    super(props);
    this.onChangeText = this.onChangeText.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      text: '',
      section: false,
      searchPopupVisible: false,
    };

    this.searchFormRef = React.createRef(null);
    this.searchButtonRef = React.createRef(null);

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * On change text
   * @method onChangeText
   * @param {object} event Event object.
   * @param {string} value Text value.
   * @returns {undefined}
   */
  onChangeText(event, { value }) {
    this.setState({
      text: value,
    });
  }

  /**
   * Submit handler
   * @method onSubmit
   * @param {event} event Event object.
   * @returns {undefined}
   */
  onSubmit = (event) => {
    event.preventDefault();
    this.props.history.push(`/search?SearchableText=${this.state.text}`);
    this.closePopup();
  };

  openPopup = () => {
    this.setState(
      (state, props) => {
        if (state.searchPopupVisible) {
          return {};
        }
        return {
          searchPopupVisible: true,
        };
      },
      () => {
        document.addEventListener('mousedown', this.handleClickOutside);
        this.updateSizeAndPosition();
      },
    );
  };

  closePopup = () => {
    this.setState(
      (state, props) => {
        if (!state.searchPopupVisible) {
          return {};
        }
        return { searchPopupVisible: false };
      },
      () => {
        document.removeEventListener('mousedown', this.handleClickOutside);
      },
    );
  };

  handleClickOutside = (event) => {
    if (
      this.searchFormRef.current &&
      !this.searchFormRef.current.contains(event.target) &&
      !this.searchButtonRef.current.ref.current.contains(event.target)
    ) {
      this.closePopup();
      event.preventDefault();
      event.stopPropagation();
    }
  };

  updateSizeAndPosition = () => {
    // const el = this.searchButtonRef.current.ref.current;
    // const s = window.getComputedStyle(el);
    // this.searchFormRef.current.style.left = '25rem';
    // this.searchFormRef.current.style.right = `calc(100vw - ${
    //   el.offsetLeft
    // }px)`;

    const el = this.searchButtonRef.current.ref.current;
    // const s = window.getComputedStyle(el);

    let nav = document.querySelector('.header'); // better than .tools-search-wrapper or .navigation

    // the 13px is hardcoded in another part of CSS
    let y =
      nav.getBoundingClientRect().height -
      3 + // necessary but not understood
      (this.props.displayMode === 'desktop' ? 13 : 0);

    // y = el.offsetHeight + el.offsetTop;
    this.searchFormRef.current.style.top = `${y}px`;
    this.searchFormRef.current.style.right = `calc(100vw - ${
      el.getBoundingClientRect().left +
      el.getBoundingClientRect()
        .width /* -
          this.searchFormRef.current.getBoundingClientRect().width */
    }px)`;

    if (this.props.displayMode === 'mobile') {
      this.searchFormRef.current.style.left = '0';
      this.searchFormRef.current.style.width = '100vw';
    }
  };

  handleResize = () => {
    this.updateSizeAndPosition();
  };

  componentDidMount = () => {
    window.addEventListener('resize', this.handleResize, false);
  };

  componentWillUnmount = () => {
    window.removeEventListener('resize', this.handleResize);
  };

  handleClick = (event) => {
    // this.openPopup();
    // if (this.searchButtonRef.current.ref.current.contains(event.target)) {
    if (this.state.searchPopupVisible) {
      this.closePopup();
    } else {
      this.openPopup();
    }
    // this.openPopup();
    // }
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const visible =
      typeof this.state.searchPopupVisible === 'boolean' &&
      this.state.searchPopupVisible;

    return (
      <>
        {this.props.displayMode === 'mobile' && (
          <Grid columns={1} id="search-widget-mobile-wrapper-grid">
            <Grid.Column only="mobile" mobile={1}>
              <div>
                <SearchButton
                  id="search-button-mobile"
                  ref={this.searchButtonRef}
                  onClick={this.handleClick}
                />
                {__CLIENT__ &&
                  createPortal(
                    <SearchBox
                      onSubmit={this.onSubmit}
                      searchFormRef={this.searchFormRef}
                      visible={visible}
                      id="search-widget-mobile-popup"
                      onChangeText={this.onChangeText}
                      text={this.state.text}
                    ></SearchBox>,
                    document.body,
                  )}
              </div>
            </Grid.Column>
          </Grid>
        )}
        {this.props.displayMode === 'desktop' && (
          <Grid columns={1} className={this.props.className}>
            <Grid.Column width={1}>
              <div>
                <SearchButton
                  id="search-widget-toggle"
                  ref={this.searchButtonRef}
                  onClick={this.handleClick}
                />
                {__CLIENT__ &&
                  createPortal(
                    <SearchBox
                      onSubmit={this.onSubmit}
                      searchFormRef={this.searchFormRef}
                      visible={visible}
                      id="search-widget-popup"
                      onChangeText={this.onChangeText}
                      text={this.state.text}
                    ></SearchBox>,
                    document.body,
                  )}
              </div>
            </Grid.Column>
          </Grid>
        )}
      </>
    );
  }
}

export const SearchButton = React.forwardRef(({ id, onClick }, ref) => {
  return (
    <Button basic={true} id={id} ref={ref} onClick={onClick}>
      <Icon name={zoomSVG} size="18px" />
    </Button>
  );
});

export const SearchBox = ({
  onSubmit,
  searchFormRef,
  visible,
  id,
  onChangeText,
  text,
  className,
}) => {
  const intl = useIntl();

  return (
    <form
      action="/search"
      onSubmit={onSubmit}
      id={id}
      className={cx(className)}
      ref={searchFormRef}
      style={{
        visibility: visible ? 'visible' : 'collapse',
      }}
    >
      <div className="search-widget-box">
        <Input
          aria-label={intl.formatMessage(messages.search)}
          onChange={onChangeText}
          name="SearchableText"
          value={text}
          transparent
          placeholder={intl.formatMessage(messages.searchSite)}
          title={intl.formatMessage(messages.search)}
          type="search"
        />
        <button aria-label={intl.formatMessage(messages.search)}>
          <Icon name={zoomSVG} size="18px" />
        </button>
      </div>
    </form>
  );
};

export const TabletSearchWidget = ({ onSubmit, onChangeText, searchText }) => {
  return (
    <Grid columns={1} id="search-widget-tablet-wrapper-grid">
      <Grid.Column only="tablet" tablet={1}>
        <SearchBox
          onSubmit={onSubmit}
          visible={true}
          id="search-widget-tablet"
          onChangeText={onChangeText}
          text={searchText}
        ></SearchBox>
      </Grid.Column>
    </Grid>
  );
};

export default compose(withRouter, injectIntl)(SearchWidget);
