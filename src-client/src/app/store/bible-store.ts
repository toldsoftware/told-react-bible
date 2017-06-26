import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';

import { autoDeviceStorage } from '../extensions/storage/autoDeviceStorage';
import { FacebookAccess } from "../components/common/account/facebook-login";
import { Passage, BibleMetadataData, BibleData } from "../components/bible/types";
import { PassagePartsGenerator } from "../components/bible/passage-parts-generator";

@AutoSubscribeStore
export class BibleStoreClass extends StoreBase {

    // TODO: Download Metadata and Data

    _bibleData: BibleData;

    _bibleMetadata: BibleMetadataData;

    @autoDeviceStorage(null, 'Bible')
    _selectedBookKey: string;

    @autoDeviceStorage(null, 'Bible')
    _selectedChapterNumber: number;

    @autoDeviceStorage(null, 'Bible')
    _selectedVerseNumber: number;

    _passage: Passage;

    @autoSubscribe
    getPassageMetadata() {

        const bookMetadata = this._bibleMetadata && this._selectedBookKey && this._bibleMetadata.books.filter(x => x.bookID === this._selectedBookKey)[0];
        const chapterMetadata = bookMetadata && this._selectedChapterNumber && bookMetadata.chapters[this._selectedChapterNumber - 1];

        return {
            bookKey: this._selectedBookKey,
            chapterNumber: this._selectedChapterNumber,
            verseNumber: this._selectedVerseNumber,

            bookIndex: bookMetadata && bookMetadata.bookIndex || 0,
            chapterIndex: (this._selectedChapterNumber || 1) - 1,
            verseIndex: (this._selectedVerseNumber || 1) - 1,

            books: this._bibleMetadata.books,
            bookName: bookMetadata && bookMetadata.bookName,
            chapterCount: bookMetadata && bookMetadata.chapterCount,
            verseCount: chapterMetadata && chapterMetadata.verseCount,
        };
    }

    selectBook = (bookKey: string) => {
        this._selectedBookKey = bookKey;
        this._selectedChapterNumber = null;
        this._selectedVerseNumber = null;
        this.trigger();
    };

    selectChapter = (chapterNumber: number) => {
        this._selectedChapterNumber = chapterNumber;
        this._selectedVerseNumber = null;
        this.trigger();
    };

    selectVerse = (verseNumber: number) => {
        this._selectedVerseNumber = verseNumber;
        this._passage = null;
        this.trigger();
    };


    @autoSubscribe
    getPassage() {

        if (!this._passage) {
            this.generatePassage();
        }

        return this._passage;
    }

    private _passageGenerator = new PassagePartsGenerator();

    private generatePassage() {
        this._passage = this._passage || { previousParts: [], activeParts: [], nextParts: [] };
        this._passage.previousParts = this._passageGenerator.createParts(this.getVerseDataAtOffset(-1), false);
        this._passage.activeParts = this._passageGenerator.createParts(this.getVerseDataAtOffset(0), true);
        this._passage.nextParts = this._passageGenerator.createParts(this.getVerseDataAtOffset(1), true);
    }

    private gotoAndGenerateNextPassage = () => {
        this.gotoNextVerseReference();
        this._passage.previousParts.push(...this._passage.activeParts);
        this._passage.activeParts = this._passage.nextParts;
        this._passage.nextParts = this._passageGenerator.createParts(this.getVerseDataAtOffset(1), true);
    };

    private gotoNextVerseReference = () => {
        const m = this.getPassageMetadata();

        if (m.verseIndex + 1 <= m.verseCount) {
            this._selectedVerseNumber++;
            return;
        }

        if (m.chapterIndex < m.chapterCount) {
            this._selectedVerseNumber = 1;
            this._selectedChapterNumber++;
            return;
        }
    };

    private getVerseDataAtOffset = (verseOffset: number) => {
        const m = this.getPassageMetadata();

        if (verseOffset >= 0) {
            if (m.verseIndex + verseOffset <= m.verseCount) {
                return this.getVerseData(m.bookIndex, m.chapterIndex, m.verseIndex + verseOffset);
            }

            if (m.chapterIndex < m.chapterCount) {
                return this.getVerseData(m.bookIndex, m.chapterIndex + 1, 0);
            }

            return null;
        }
        else {
            if (m.verseIndex + verseOffset >= 0) {
                return this.getVerseData(m.bookIndex, m.chapterIndex, m.verseIndex + verseOffset);
            }

            if (m.chapterIndex > 0) {
                const vCount = this._bibleMetadata.books[m.bookIndex].chapters[m.chapterIndex - 1].verseCount;
                return this.getVerseData(m.bookIndex, m.chapterIndex - 1, vCount - 1);
            }

            return null;
        }
    };

    private getVerseData = (bookIndex: number, chapterIndex: number, verseIndex: number) => {
        return this._bibleData.books[bookIndex].chapters[chapterIndex].verses[verseIndex];
        // return {
        //     bookKey: this._bibleMetadata.books[bookIndex].bookID,
        //     chapterNumber: chapterIndex + 1,
        //     verseNumber: verseIndex + 1,
        //     verseData: this._bibleData.books[bookIndex].chapters[chapterIndex].verses[verseIndex],
        // }
    }
}

export const BibleStore = new BibleStoreClass();
export type BibleStore = BibleStoreClass;