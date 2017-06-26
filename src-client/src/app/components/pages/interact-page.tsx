import * as RX from 'reactxp';
import { storeComp } from '../common/store-component-base';
import { Store } from '../../store/store';
import { styles } from "../../styles";
import { PostList } from "../posts/post-list";
import { FacebookLogin } from "../common/account/facebook-login";
import { PostsBaseList } from "../page/posts-base-list";
import { PageLayout } from "../page/page-layout";
import { PassageViewer } from "../bible/passage";

export const InteractPage = (props: { store: Store }) => (
    <PageLayout store={props.store}>
        <RX.View style={styles.page}>
            <InteractView store={props.store} />
        </RX.View>
    </PageLayout>
);

export const InteractView = (props: { store: Store }) => storeComp(() => ({
    passage: props.store.bibleStore.getPassage(),
}), (state) => (
    <RX.View>
        <PassageViewer passage={state.passage} onPartDone={props.store.bibleStore.completePart} />
    </RX.View>
));
