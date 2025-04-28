import { REACT_ELEMENT, REACT_FORWARD_DREF } from './utils';
import { Component } from './Component';

function createElement(type, properties, children) {
    let ref = properties.ref || null;
    let key = properties.key || null;

    ['key', 'ref', '__self', '__source'].forEach((key) => {
        delete properties[key];
    });
    let props = { ...properties };
    if (arguments.length > 3) {
        props.children = Array.prototype.slice.call(arguments, 2);
    } else {
        props.children = children;
    }

    return {
        $$typeof: REACT_ELEMENT,
        type,
        props,
        ref,
        key
    };
}

/* return;

{
    "type": "div",
    "key": null,
    "ref": null,
    "props": {
        "children": "Hello React"
    },
    "_owner": null,
    "_store": {}
}*/

function createRef() {
    return { current: null };
}

function forwardRef(render) {
    return  {
        $$typeof: REACT_FORWARD_DREF,
        render
    }
}

const React = { createElement, Component, createRef, forwardRef };
export default React;
