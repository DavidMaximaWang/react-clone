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


// ReactDOM.render(<FuncComponent />, document.getElementById('root'));
ReactDOM.render(<ClassComponent a="1"/>, document.getElementById('root'));
