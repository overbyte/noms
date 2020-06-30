import React, { useState, useEffect, useRef, useReducer, useCallback } from 'react';
import TouchCircle from './touchCircle';
import vars from './vars';

const STATE_INIT = 'listening...';
const STATE_DESTROY = 'destroying...';
const STATE_COUNTDOWN = 'counting down...';
const STATE_COUNTCOMPLETE = 'counting complete';
const STATE_WAIT = 'STATE_WAIT';

const TP_ADD = 'TP_ADD';
const TP_MOVE = 'TP_MOVE';
const TP_REMOVE = 'TP_REMOVE';
const TP_MOVE_TO_EDGES = 'TP_MOVE_TO_EDGES';
const TP_CHOOSE_PLAYER = 'TP_CHOOSE_PLAYER';

export default function Board() {
    const [count, setCount] = useState(-10);
    const svg = useRef();

    const addTouchPoints = (tp, touches) => {
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
        return tp;
    };

    const moveTouchPoints = (tp, touches) => {
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
        return tp;
    };

    const removeTouchPoints = (tp, touches) => {
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

        return tp;
    }

    const moveToEdges = tp => {
        // TODO this is situational - use innerWidth/Height to get the actual angles
        // to the corners of the screen
        // TODO move so touchpoints aren't touching each other
        return tp.map(t => {
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
    };

    const getPlayerOrder = tp => {
        // sort by angle
        tp.sort((a, b) => a.angle > b.angle ? 1 : -1);
        // move a random number of items to front of array
        const selectionIndex = Math.floor(tp.length * Math.random());
        tp.splice(0, 0, ...tp.splice(selectionIndex));
        return tp;
    };

    const initialTouchPoints = [];
    const [touchPoints, dispatchTouches] = useReducer((tp, { type, touches }) => {
        switch(type) {
            case TP_ADD :
                return addTouchPoints(tp.slice(), touches);
            case TP_MOVE :
                return moveTouchPoints(tp.slice(), touches);
            case TP_REMOVE :
                return removeTouchPoints(tp.slice(), touches);
            case TP_CHOOSE_PLAYER :
                return getPlayerOrder(tp.slice());
            case TP_MOVE_TO_EDGES :
                return moveToEdges(tp.slice());
            default:
                throw new Error('Unrecognised touchpoint event type');
        }
    }, initialTouchPoints);

    const handleTouchStart = useCallback((e) => {
        e.preventDefault();
        dispatchTouches({ type: TP_ADD, touches: e.changedTouches});
    }, []);

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();
        dispatchTouches({ type: TP_MOVE, touches: e.changedTouches});
    }, []);

    const handleTouchEnd = useCallback((e) => {
        e.preventDefault();
        dispatchTouches({ type: TP_REMOVE, touches: e.changedTouches});
    }, []);

    const addTouchListeners = () => {
        svg.current.addEventListener('touchstart', handleTouchStart, { passive: false });
        svg.current.addEventListener('touchmove', handleTouchMove, { passive: false });
        svg.current.addEventListener('touchcancel', handleTouchEnd, { passive: false });
        svg.current.addEventListener('touchend', handleTouchEnd, { passive: false });
    };

    const removeTouchListeners = () => {
        svg.current.removeEventListener('touchstart', handleTouchStart, { passive: false });
        svg.current.removeEventListener('touchmove', handleTouchMove, { passive: false });
        svg.current.removeEventListener('touchend', handleTouchEnd, { passive: false });
        svg.current.removeEventListener('touchcancel', handleTouchEnd, { passive: false });
    };

    const stateReducer = (state, action) => {
        switch (action.type) {
            case STATE_INIT :
                addTouchListeners();
                return 'adding listeners';
            case STATE_WAIT :
                return 'waiting...';
            case STATE_DESTROY : 
                removeTouchListeners();
                return 'destroying component';
            case STATE_COUNTDOWN :
                return 'counting down';
            case STATE_COUNTCOMPLETE :
                removeTouchListeners();
                return 'countdown complete';
            default :
                throw new Error('Unexpected state found');
        }
    };

    const [state, dispatchState] = useReducer(stateReducer, 'not started');

    useEffect(() => {
        switch (state) {
            case 'countdown complete' :
                dispatchTouches({ type: TP_MOVE_TO_EDGES });
                break;
            default :
                break;
        }
    }, [state]);

    useEffect(() => {
        const id = setInterval(() => {
            setCount(c => {
                if (c <= -10) {
                    dispatchState({ type: STATE_WAIT });
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
                            col={ vars.generateColour() }
                            move={ state === 'countdown complete' }
                            active={ touchpoint.isActive }
                        />
                    )
                }
            </svg>
        </div>
    );
}

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

