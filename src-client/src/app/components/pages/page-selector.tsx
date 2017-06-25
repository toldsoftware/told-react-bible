import * as RX from 'reactxp';

import { Store } from "../../store/store";
import { NewsIcon } from "../common/icons/news";
import { MenuIcon } from "../common/icons/menu";
import { IconStyle } from "../common/icons/icon-base";
import { PageLayout } from "../page/page-layout";
import { SettingsPage } from "./settings-page";
import { NewsPage } from "./news-page";

export const PageSelector = (props: { store: Store, pageName: string }) => {
    switch (props.pageName) {
        case 'Empty': return <EmptyPage store={props.store} />
        case 'Newsfeed': return <NewsPage store={props.store} />
        default: return <SettingsPage store={props.store} />
    }
};

export const PageIcon = (props: { pageName: string, iconStyle: IconStyle }) => {
    switch (props.pageName) {
        case 'Newsfeed': return <NewsIcon style={props.iconStyle} />
        default: return <MenuIcon style={props.iconStyle} />
    }
};

export const EmptyPage = (props: { store: Store }) => (
    <PageLayout store={props.store} postsStore={props.store}>
        <RX.View >
        </RX.View>
    </PageLayout>
);