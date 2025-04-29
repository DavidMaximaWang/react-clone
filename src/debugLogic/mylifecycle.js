import React from '../react';
import ReactDOM from '../react-dom';
class Clock extends React.Component {
    constructor(props) {
      super(props);
      this.state = {date: new Date()};
    }

    // after component mounted
    // if you need real dom to do something
    // if you need get data
    // subscribe some events
    // NOT for setState(should be in a condition if use it, will have infinite loop), as it will cause remount
    componentDidMount() {
        console.log("component did Mount")
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }


    // before the component be removed from the DOM tree
    // unmount, unsubscribe, clear the interval..., clear internet request
    // NOT setState, as it will be destroyed
    //
    componentWillUnmount() {
      clearInterval(this.timerID);
    }

    // after update, not for initialize
    // when update fini, need to update the dom
    // when the current props and previous props have some difference, can send internet request
    // You can setState, but must be conditional use., otherwise you will have a infinite loop
    // if shouldComponentUpdate is false, then componentDidUpdate won't be triggered, no lifecycle methods will be triggrtf
    // if you have getSnapshotBeforeUpdate, then componentDidUpdate can accept the third paramerer: snapshot parameter
    // Better NOT copy props to state, use it directly
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log("Did update", this.state.date)
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("should component update");
        // return false; // won't update
        return true; // update
    }

    tick() {
      this.setState({
        date: new Date()
      });
    }

    render() {
      return (
        <div>
          <h1>Hello, world!</h1>
          <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
        </div>
      );
    }
  }

//   const root = ReactDOM.createRoot(document.getElementById('root'));
  const test = () => ReactDOM.render(<Clock />, document.getElementById('root'));
  export default test;