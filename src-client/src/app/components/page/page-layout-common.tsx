import { ViewOnLayoutEvent } from 'reactxp/dist/common/Types';
import * as RX from 'reactxp';
import { styles, sizes, colors } from '../../styles';
import { NewsIcon } from '../common/icons/news';
import { LocalIcon } from '../common/icons/local';
import { DirectoryIcon } from '../common/icons/directory';
import { HomeIcon } from '../common/icons/home';
import { MenuIcon } from '../common/icons/menu';
import { Store } from '../../store/store';
import { storeComp } from '../common/store-component-base';
import { Debug } from '../common/utils/debug';
import { SearchIcon } from "../common/icons/search";
import { ClearIcon } from "../common/icons/clear";
import { FeedbackButton } from "../smart/feedbackButton";
import { PageName, PageTabList } from "../pages/page-names";
import { PageIcon } from "../pages/page-selector";

export interface PostsStoreProvider {
    getIsLoading(): boolean;

    setSearch?(value: string): void;
    getSearch?(): string;
}


export const TabBar = (props: { store: Store }) => {
    return (
        <RX.View style={[styles.tabBar]} >
            {PageTabList.map(x=>(
                <PageTab name={x} store={props.store} />
            ))}
        </RX.View>
    );
};

const PageTab = (props: { name: PageName, store: Store, title?: string }) => storeComp(() => ({
    active: props.store.getPage()
}), (state) => {

    // Cache Action in Store    
    const s = props.store.uiActions;
    const n = 'PageTab_onPress_' + props.name;
    const onPress = s[n] = s[n] || (() => props.store.gotoPage(props.name));

    // Creates an arrow function every render
    // const onPress = () => props.store.gotoPage(props.name);

    const active = state.active;
    const buttonStyle = props.name === active ? styles.tab_button_active : styles.tab_button;
    const textStyle = props.name === active ? styles.tab_text_active : styles.tab_text;
    const iconStyle = props.name === active ? styles.tabIcon_active : styles.tabIcon;
    const icon = (
        <PageIcon pageName={props.name} iconStyle={iconStyle} />
    );

    return (
        <RX.Button style={buttonStyle} onPress={onPress}>
            <RX.View style={styles.center_content}>{icon}</RX.View>
            <RX.Text style={textStyle}>{props.title || props.name}</RX.Text>
        </RX.Button>
    );
});


export const Loader = (props: { store: PostsStoreProvider }) => storeComp(() => ({
    isLoading: props.store.getIsLoading(),
}), (state) => {

    // console.log('Loader.render', state.isLoading);

    return state.isLoading && (
        <RX.View style={styles.loader}>
            <RX.ActivityIndicator size={'medium'} color={colors.loader} />
        </RX.View>
    );
});

export const MiniLoader = (props: { store: PostsStoreProvider }) => storeComp(() => ({
    isLoading: props.store.getIsLoading(),
    isWeb: RX.Platform.getType() === 'web'
}), (state) => {

    // console.log('Loader.render', state.isLoading);

    return (
        <RX.View style={styles.mini_loader}>
            {state.isLoading && (
                state.isWeb ? (
                    <RX.View style={styles.mini_loader_container_web} >
                        <RX.ActivityIndicator size={'tiny'} color={colors.mini_loader_web} deferTime={0} />
                    </RX.View>
                ) : (
                        <RX.ActivityIndicator size={'tiny'} color={colors.mini_loader_native} deferTime={0} />
                    )
            )}
        </RX.View>
    );
});

export const AppIconImage = () => (
    <RX.View style={styles.headerBar_appIconImage_view}>
        <RX.Image style={styles.headerBar_appIconImage} source='/static/images/icon_24.png'></RX.Image>
    </RX.View>
);

export const AppImage = () => (
    <RX.View style={styles.appImage_view}>
        <RX.Image style={styles.appImage} source='/static/images/icon_128.png'></RX.Image>
    </RX.View>
);

export const HeaderBar = (props: { store: PostsStoreProvider }) => storeComp(() => ({
    hasSearch: props.store.getSearch,
    search: props.store.getSearch && props.store.getSearch(),
}), (state) => {

    let s = state.search;
    let searchTimeoutId: any = null;

    const setSearch = (value: string) => {
        s = value;

        clearTimeout(searchTimeoutId);
        searchTimeoutId = setTimeout(onDone, 1000);
    };

    const clearSearch = () => {
        clearTimeout(searchTimeoutId);
        props.store.setSearch('');
    };

    const onDone = () => {
        clearTimeout(searchTimeoutId);
        props.store.setSearch(s);
    };

    return (
        <RX.View style={styles.headerBar}>
            <AppIconImage />
            <MiniLoader store={props.store} />
            {state.hasSearch ? (
                <RX.View style={styles.searchBox_view}>
                    <SearchIcon style={styles.searchIcon} />
                    <SearchTextBox value={state.search} setValue={setSearch} onDone={onDone} />
                    <RX.Button onPress={clearSearch}>
                        <ClearIcon style={styles.searchIcon} />
                    </RX.Button>
                </RX.View>
            ) : (
                    <RX.View style={styles.flex1}>
                    </RX.View>
                )}
            <RX.View style={styles.headerButtons}>
                <FeedbackButton />
            </RX.View>
        </RX.View>
    );
});

const SearchTextBox = (props: { value: string, setValue: (value: string) => void, onDone: () => void }) => (
    <RX.TextInput
        style={styles.searchBox_text}
        value={props.value}
        onChangeText={props.setValue}
        onSubmitEditing={props.onDone}
        onBlur={props.onDone}
        placeholder='Search'
        placeholderTextColor={styles.searchBox_text_placeholder_color}
    />
);
