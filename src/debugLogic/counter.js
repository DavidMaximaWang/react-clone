import React from '../react';
import ReactDOM from '../react-dom';

// import React from "react";
// import ReactDOM from "react-dom";

function Counter() {
    const [count, setCount] = React.useState(0)
    function handleClick() {
        setCount(count + 1)
    }
    return (<div>
        <button onClick={handleClick}>
        click me

    </button>

    <span>{count}</span>
    </div>);
}

// export default Counter;


const test = () => ReactDOM.render(<Counter />, document.getElementById('root'));
export default test;