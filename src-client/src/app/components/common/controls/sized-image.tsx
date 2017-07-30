import { SimpleComponentBase } from '../simple-component-base';
import * as RX from 'reactxp';
import { getSize } from "./sized-image-common";

export class SizedImage extends SimpleComponentBase<{ source: string, style: RX.Types.StyleRuleSet<RX.Types.ImageStyle>, maxWidth: number }, { width: number, height: number }>{

    onImageLoad = () => {
        const img = this.refs['img'] as RX.Image;
        const w = img.getNativeWidth();
        const h = img.getNativeHeight();

        this.setState(getSize(w, h, this.props.maxWidth));
    };

    render() {

        const w = this.state && this.state.width || 50;
        const h = this.state && this.state.height || 50;
        const s = RX.Styles.createViewStyle({
            width: w,
            height: h,
        }, false);

        return (
            <RX.View style={s}>
                <RX.Image ref='img' source={this.props.source} style={this.props.style} onLoad={this.onImageLoad} />
            </RX.View>
        );
    }
}