import * as RX from 'reactxp';
import { Debug } from '../utils/debug';
import { SimpleComponentBase } from '../simple-component-base';

let __nextId = 0;
export class AnimView extends SimpleComponentBase<{ shouldAnimateOnLoad?: boolean, shouldAnimateKey?: any, style?: RX.Types.StyleRuleSet<RX.Types.ViewStyle> }> {

    private _in_animScaleValue = new RX.Animated.Value(1);
    private _in_animTiming = RX.Animated.timing(this._in_animScaleValue,
        { toValue: 1.0, duration: 500, easing: RX.Animated.Easing.InOut() }
    );
    private _in_animStyle = RX.Styles.createAnimatedViewStyle({
        // opacity: animatedOpacityValue,
        transform: [{
            scale: this._in_animScaleValue
        }]
    });

    private _animateKey: any = undefined;

    private _in_play = () => {
        const newKey = this.props.shouldAnimateKey || null;

        if (this.props.shouldAnimateOnLoad === false
            && this._animateKey === undefined) {
            this._animateKey = newKey;
            this._in_animScaleValue.setValue(1);

        } else if (this._animateKey !== newKey) {
            this._animateKey = newKey;
            this._in_animScaleValue.setValue(0);
            this._in_animTiming.start();
        }
    }

    _id = __nextId++;
    _log: string[] = [];
    log(m: string) {
        // this._log = [m].concat(this._log);
        // console.log('log' + this._id, this._log);
    }

    componentDidMount() {
        this.log('componentDidMount');
        this._in_play();
    }

    // componentWillUnmount() {
    //     this.log('componentWillUnmount');
    //     // TODO:
    // }

    // shouldComponentUpdate() {
    //     console.log('shouldComponentUpdate');
    // }

    // componentWillReceiveProps() {
    //     this.log('componentWillReceiveProps');
    //     // this._in_animTiming.start();
    // }

    // componentWillUpdate() {
    //     this.log('componentWillUpdate');
    // }

    componentDidUpdate(prevProps: { children: JSX.Element | null }) {
        this.log('componentDidUpdate');
        this._in_play();
    }

    render() {
        return (
            <RX.Animated.View style={[this._in_animStyle, this.props.style]}>
                {/*{'#' + this._id}*/}
                {this.props.children}
            </RX.Animated.View>
        );
    }
}
