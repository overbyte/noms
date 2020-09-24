import React, { useState, useReducer, useEffect } from 'react';
import PlayerCarousel from './PlayerCarousel';
import './Player.css';

export default function Player() {
    // use ternery because calling .split() will cause an error if the localstorage
    // item doesn't exist
    const initialNameState = localStorage.getItem('nomsPlayers') 
        ? localStorage.getItem('nomsPlayers').split(',')
        : [];

    const namesReducer = (state, { type, data }) => {
        switch (type) {
            case 'NAME_ADD' :
                return [...state, data];
            case 'NAME_REMOVE' :
                return state.filter(name=> name !== data);
            case 'NAME_SELECT' :
                return [...state];
            default :
                throw new Error('Unrecognised name event type', type);
        }
    };

    const [names, dispatchNames] = useReducer(namesReducer, initialNameState);

    useEffect(() => {
        localStorage.setItem('nomsPlayers', names);
    }, [names]);

    return (
        <div className="panel">
            <Existing dispatchNames={ dispatchNames } names={ names } />
            <New dispatchNames={ dispatchNames } />
        </div>
    );
}

function New({ dispatchNames }) {
    const [name, setName] = useState('');

    const handleNameChange = e => setName(e.target.value);

    const handleSubmit = e => {
        e.preventDefault();
        dispatchNames({ type: 'NAME_ADD', data: name });
        setName('');
    };

    return (
        <section className='playernew'>
            <h1>Add A New Player</h1>
            <img src={ `https://api.adorable.io/avatars/180/${ name }.png` } alt={ name } />
            <form onSubmit={ handleSubmit }>
                <input 
                    type='text' 
                    placeholder='Name'
                    minLength={ 2 }
                    maxLength={ 12 }
                    required={ true }
                    value={ name }
                    onChange={ handleNameChange }
                />
                <button>Create</button>
            </form>
        </section>
    );
}

function Existing({ names, dispatchNames }) {
    return (
        <section className="playerexisting">
            <h1>Choose a Player</h1>
            <PlayerCarousel dispatchNames={ dispatchNames } names={ names }></PlayerCarousel>
        </section>
    );
}

