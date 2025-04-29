import React from '../react';
import ReactDOM from '../react-dom';

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: 'xxxx@xx.com',
            prevUserID: this.props.userID
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.userID !== state.prevUserID) {
            return {
                prevUserID: props.userID,
                email: props.userID + "@bbbb.com"
            };
        }
        return null;
    }

    render() {
        return (
            <div>
                <h1> Email: </h1>
                <h1>{this.state.email}</h1>
            </div>
        );
    }
}

class Parent extends React.Component {
    constructor() {
        super();
        this.state = { email: 'xxx@xx.com', userId: 'parentuserId' };
    }
    changeValue() {
        this.setState({ email: 'bbb@bb.com', userId: 'changedParentId' });
    }

    render() {
        return (
            <div>
                <input type="button" value="Click to change value" onClick={() => this.changeValue()} />
                <Form userID={this.state.userId} />
            </div>
        );
    }
}

const test = () => ReactDOM.render(<Parent />, document.getElementById('root'));
export default test;
