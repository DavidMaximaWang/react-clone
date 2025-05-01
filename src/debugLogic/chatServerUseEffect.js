// import React, { React.useState, React.useEffect } from 'react';
// import ReactDOM from 'react-dom';

import React from '../react';
import ReactDOM from '../react-dom';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
    const [serverUrl, setServerUrl] = React.useState('https://localhost:1234');

    React.useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => {
            connection.disconnect();
        };
    }, [roomId, serverUrl]);
    const handleChange = (e) =>{
        debugger;
        setServerUrl(e.target.value);}
    return (
        <div>
            <label>
                Server URL: <input value={serverUrl} onInput={handleChange} />
            </label>
            <h1>Welcome to the {roomId} room!</h1>
        </div>
    );
}

function App() {
    const [roomId, setRoomId] = React.useState('general');
    const [show, setShow] = React.useState(false);
    return (
        <div>
            <label>
                Choose the chat room:{' '}
                <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
                    <option value="general">general</option>
                    <option value="travel">travel</option>
                    <option value="music">music</option>
                </select>
            </label>
            <button onClick={() => setShow(!show)}>{show ? 'Close chat' : 'Open chat'}</button>
            {show && <hr />}
            {show && <ChatRoom roomId={roomId} />}
        </div>
    );
}

export default function test() {
    ReactDOM.render(<App />, document.getElementById('root'));
}
