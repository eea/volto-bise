import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import UpSVG from '@plone/volto/icons/up-key.svg';

class InpageNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollPosition: 0,
      removeClass: 'hidden',
    };
  }

  handleInpageNavigationVisibility = () => {
    const position = window.scrollY;
    this.setState({ scrollPosition: position });

    if (this.state.scrollPosition > 50) {
      return this.setState({ removeClass: '' });
    } else {
      return this.setState({ removeClass: 'hidden' });
    }
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleInpageNavigationVisibility);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleInpageNavigationVisibility);
  }

  onInpageNavigationClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  render() {
    return (
      <Container>
        <div
          id="inpage-navigation"
          onClick={this.onInpageNavigationClick}
          role="none"
          className={this.state.removeClass}
        >
          <div className="mobile tablet only">
            <Icon name={UpSVG} />
          </div>
          <div className="tablet or lower hidden">
            <Icon name={UpSVG} />
            <div className="text">top</div>
          </div>
        </div>
      </Container>
    );
  }
}

export default InpageNavigation;
