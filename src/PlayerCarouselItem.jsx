import React, { useContext } from 'react';
import { Store } from './Store';

export default function PlayerCarouselItem({ name }) {
    const { dispatchNames } = useContext(Store);

    const handleDeleteClick = e => dispatchNames({ type: 'NAME_REMOVE', data: name });

    return (
        <React.Fragment>
            <img src={ `https://api.adorable.io/avatars/100/${name}.png` } alt={ name } />
            <p>{name}</p>
            <button onClick={ handleDeleteClick }>x</button>
        </React.Fragment>
    );
}
