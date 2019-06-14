import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { View } from 'react-native';
import lottie from 'lottie-web';

class Animation extends PureComponent {
  componentDidMount() {
    this.loadAnimation(this.props);

    const { progress } = this.props;

    if (progress && progress.addListener) {
      progress.addListener(({ value, isPlaying }) => {
        if (!this.anim || !this.animationDuration) {
          return;
        }

        const toTime = this.animationDuration * value * 1000;

        if (typeof value === 'number') {
          this.anim.goToAndPlay(toTime, false);

          if (!isPlaying) {
            this.anim.pause();
          }
        }
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.source && nextProps.source && this.props.source.nm !== nextProps.source.nm) {
      this.loadAnimation(nextProps);
    }
  }

  setAnimationDOMNode = ref => {
    this.animationDOMNode = ReactDOM.findDOMNode(ref);
  };

  setAnimationDuration = () => {
    if (this.anim) {
      this.animationDuration = this.anim.getDuration();
    }
  };

  loadAnimation = props => {
    if (this.anim) {
      this.anim.destroy();
    }

    this.anim = lottie.loadAnimation({
      container: this.animationDOMNode,
      animationData: props.source,
      renderer: 'svg',
      loop: props.loop || false,
      autoplay: props.autoplay,
    });

    this.anim.addEventListener('DOMLoaded', this.setAnimationDuration);
  };

  animationDOMNode = null;
  animationDuration = null;

  render() {
    return <View style={this.props.style} ref={this.setAnimationDOMNode} />;
  }
}

export default React.forwardRef((props, ref) => (
  <Animation {...props} ref={typeof ref === 'function' ? cc => ref(cc && cc.anim) : ref} />
));
