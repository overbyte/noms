import React, { useState } from 'react';
import TouchCircle from './touchCircle';
import vars from './vars';

export default function Board(props) {

    const [touchPoints, setTouchPoints] = useState([]);

    /*
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
    */

    function handleTouchStart(e) {
        e.preventDefault();
        const tp = touchPoints.slice();

        // note e.changedTouches is a TouchList not an array
        // so we can't map over it
        for (var i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const angle = getAngleFromCenter(touch.pageX, touch.pageY);

            tp.push({
                touch,
                angle,
            });
        }

        setTouchPoints(tp);
    }

    function handleTouchMove(e) {
        e.preventDefault();
        const tp = touchPoints.slice();

        for (var i = 0; i < e.changedTouches.length; i++) {
            const touch = getTouchById(tp, e.changedTouches[i].identifier);
            if (!touch) continue;
            touch.touch = e.changedTouches[i];
            touch.angle = getAngleFromCenter(touch.touch.pageX, touch.touch.pageY);
        }

        setTouchPoints(tp);
    }

    function handleTouchEnd(e) {
        e.preventDefault();
        const tp = touchPoints.slice();

        for (var i = 0; i < e.changedTouches.length; i++) {
            const touch = getTouchById(tp, e.changedTouches[i].identifier);
            const index = tp.indexOf(touch);
            tp.splice(index, 1);
        }

        setTouchPoints(tp);
    }

    return (
        <svg 
            xmlns={ vars.SVG_NS }
            width={ window.innerWidth }
            height={ window.innerHeight }
            onTouchStart = { handleTouchStart }
            onTouchMove = { handleTouchMove }
            onTouchEnd = { handleTouchEnd }
            onTouchCancel = { handleTouchEnd }
        >
            {
                touchPoints.map(touchpoint =>
                    <TouchCircle 
                        key={ touchpoint.touch.identifier }
                        cx={ touchpoint.touch.pageX }
                        cy={ touchpoint.touch.pageY }
                        colour={ generateColour() }
                    />
                )
            }
        </svg>
    );
}

// lambadas
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
