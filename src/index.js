import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { View, Animated } from 'react-native';
import bodymovin from 'bodymovin';

export default class Animation extends PureComponent {
	animationDOMNode = null;

	componentDidMount() {
		this.loadAnimation(this.props);
		this.props.progress &&
			this.props.progress.addListener &&
			this.props.progress.addListener((args) => {
				if (args.value > 0) {
					this.anim.play();
				} else {
					this.anim.goToAndStop(0);
				}
			});

		/*
    this.props.progress._animation.onUpdate(() => {
      console.log(arguments);
      console.log(this.props.progress._value);
    });
    */
	}

	componentWillReceiveProps(nextProps) {
		if (
			this.props.source &&
			nextProps.source &&
			this.props.source.nm !== nextProps.source.nm
		) {
			this.loadAnimation(nextProps);
		}
	}

	loadAnimation = (props) => {
		if (this.anim) {
			this.anim.destroy();
		}

		this.anim = bodymovin.loadAnimation({
			container: this.animationDOMNode,
			animationData: props.source,
			renderer: 'svg',
			loop: props.loop || false,
			autoplay: props.autoplay
		});
	};

	setAnimationDOMNode = ref =>
		(this.animationDOMNode = ReactDOM.findDOMNode(ref));

	render() {
		return <View style={this.props.style} ref={this.setAnimationDOMNode} />;
	}
}
