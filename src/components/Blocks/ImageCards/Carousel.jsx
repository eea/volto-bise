import React, { Component } from 'react';
import loadable from '@loadable/component';
import { Placeholder } from 'semantic-ui-react';
import { settings } from '~/config';
import { flattenToAppURL } from '@plone/volto/helpers';
import { Icon } from '@plone/volto/components';
import leftSVG from '@plone/volto/icons/left-key.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import cx from 'classnames';

import 'react-image-gallery/styles/css/image-gallery-no-icon.css';

const ImageGallery = loadable(() => import('react-image-gallery'));

export const getPath = (url) =>
  url.startsWith('http') ? new URL(url).pathname : url;

export const fixUrl = (url) =>
  (url || '').includes(settings.apiPath)
    ? `${flattenToAppURL(url.replace('/api', ''))}/@@images/image`
    : `${url.replace('/api', '')}/@@images/image`;

class Carousel extends Component {
  componentDidMount() {
    require('./css/carousel.less');
  }

  renderSlide = (card) => {
    return (
      <div className="slider-slide">
        <LazyLoadImage
          className="slide-img"
          height={600}
          effect="blur"
          style={{
            backgroundImage: `url(${fixUrl(getPath(card.attachedimage))})`,
          }}
          width={'100%'}
          visibleByDefault={true}
          placeholder={
            <Placeholder>
              <Placeholder.Image rectangular />
            </Placeholder>
          }
        />
        <div className="slide-overlay" />
        <div className="ui container">
          <div className="slide-body">
            <div className="slide-title">{card.title || ''}</div>
            <div
              className="slide-description"
              dangerouslySetInnerHTML={{ __html: card.text?.data || '' }}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { data } = this.props;
    const images = this.props.data.cards || [];

    function renderLeftNav(onClick, disabled) {
      return (
        <button
          type="button"
          className="image-gallery-custom-left-nav"
          aria-label="Prev Slide"
          disabled={disabled}
          onClick={onClick}
        >
          <Icon name={leftSVG} size="55px" />
        </button>
      );
    }

  function renderRightNav(onClick, disabled) {
    return (
      <button
        type="button"
        className="image-gallery-custom-right-nav"
        aria-label="Prev Slide"
        disabled={disabled}
        onClick={onClick}
      >
        <Icon name={rightSVG} size="55px" />
      </button>
    );
  }

    return (
      <div
        className={cx(
          'block align imagecards-block',
          {
            center: !Boolean(data.align),
          },
          data.align,
        )}
      >
        <div
          className={cx({
            'full-width': data.align === 'full',
          })}
        >
          <div className="slider-wrapper">
            <ImageGallery
              className="mainSlider"
              items={images}
              showFullscreenButton={false}
              showPlayButton={false}
              autoPlay
              renderItem={this.renderSlide}
              slideDuration={300}
              slideInterval={100000}
              renderLeftNav={renderLeftNav}
              renderRightNav={renderRightNav}
              showThumbnails={false}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Carousel;
