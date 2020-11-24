import React, { Component } from 'react';
import loadable from '@loadable/component';
import { Icon } from '@plone/volto/components';

import leftSVG from '@plone/volto/icons/left-key.svg';
import rightSVG from '@plone/volto/icons/right-key.svg';
import cx from 'classnames';

import 'slick-carousel/slick/slick.css';
import { fixUrl, getPath } from 'volto-bise/utils';

// import { Placeholder } from 'semantic-ui-react';
// import 'slick-carousel/slick/slick-theme.css';

const Slider = loadable(() => import('react-slick'));

class Carousel extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }

  next() {
    this.slider.slickNext();
  }

  previous() {
    this.slider.slickPrev();
  }

  componentDidMount() {
    require('./css/carousel.less');
  }

  renderSlide = (cards) => {
    return cards.map((card, index) => {
      return (
        <div className="slider-slide" key={index}>
          <div
            className="slide-img"
            style={
              card.attachedimage
                ? {
                    backgroundImage: `url(${fixUrl(
                      getPath(card.attachedimage),
                    )})`,
                  }
                : {}
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
    });
  };

  renderSlideArrows = () => {
    return (
      <div className="slider-arrow">
        <div className="ui container">
          <button
            className="left-arrow"
            aria-label="Prev Slide"
            onClick={() => this.slider.slickPrev()}
          >
            <Icon name={leftSVG} size="55px" />
          </button>

          <button
            className="right-arrow"
            aria-label="Prev Slide"
            onClick={() => this.slider.slickNext()}
          >
            <Icon name={rightSVG} size="55px" />
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { data } = this.props;
    const cards = this.props.data.cards || [];

    var settings = {
      fade: true,
      speed: 800,
      infinite: true,
      autoplay: true,
      pauseOnHover: true,
      autoplaySpeed: 10000,
      slidesToShow: 1,
      slidesToScroll: 1,
      lazyLoad: 'ondemand',
    };

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
            <Slider {...settings} ref={(slider) => (this.slider = slider)}>
              {this.renderSlide(cards)}
            </Slider>
            {this.renderSlideArrows()}
          </div>
        </div>
      </div>
    );
  }
}

export default Carousel;
