import React, { useEffect, useRef } from 'react';
import PlayerCarouselItem from './PlayerCarouselItem';
import './PlayerCarousel.css';

export default function PlayerCarousel({ names }) {
    const ref = useRef();

    useEffect(() => {
        ref.current.scrollTo({ left: ref.current.scrollWidth, behavior: 'smooth' });
    }, [names]);

    return (
        <ul className="carousel" ref={ ref }>
            {
                names.map((name, index) => 
                        <PlayerCarouselItem 
                            key={index}
                            name={name}
                        />
                )
            }
        </ul>
    );
}
