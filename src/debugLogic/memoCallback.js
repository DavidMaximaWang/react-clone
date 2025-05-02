import React from '../react';
import ReactDOM from '../react-dom';

// import React from 'react';
// import ReactDOM from 'react-dom';

const Child = React.memo((props) => {
    const { userInfo } = props;
    console.log('rendered', userInfo);
    return (
        <div>
            <div>name {userInfo.name}</div>
            <div>age: {userInfo.age}</div>
        </div>
    );
});

const Parent = () => {
    const [count, setCount] = React.useState(0);
    const increment = () => setCount(count + 1);
    const userInfo = React.useMemo(() => ({ name: 'Tom', age: 18 }), []);
    // const userInfo = { name: 'Tom', age: 18 }

    return (
        <div>
            <button onClick={increment}>Clicked：{count}</button>
            <Child userInfo={userInfo} />
        </div>
    );
};

export default function test() {
    ReactDOM.render(<Parent />, document.getElementById('root'));
}
