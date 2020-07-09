import React from 'react';
import {
    HashRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import Board from './Board';
import Game from './Game';
import Player from './Player';
import { StoreProvider } from './Store';
import './Noms.css';

export default function Noms() {
    return (
        <div className="noms">
            <StoreProvider>
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
            </StoreProvider>
        </div>
    )
}

