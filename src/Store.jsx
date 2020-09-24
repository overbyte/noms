import React, { useReducer, createContext } from 'react';
import vars from './vars';

export const Store = createContext();

const initialState = {
    touchPoints: [],
    current: '',
};

const addTouchPoints = (tp, touchList) => {
    const newTouches = Array.from(touchList)
        .map(touch => {
            return {
                touch: {
                    id: touch.identifier,
                    x: touch.pageX,
                    y: touch.pageY,
                },
                angle: getAngleFromCenter(touch.pageX, touch.pageY),
                isActive: false,
                colour: vars.generateColour(),
            };
        });

    return [
        ...tp,
        ...newTouches,
    ];
};

const moveTouchPoints = (tp, touchList) => {
    const touches = Array.from(touchList);
    return tp
        .map(t => {
            const matches = touches.filter(touch => touch.identifier === t.touch.id);
            // uses if because using filter causes css keyframes to reset
            if (matches.length > 0) {
                const touch = matches[0];
                return {
                    ...t,
                    touch: {
                        id: touch.identifier,
                        x: touch.pageX,
                        y: touch.pageY,
                    },
                    angle: getAngleFromCenter(touch.pageX, touch.pageY),
                };
            } else {
                return t;
            }
        });
};

const removeTouchPoints = (tp, touchList) => {
    const touches = Array.from(touchList);
    return tp
        .filter(t => 
            touches.filter(touch => touch.identifier === t.touch.id).length < 1
        );
}

const moveToEdges = tp => {
    // TODO this is situational - use innerWidth/Height to get the actual angles
    // to the corners of the screen to determine the angles to use
    // TODO move so touchpoints aren't touching each other
    return tp.map(t => {
        if (t.angle > 325 || t.angle < 35) {
            t.touch.x = 80;
        } else if (t.angle < 145) {
            t.touch.y = 80;
        } else if (t.angle < 215) {
            t.touch.x = window.innerWidth - 80;
        } else {
            t.touch.y = window.innerHeight - 80;
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

const touchReducer = (state, { type, touches }) => {
    switch(type) {
        case 'TP_ADD' :
            return {...state, touchPoints: addTouchPoints([...state.touchPoints], touches), current: type  };
        case 'TP_MOVE' :
            return {...state, touchPoints: moveTouchPoints([...state.touchPoints], touches), current: type  };
        case 'TP_REMOVE' :
            return {...state, touchPoints: removeTouchPoints([...state.touchPoints], touches), current: type  };
        case 'PLAYER_CHOOSE' :
            return {...state, touchPoints: getPlayerOrder([...state.touchPoints]), current: type  };
        case 'PLAYER_READY' :
            let touchPoints = moveToEdges([...state.touchPoints]);
            touchPoints[0].isActive = true;
            return {...state, touchPoints, current: type  };
        default:
            throw new Error('Unrecognised touchpoint event type', type);
    }
};

export const StoreProvider = (props) => {
    const [touchState, dispatchTouches] = useReducer(touchReducer, initialState);
    const value = { touchState, dispatchTouches };

    return <Store.Provider value={ value }>{ props.children }</Store.Provider>;
};
