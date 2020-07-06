import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import Board from './board';
import AddPlayer from './addPlayer';
import './noms.css';

export default function Noms() {
    const routes = [
        {
            path: '/addplayer/new',
            component: () =>  (
                <div className='addnewplayer component'>
                    <h1>add new player</h1>
                </div>
            )
        },
        {
            path: '/addplayer/existing',
            component: () => (
                <div className='addexistingplayer component'>
                    <h1>add existing player</h1>
                </div>
            )
        },
        {
            path: '/addplayer',
            component: AddPlayer,
        },
        {
            path: '/game/start',
            component: () => (
                <div className='gamestart component'>
                    <h1>Game Start</h1>
                </div>
            )
        },
        {
            path: '/game/nominate',
            component: () => (
                <div className='gamenominate component'>
                    <h1>Game Nominate</h1>
                </div>
            )
        },
        {
            path: '/game',
            component: () => (
                <div className='game component'>
                    <h1>Game</h1>
                </div>
            )
        },
        {
            path: '/',
            component: () => (
                <div className='home component'>
                    <h1>Home</h1>
                </div>
            )
        },
    ];

    return (
        <div className="noms">
            <Router>
                <Switch>
                    {
                        routes.map(route => {
                            return (
                                <Route
                                    path={ route.path }
                                    component={ route.component }
                                />
                            );
                        })
                    }
                </Switch>
            </Router>
            <Board />
        </div>
    )
}
