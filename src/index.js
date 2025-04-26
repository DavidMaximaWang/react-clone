import ReactDOM from './react-dom';
import React from './react';

class ClassComponent extends React.Component {
    render() {
        return (
            <div style={{ color: 'red' }}>
                Class Hello React<span> span {this.props.a}</span>
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
