import React from 'react';
import TouchCircle from './touchCircle';
import vars from './vars';

export default class Board extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            touchPoints: [ ],
            countdownIntervalID: 0,
            countdown: 0,
        };

        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
    }

    componentDidMount() {
        // to stop the built in browser gesture interfering with the multitouch
        // events we need to turn off passive events for the touch which can
        // only be done in a lifecycle hook (this code was moved from the svg
        // declaration)
        window.addEventListener('touchstart', this.handleTouchStart, { passive: false });
        window.addEventListener('touchend', this.handleTouchEnd, { passive: false });
        window.addEventListener('touchcancel', this.handleTouchEnd, { passive: false });
        window.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    }

    componentWillUnmount() {
        window.removeEventListener('touchstart', this.handleTouchStart, { passive: false });
        window.removeEventListener('touchend', this.handleTouchEnd, { passive: false });
        window.removeEventListener('touchcancel', this.handleTouchEnd, { passive: false });
        window.removeEventListener('touchmove', this.handleTouchMove, { passive: false });
    }

    handleTouchStart(e) {
        e.preventDefault();
        const touchPoints = this.state.touchPoints.slice();

        // note e.changedTouches is a TouchList not an array
        // so we can't map over it
        for (var i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const angle = getAngleFromCenter(touch.pageX, touch.pageY);

            touchPoints.push({
                touch,
                angle,
            });
        }
        this.setState({ touchPoints });
    }

    handleTouchMove(e) {
        e.preventDefault();
        const touchPoints = this.state.touchPoints.slice();

        for (var i = 0; i < e.changedTouches.length; i++) {
            const touch = getTouchById(touchPoints, e.changedTouches[i].identifier);
            if (!touch) continue;
            touch.touch = e.changedTouches[i];
            touch.angle = getAngleFromCenter(touch.touch.pageX, touch.touch.pageY);
        }

        this.setState({ touchPoints });
    }

    handleTouchEnd(e) {
        e.preventDefault();
        const touchPoints = this.state.touchPoints.slice();

        for (var i = 0; i < e.changedTouches.length; i++) {
            const touch = getTouchById(touchPoints, e.changedTouches[i].identifier);
            const index = touchPoints.indexOf(touch);
            touchPoints.splice(index, 1);
        }

        this.setState({ touchPoints });
    }

    // TODO add udpate if size changes using shouldComponentUpdate

    render() {
        const touchPoints = this.state.touchPoints.map(touchpoint =>
            <TouchCircle 
                key={ touchpoint.touch.identifier }
                cx={ touchpoint.touch.pageX }
                cy={ touchpoint.touch.pageY }
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
const getTouchById = (touchPoints, id) => touchPoints.filter(item => item.touch.identifier === id)[0];
const getCenterPoint = () => {
    return {
        x: (window.innerWidth / 2), 
        y: (window.innerHeight / 2),
    };
}

const getAngleFromCenter = (x, y) => {
    const center = getCenterPoint();
    const angle = Math.atan2(y - center.y, x - center.x) * 180 / Math.PI + 180;
    return angle;
};
