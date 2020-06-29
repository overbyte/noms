import React, { useState } from 'react';
import classnames from 'classnames';
import vars from './vars';
import './touchCircle.css';

export default function TouchCircle({ cx, cy, col, move, active }) {
    const [colour] = useState(col);

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
