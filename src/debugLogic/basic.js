import ReactDOM from '../react-dom';
import React from '../react';

class ClassComponent extends React.Component {
    counter = 0;
    constructor(props) {
        super();
        this.props = props;
        this.state = {count: '0'}
    }
    updateText(text) {
        this.setState({count: text + ''})
    }
    render() {
        return (
            <div style={{ color: 'blue', cursor: 'pointer', border: '1px solid grey' }} onClick={() =>this.updateText(++this.counter)}>
                Class Hello React<span> span {this.state.count}</span>
            </div>
        );
    }
}
let ForwardRefFunctionalComponent = React.forwardRef((props, ref)=> {
    return <input ref={ref} value="This is a forward ref functional component"/>
})
function FuncComponent(props) {
    let forwardRef = React.createRef()
    let classRef = React.createRef()
    let elementRef = React.createRef()
    const changeInput = () => {
        forwardRef.current.value = 'ForwardRef....'
        classRef.current.updateText('100')
        elementRef.current.value = 'xxxx'
    }

    return (
        <div>
            <ForwardRefFunctionalComponent ref={forwardRef}/><br/>
            <input ref={elementRef}/><br/>
            <input type="button" onClick={changeInput}  value="Click me change to xxx"/>
            <ClassComponent ref={classRef}/>

        </div>
    );
}

class RootComponent extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.state = { count: 0 };
        this.ref = React.createRef();
        this.show100 = this.show100.bind(this);
        this.focusElement = this.focusElement.bind(this)
    }
    show100() {
        this.ref.current.updateText(100);
    }

    // render() {
    //     return (
    //         <div>
    //             <div onClick={this.show100}>xxx</div>
    //             <ClassComponent ref={this.ref} />
    //         </div>
    //     );
    // }
    focusElement() {
        if (this.ref.current) {
            this.ref.current.focus()
        }
    }
    render() {
        return (
            <div>
                <input type="text" ref={this.ref}/>
                <input type="button"
                value="focus to the input"
            onClick={this.focusElement}
                />
            </div>
        );
    }
}
debugger;


export default function test() {
ReactDOM.render(<FuncComponent />, document.getElementById('root'));
// ReactDOM.render(<ClassComponent a="1"/>, document.getElementById('root'));
// ReactDOM.render(<RootComponent/>, document.getElementById('root'));
}