import React from 'react';

export const TP_ADD = 'TP_ADD';
export const TP_MOVE = 'TP_MOVE';
export const TP_REMOVE = 'TP_REMOVE';
export const TP_MOVE_TO_EDGES = 'TP_MOVE_TO_EDGES';
export const TP_CHOOSE_PLAYER = 'TP_CHOOSE_PLAYER';

export const Store = React.createContext();

const initialState = {
    touchPoints: [],
    current: '',
};

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


    return tp;
}

const moveToEdges = tp => {
    // TODO this is situational - use innerWidth/Height to get the actual angles
    // to the corners of the screen
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

const reducer = (state, { type, touches }) => {
    switch(type) {
        case TP_ADD :
            return {...state, touchPoints: addTouchPoints([...state.touchPoints], touches), current: type  };
        case TP_MOVE :
            return {...state, touchPoints: moveTouchPoints([...state.touchPoints], touches), current: type  };
        case TP_REMOVE :
            return {...state, touchPoints: removeTouchPoints([...state.touchPoints], touches), current: type  };
        case TP_CHOOSE_PLAYER :
            return {...state, touchPoints: getPlayerOrder([...state.touchPoints]), current: type  };
        case TP_MOVE_TO_EDGES :
            return {...state, touchPoints: moveToEdges([...state.touchPoints]), current: type  };
        default:
            throw new Error('Unrecognised touchpoint event type');
    }
};

export const StoreProvider = (props) => {
    const [touchState, dispatchTouches] = React.useReducer(reducer, initialState);
    const value = { touchState, dispatchTouches };

    return <Store.Provider value={ value }>{ props.children }</Store.Provider>;
};
