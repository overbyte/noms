import React, { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import TouchCircle from './touchCircle';
import vars from './vars';

const STATE_INIT = 'init';
const STATE_DESTROY = 'destroy';
const STATE_COUNTDOWN = 'counting down';
const STATE_COUNTCOMPLETE = 'counting complete';

const TP_ADD = 'TP_ADD';
const TP_MOVE = 'TP_MOVE';
const TP_DELETE = 'TP_DELETE';
const TP_SETUP_GAME = 'TP_SETUP_GAME';

export default function Board() {
    const [count, setCount] = useState(-10);
    const svg = useRef();

    const initialTouchPoints = [];
    // TODO man there's a lot of code here - break up into functions at least
    const [touchPoints, dispatchTouches] = useReducer((tp, { type, touches }) => {
        console.log('received tp dispatch', type, touches);
        switch(type) {
            case TP_ADD :
                // note e.changedTouches is a TouchList not an array
                // so we can't map over it
                for (var i = 0; i < touches.length; i++) {
                    const touch = {
                        id: touches[i].identifier,
                        x: touches[i].pageX,
                        y: touches[i].pageY,
                    };
                    const angle = getAngleFromCenter(touch.x, touch.y);
                    const isActive = false;

                    tp.push({ touch, angle, isActive });
                }
                if (tp.length >= vars.MIN_TOUCHPOINTS) {
                    setCount(vars.MAX_COUNTDOWN);
                }
                return [...tp];
            case TP_MOVE :
                // move existing TouchCircle with same key
                for (var i = 0; i < touches.length; i++) {
                    const touch = {
                        id: touches[i].identifier,
                        x: touches[i].pageX,
                        y: touches[i].pageY,
                    };
                    const index = getTouchIndexById(tp, touch);
                    if (index < 0) continue;
                    tp[index].touch = touch;
                    tp[index].angle = getAngleFromCenter(touch.x, touch.y);
                }
                return [...tp];
            case TP_DELETE :
                // delete existing TouchCircle with same key
                for (var i = 0; i < touches.length; i++) {
                    const touch = {
                        id: touches[i].identifier,
                        x: touches[i].pageX,
                        y: touches[i].pageY,
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

                return [...tp];
            case TP_SETUP_GAME :
                // TODO this is situational - use innerWidth/Height to get the actual angles
                // to the corners of the screen
                // TODO move so touchpoints aren't touching each other
                tp = tp.map(t => {
                    if (t.angle > 325 || t.angle < 35) {
                        t.touch.x = 0;
                    } else if (t.angle < 145) {
                        t.touch.y = 0;
                    } else if (t.angle < 215) {
                        t.touch.x = window.innerWidth;
                    } else {
                        t.touch.y = window.innerHeight;
                    }
                    return t;
                });
                tp = getPlayerOrder(tp);
                return [...tp];
        }
    }, initialTouchPoints);

    const handleTouchStart = useCallback((e) => {
        e.preventDefault();
        console.log('sending start event');
        dispatchTouches({ type: TP_ADD, touches: e.changedTouches});
    }, []);

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();
        console.log('sending move event');
        dispatchTouches({ type: TP_MOVE, touches: e.changedTouches});
    }, []);

    const handleTouchEnd = useCallback((e) => {
        e.preventDefault();
        console.log('sending end event');
        dispatchTouches({ type: TP_DELETE, touches: e.changedTouches});
    }, []);

    const stateReducer = (state, action) => {
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
                dispatchTouches({ type: TP_SETUP_GAME });
                return 'countdown complete';
            default :
                return 'waiting...';
        }
    };

    const [state, dispatchState] = useReducer(stateReducer, 'not started');

    useEffect(() => {
        const id = setInterval(() => {
            setCount(c => {
                if (c <= -10) {
                    dispatchState({ type: 'wait' });
                    return -10;
                } else if (c <= 0) {
                    dispatchState({ type: STATE_COUNTCOMPLETE });
                    clearInterval(id);
                    return 0;
                }
                dispatchState({ type: STATE_COUNTDOWN });
                return --c;
            });
        }, 1000);

        return () => clearInterval(id);
    }, [setCount]);

    useEffect(() => {
        dispatchState({ type: STATE_INIT });

        return () => {
            dispatchState({ type: STATE_DESTROY });
        }
    }, []);

    return (
        <div>
            <div style={{
                color: 'white',
                position: 'fixed'
            }}>
                <p>{ count }, { state }</p>
                <ul>
                    { touchPoints.map((tp, index) => <li key={ tp.touch.id }>{ index } { tp.angle }</li>) } 
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
                            active={ touchpoint.isActive }
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
    const tp = touchPoints.slice();
    tp.sort((a, b) => a.angle > b.angle ? 1 : -1);
    const selectionIndex = Math.floor(tp.length * Math.random());
    tp.splice(0, 0, ...tp.splice(selectionIndex));
    return tp;
};
