import cx from 'classnames';
import React, { Component } from 'react';

import { Placeholder } from 'semantic-ui-react';
import { settings } from '~/config';
import { flattenToAppURL } from '@plone/volto/helpers';

import loadable from '@loadable/component';
const ImageGallery = loadable(() => import('react-image-gallery'));
const ImageGalleryCss = loadable.lib(() => import('react-image-gallery/styles/css/image-gallery.css'));

import { LazyLoadImage } from 'react-lazy-load-image-component';

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

    // renderLeftNav={(onClick, disabled) => (
    //   <button
    //     className="image-gallery-left-nav"
    //     disabled={disabled}
    //     onClick={onClick}
    //   />
    // )}
    // renderRightNav={(onClick, disabled) => (
    //   <button
    //     className="image-gallery-right-nav"
    //     disabled={disabled}
    //     onClick={onClick}
    //   />
    // )}

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
            <ImageGalleryCss>
              {() => {
                return (
                  <ImageGallery
                    className="mainSlider"
                    items={images}
                    showFullscreenButton={false}
                    showPlayButton={false}
                    autoPlay
                    renderItem={this.renderSlide}
                    slideDuration={300}
                    slideInterval={100000}
                  />
                );
              }}
            </ImageGalleryCss>
          </div>
        </div>
      </div>
    );
  }
}

export default Carousel;
