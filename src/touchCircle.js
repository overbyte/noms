import React, { useState } from 'react';
import vars from './vars';
import './touchCircle.css';

export default function TouchCircle(props) {
    const [colour] = useState(props.colour);

    return (
        <circle
            xmlns={ vars.SVG_NS }
            cx={ props.cx }
            cy={ props.cy }
            r={ vars.TOUCH_RADIUS }
            fill={ colour }
            className="touch-gfx"
            style={{
                transformOrigin: `${props.cx}px ${props.cy}px`
            }}
        />

    );
}
