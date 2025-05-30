import React from '../react';
import ReactDOM from '../react-dom';

class ScrollingList extends React.Component {
    isAppend = true;
    count = 0;
    intervalId = 0;
    constructor(props) {
        super(props);
        this.listRef = React.createRef();
        this.state = { list: [] };
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        // Are we adding new items to the list?
        // Capture the scroll position so we can adjust scroll later.
        if (prevState.list.length < this.state.list.length) {
            const list = this.listRef.current;
            return list.scrollHeight - list.scrollTop;
        }
        return null;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // If we have a snapshot value, we've just added new items.
        // Adjust scroll so these new items don't push the old ones out of view.
        // (snapshot here is the value returned from getSnapshotBeforeUpdate)
        if (snapshot !== null) {
            const list = this.listRef.current;
            list.scrollTop = list.scrollHeight - snapshot;
        }
    }

    appendData() {
        if (this.isAppend) {
            this.intervalId = setInterval(() => {
                this.setState({ list: [...this.state.list, this.count++] });
            }, 1000);
        } else {
            clearInterval(this.intervalId);
        }

        this.isAppend = !this.isAppend;
    }
    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        return (
            <div>
                <input type="button" onClick={() => this.appendData()}  value={'add or stop'}/>
                <div
                    ref={this.listRef}
                    style={{
                        overflow: 'auto',
                        height: '400px',
                        background: '#efefef'
                    }}
                >
                    {this.state.list.map((item) => {
                        return (
                            <div key={item} style={{ height: '60px', padding: '10px', marginTop: '10px', border: '1px solid grey' }}>
                                {item}{' '}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

const test = () => ReactDOM.render(<ScrollingList />, document.getElementById('root'));
export default test;
