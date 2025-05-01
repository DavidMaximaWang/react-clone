import {MOVE, CREATE, REACT_ELEMENT, REACT_FORWARD_DREF, REACT_TEXT, REACT_MEMO } from './utils';
import {addEventListener} from './event.js'
import {resetHookIndex} from './hooks.js'

export let emitUpdateForHooks;

//initial render
function render(VNode, containerDOM) {
    // convert vdom to real dom
    // mount the real dom to containerDOM
    mount(VNode, containerDOM);
    emitUpdateForHooks = () => {
        resetHookIndex();
        updateDOMTree(VNode, VNode, findDOMByVNode(VNode))
    }
}

function createDOM(VNode) {
    const { type, props, ref } = VNode;

    let dom;
    if (type && type.$$typeof === REACT_FORWARD_DREF) {
        return getDOMFromForwardRef(VNode);
    } else if (type && type.$$typeof === REACT_MEMO) {
        return getDOMByMemoComponent(VNode);
    } else if (typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT && VNode.type.IS_CLASS_COMPONENGT) {
        return getDomByClassComponent(VNode);
    } else if (typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT) {
        return getDOMFromFunctionalComponent(VNode);
    } else if (type === REACT_TEXT) {
        dom = document.createTextNode(props.text);
    } else if (type && VNode.$$typeof === REACT_ELEMENT) {
        dom = document.createElement(type); // need to consider the textnode case if use setAttribute(key, VNodeProps[key])
        //https://reactjs.org/docs/introducing-jsx.html
        // Since JSX is closer to JavaScript than to HTML, React DOM uses camelCase property naming convention instead of HTML attribute names.
        // For example, class becomes className in JSX, and tabindex becomes tabIndex.
    }

    if (props && dom.type !== Node.TEXT_NODE) {
        //single children
        if (typeof props.children === 'object' && props.children.type) {
            mount(props.children, dom);
        } else if (props.children instanceof Array) {
            mountArray(props.children, dom);
        }
        setPropsForDOM(dom, props);
    }
    if (ref) {
        ref.current = dom;
    }

    VNode.dom = dom;
    return dom;
}

function getDOMFromForwardRef(VNode) {
    let {type, props, ref} = VNode;
    let renderVNode = type.render(props, ref);
    return createDOM(renderVNode)
}

function getDOMFromFunctionalComponent(VNode) {
    let { type, props } = VNode;
    let renderVNode = type(props);
    if (!renderVNode) {
        return null;
    }
    VNode.oldRenderVNode = renderVNode
    const dom =  createDOM(renderVNode);
    VNode.dom = dom;
    return dom;
}

function getDOMByMemoComponent(vNode) {
    const { type, props } = vNode;

    let renderVNode = type.type(props);
    if (!renderVNode) return null;
    vNode.oldRenderVNode = renderVNode;
    return createDOM(renderVNode);
}

function getDomByClassComponent(VNode) {
    const { type, props, ref } = VNode;
    const instance = new type(props);
    VNode.classInstance = instance;
    const renderVNode = instance.render();
    instance.oldVNode = renderVNode;
    /* //todo test only, remove later, start
    setTimeout(()=> {
        debugger;
        instance.setState({'aaa': 'bbb'})
        }, 4000)
    //todo test only, remove later, end
    */
    if (!render) {
        return null;
    }
    if (ref) {
        ref.current = instance
    }
    const dom = createDOM(renderVNode);
    if (instance && instance.componentDidMount) {
        instance.componentDidMount();
    }
    return dom;
}

function setPropsForDOM(dom, VNodeProps = {}) {
    if (!dom) {
        return;
    }
    for (let key in VNodeProps) {
        if (key === 'children') continue;
        if (/^on[A-Z].*/.test(key)) {
            const eventName = key.toLowerCase();
            // dom.addEventListener(eventName, VNodeProps[key]);
            addEventListener(dom, eventName, VNodeProps[key])
        } else if (key === 'style') {
            Object.entries(VNodeProps[key]).forEach(([key, value]) => {
                dom.style[key] = value;
            });
        } else {
            dom[key] = VNodeProps[key]
        }
    }
}

function mount(VNode, containerDOM) {
    let newDOM = createDOM(VNode);
    if (newDOM) {
        containerDOM.appendChild(newDOM);
    }
}

function mountArray(children, containerDOM) {
    if (!Array.isArray(children)) return;
    for (let [i, child] of Object.entries(children)) {
        child.index = i;
        mount(child, containerDOM);
    }
}

export function findDOMByVNode(VNode) {
    if(!VNode) {
        return
    }
    if (VNode.dom) {
        return VNode.dom;
    }
}

export function updateDOMTree(oldVNode, newVNode, oldDOM) {
    // let parentNode = oldDOM.parentNode;
    // parentNode.removeChild(oldDOM)
    // parentNode.appendChild(createDOM(newVNode))

    // oldVNode: exist? type? and newVNode: exist? type?
    // compare if both exist and type are the same
    const TYPE_MAP = {
        NO_OPERATE: !oldVNode && !newVNode,
        ADD: !oldVNode && newVNode,
        DELETE: oldVNode && !newVNode,
        REPLACE: oldVNode && newVNode && oldVNode.type !== newVNode.type
    }
    let UPDATE_TYPE = Object.keys(TYPE_MAP).filter(key=> TYPE_MAP[key])[0];
    switch (UPDATE_TYPE) {
        case 'NO_OPERATE':
            break;
        case 'ADD':
            oldDOM.parentNode.appendChild(createDOM(newVNode))
            break;
        case 'DELETE':
            removeVNode(oldVNode);
            break;
        case 'REPLACE':
            removeVNode(oldVNode);
            oldDOM.parentNode.appendChild(createDOM(newVNode));
            break;
        default:
            deepDOMDiff(oldVNode, newVNode)
            break;
    }
}

function removeVNode(vNode) {
    const currentDOM = findDOMByVNode(vNode)
    if (currentDOM) {
        currentDOM.remove();
    }
    if (vNode.classInstance && vNode.classInstance.componentWillUnmount) {
        vNode.classInstance.componentWillUnmount()
    }
}

function deepDOMDiff(oldVNode, newVNode) {
    let diffTypeMap = {
        ORIGIN_NODE: typeof oldVNode.type === 'string',
        CLASS_COMPONENT: typeof oldVNode.type === 'function' && oldVNode.$$typeof === REACT_ELEMENT && oldVNode.type.IS_CLASS_COMPONENGT,
        FUNCTIONAL_COMPONENT: typeof oldVNode.type === 'function' && oldVNode.$$typeof === REACT_ELEMENT,
        TEXT: oldVNode.type === REACT_TEXT && oldVNode.props.text !== newVNode.props.text,
        MEMO: oldVNode.type.$$typeof === REACT_MEMO
    }

    let DIFF_TYPE = Object.keys(diffTypeMap).filter(key=> diffTypeMap[key])[0]
    switch (DIFF_TYPE) {
        case 'ORIGIN_NODE':
            let currentDOM = newVNode.dom = findDOMByVNode(oldVNode);
            setPropsForDOM(currentDOM, newVNode.props);
            updateChildren(currentDOM, oldVNode.props.children, newVNode.props.children);
            break;
        case 'CLASS_COMPONENT':
            updateClsssComPonent(oldVNode, newVNode);
            break;
        case 'FUNCTIONAL_COMPONENT':
            updateFunctionalComPonent(oldVNode, newVNode)
            break;
        case 'TEXT':
            newVNode.dom = findDOMByVNode(oldVNode);
            newVNode.dom.textContent = newVNode.props.text;
            break;
        case 'MEMO':
            updateMemoFunctionalComponent(oldVNode, newVNode);
            break;
        default:
            break;
    }
}

function updateMemoFunctionalComponent(oldVNode, newVNode) {
    const {type} = oldVNode
    if (!type.compare(oldVNode.props, newVNode.props)) {
        const oldDOM = findDOMByVNode(oldVNode)
        const {type} = newVNode;
        let renderVNode = type.type(newVNode.props);
        newVNode.oldRenderVNode = renderVNode
        updateDOMTree(oldVNode.oldRenderVNode, renderVNode, oldDOM)
    } else {
        newVNode.oldRenderVNode = oldVNode.oldRenderVNode;
    }
}

function updateClsssComPonent(oldVNode, newVNode){
    const classInstance = newVNode.classInstance = oldVNode.classInstance;
    classInstance.updater.launchUpdate(newVNode.props);
}

function updateFunctionalComPonent(oldVNode, newVNode) {
    let oldDOM = newVNode.dom = findDOMByVNode(oldVNode)
    if (!oldDOM) {
        return;
    }
    const {type, props} = newVNode;
    let newRenderedVNode = type(props)
    updateDOMTree(oldVNode.oldRenderVNode, newRenderedVNode, oldDOM);
    newVNode.oldRenderVNode = newRenderedVNode
}

//dom diff core
// can improve by 'longest increasing subsequence'
function updateChildren(parentDOM, oldVNodeChildren, newVNodeChildren) {
    oldVNodeChildren = (Array.isArray(oldVNodeChildren) ? oldVNodeChildren : [oldVNodeChildren]).filter(Boolean);
    newVNodeChildren = (Array.isArray(newVNodeChildren) ? newVNodeChildren : [newVNodeChildren]).filter(Boolean);
    let lastNotChangeIndex = -1;
    let oldKeyChildMap = {};
    oldVNodeChildren.forEach((oldVNode, index) => {
        let oldKey = oldVNode && oldVNode.key ? oldVNode.key : index;
        oldKeyChildMap[oldKey] = oldVNode;
    });

    // traverse new children vdom array, find which can be reused but need to move position, which need to be created, need to be deleted, can resuse and position correct

    let actions = [];
    newVNodeChildren.forEach((newVNode, index) => {
        newVNode.index = index;
        let newKey = newVNode.key ? newVNode.key : index;
        let oldVNode = oldKeyChildMap[newKey];
        if (oldVNode) {
            deepDOMDiff(oldVNode, newVNode);
            if (oldVNode.index < lastNotChangeIndex) {
                actions.push({
                    type: MOVE,
                    oldVNode,
                    newVNode,
                    index
                });
            }
            delete oldKeyChildMap[newKey];
            lastNotChangeIndex = Math.max(lastNotChangeIndex, oldVNode.index);
        } else {
            actions.push({ type: CREATE, newVNode, index });
        }
    });
    let VNodeToMove = actions.filter((action) => action.type === MOVE).map((action) => action.oldVNode);
    let VNodeToDelete = Object.values(oldKeyChildMap);
    [...VNodeToMove, ...VNodeToDelete].forEach((oldVNode) => {
        let currentDOM = findDOMByVNode(oldVNode);
        currentDOM.remove();
    });
    actions.forEach(({ type, oldVNode, newVNode, index }) => {
        const getDomForInsert = () => {
            if (type === CREATE) {
                return createDOM(newVNode);
            } else {
                return findDOMByVNode(oldVNode);
            }
        };
        let childNodes = parentDOM.childNodes;
        let childNode = childNodes[index];
        parentDOM.insertBefore(getDomForInsert(), childNode);
    });
}

const ReactDOM = {
    render
};

export default ReactDOM;
