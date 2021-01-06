/**
 * Search widget component.
 * @module components/theme/SearchWidget/SearchWidget
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Form, Input, Button } from 'semantic-ui-react';
import { compose } from 'redux';
import { PropTypes } from 'prop-types';
import { defineMessages, injectIntl, useIntl } from 'react-intl';

import { Icon } from '@plone/volto/components';
import zoomSVG from '@plone/volto/icons/zoom.svg';

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
    this.onChangeSection = this.onChangeSection.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      text: '',
      section: false,
      searchPopupVisible: false,
    };

    this.searchFormRef = React.createRef(null);
    this.searchButtonRef = React.createRef(null);
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
   * On change section
   * @method onChangeSection
   * @param {object} event Event object.
   * @param {bool} checked Section checked.
   * @returns {undefined}
   */
  onChangeSection(event, { checked }) {
    this.setState({
      section: checked,
    });
  }

  /**
   * Submit handler
   * @method onSubmit
   * @param {event} event Event object.
   * @returns {undefined}
   */
  onSubmit(event) {
    const section = this.state.section ? `&path=${this.props.pathname}` : '';
    this.props.history.push(
      `/search?SearchableText=${this.state.text}${section}`,
    );
    event.preventDefault();
    this.setState({ searchPopupVisible: false });
  }

  handleClickOutside = (ev) => {
    function overlaps(x, y) {
      return y.contains(y);

      // const r1 = x.getBoundingClientRect();
      // const r2 = y.getBoundingClientRect();

      // return (
      //   r1.right < r2.left ||
      //   r1.left > r2.right ||
      //   r1.bottom < r2.top ||
      //   r1.top > r2.bottom
      // );
    }

    this.setState((state, props) => {
      if (
        state.searchPopupVisible &&
        this.searchFormRef.current &&
        ev.target !== this.searchFormRef.current &&
        !overlaps(this.searchFormRef.current, ev.target)
      ) {
        return { searchPopupVisible: false };
      }

      return {};
    });
  };

  updateWidth = () => {
    const el = this.searchButtonRef.current.ref.current;
    const s = window.getComputedStyle(el);

    // this.searchFormRef.current.style.left = '25rem';
    // this.searchFormRef.current.style.right = `calc(100vw - ${
    //   el.offsetLeft
    // }px)`;
  };

  handleResize = () => {
    this.updateWidth();
  };

  componentDidMount = () => {
    window.addEventListener('click', this.handleClickOutside, false);
    window.addEventListener('resize', this.handleResize, false);
  };

  componentWillUnmount = () => {
    window.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('resize', this.handleResize);
  };

  handleClick = () => {
    this.setState((state, props) => {
      if (
        !state.searchPopupVisible &&
        this.searchFormRef.current &&
        this.searchButtonRef.current?.ref?.current
      ) {
        const el = this.searchButtonRef.current.ref.current;
        // const s = window.getComputedStyle(el);

        let y = document.querySelector('.navigation').clientHeight;
        // y = el.offsetHeight + el.offsetTop;

        this.searchFormRef.current.style.top = `${y}px`;

        this.updateWidth();
      }
      return {
        searchPopupVisible: !state.searchPopupVisible,
      };
    });
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
      <div>
        <Button
          basic={true}
          id="search-widget-root"
          ref={this.searchButtonRef}
          onClick={this.handleClick}
        >
          <Icon name={zoomSVG} size="18px" />
        </Button>
        <SearchBox
          onSubmit={this.onSubmit}
          searchFormRef={this.searchFormRef}
          visible={visible}
          id="search-widget-box"
          onChangeText={this.onChangeText}
          text={this.state.text}
        ></SearchBox>
      </div>
    );
  }
}

export const SearchBox = ({
  onSubmit,
  searchFormRef,
  visible,
  id,
  onChangeText,
  text,
}) => {
  const intl = useIntl();

  return (
    <form
      action="/search"
      onSubmit={onSubmit}
      id="search-widget-popup"
      ref={searchFormRef}
      style={{
        visibility: visible ? 'visible' : 'collapse',
      }}
    >
      <div id={id}>
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

export default compose(withRouter, injectIntl)(SearchWidget);
