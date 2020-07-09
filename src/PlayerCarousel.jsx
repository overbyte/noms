import React, { useEffect, useRef } from 'react';
import './PlayerCarousel.css';

export default function PlayerCarousel({ dispatchNames, names }) {
    const ref = useRef();

    useEffect(() => {
        ref.current.scrollTo({ left: ref.current.scrollWidth, behavior: 'smooth' });
    }, [names]);

    return (
        <ul className="carousel" ref={ ref }>
            {
                names.map((name, index) => 
                        <Item 
                            key={ index }
                            name={ name }
                            dispatchNames={ dispatchNames }
                        />
                )
            }
        </ul>
    );
}

function Item({ name, dispatchNames }) {

    const handleDeleteClick = e => dispatchNames({ type: 'NAME_REMOVE', data: name });
    const handleSelectClick = e => dispatchNames({ type: 'NAME_SELECT', data: name });

    return (
        <li className='item'>
            <img src={ `https://api.adorable.io/avatars/100/${name}.png` } alt={ name } />
            <p>{name}</p>
            <button onClick={ handleDeleteClick }>x</button>
            <div className="selection" onClick={ handleSelectClick }></div>
        </li>
    );
}
