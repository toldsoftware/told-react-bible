import { ViewOnLayoutEvent } from 'reactxp/dist/common/Types';
import * as RX from 'reactxp';
import { styles, sizes, colors } from '../../styles';
import { MainLayout } from '../common/layout/main-layout';
import { Store } from "../../store/store";
import { HeaderBar, PostsStoreProvider, TabBar } from './page-layout-common';

export const PageLayout = (props: { children?: any, store: Store, postsStore?: PostsStoreProvider, onScrollReachEnd?: () => void, shouldHideTabBar?: boolean }) => {

    return (
        <MainLayout
            backgroundColor={colors.back_page}
            headerContent={<HeaderBar store={props.postsStore || props.store} />}
            footerContent={!props.shouldHideTabBar && <TabBar store={props.store} />}
            footerHeight={sizes.footer_height}
            onScrollReachEnd={props.onScrollReachEnd}
        >
            <RX.View style={[styles.fullColumn, styles.pageBackground]}>
                {props.children}
            </RX.View>
        </MainLayout>
    );
};

