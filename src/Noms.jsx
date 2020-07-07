import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
    useRouteMatch,
} from 'react-router-dom';
import Board from './Board';
import Game from './Game';
import Player from './Player';
import './Noms.css';

export default function Noms() {
    return (
        <div className="noms">
            <Router>
                <Switch>
                    <Route 
                        path="/player" 
                        component={ Player }
                    />
                    <Route 
                        path="/game" 
                        component={ Game }
                    />
                </Switch>
            </Router>

            <Board />
        </div>
    )
}

