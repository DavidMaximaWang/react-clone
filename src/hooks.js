import { emitUpdateForHooks } from './react-dom';
import { shallCompare } from './utils';
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
        states[currentIndex] = { ...states[currentIndex], ...newState };
        emitUpdateForHooks();
    }
    return [states[hookIndex++], dispatch];
}

export function useEffect(effect, deps = []) {
    const currentIndex = hookIndex;
    const [destroyFn, preDeps] = states[hookIndex] || [null, null];
    if (!states[hookIndex] || deps.some((item, index) => item !== preDeps[index])) {
        setTimeout(() => {
            destroyFn && destroyFn();
            states[currentIndex] = [effect(), deps];
        });// after Dom mounted
    }
    hookIndex++;
}

export function useLayoutEffect(effect, deps = []) {
    const currentIndex = hookIndex;
    const [destroyFn, preDeps] = states[hookIndex] || [null, null];
    if (!states[hookIndex] || deps.some((item, index) => item !== preDeps[index])) {
        queueMicrotask(() => {
            destroyFn && destroyFn();
            states[currentIndex] = [effect(), deps];
        });// before Dom mounted, will block mount
    }
    hookIndex++;
}

export function useRef(initialValue) {
    states[hookIndex] = states[hookIndex] || { current: initialValue }
    return states[hookIndex++]
  }

export function useImperativeHandle(ref, refMaker) {
    ref.current = refMaker()
}

export function useMemo(dataFactory, deps) {
    const [prevData, prevDeps] = states[hookIndex] || [null, null];
    if (
        !states[hookIndex] ||
        deps.some((item, index) => {
            return item !== prevDeps[index];
        })
    ) {
        const newData = dataFactory();
        states[hookIndex++] = [newData, deps];
        return newData;
    }
    hookIndex++;

    return prevData;
}

export function useCallback(callback, deps) {
    let [prevCallback, preDeps] = states[hookIndex] || [null, null];
    if (!states[hookIndex] || deps.some((item, index) => item !== preDeps[index])) {
        states[hookIndex++] = [callback, deps];
        return callback;
    }
    hookIndex++;
    return prevCallback;
  }