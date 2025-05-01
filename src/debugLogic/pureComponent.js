import React from '../react';
import ReactDOM from '../react-dom';

class Greeting1 extends React.PureComponent {
    render() {
        console.log('Greeting was rendered at', new Date().toLocaleTimeString());
        return (
            <h3>
                Hello{this.props.name && ', '}
                {this.props.name}!
            </h3>
        );
    }
}

function Greeting2({name}) {
    console.log("rendering memo greeting")
    return (
        <h3>
            Hello{name && ', '}
            {name}!
        </h3>
    );
}
const Greeting = React.memo(Greeting2)

class MyApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: '', address: '' };
    }

    setName = (newName) => {
        this.setState({ name: newName });
    };
    setAddress = (newAddress) => {
        this.setState({ address: newAddress });
    };
    render() {
        return (
            <div>
                <label>
                    Name{': '}
                    <input
                        onInput={(e) => {
                            this.setName(e.target.value);
                        }}
                    />
                </label>
                <label>
                    Address{': '}
                    <input
                        onInput={(e) => {
                            this.setAddress(e.target.value);
                        }}
                    />
                </label>
                <Greeting name={this.state.name} />
            </div>
        );
    }
}

const test = () => ReactDOM.render(<MyApp />, document.getElementById('root'));
export default test;
