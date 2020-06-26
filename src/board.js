import React, { useState, useEffect, useRef } from 'react';
import TouchCircle from './touchCircle';
import vars from './vars';

export default function Board(props) {
    const [touchPoints, setTouchPoints] = useState([]);
    const svg = useRef();

    useEffect(() => {
        const svgRef = svg.current;

        const handleTouchStart = (e) => {
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

                return tp;
            });
        };

        const handleTouchMove = (e) => {
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
        };

        const handleTouchEnd = (e) => {
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

                return tp;
            });
        };

        console.log('add touch listeners');
        svgRef.addEventListener('touchstart', handleTouchStart, { passive: false });
        svgRef.addEventListener('touchmove', handleTouchMove, { passive: false });
        svgRef.addEventListener('touchcancel', handleTouchEnd, { passive: false });
        svgRef.addEventListener('touchend', handleTouchEnd, { passive: false });

        return () => {
            console.log('remove touch listeners');
            svgRef.removeEventListener('touchstart', handleTouchStart, { passive: false });
            svgRef.removeEventListener('touchmove', handleTouchMove, { passive: false });
            svgRef.removeEventListener('touchend', handleTouchEnd, { passive: false });
            svgRef.removeEventListener('touchcancel', handleTouchEnd, { passive: false });
        }
    }, [setTouchPoints]);// eslint-disable-next-line react-hooks/exhaustive-deps

    return (
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
