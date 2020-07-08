import React, { useContext } from 'react';
import { Store } from './Store';
import PlayerCarousel from './PlayerCarousel';

export default function PlayerExisting() {

    const { names } = useContext(Store);

    return (
        <section className="playerexisting">
            <h1>Choose an existing player</h1>
            <PlayerCarousel names={names}></PlayerCarousel>
        </section>
    );
}
