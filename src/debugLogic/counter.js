import React from '../react';
import ReactDOM from '../react-dom';

// import React from 'react';
// import ReactDOM from 'react-dom';

function Counter1() {
    const [count, setCount] = React.useState(0);
    function handleClick() {
        setCount(count + 1);
    }
    return (
        <div>
            <button onClick={handleClick}>click me</button>

            <span>{count}</span>
        </div>
    );
}

function reducer(state, action) {
    if (action.type === 'increment') {
        return { number: state.number + 1 };
    }
}

function Counter() {
    const [state, dispatch] = React.useReducer(reducer, { number: 33 });

    return (
        <div>
            <button
                onClick={() => {
                    dispatch({ type: 'increment' });
                }}
            >
                click me
            </button>

            <span>{state.number}</span>
        </div>
    );
}

const test = () => ReactDOM.render(<Counter />, document.getElementById('root'));
export default test;
