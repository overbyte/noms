import React from 'react';
import {
    useRouteMatch,
    Switch,
    Route,
} from 'react-router-dom';

export default function Game() {
    const { path } = useRouteMatch();

    return (
        <div className="component panel">
            <Switch>
                <Route 
                    path={ `${path}/nominate` }
                    render={ () => <div className="gamenominate"><h1>Game Nominate</h1></div> }
                />
                <Route 
                    path={ `${path}/play` }
                    render={ () => <div className="gameplay"><h1>Game Play</h1></div> }
                />
                <Route 
                    path={ `${path}/over` }
                    render={ () => <div className="gameover"><h1>Game Over</h1></div> }
                />
                <Route 
                    path={ path }
                    render={ () => <div className="game"><h1>Game</h1></div> }
                />
            </Switch>
        </div>
    );
}
