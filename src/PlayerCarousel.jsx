import React from 'react';
import PlayerCarouselItem from './PlayerCarouselItem';
import './PlayerCarousel.css';

export default function PlayerCarousel({ names }) {
    return (
        <ul className="carousel">
            {
                names.map((name, index) => (
                    <li key={index} className='item'>
                        <PlayerCarouselItem 
                            name={name}
                        />
                    </li>
                ))
            }
        </ul>
    );
}
