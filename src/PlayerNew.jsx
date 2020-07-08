import React, { useContext, useState } from 'react';
import { Store } from './Store';

export default function PlayerNew() {
    const [name, setName] = useState('');
    const { dispatchNames } = useContext(Store);


    const handleNameChange = e => setName(e.target.value);

    const handleSubmit = e => {
        e.preventDefault();
        // add to players list in local storage
        dispatchNames({ type: 'NAME_ADD', data: name });
    };

    return (
        <section className='playernew'>
            <h1>Create a new player</h1>
            <img src={ `https://api.adorable.io/avatars/100/${name}.png` } alt={ name } />
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

