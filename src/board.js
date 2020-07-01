import React, { useState, useEffect, useRef, useReducer, useCallback, useContext } from 'react';
import { Store, TP_ADD, TP_MOVE, TP_REMOVE, TP_MOVE_TO_EDGES } from './store';
import TouchCircle from './touchCircle';
import vars from './vars';

const STATE_INIT = 'listening...';
const STATE_DESTROY = 'destroying...';
const STATE_COUNTDOWN = 'counting down...';
const STATE_COUNTCOMPLETE = 'counting complete';
const STATE_WAIT = 'STATE_WAIT';

export default function Board() {
    const [count, setCount] = useState(-10);
    const svg = useRef();
    const { touchState, dispatchTouches } = useContext(Store);

    const handleTouchStart = useCallback((e) => {
        e.preventDefault();
        dispatchTouches({ type: TP_ADD, touches: e.changedTouches});
    }, [dispatchTouches]);

    const handleTouchMove = useCallback((e) => {
        e.preventDefault();
        dispatchTouches({ type: TP_MOVE, touches: e.changedTouches});
    }, [dispatchTouches]);

    const handleTouchEnd = useCallback((e) => {
        e.preventDefault();
        dispatchTouches({ type: TP_REMOVE, touches: e.changedTouches});
    }, [dispatchTouches]);

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
    }, [state, dispatchTouches]);

    useEffect(() => {
        // a touchmove should not affect the countdown
        if (touchState.current !== TP_MOVE) {
            if (touchState.touchPoints.length >= vars.MIN_TOUCHPOINTS) {
                setCount(vars.MAX_COUNTDOWN);
            } else {
                setCount(-10);
            }
        }
    }, [touchState, setCount]);

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
                <p>num fingers: { touchState.touchPoints.length }, { count }, { state }</p>
                <ul>
                    { touchState.touchPoints.map((tp, index) => <li key={ tp.touch.id }>{ index } { tp.angle }</li>) } 
                </ul>
            </div>
            <svg 
                ref={ svg }
                xmlns={ vars.SVG_NS }
                width={ window.innerWidth }
                height={ window.innerHeight }
            >
                { 
                    touchState.touchPoints.map(touchpoint =>
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

