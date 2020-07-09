import React, { useContext } from 'react';
import { NameStore } from './NameStore';
import PlayerCarousel from './PlayerCarousel';

export default function PlayerExisting() {

    const { names } = useContext(NameStore);

    return (
        <section className="playerexisting">
            <h1>Choose an existing player</h1>
            <PlayerCarousel names={names}></PlayerCarousel>
        </section>
    );
}
