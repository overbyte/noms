import React, { useContext } from 'react';
import { Store } from './Store';

export default function PlayerCarouselItem({ name }) {
    const { dispatchNames } = useContext(Store);

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
