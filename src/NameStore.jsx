import React, { useReducer, createContext } from 'react';

export const NameStore = createContext();

// use ternery because calling .split() will cause an error if the localstorage
// item doesn't exist
const initialNameState = localStorage.getItem('nomsPlayers') 
    ? localStorage.getItem('nomsPlayers').split(',')
    : [];

const namesReducer = (state, { type, data }) => {
    let newState;
    switch (type) {
        case 'NAME_ADD' :
            newState = [...state, data];
            localStorage.setItem('nomsPlayers', newState);
            return newState;
        case 'NAME_REMOVE' :
            newState = state.filter(name=> name !== data);
            localStorage.setItem('nomsPlayers', newState);
            return newState;
        case 'NAME_SELECT' :
            return [...state];
        default :
            throw new Error('Unrecognised name event type', type);
    }
};

export const NameStoreProvider = (props) => {
    const [names, dispatchNames] = useReducer(namesReducer, initialNameState);
    const value = { names, dispatchNames };

    return <NameStore.Provider value={ value }>{ props.children }</NameStore.Provider>;
};
