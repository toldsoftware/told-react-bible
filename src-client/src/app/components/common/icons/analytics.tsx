import * as RX from 'reactxp';
import ImageSvg, { SvgPath } from 'reactxp-imagesvg';
import { IconBase, IconProps } from './icon-base';

export const AnalyticsIcon = (props: IconProps) => (
    <IconBase viewBox='0 -2 40 40' {...props} >
        <SvgPath strokeColor={props.style.strokeColor} fillColor={props.style.fillColor} 
            // tslint:disable-next-line:max-line-length
            d='m17.5 2.5c9.7 0 17.5 7.8 17.5 17.5 0 1-0.1 2-0.2 2.9-0.1 0.5-0.2 0.9-0.3 1.3-1.8 7.7-8.8 13.3-17 13.3-9.5 0-17.3-7.7-17.5-17.1v-0.4c0-0.7 0.1-1.3 0.2-2 1-8.7 8.3-15.5 17.3-15.5z m16.2 19.4c0.1-0.6 0.1-1.3 0.1-1.9 0-2.2-0.4-4.3-1.3-6.3-0.8-2-2-3.7-3.5-5.2s-3.2-2.7-5.2-3.5c-2-0.9-4.1-1.2-6.3-1.2s-4.3 0.3-6.3 1.2c-2 0.8-3.7 2-5.2 3.5s-2.7 3.2-3.5 5.2c-0.9 2-1.2 4.1-1.2 6.3 1 1.6 2.2 2.7 2.2 2.7h0.1v0c0.1 0.1 1.2 1.3 2.8 1.1 0.9-0.2 2.1-2.1 3-3.3 0.3-0.5 0.7-1 0.9-1.3 1.3-1.6 2.7-1.8 3.5-1.6 1.9 0.2 3.5 2.1 4.3 3.9 0.5 1.4 1.4 2.2 2.5 2.3 1.1 0 2.4-0.8 3.3-2.3 0.1-0.2 0.2-0.3 0.3-0.6 0.7-1.3 1.9-3.4 4.1-3.4 2.4 0 4 2.7 4.1 2.8 0.3 0.3 0.7 0.9 1.3 1.6z'
        />
    </IconBase>
);
