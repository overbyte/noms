import React, { useState, useContext } from 'react';
import { useRouteMatch, Switch, Route } from 'react-router-dom';
import { NameStore, NameStoreProvider } from './NameStore';
import PlayerCarousel from './PlayerCarousel';
import './Player.css';

export default function Player() {
    const { path } = useRouteMatch();

    return (
        <div className="panel">
            <NameStoreProvider>
                <Switch>
                    <Route 
                        path={ `${ path }/start` }
                        render={ () => <div className="playerstart"><h1>Player Start</h1></div> }
                    />
                    <Route path={ path }>
                        <New />
                        <Existing />
                    </Route>
                </Switch>
            </NameStoreProvider>
        </div>
    );
}

function New() {
    const [name, setName] = useState('');
    const { dispatchNames } = useContext(NameStore);

    const handleNameChange = e => setName(e.target.value);

    const handleSubmit = e => {
        e.preventDefault();
        dispatchNames({ type: 'NAME_ADD', data: name });
        setName('');
    };

    return (
        <section className='playernew'>
            <h1>Create a new player</h1>
            <img src={ `https://api.adorable.io/avatars/100/${ name }.png` } alt={ name } />
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

function Existing() {
    const { names } = useContext(NameStore);

    return (
        <section className="playerexisting">
            <h1>Choose an existing player</h1>
            <PlayerCarousel names={ names }></PlayerCarousel>
        </section>
    );
}

