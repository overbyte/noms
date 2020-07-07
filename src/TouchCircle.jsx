import React from 'react';
import classnames from 'classnames';
import vars from './vars';
import './TouchCircle.css';

export default function TouchCircle({ cx, cy, colour, move, active }) {
    return (
        <circle
            xmlns={ vars.SVG_NS }
            cx={ cx }
            cy={ cy }
            r={ vars.TOUCH_RADIUS }
            fill={ colour }
            className={
                classnames({
                    touchcircle: true,
                    move: move,
                    active: active,
                })
            }
            style={{
                transformOrigin: `${cx}px ${cy}px`
            }}
        />

    );
}
