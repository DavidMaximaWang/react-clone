import ReactDOM from './react-dom';
import React from './react';

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

function FuncComponent(props) {
    return (
        <div style={{ color: 'red' }}>
            Functional Hello React<span> span</span>
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


// ReactDOM.render(<FuncComponent />, document.getElementById('root'));
// ReactDOM.render(<ClassComponent a="1"/>, document.getElementById('root'));
ReactDOM.render(<RootComponent/>, document.getElementById('root'));
