// import { useRef } from '../hooks';
import React from '../react';
import ReactDOM from '../react-dom';

// import React from 'react';
// import ReactDOM from 'react-dom';

function FancyInput(props, ref) {
    const inputRef = React.useRef();
    React.useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current.focus();
        }
    }));
    return <input ref={inputRef} />;
}
FancyInput = React.forwardRef(FancyInput);

function TextInputWithFocusButton() {
    const inputEl = React.useRef(null);
    const onButtonClick = () => {
        // `current` points to the mounted text input element
        inputEl.current.focus();
        // inputEl.current.style.opacity = 0; // won't effect
    };
    return (
        <div>
            <FancyInput ref={inputEl} />
            <button onClick={onButtonClick}>Focus the input</button>
        </div>
    );
}

export default function test() {
    ReactDOM.render(<TextInputWithFocusButton />, document.getElementById('root'));
}

