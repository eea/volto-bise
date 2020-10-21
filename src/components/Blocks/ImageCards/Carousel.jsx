import cx from 'classnames';
import React, { Component } from 'react';

import { Placeholder } from 'semantic-ui-react';
import { settings } from '~/config';
import { flattenToAppURL } from '@plone/volto/helpers';

import ImageGallery from 'react-image-gallery';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import 'react-image-gallery/styles/css/image-gallery.css';

import { getImageUrlFromValue } from './utils';

import { serializeNodes } from 'volto-slate/editor/render';

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
            backgroundImage: `url(${getImageUrlFromValue(card.attachedimage)})`,
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
        <div class="ui container">
          <div className="slide-body">
            <div className="slide-title">{card.title || ''}</div>
            {/* Incomplete backward-compatibility: */}
            {card.text?.data ? (
              <div
                className="slide-description"
                dangerouslySetInnerHTML={{ __html: card.text?.data || '' }}
              />
            ) : (
              <div className="slide-description">{serializeNodes(card.text)}</div>
            )}
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
          </div>
        </div>
      </div>
    );
  }
}

export default Carousel;
