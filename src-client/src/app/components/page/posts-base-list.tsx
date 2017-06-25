import * as RX from 'reactxp';
import { styles, colors } from "../../styles";
import { storeComp } from "../common/store-component-base";
import { Store } from "../../store/store";
import { PostsStoreBase } from '../../store/posts-store-base';
import { PostList } from "../posts/post-list";

export const PostsBaseList = (props: { store: Store, postsStore: PostsStoreBase }) => storeComp(() => ({
    isLoading: props.postsStore.getIsLoading(),
    isLoaded: props.postsStore.getIsLoaded(),
    error: props.postsStore.getError(),
    posts: props.postsStore.getPosts(),
}), (state) => (
    <RX.View>
        {!!state.error && <RX.Text style={styles.warning_text}>{state.error}</RX.Text>}
        {state.isLoaded && !state.posts.length && (
            <RX.Text style={styles.warning_text} >No Items</RX.Text>
        )}
        {state.posts && !!state.posts.length && (
            <RX.View>
                <PostList store={props.store} items={state.posts} />
                <LoadMore postsStore={props.postsStore} />
            </RX.View>
        )}
    </RX.View>
));


export const LoadMore = (props: { postsStore: PostsStoreBase }) => storeComp(() => ({
    isLoadingMore: props.postsStore.getIsLoadingMore(),
    hasMorePosts: props.postsStore.getHasMorePosts(),
}), (state) => (state.hasMorePosts && (!state.isLoadingMore ? (
    <RX.View style={styles.center_content}>
        <RX.Button style={styles.action_button} onPress={props.postsStore.loadMorePosts}>
            <RX.Text style={styles.action_button_text}>
                Load More
                </RX.Text>
        </RX.Button>
    </RX.View>
) : (
        <RX.View style={styles.center_content}>
            <RX.ActivityIndicator size={'medium'} color={colors.loader} />
        </RX.View>
    )
)
));
