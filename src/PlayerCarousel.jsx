import React, { useEffect, useRef } from 'react';
import PlayerCarouselItem from './PlayerCarouselItem';
import './PlayerCarousel.css';

export default function PlayerCarousel({ names }) {
    const ref = useRef();

    const handleClick = e => {
        console.log(e);
    };

    useEffect(() => {
        ref.current.scrollTo({ left: ref.current.scrollWidth, behavior: 'smooth' });
    }, [names]);

    return (
        <ul className="carousel" ref={ ref }>
            {
                names.map((name, index) => (
                    <li 
                        key={index}
                        className='item'
                        onClick={ handleClick }>
                        <PlayerCarouselItem 
                            name={name}
                        />
                    </li>
                ))
            }
        </ul>
    );
}
