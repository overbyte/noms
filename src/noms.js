import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import Board from './board';
import PlayerAdd from './playerAdd';
import './noms.css';

export default function Noms() {
    const routes = [
        {
            path: '/player/new',
            component: () =>  (
                <div className='playernew component'>
                    <h1>add new player</h1>
                </div>
            )
        },
        {
            path: '/player/existing',
            component: () => (
                <div className='playerexisting component'>
                    <h1>add existing player</h1>
                </div>
            )
        },
        {
            path: '/player/start',
            component: () => (
                <div className='playerstart component'>
                    <h1>Choose a player to start</h1>
                </div>
            )
        },
        {
            path: '/player',
            component: PlayerAdd,
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
            path: '/game/play',
            component: () => (
                <div className='gameplay component'>
                    <h1>Game play</h1>
                </div>
            )
        },
        {
            path: '/game/over',
            component: () => (
                <div className='gameover component'>
                    <h1>Game Over</h1>
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
