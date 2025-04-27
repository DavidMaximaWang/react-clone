import ReactDOM from './react-dom';
import React from './react';

class ClassComponent extends React.Component {
    constructor(props) {
        super();
        this.props = props;
        this.state = {aaa: '111'}
    }
    render() {
        return (
            <div style={{ color: 'red' }}>
                Class Hello React<span> span {this.state.aaa}</span>
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


ReactDOM.render(<FuncComponent />, document.getElementById('root'));
ReactDOM.render(<ClassComponent a="1"/>, document.getElementById('root'));
