import {emitUpdateForHooks} from './react-dom';
let states = [];
let hookIndex = 0;

export function resetHookIndex() {
    hookIndex = 0;
}

export function useState(initValue) {
    states[hookIndex] = states[hookIndex] || initValue;
    const currentIndex = hookIndex;
    function setState(newState) {
        states[currentIndex] = newState;
        emitUpdateForHooks();
    }
    return [states[hookIndex++], setState];
}

export function useReducer(reducer, initState) {
    states[hookIndex] = states[hookIndex] || initState;

    const currentIndex = hookIndex;
    function dispatch(action) {
        const newState = reducer(states[currentIndex], action);
        states[currentIndex] = {...states[currentIndex], ...newState};
        emitUpdateForHooks();
    }
    return [states[hookIndex++], dispatch];
}