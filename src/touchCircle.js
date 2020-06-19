import React from 'react';
import vars from './vars';
import './touchCircle.css';

export default class TouchCircle extends React.PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            colour: this.props.colour
        };
    }

    render() {
        return (
            <circle
                xmlns={ vars.SVG_NS }
                cx={ this.props.cx }
                cy={ this.props.cy }
                r={ vars.TOUCH_RADIUS }
                fill={ this.state.colour }
                className="touch-gfx"
                style={{
                    transformOrigin: `${this.props.cx}px ${this.props.cy}px`
                }}
            />

        );
    }
}
