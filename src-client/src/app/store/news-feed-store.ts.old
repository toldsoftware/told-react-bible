import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';
import { autoDeviceStorage } from "../extensions/storage/autoDeviceStorage";
import { isMatch } from './helpers';
import { PostsStoreBase } from "./posts-store-base";
import { FacebookPost, getPosts_multiplePages, getPosts } from "../server-access/facebook-access";
import { AccountStore } from "./account-store";
import { facebookClient } from "../server-access/facebook-client";

const facebookPageIds: string[] = [];

interface NewsFeedEntry {
    pageId: string;
    posts: FacebookPost[];
    isLoading?: boolean;
    oldestEntryTimeTicks?: number;
}

@AutoSubscribeStore
export class NewsFeedStoreClass extends PostsStoreBase {
    accountStore = AccountStore;

    _postsAll_facebook: FacebookPost[];
    _newsFeedData: {
        feeds: NewsFeedEntry[];
    };

    protected load() {
        this._newsFeedData = {
            feeds: facebookPageIds.map(x => ({
                pageId: x,
                posts: [],
            }))
        };
    }

    async getPosts_filtered(search: string) {

        if (!this._postsAll_facebook) {
            await this.loadFacebookPosts();
        }

        return this._postsAll_facebook.filter(x => isMatch(search, x));
    };

    private loadFacebookPosts = async () => {
        // Load Facebook Posts
        try {
            await this.accountStore.getFacebookAccessToken_async();
            await this.populateActivePosts();
        } catch (err) {
            this.setError('Failed to load data from Facebook', err);
        }

    };

    private populateActivePosts = async () => {


        const accessToken = this.accountStore.getFacebookAccessToken();
        console.log('NewsFeedStore.populateActivePosts START', { accessToken });

        if (!accessToken) {
            this.setError('Facebook Account not Connected');
            return;
        }

        const allPosts = this._postsAll_facebook;

        // If no results yet, get from all pages simultaneously
        if (!allPosts || !allPosts.length) {
            // Add all feeds
            try {
                const pagePosts = await getPosts_multiplePages(facebookClient, accessToken, this._newsFeedData.feeds.map(x => x.pageId));

                const newPosts: FacebookPost[] = [];
                for (let k in pagePosts) {
                    const feed = this._newsFeedData.feeds.filter(f => f.pageId === k)[0];
                    console.log('NewsFeedStore.populateActivePosts AddAllFeeds', { k, feed, pagePosts, _newsFeedData: this._newsFeedData });

                    const fPosts = pagePosts[k].data;
                    feed.posts = feed.posts || [];
                    feed.posts.push(...fPosts);
                    feed.posts = cleanAndSortPosts(feed.posts);
                    feed.isLoading = false;
                    feed.oldestEntryTimeTicks = feed.posts && feed.posts[feed.posts.length - 1].createdTimeTicks || 0;

                    newPosts.push(...fPosts);
                }

                this._postsAll_facebook = this._postsAll_facebook || [];
                this._postsAll_facebook.push(...newPosts);
                this._postsAll_facebook = cleanAndSortPosts(this._postsAll_facebook);

                console.log('NewsFeedStore.populateActivePosts END', { allPosts: this._postsAll_facebook, pagePosts });
                return;
            } catch (err) {
                this.setError('Failed to load posts from Facebook', err);
                return;
            }
        }

        // Add more data for each feed
        const postsActive = this._postsAll_facebook.slice(0, this._postsActiveCount);
        const lastPost = postsActive && postsActive.length && postsActive[postsActive.length - 1];
        const oldestActiveTimeTicks = lastPost && lastPost.createdTimeTicks || Number.MAX_VALUE;

        const promises = this._newsFeedData.feeds.filter(f =>
            // If the feed has newer items (greater), expand it
            !f.isLoading && ((f.oldestEntryTimeTicks || 0) > oldestActiveTimeTicks)
        ).map(x => this.loadMoreFeedPosts(x));

        try {
            await Promise.all(promises);
        } catch (err) {
            this.setError('Failed to load more posts from Facebook', err);
            return;
        }

        console.log('NewsFeedStore.populateActivePosts END', { allPosts: this._postsAll_facebook, promises, oldestActiveTimeTicks });
    };

    private loadMoreFeedPosts = async (feed: NewsFeedEntry) => {
        const accessToken = this.accountStore.getFacebookAccessToken();
        console.log('NewsFeedStore.loadMoreFeedPosts START', { feed, allPosts: this._postsAll_facebook, accessToken });

        try {
            feed.isLoading = true;
            feed.posts = feed.posts || [];
            const untilSeconds = feed.posts && feed.posts[feed.posts.length - 1].createdTimeTicks / 1000 || null;
            feed.posts.push(... await getPosts(facebookClient, accessToken, feed.pageId, null, null, untilSeconds));
            feed.posts = cleanAndSortPosts(feed.posts);
            feed.isLoading = false;
            feed.oldestEntryTimeTicks = feed.posts && feed.posts[feed.posts.length - 1].createdTimeTicks || 0;

            this._postsAll_facebook = this._postsAll_facebook || [];
            this._postsAll_facebook.push(...feed.posts);
            this._postsAll_facebook = cleanAndSortPosts(this._postsAll_facebook);

            // this.trigger();
        } catch (err) {
            console.log('NewsFeedStore.loadMoreFeedPosts FAIL', err);
            feed.isLoading = false;
            throw err;
        }

        console.log('NewsFeedStore.loadMoreFeedPosts END', { feed, allPosts: this._postsAll_facebook });
    };

}

function cleanAndSortPosts(items: FacebookPost[]) {
    items.forEach(x => {
        x.createdTimeTicks = Date.parse(x.created_time.replace('+0000', '+00:00'));
        x.kind = 'FacebookPost';
    });

    const hash = items.reduce((out, x) => {
        out[x.id] = x;
        return out;
    }, {} as { [key: string]: FacebookPost });

    const final = Object.getOwnPropertyNames(hash).map(k => hash[k]);
    return final.sort((a, b) => b.createdTimeTicks - a.createdTimeTicks);
}

export const NewsFeedStore = new NewsFeedStoreClass();
export type NewsFeedStore = NewsFeedStoreClass;