import React from 'react';
import TouchCircle from './touch-circle';
import vars from './vars';

export default class Board extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            touchPoints: [
                {
                    cx: 500,
                    cy: 500,
                },
            ],
            countdownIntervalID: 0,
            countdown: 0,
        };
    }

    handleTouchStart(e) {

    }

    handleTouchEnd(e) {

    }

    handleTouchMove(e) {

    }

    // TODO add udpate if size changes using shouldComponentUpdate

    render() {
        let sigh = 0;
        const touchPoints = this.state.touchPoints.map(touchpoint =>
            <TouchCircle 
                key={ 'p' + sigh++ }
                cx={ touchpoint.cx }
                cy={ touchpoint.cy }
                colour={ generateColour() }
            />
        );

        return (
            <svg 
                xmlns={ vars.SVG_NS }
                width={ window.innerWidth }
                height={ window.innerHeight }
            >
                { touchPoints }
            </svg>
        );
    }
}

const generateColour = () => vars.COLOURS[Math.ceil(Math.random() * vars.COLOURS.length) - 1];
