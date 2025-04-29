import { findDOMByVNode , updateDOMTree} from "./react-dom";
import {deepClone} from "./utils"

export const updaterQueue = {
    isBatch: false,
    updaters: new Set()
}
export function flushUpdaterQueue() {
    updaterQueue.isBatch = false;
    for ( let updater of updaterQueue.updaters) {
        updater.launchUpdate();
    }
    updaterQueue.updaters.clear();
}
class Updater {
    constructor(classComponentInstance) {
        this.classComponentInstance = classComponentInstance;
        this.pendingStates = [];
    }

    addState(partialState) {
        this.pendingStates.push(partialState);
        this.preHandlerForUpdate();
    }

    preHandlerForUpdate() {
        if (updaterQueue.isBatch) {
            updaterQueue.updaters.add(this)
        } else {
            this.launchUpdate();
        }
    }

    launchUpdate(nextProps) {
        let shouldComponentUpdate = true;
        const { classComponentInstance, pendingStates } = this;
        if (pendingStates.length === 0 && !nextProps) {
            return;
        }
        const prevProps = deepClone(this.classComponentInstance.props)
        const prevState = deepClone(this.classComponentInstance.state)
        const nextState = classComponentInstance.state = this.pendingStates.reduce((preState, newState) => {
            return { ...preState, ...newState };
        }, classComponentInstance.state);

        if (classComponentInstance && classComponentInstance.shouldComponentUpdate && !classComponentInstance.shouldComponentUpdate(nextProps, nextState)) {
            shouldComponentUpdate = false;
        }

        classComponentInstance.state = nextState;
        if (nextProps) {
            classComponentInstance.props = nextProps;
        }

        this.pendingStates.length = 0;
        if (shouldComponentUpdate) {
            classComponentInstance.update(prevProps, prevState);
        }
    }
}
export class Component {
    static IS_CLASS_COMPONENGT = true;
    state = null;

    constructor(props) {
        this.updater = new Updater(this);
        this.props = props;
        this.state = {};
    }

    setState(partialState) {
        //merge attrs
        // this.state = {...this.state, ...partialState}
        // //update
        // this.update()
        this.updater.addState(partialState);
    }

    update(prevProps, prevState) {
        // get the new vdom after rerender
        // based on the new vdom, create the real dom
        // mount the real dom
        let oldVNode = this.oldVNode; //todo add oldVNode
        let oldDOM = findDOMByVNode(oldVNode) // todo save real dom to vnode
        if (this.constructor.getDerivedStateFromProps) {
            const newState = this.constructor.getDerivedStateFromProps(this.props, this.state);
            this.state = {...this.state, ...newState}
        }
        let snapshot = this.getSnapshotBeforeUpdate && this.getSnapshotBeforeUpdate(prevProps, prevState)
        let newVNode = this.render();
        updateDOMTree(oldVNode, newVNode, oldDOM)
        this.oldVNode = newVNode;
        if (this.componentDidUpdate) {
            this.componentDidUpdate(this.props, this.state, snapshot)
        }
    }
}

/*
batch action??
this.setState({a: 1})
this.setState({b: 2})
*/
