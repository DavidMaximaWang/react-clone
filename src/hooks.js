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
