import { REACT_ELEMENT } from './utils';
import {addEventListener} from './event.js'

//initial render
function render(VNode, containerDOM) {
    // convert vdom to real dom
    // mount the real dom to containerDOM
    mount(VNode, containerDOM);
}

function createDOM(VNode) {
    const { type, props, ref } = VNode;

    let dom;
    if (typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT && VNode.type.IS_CLASS_COMPONENGT) {
        return getDomByClassComponent(VNode);
    } else if (typeof type === 'function' && VNode.$$typeof === REACT_ELEMENT) {
        return getDOMFromFunctionalComponent(VNode);
    }
    if (type && VNode.$$typeof === REACT_ELEMENT) {
        dom = document.createElement(type);
    }

    if (props) {
        //single children
        if (typeof props.children === 'object' && props.children.type) {
            mount(props.children, dom);
        } else if (props.children instanceof Array) {
            mountArray(props.children, dom);
        } else if (typeof props.children === 'string') {
            dom.appendChild(document.createTextNode(props.children));
        }
        setPropsForDOM(dom, props);
    }
    if (ref) {
        ref.current = dom;
    }

    VNode.dom = dom;
    return dom;
}

function getDOMFromFunctionalComponent(VNode) {
    let { type, props } = VNode;
    let renderVNode = type(props);
    if (!renderVNode) {
        return null;
    }

    return createDOM(renderVNode);
}

function getDomByClassComponent(VNode) {
    const { type, props, ref } = VNode;
    const instance = new type(props);
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
    return createDOM(renderVNode);
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
            dom.setAttribute(key, VNodeProps[key]);
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
    for (let child of children) {
        if (typeof child === 'string') {
            containerDOM.appendChild(document.createTextNode(child));
        } else {
            mount(child, containerDOM);
        }
    }
}

export function findDOMByVNode(VNode) {
    if(!VNode) {
        return
    }
    return VNode.dom;
}

export function updateDOMTree(oldDOM, newVNode) {
    let parentNode = oldDOM.parentNode;
    parentNode.removeChild(oldDOM)
    parentNode.appendChild(createDOM(newVNode))
}

const ReactDOM = {
    render
};

export default ReactDOM;
