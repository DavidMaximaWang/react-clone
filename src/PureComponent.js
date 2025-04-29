import { Component } from './Component';
import { shallCompare } from './utils';

class PureComponent extends Component {
    constructor(props) {
        super(props);
    }
    shouldComponentUpdate(nextProps, nextState) {
        const ret =  !shallCompare(this.props, nextProps) || !shallCompare(this.state, nextState);
        return ret;
    }
}

export default PureComponent;
