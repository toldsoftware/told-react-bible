import { StoreBase, AutoSubscribeStore, autoSubscribe } from 'resub';

import { autoDeviceStorage } from '../extensions/storage/autoDeviceStorage';
import { FacebookAccess } from "../components/common/account/facebook-login";
import { Passage, BibleMetadata, BibleData, PassagePart } from "../components/bible/types";
import { PassagePartsGenerator } from "../components/bible/passage-parts-generator";
import { downloadBibleChapterData, downloadBibleMetadata } from "../server-access/bible-data";
import { bibleVersions } from "../server-access/bible-data-versions";
import { delay } from "./helpers";
import { ChoiceKind, ChoiceSpacing } from "../components/bible/passage-options";

@AutoSubscribeStore
export class BibleStoreClass extends StoreBase {
    private _passageGenerator = new PassagePartsGenerator();

    _isLoading = false;
    // TODO: Download Metadata and Data

    _bibleData: BibleData;

    _bibleMetadata: BibleMetadata;

    versions = bibleVersions.map(x => {
        let label = `${x.lang_name.match(/^English/) ? '' : '(' + x.lang_name + ')'} ${x.name}`.trim();
        label = label.length > 50 ? label.substr(0, 50) + '...' : label;
        return {
            value: x.value,
            label
        };
    });
    // versions = [
    //     { value: 'eng-ESV', label: 'ESV (English Standard Version)' },
    //     { value: 'eng-ESV', label: 'ESV (English Standard Version)' },
    // ];

    @autoDeviceStorage(null, 'eng-ESV')
    _selectedVersion: string;

    @autoDeviceStorage(null, 'Bible')
    _selectedBookKey: string;

    @autoDeviceStorage(null, 'Bible')
    _selectedChapterNumber: number;

    @autoDeviceStorage(null, 'Bible')
    _selectedVerseLabel: string;

    @autoDeviceStorage(null, 'Bible')
    _choiceKind: ChoiceKind;

    @autoDeviceStorage(null, 'Bible')
    _choiceSpacing: ChoiceSpacing;

    _passage: Passage;

    constructor() {
        super();
        setTimeout(() => {
            this.ensureLoad();
        });
    }

    private ensureLoad = async () => {
        let val = null as any;
        val = this._selectedVersion;
        val = this._selectedBookKey;
        val = this._selectedChapterNumber;
        val = this._selectedVerseLabel;
    };

    @autoSubscribe
    getIsLoading() {
        return this._isLoading;
    }

    startLoading = () => {
        this._isLoading = true;
        this.trigger();
    };

    endLoading = () => {
        this._isLoading = false;
        this.trigger();
    };

    @autoSubscribe
    getVersions() {
        return this.versions;
    }

    @autoSubscribe
    getSelectedVersion() {
        return this._selectedVersion;
    }

    selectVersion = (version: string) => {
        this._selectedVersion = version;
        this._bibleData = null;
        this.reloadPassage();
    };

    @autoSubscribe
    getPassageMetadata() {

        if (!this._bibleMetadata) {
            setTimeout(async () => {
                this.startLoading();
                await this.getPassageMetadata_async();
                this.endLoading();

                console.log('getPassageMetadata ASYNC END TRIGGER');
            });
        }

        return this.getPassageMetadata_inner();
    }

    @autoSubscribe
    getVerseLabels() {
        const m = this.getPassageMetadata_inner();
        const b = m && this._bibleData && this._bibleData.books[m.bookIndex];
        const ch = b && b.chapters[m.chapterIndex];
        return ch && ch.verseData.map(x => x.vLabel) || [];
    }

    private getPassageMetadata_async = async () => {
        if (!this._bibleMetadata) {
            await this.downloadMetadata();
        }

        return this.getPassageMetadata_inner();
    }

    private getPassageMetadata_inner() {

        const bookMetadata = this._bibleMetadata && this._selectedBookKey && this._bibleMetadata.books.filter(x => x.bookID === this._selectedBookKey)[0];
        const chapterMetadata = bookMetadata && this._selectedChapterNumber && bookMetadata.chapters[this._selectedChapterNumber - 1];

        return {
            bookKey: this._selectedBookKey,
            chapterNumber: this._selectedChapterNumber,
            verseLabel: this._selectedVerseLabel,

            bookIndex: bookMetadata && bookMetadata.bookIndex || 0,
            chapterIndex: (this._selectedChapterNumber || 1) - 1,

            books: this._bibleMetadata && this._bibleMetadata.books,
            bookName: bookMetadata && bookMetadata.bookName,
            chapterCount: bookMetadata && bookMetadata.chapterCount,
        };
    }

    selectBook = (bookKey: string) => {
        this._selectedBookKey = bookKey;
        this._selectedChapterNumber = null;
        this._selectedVerseLabel = null;
        this.reloadPassage();
    };

    selectChapter = (chapterNumber: number | string) => {
        this._selectedChapterNumber = 1 * (chapterNumber as number);
        this._selectedVerseLabel = null;
        this.reloadPassage();
    };

    selectVerse = (verseLabel: string) => {
        this._selectedVerseLabel = verseLabel;
        this.reloadPassage();
    };

    // Options
    changeChoiceKind = (choiceKind: ChoiceKind) => {
        this._choiceKind = choiceKind;
        this.trigger();
    }

    @autoSubscribe
    getChoiceKind() {
        return this._choiceKind;
    }

    changeChoiceSpacing = (choiceSpacing: ChoiceSpacing) => {
        this._choiceSpacing = choiceSpacing;
        switch (choiceSpacing) {
            case ChoiceSpacing.EveryWord:
                this._passageGenerator.setSpacing(1, 1);
                break;
            case ChoiceSpacing.ShortSpacing:
                this._passageGenerator.setSpacing(1, 3);
                break;
            case ChoiceSpacing.MediumSpacing:
                this._passageGenerator.setSpacing(2, 5);
                break;
            case ChoiceSpacing.LongSpacing:
                this._passageGenerator.setSpacing(3, 7);
                break;
        }
        this.reloadPassage();
    }

    @autoSubscribe
    getChoiceSpacing() {
        return this._choiceSpacing;
    }

    @autoSubscribe
    getPassage() {
        console.log('getPassage START', { _passage: this._passage });

        if (!this._passage) {
            this._passage = {
                previousParts: [],
                activeParts: [],
                nextParts: [],
            };

            this.reloadPassage();
        }

        console.log('getPassage END', { _passage: this._passage });

        return this._passage;
    }

    reloadPassage = () => {
        setTimeout(async () => {
            this.startLoading();
            await this.generatePassage();
            console.log('getPassage ASYNC TRIGGERING', { _passage: this._passage });
            this.endLoading();
            console.log('getPassage ASYNC END', { _passage: this._passage });
        });
    };

    completePart = async (part: PassagePart) => {
        console.log('completePart', { part, _passage: this._passage });

        part._isDone = true;
        if (this._passage.activeParts.every(x => x._isDone || x.kind !== 'choice')) {
            console.log('completePart ActiveParts DONE', { part, _passage: this._passage });

            this.startLoading();
            await this.gotoAndGenerateNextPassage();
            this.endLoading();

            console.log('completePart TRIGGER', { part, _passage: this._passage });
        }

        console.log('completePart END', { part, _passage: this._passage });
    };


    private generatePassage = async () => {
        console.log('generatePassage START', { _passage: this._passage });

        if (!this._bibleMetadata) {
            await this.downloadMetadata();
        }

        this._selectedBookKey = this._selectedBookKey || this._bibleMetadata.books[0].bookID;
        this._selectedChapterNumber = this._selectedChapterNumber || 1;
        this._selectedVersion = this._selectedVersion || this.versions[0].value;

        const vPrev = await this.getVerseDataAtOffset(-1);
        const vActive = await this.getVerseDataAtOffset(0);

        // Go ahead and show this while loading the nextParts
        this._passage = {
            previousParts: this._passageGenerator.createParts(vPrev, false),
            activeParts: this._passageGenerator.createParts(vActive, true),
            nextParts: [], // this._passageGenerator.createParts(vNext, true)
        };

        this.trigger();

        const vNext = await this.getVerseDataAtOffset(1);

        this._selectedVerseLabel = this._selectedVerseLabel || vActive.vLabel;

        this._passage = {
            previousParts: this._passageGenerator.createParts(vPrev, false),
            activeParts: this._passageGenerator.createParts(vActive, true),
            nextParts: this._passageGenerator.createParts(vNext, true)
        };

        console.log('generatePassage END', { _passage: this._passage });
    }

    private gotoAndGenerateNextPassage = async () => {
        console.log('gotoAndGenerateNextPassage START', { _passage: this._passage });

        // await this.gotoNextVerseReference();
        const nextActiveVerseData = await this.getVerseDataAtOffset(1);
        const selectedVerseLabel = nextActiveVerseData.vLabel;
        const selectedChapterNumber = nextActiveVerseData.c;

        // Avoid Double Call
        if (selectedVerseLabel === this._selectedVerseLabel
            && selectedChapterNumber === this._selectedChapterNumber) {
            return;
        }

        this._passage = {
            previousParts: [...this._passage.previousParts, ...this._passage.activeParts],
            activeParts: [...this._passage.nextParts],
            nextParts: [],
        };

        this.trigger();

        // Load Next
        this._selectedVerseLabel = selectedVerseLabel;
        this._selectedChapterNumber = selectedChapterNumber;
        const nextVerseData = await this.getVerseDataAtOffset(1);
        this._passage = {
            previousParts: this._passage.previousParts,
            activeParts: this._passage.activeParts,
            nextParts: this._passageGenerator.createParts(nextVerseData, true)
        };

        console.log('gotoAndGenerateNextPassage END', { _passage: this._passage });
    };

    // private gotoNextVerseReference = async () => {
    //     const m = await this.getPassageMetadata_async();

    //     if (m.verseIndex + 1 <= m.verseCount) {
    //         this._selectedVerseNumber++;
    //         return;
    //     }

    //     if (m.chapterIndex < m.chapterCount) {
    //         this._selectedVerseNumber = 1;
    //         this._selectedChapterNumber++;
    //         return;
    //     }
    // };

    private getVerseDataAtOffset = async (verseIndexOffset: number) => {
        const m = await this.getPassageMetadata_async();
        const ch = await this.getChapterData(m.bookIndex, m.chapterIndex);
        const vd = ch.verseData.map((x, i) => ({ x, i })).filter(x => x.x.vLabel === m.verseLabel);
        const vIndex = vd && vd.length && vd[0].i || 0;

        console.log('getVerseDataAtOffset START', { getPassageMetadata: m });

        if (verseIndexOffset >= 0) {
            const vCount = ch.verseData.length;

            if (vIndex + verseIndexOffset < vCount) {
                return await this.getVerseData(m.bookIndex, m.chapterIndex, vIndex + verseIndexOffset);
            }

            if (m.chapterIndex < m.chapterCount - 1) {
                return await this.getVerseData(m.bookIndex, m.chapterIndex + 1, 0);
            }

            console.warn('getVerseDataAtOffset: Past end of book');
            return null;
        }
        else {
            if (vIndex + verseIndexOffset >= 0) {
                return await this.getVerseData(m.bookIndex, m.chapterIndex, vIndex + verseIndexOffset);
            }

            if (m.chapterIndex > 0) {
                const chLast = await this.getChapterData(m.bookIndex, m.chapterIndex - 1);
                const vCountLast = chLast.verseData.length;
                return await this.getVerseData(m.bookIndex, m.chapterIndex - 1, vCountLast - 1);
            }

            console.warn('getVerseDataAtOffset: Past beginning of book');
            return null;
        }
    };

    private getChapterData = async (bookIndex: number, chapterIndex: number) => {
        if (!this._bibleMetadata) {
            await this.downloadMetadata();
        }

        const m = this._bibleMetadata;

        console.log('getVerseData START', { _bibleData: this._bibleData, _bibleMetadata: this._bibleMetadata });

        this._bibleData = this._bibleData || { books: [] };
        this._bibleData.books[bookIndex] = this._bibleData.books[bookIndex] || { chapters: [], hasChapterDownloadStarted: [] };

        if (this._bibleData.books[bookIndex].hasChapterDownloadStarted[chapterIndex]) {
            while (!this._bibleData.books[bookIndex].chapters[chapterIndex]) {
                await delay(500);
            }
        }

        if (!this._bibleData.books[bookIndex].chapters[chapterIndex]) {
            this._bibleData.books[bookIndex].hasChapterDownloadStarted[chapterIndex] = true;
            this._bibleData.books[bookIndex].chapters[chapterIndex] =
                await downloadBibleChapterData(this._selectedVersion || this.versions[0].value, bookIndex + 1, m.books[bookIndex].bookID, chapterIndex + 1);
        }

        console.log('getVerseData END', { _bibleData: this._bibleData, _bibleMetadata: this._bibleMetadata });

        const ch = this._bibleData.books[bookIndex].chapters[chapterIndex];

        // Add Chapter ID
        ch.c = (chapterIndex + 1);
        ch.verseData.forEach(x => x.vLabel = x.vStart === x.vEnd ? `${x.vStart}` : `${x.vStart}-${x.vEnd}`);
        return ch;
    }

    private getVerseData = async (bookIndex: number, chapterIndex: number, verseIndex: number) => {

        const chData = await this.getChapterData(bookIndex, chapterIndex);
        const vData = chData.verseData[verseIndex];

        vData.c = (chapterIndex + 1);
        return vData;
    }

    private _downloadMetadata_busy = false;
    private downloadMetadata = async () => {
        console.log('downloadMetadata START', { _bibleMetadata: this._bibleMetadata, _downloadMetadata_busy: this._downloadMetadata_busy });

        while (!this._bibleMetadata && this._downloadMetadata_busy) {
            await delay(500);
            console.log('downloadMetadata DELAY', { _bibleMetadata: this._bibleMetadata, _downloadMetadata_busy: this._downloadMetadata_busy });
        }

        console.log('downloadMetadata CONTINUE', { _bibleMetadata: this._bibleMetadata, _downloadMetadata_busy: this._downloadMetadata_busy });

        this._downloadMetadata_busy = true;
        if (!this._bibleMetadata) {
            this._bibleMetadata = await downloadBibleMetadata('WEB');
            this._downloadMetadata_busy = false;
        }

        console.log('downloadMetadata END', { _bibleMetadata: this._bibleMetadata, _downloadMetadata_busy: this._downloadMetadata_busy });
    };
}

export const BibleStore = new BibleStoreClass();
export type BibleStore = BibleStoreClass;