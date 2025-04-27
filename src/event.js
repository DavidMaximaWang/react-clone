import { flushUpdaterQueue, updaterQueue } from './Component';

export function addEventListener(dom, eventName, func) {
    dom.attach = dom.attach || {};
    dom.attach[eventName] = func;
    if (document[eventName]) {
        return;
    }
    //bind event to document
    document[eventName] = dispatchEvent;
}

function dispatchEvent(nativeEvent) {
    //
    updaterQueue.isBatch = true;
    // handle difference of browsers
    let syntheticEvent = createSyntheticEvent(nativeEvent);
    let target = nativeEvent.target;
    while (target) {
        syntheticEvent.currentTarget = target;
        let eventName = `on${nativeEvent.type}`;
        let bindFunc = target.attach && target.attach[eventName];
        if (bindFunc) {
            bindFunc(syntheticEvent);
        }
        if (syntheticEvent.isPropagationStopped) {
            break;
        }
        target = target.parentNode;
    }
    flushUpdaterQueue();
}

function createSyntheticEvent(nativeEvent) {
    const nativeEventKeyValues = {};
    for (const key in nativeEvent) {
        nativeEventKeyValues[key] = typeof nativeEvent[key] === 'function' ? nativeEvent[key].bind(nativeEvent) : nativeEvent[key];
    }
    const syntheticEvent = Object.assign(nativeEventKeyValues, {
        isDefaultPrevented: false,
        isPropagationStopped: false,
        preventDefault: function () {
            this.isDefaultPrevented = true;
            if (this.nativeEvent.preventDefault) {
                this.nativeEvent.preventDefault();
            } else {
                this.nativeEvent.returnValue = false;
            }
        },
        stopPropagation: function () {
            this.isPropagationStopped = true;
            if (this.nativeEvent.stopPropagation) {
                this.nativeEvent.stopPropagation();
            } else {
                this.nativeEvent.cancelBubble = true;
            }
        }
    });
    return syntheticEvent;
}
