import React, { Component } from 'react';
import cx from 'classnames';
import { Button, Container } from 'semantic-ui-react';
import { Icon } from '@plone/volto/components';
import UpSVG from '@plone/volto/icons/up-key.svg';
import './styles.less';

class InpageNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollPosition: 0,
      hidden: true,
    };
  }

  handleInpageNavigationVisibility = () => {
    const position = window.scrollY;
    this.setState({ scrollPosition: position });

    if (this.state.scrollPosition > 50) {
      return this.setState({ hidden: false });
    } else {
      return this.setState({ hidden: true });
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
        <div className={cx('scroll-to-top', { hidden: this.state.hidden })}>
          <Button size="small" onClick={this.onInpageNavigationClick} icon>
            <Icon color="#FFF" name={UpSVG} size={32} />
          </Button>
        </div>
      </Container>
    );
  }
}

export default InpageNavigation;
