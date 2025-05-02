import { useRef } from '../hooks';
import React from '../react';
import ReactDOM from '../react-dom';

function TextInputWithFocusButton() {
    const inputEl = useRef(null);
    const onButtonClick = () => {
        // `current` points to the mounted text input element
        inputEl.current.focus();
    };
    return (
        <div>
            <input ref={inputEl} type="text" />
            <button onClick={onButtonClick}>Focus the input</button>
        </div>
    );
}

export default function test() {
    ReactDOM.render(<TextInputWithFocusButton />, document.getElementById('root'));
}
