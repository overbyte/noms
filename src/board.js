import React, { useState, useEffect, useCallback } from 'react';
import TouchCircle from './touchCircle';
import vars from './vars';

export default function Board(props) {

    const [touchPoints, setTouchPoints] = useState([]);

    useEffect(() => {
        console.log('adding event listeners');
        window.addEventListener('touchstart', handleTouchStart, { passive: false });
        window.addEventListener('touchend', handleTouchEnd, { passive: false });
        window.addEventListener('touchcancel', handleTouchEnd, { passive: false });
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            console.log('removing event listeners');
            window.removeEventListener('touchstart', handleTouchStart, { passive: false });
            window.removeEventListener('touchend', handleTouchEnd, { passive: false });
            window.removeEventListener('touchcancel', handleTouchEnd, { passive: false });
            window.removeEventListener('touchmove', handleTouchMove, { passive: false });
        }
    });

    const handleTouchStart = useCallback((e) => {
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
    }, [touchPoints, setTouchPoints]);

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();

        const tp = touchPoints.slice();

        for (var i = 0; i < e.changedTouches.length; i++) {
            const touch = getTouchById(tp, e.changedTouches[i].identifier);
            if (!touch) continue;
            touch.touch = e.changedTouches[i];
            touch.angle = getAngleFromCenter(touch.touch.pageX, touch.touch.pageY);
        }

        setTouchPoints(tp);
    }, [touchPoints, setTouchPoints]);

    const handleTouchEnd = useCallback((e) => {
        e.preventDefault();

        const tp = touchPoints.slice();

        for (var i = 0; i < e.changedTouches.length; i++) {
            const touch = getTouchById(tp, e.changedTouches[i].identifier);
            const index = tp.indexOf(touch);
            tp.splice(index, 1);
        }

        setTouchPoints(tp);
    }, [touchPoints, setTouchPoints]);


    // TODO add udpate if size changes using shouldComponentUpdate

    return (
        <svg 
            xmlns={ vars.SVG_NS }
            width={ window.innerWidth }
            height={ window.innerHeight }
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

const generateColour = () => vars.COLOURS[Math.ceil(Math.random() * vars.COLOURS.length) - 1];
const getTouchIndexById = (touchPoints, newTouch) => touchPoints.findIndex(t => t.touch.identifier === newTouch.identifier);

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
