import ReactDOM from './react-dom';
import React from './react'
// const root = ReactDOM.createRoot(document.getElementById('root'));
// let element = <div>Hello React</div>
// root.render(element);
ReactDOM.render(<div style={{color: 'red'}}>Hello React<span> span</span></div>, document.getElementById('root'))
console.log(<div>Hello React<span> span</span></div>)// vdom