import { REACT_ELEMENT, REACT_FORWARD_DREF, REACT_MEMO, shallCompare, toVNode } from './utils';
import { Component } from './Component';
import PureComponent from './PureComponent';
import { useState, useReducer, useEffect, useLayoutEffect } from './hooks';

function createElement(type, properties, children) {
    let ref = properties.ref || null;
    let key = properties.key || null;

    ['key', 'ref', '__self', '__source'].forEach((key) => {
        delete properties[key];
    });
    let props = { ...properties };
    if (arguments.length > 3) {
        props.children = Array.prototype.slice.call(arguments, 2).map(toVNode);
    } else {
        props.children = toVNode(children);
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

function memo(type, compare=shallCompare) {
    return {
        $$typeof: REACT_MEMO,
        type,
        compare,
    }
}

const React = { useState, useReducer, useEffect, useLayoutEffect, createElement, Component,  PureComponent, createRef, forwardRef, memo };
export default React;
