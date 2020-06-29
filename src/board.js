import React, { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import TouchCircle from './touchCircle';
import vars from './vars';

export default function Board(props) {
    const [touchPoints, setTouchPoints] = useState([]);
    const [count, setCount] = useState(-10);
    const svg = useRef();

    const handleTouchStart = useCallback((e) => {
        e.preventDefault();

        // use functional version of mutator
        setTouchPoints(tp => {
            // duplicate array
            tp = tp.slice();

            // note e.changedTouches is a TouchList not an array
            // so we can't map over it
            for (var i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                const angle = getAngleFromCenter(touch.pageX, touch.pageY);

                tp.push({ touch, angle });
            }

            if (tp.length >= vars.MIN_TOUCHPOINTS) {
                setCount(vars.MAX_COUNTDOWN);
            }

            return tp;
        });
    }, [setTouchPoints, setCount]);

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();

        setTouchPoints(tp => {
            tp = tp.slice();

            // move existing TouchCircle with same key
            for (var i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                const index = getTouchIndexById(tp, touch);
                if (index < 0) continue;
                tp[index].touch = touch;
                tp[index].angle = getAngleFromCenter(touch.pageX, touch.pageY);
            }

            return tp;
        });
    }, [setTouchPoints]);

    const handleTouchEnd = useCallback((e) => {
        e.preventDefault();

        setTouchPoints(tp => {
            tp = tp.slice();

            // delete existing TouchCircle with same key
            for (var i = 0; i < e.changedTouches.length; i++) {
                const touch = e.changedTouches[i];
                const index = getTouchIndexById(tp, touch);
                if (index < 0) continue;
                tp.splice(index, 1);
            }

            if (tp.length >= vars.MIN_TOUCHPOINTS) {
                setCount(vars.MAX_COUNTDOWN);
            } else {
                setCount(-10);
            }

            return tp;
        });
    }, [setTouchPoints, setCount]);

    const reducer = (state, action) => {
        // TODO as svgRef is the root element, can we assume that the
        // current one is the only one?

        switch (action.type) {
            case 'init' :
                svg.current.addEventListener('touchstart', handleTouchStart, { passive: false });
                svg.current.addEventListener('touchmove', handleTouchMove, { passive: false });
                svg.current.addEventListener('touchcancel', handleTouchEnd, { passive: false });
                svg.current.addEventListener('touchend', handleTouchEnd, { passive: false });
                return 'waiting...';
            case 'destroy' : 
                // can't fall through so duplicate event removal
                svg.current.removeEventListener('touchstart', handleTouchStart, { passive: false });
                svg.current.removeEventListener('touchmove', handleTouchMove, { passive: false });
                svg.current.removeEventListener('touchend', handleTouchEnd, { passive: false });
                svg.current.removeEventListener('touchcancel', handleTouchEnd, { passive: false });
                return 'destroying component';
            case 'counting down' :
                return 'counting down';
            case 'countdown complete' :
                svg.current.removeEventListener('touchstart', handleTouchStart, { passive: false });
                svg.current.removeEventListener('touchmove', handleTouchMove, { passive: false });
                svg.current.removeEventListener('touchend', handleTouchEnd, { passive: false });
                svg.current.removeEventListener('touchcancel', handleTouchEnd, { passive: false });
                return 'countdown complete';
            default :
                return 'waiting...';
        }
    };

    const [state, dispatch] = useReducer(reducer, false);

    useEffect(() => {
        const id = setInterval(() => {
            setCount(c => {
                if (c <= -10) {
                    dispatch({ type: 'wait' });
                    return -10;
                } else if (c <= 0) {
                    clearInterval(id);
                    dispatch({ type: 'countdown complete' });
                    return 0;
                }
                dispatch({ type: 'counting down' });
                return --c;
            });
        }, 1000);

        return () => clearInterval(id);
    }, []);


    useEffect(() => {
        dispatch({ type: 'init' });

        return () => {
            dispatch({ type: 'destroy' });
        }
    }, []);

    return (
        <div>
            <div style={{
                color: 'white',
                position: 'absolute'
            }}>{ count }, { state }</div>
            <svg 
                ref={ svg }
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
        </div>
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
