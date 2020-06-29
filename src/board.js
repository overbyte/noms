import React, { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import TouchCircle from './touchCircle';
import vars from './vars';

const STATE_INIT = 'init';
const STATE_DESTROY = 'destroy';
const STATE_COUNTDOWN = 'counting down';
const STATE_COUNTCOMPLETE = 'counting complete';

export default function Board() {
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
                const touch = {
                    id: e.changedTouches[i].identifier,
                    x: e.changedTouches[i].pageX,
                    y: e.changedTouches[i].pageY,
                };
                const angle = getAngleFromCenter(touch.x, touch.y);

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
                const touch = {
                    id: e.changedTouches[i].identifier,
                    x: e.changedTouches[i].pageX,
                    y: e.changedTouches[i].pageY,
                };
                const index = getTouchIndexById(tp, touch);
                if (index < 0) continue;
                tp[index].touch = touch;
                tp[index].angle = getAngleFromCenter(touch.x, touch.y);
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
                const touch = {
                    id: e.changedTouches[i].identifier,
                    x: e.changedTouches[i].pageX,
                    y: e.changedTouches[i].pageY,
                };
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

    // TODO this is situational - use innerWidth/Height to get the actual angles
    // to the corners of the screen
    // TODO move so touchpoints aren't touching each other
    const moveTouchPointsToNearestEdge = () => {
        setTouchPoints(tps => touchPoints.map(tp => {
            if (tp.angle > 325 || tp.angle < 35) {
                tp.touch.x = 0;
            } else if (tp.angle < 145) {
                tp.touch.y = 0;
            } else if (tp.angle < 215) {
                tp.touch.x = window.innerWidth;
            } else {
                tp.touch.y = window.innerHeight;
            }
            tp.active = false;
            return tp;
        }));

    };

    const reducer = (state, action) => {
        // TODO as svgRef is the root element, can we assume that the
        // current one is the only one?

        switch (action.type) {
            case STATE_INIT :
                svg.current.addEventListener('touchstart', handleTouchStart, { passive: false });
                svg.current.addEventListener('touchmove', handleTouchMove, { passive: false });
                svg.current.addEventListener('touchcancel', handleTouchEnd, { passive: false });
                svg.current.addEventListener('touchend', handleTouchEnd, { passive: false });
                return 'waiting...';
            case STATE_DESTROY : 
                // can't fall through so duplicate event removal
                svg.current.removeEventListener('touchstart', handleTouchStart, { passive: false });
                svg.current.removeEventListener('touchmove', handleTouchMove, { passive: false });
                svg.current.removeEventListener('touchend', handleTouchEnd, { passive: false });
                svg.current.removeEventListener('touchcancel', handleTouchEnd, { passive: false });
                return 'destroying component';
            case STATE_COUNTDOWN :
                return 'counting down';
            case STATE_COUNTCOMPLETE :
                svg.current.removeEventListener('touchstart', handleTouchStart, { passive: false });
                svg.current.removeEventListener('touchmove', handleTouchMove, { passive: false });
                svg.current.removeEventListener('touchend', handleTouchEnd, { passive: false });
                svg.current.removeEventListener('touchcancel', handleTouchEnd, { passive: false });
                setTouchPoints(getPlayerOrder(touchPoints));
                moveTouchPointsToNearestEdge();
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
                    dispatch({ type: STATE_COUNTCOMPLETE });
                    clearInterval(id);
                    return 0;
                }
                dispatch({ type: STATE_COUNTDOWN });
                return --c;
            });
        }, 1000);

        return () => clearInterval(id);
    }, [setCount]);

    useEffect(() => {
        dispatch({ type: STATE_INIT });

        return () => {
            dispatch({ type: STATE_DESTROY });
        }
    }, []);

    return (
        <div>
            <div style={{
                color: 'white',
                position: 'absolute'
            }}>
                <p>{ count }, { state }</p>
                <ul>
                    { touchPoints.map(tp => <li key={ tp.touch.id }>{ tp.angle }</li>) } 
                </ul>
            </div>
            <svg 
                ref={ svg }
                xmlns={ vars.SVG_NS }
                width={ window.innerWidth }
                height={ window.innerHeight }
            >
                { 
                    touchPoints.map(touchpoint =>
                        <TouchCircle 
                            key={ touchpoint.touch.id }
                            cx={ touchpoint.touch.x }
                            cy={ touchpoint.touch.y }
                            col={ generateColour() }
                            move={ state === 'countdown complete' }
                        />
                    )
                }
            </svg>
        </div>
    );
}

const generateColour = () => vars.COLOURS[Math.ceil(Math.random() * vars.COLOURS.length) - 1];
const getTouchIndexById = (touchPoints, newTouch) => touchPoints.findIndex(t => t.touch.id === newTouch.id);

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

const getPlayerOrder = (touchPoints) => {
    console.log('start');
    const tp = touchPoints.slice();
    console.log(tp.map(i => i.angle));
    tp.sort((a, b) => a.angle > b.angle ? 1 : -1);
    console.log(tp.map(i => i.angle));
    const selectionIndex = Math.floor(tp.length * Math.random());
    tp.splice(0, 0, ...tp.splice(selectionIndex));
    console.log(tp.map(i => i.angle));
    console.log('fin');
    return tp;
};
