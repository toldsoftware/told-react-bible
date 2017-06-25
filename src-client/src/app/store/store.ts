import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';
import { autoDeviceStorage } from '../extensions/storage/autoDeviceStorage';
import { delay, isMatch } from './helpers';
import { AccountStore } from './account-store';
import { facebookClient } from '../server-access/facebook-client';
import { NewsFeedStore } from "./news-feed-store";
import { PageName } from "../components/pages/page-names";

@AutoSubscribeStore
export class StoreClass extends StoreBase {

    newsFeed = NewsFeedStore;
    account = AccountStore;

    uiActions: { [key: string]: any } = [];

    _isLoading = true;
    _isLoadingChangeId = 0;

    @autoDeviceStorage('Settings')
    _page: PageName;

    constructor() {
        super();
        setTimeout(this.load, 250);
    }

    load = async () => {
        // await this.startLoading();
        // this.endLoading();
    }

    @autoSubscribe
    getIsLoading() {
        return this._isLoading;
    }

    startLoading = async (fast = false) => {
        if (this._isLoading) { return; }

        this._isLoading = true;
        this._isLoadingChangeId++;

        if (!fast) {
            this.trigger();
            await delay(10);
        }
    }

    endLoading = async (fast = false) => {
        // this.refreshPage();

        if (!this._isLoading) { return; }

        const id = this._isLoadingChangeId;
        //if (!fast) await delay(500);
        if (!fast) await delay(10);

        if (!this._isLoading) { return; }
        if (id !== this._isLoadingChangeId) { return; }

        this._isLoading = false;
        this._isLoadingChangeId++;
        this.trigger();
    }

    @autoSubscribe
    getPage() {
        return this._page;
    }

    gotoPage = async (page: PageName) => {
        // console.log('gotoPage', { page });

        this.startLoading(true);
        // await this.startLoading(true);
        this._page = 'Empty';
        this.trigger();
        await delay(10);

        this._page = page;

        this.endLoading();
    }

};

export const Store = new StoreClass();
export type Store = StoreClass;
