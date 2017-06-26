import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';

import { autoDeviceStorage } from '../extensions/storage/autoDeviceStorage';
import { FacebookAccess } from "../components/common/account/facebook-login";

@AutoSubscribeStore
export class AccountStoreClass extends StoreBase {

    // @autoDeviceStorage(false, 'AccountStore')
    private _isFacebookLoggedIn: boolean = false;

    // @autoDeviceStorage(null, 'AccountStore')
    private _accessToken: string;

    private _error: string = null;

    @autoSubscribe
    getError() {
        return this._error;
    }

    constructor() {
        super();
        // setTimeout(this.load, 5);
    }

    setLoginError = (message: string, data: any) => {
        try {
            this._error = message + ': ' + JSON.stringify(data);
        } catch (err) {
            this._error = message + ': ' + data;
        }

        // Erase the access token on error?
        this._accessToken = null;
        this._isFacebookLoggedIn = false;
        this.trigger();
        console.error(message, data);
    };

    load = async () => {
        try {
            await this.getFacebookAccessToken_async();
            this._isFacebookLoggedIn = this._accessToken != null;
            this.trigger();
            // this._accessToken = await FacebookAccess.getCurrentAccessToken();
            // this._isFacebookLoggedIn = true;
            // this.trigger();
            // console.log('Facebook access token', this._accessToken);
        } catch (err) {
            // this._accessToken = null;
            // this._isFacebookLoggedIn = false;
            // this.trigger();
            console.log('Facebook did not return an access token on load', err);
        }
    }

    @autoSubscribe
    getIsFacebookLoggedIn() {
        return this._isFacebookLoggedIn;
    }

    @autoSubscribe
    getFacebookAccessToken() {
        console.log('getFacebookAccessToken', { accessToken: this._accessToken });
        return this._accessToken;
    }

    getFacebookAccessToken_async = async () => {
        const accessToken = await FacebookAccess.getCurrentAccessToken();
        console.log('getFacebookAccessToken_async', { accessToken });

        this._accessToken = accessToken;
    };

    onLoginFinished = (accessToken: string) => {
        console.log('onLoginFinished', { accessToken });

        this._accessToken = accessToken;
        this._isFacebookLoggedIn = true;
        this.trigger();
    };
}

export const AccountStore = new AccountStoreClass();
export type AccountStore = AccountStoreClass;