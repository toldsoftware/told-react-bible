import * as RX from 'reactxp';
import { storeComp } from '../common/store-component-base';
import { Store } from '../../store/store';
import { styles } from "../../styles";
import { PostList } from "../posts/post-list";
import { FacebookLogin } from "../common/account/facebook-login";
import { PostsBaseList } from "../page/posts-base-list";
import { PageLayout } from "../page/page-layout";

export const NewsPage = (props: { store: Store }) => (
    <PageLayout store={props.store} postsStore={props.store.newsFeed} onScrollReachEnd={props.store.newsFeed.loadMorePosts}>
        <RX.View style={styles.page}>
            <NewsPostList store={props.store} />
        </RX.View>
    </PageLayout>
);

export const NewsPostList = (props: { store: Store }) => storeComp(() => ({
    isFacebookLoggedIn: props.store.account.getIsFacebookLoggedIn(),
    loginError: props.store.account.getError(),
}), (state) => (
    <RX.View>
        {!state.isFacebookLoggedIn ? (
            <RX.View>
                <RX.Text style={styles.warning_text} >Facebook not Logged In</RX.Text>
                {!!state.loginError && <RX.Text style={styles.warning_text}>{state.loginError}</RX.Text>}
                {/*{!!state.error && <RX.Text style={styles.warning_text}>{state.error}</RX.Text>}*/}
                <RX.View style={styles.postPanel}>
                    <RX.View style={styles.center_content}>
                        <FacebookLogin onLoginFinished={props.store.account.onLoginFinished} onError={props.store.account.setLoginError} />
                    </RX.View>
                </RX.View>
            </RX.View>
        ) : (
                <PostsBaseList store={props.store} postsStore={props.store.newsFeed} />
            )}
    </RX.View>
));

// export const NewsPostList = (props: { store: Store }) => storeComp(() => ({
// }), (state) => (
//     <RX.View>
//         <PostsBaseList store={props.store} postsStore={props.store.newsFeed} />
//     </RX.View>
// ));