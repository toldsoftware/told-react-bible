import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';

import { autoDeviceStorage } from '../extensions/storage/autoDeviceStorage';
import { FacebookAccess } from "../components/common/account/facebook-login";
import { Passage } from "../components/bible/types";
import { PassagePartsGenerator } from "../components/bible/passage-parts-generator";

@AutoSubscribeStore
export class BibleStoreClass extends StoreBase {
    private _choiceGenerator = new PassagePartsGenerator();
    private _passage: Passage = {
        parts: this._choiceGenerator.createParts({
            chapterID: '1',
            verseID: '1',
            text: 'In the beginning, God created the heavens and the earth.'
        }, true)
    };

    @autoSubscribe
    getPassage() {
        return this._passage;
    }
}

export const BibleStore = new BibleStoreClass();
export type BibleStore = BibleStoreClass;