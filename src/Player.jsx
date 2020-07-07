import React from 'react';
import {
    useRouteMatch,
    Switch,
    Route,
} from 'react-router-dom';

export default function Player() {
    const { path } = useRouteMatch();

    return (
        <div className="component panel">
            <Switch>
                <Route 
                    path={ `${path}/new` }
                    render={ () => <div className="playernew"><h1>Player New</h1></div> }
                />
                <Route 
                    path={ `${path}/existing` }
                    render={ () => <div className="playerexisting"><h1>Player Existing</h1></div> }
                />
                <Route 
                    path={ `${path}/start` }
                    render={ () => <div className="playerstart"><h1>Player Start</h1></div> }
                />
                <Route 
                    path={ path }
                    render={ () => <div className="playerstart"><h1>Player Start</h1></div> }
                />
            </Switch>
        </div>
    );
}

