import * as RX from 'reactxp';

import { Store } from "../../store/store";
import { NewsIcon } from "../common/icons/news";
import { MenuIcon } from "../common/icons/menu";
import { IconStyle } from "../common/icons/icon-base";
import { PageLayout } from "../page/page-layout";
import { SettingsPage } from "./settings-page";
// import { NewsPage } from "./news-page";
import { BookIcon } from "../common/icons/book";
import { RocketIcon } from "../common/icons/rocket";
import { InteractPage } from "./interact-page";
import { ReadPage } from "./read-page";

export const PageSelector = (props: { store: Store, pageName: string }) => {
    switch (props.pageName) {
        case 'Empty': return <EmptyPage store={props.store} />
        case 'Settings': return <SettingsPage store={props.store} />
        // case 'Newsfeed': return <NewsPage store={props.store} />
        case 'Read': return <ReadPage store={props.store} />
        case 'Interact': // return <InteractPage store={props.store} />
        default: return <InteractPage store={props.store} />
    }
};

export const PageIcon = (props: { pageName: string, iconStyle: IconStyle }) => {
    switch (props.pageName) {
        // case 'Newsfeed': return <NewsIcon style={props.iconStyle} />
        case 'Read': return <BookIcon style={props.iconStyle} />
        case 'Interact': return <RocketIcon style={props.iconStyle} />
        default: return <MenuIcon style={props.iconStyle} />
    }
};

export const EmptyPage = (props: { store: Store }) => (
    <PageLayout store={props.store} postsStore={props.store}>
        <RX.View >
        </RX.View>
    </PageLayout>
);