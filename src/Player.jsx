import React from 'react';
import {
    useRouteMatch,
    Switch,
    Route,
} from 'react-router-dom';
import PlayerNew from './PlayerNew';
import PlayerExisting from './PlayerExisting';
import './Player.css';

export default function Player() {
    const { path } = useRouteMatch();

    return (
        <div className="panel">
            <Switch>
                <Route 
                    path={ `${ path }/start` }
                    render={ () => <div className="playerstart"><h1>Player Start</h1></div> }
                />
                <Route path={ path }>
                    <PlayerNew />
                    <PlayerExisting />
                </Route>
            </Switch>
        </div>
    );
}

