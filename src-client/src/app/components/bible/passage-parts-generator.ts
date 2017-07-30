import { PassagePartChoice, PassagePart, VerseData, VerseParagraph } from "./types";
import { unique_values } from '@told/stack/src/core/utils/objects';

// const MIN_CHOICE_SPACING = 1;
// const MAX_CHOICE_SPACING = 1;


const TARGET_CHOICE_COUNT = 3;

export class PassagePartsGenerator {

    private _spacing_min = 2;
    private _spacing_max = 5;

    constructor() {

    }

    setSpacing(min: number, max: number) {
        this._spacing_min = min > 0 ? min : 1;
        this._spacing_max = max >= this._spacing_min ? max : this._spacing_min;

        this._iToChoice = this._spacing_min + Math.ceil((this._spacing_max - this._spacing_min) * Math.random());
    }

    private _iToChoice = this._spacing_min + Math.ceil((this._spacing_max - this._spacing_min) * Math.random());
    private _nextKey = 0;
    private _altWords: string[] = [];
    private _addCount = 0;

    private addAltWords(words: string[]) {
        this._altWords.push(...words);
        this._addCount++;

        if (this._addCount % 100 === 0) {
            this._altWords = unique_values(this._altWords);
        }
    }

    createParts(verseData: VerseData, shouldMakeChoices = true): PassagePart[] {
        if (!verseData || !verseData.p.length) { return []; }

        const parts: PassagePart[] = [];

        verseData.p.forEach(x => {
            parts.push(...this.createParts_paragraph(verseData.c, x, shouldMakeChoices));
        });

        return parts;
    }

    createParts_paragraph(chapterNumber: number, verseParagraph: VerseParagraph, shouldMakeChoices = true): PassagePart[] {
        if (!verseParagraph || !verseParagraph.x) { return []; }

        if (verseParagraph.k === 'heading') {
            return [{
                _key: '' + this._nextKey++,
                kind: 'lineBreak',
                text: '\n'
            }, {
                _key: '' + this._nextKey++,
                kind: 'heading',
                text: verseParagraph.x.map(x => x.t).join(' '),
            }, {
                _key: '' + this._nextKey++,
                kind: 'lineBreak',
                text: '\n'
            }];
        }

        const parts: PassagePart[] = [];

        for (let c of verseParagraph.x) {
            if (c.k === 'verse') {
                if (c.t.match(/^(1$|1-)/)) {
                    // Add Chapter Marker Also
                    parts.push({
                        _key: '' + this._nextKey++,
                        kind: 'chapterMarker',
                        text: '' + chapterNumber,
                    });
                }
                parts.push({
                    _key: '' + this._nextKey++,
                    kind: 'verseMarker',
                    text: c.t,
                });
            } else {
                parts.push(...this.createParts_text(c.t, shouldMakeChoices));
            }
        }

        return parts;
    }

    createParts_text(text: string, shouldMakeChoices = true): PassagePart[] {
        const words = text
            .replace(/\n/g, ' \n ')
            .replace(/ +/g, ' ')

            // Split on em dash
            .replace(/—/g, ' — ')

            .split(' ');


        let wordParts: PassagePart[] = words.map(w => ({
            _key: '' + this._nextKey++,
            kind: w.indexOf('\n') >= 0 ? 'lineBreak' : 'text' as 'lineBreak' | 'text',
            text: w
        }));

        // Convert some words to choices
        if (shouldMakeChoices) {

            // Add all words as options
            const altWords_local = wordParts.map(w => w.text);
            this.addAltWords(altWords_local);
            const altWords = this._altWords;

            wordParts = wordParts.map(p => {
                if (p.text.trim().length <= 0) { return p; }
                if (!p.text.match(/\w/)) { return p; }

                this._iToChoice--;
                if (this._iToChoice > 0) { return p; }

                this._iToChoice = this._spacing_min + Math.ceil((this._spacing_max - this._spacing_min) * Math.random());

                const choices = getChoices(p.text, altWords);
                const part: PassagePart = {
                    _key: '' + this._nextKey++,
                    kind: 'choice',
                    text: p.text,
                    correctChoice: choices.filter(c => c.text == p.text)[0],
                    choices: choices
                };

                return part;
            });
        }

        return wordParts;
    }
}

function getChoices(correct: string, altWords: string[]): PassagePartChoice[] {

    let choices = [correct];
    const sCorrect = simplify(correct);
    const sChoices = [sCorrect];

    let attempts = 0;
    while (attempts < 10 && choices.length < TARGET_CHOICE_COUNT) {

        const choice = altWords[Math.floor(altWords.length * Math.random())];
        const sChoice = simplify(choice);

        if (sChoice.length > 0
            // Doesn't contain this choice already
            && sChoices.indexOf(sChoice) < 0
            // Doesn't start with same letter
            && sCorrect[0] !== sChoice[0]
        ) {
            choices.push(choice);
            sChoices.push(sChoice);
        }

        attempts++;
    }

    choices = makeConsistent(correct, choices);

    // Randomize
    choices = randomize(choices);

    return choices.map(c => { return { text: c, isCorrect: false, isMistake: false, isCollapsed: false }; });
}

function randomize<T>(array: T[]) {
    const source = array.map(x => x);
    const result: T[] = [];

    while (source.length > 0) {
        result.push(...source.splice(Math.floor(Math.random() * source.length), 1));
    }

    return result;
}

function simplify(text: string) {
    return text.replace(/\W+/g, "").toLowerCase();
}

function markParts(parts: PassagePart[], isActive: boolean) {
    parts.forEach(p => p.isActive = isActive);
}

function makeConsistent(correct: string, choices: string[]) {
    const m = correct.match(/^([\W]*)(.*\w)([\W]*)$/);
    const prefix = m[1];
    const content = m[2];
    const suffix = m[3];
    const isCapitalized = content[0] === content[0].toUpperCase();
    const hasPossessive = content.match(/'s$/);

    return choices.map(x => {
        if (x === correct) { return x; }

        const cm = x.match(/^([\W]*)(.*\w)([\W]*)$/);
        const ca = cm[2];
        const cb = isCapitalized ? ca[0].toUpperCase() + ca.substr(1) : ca[0].toLowerCase() + ca.substr(1);
        const cc = hasPossessive ? `${cb}'s`.replace(`s's`, `s'`) : cb;
        return prefix + cc + suffix;
    });
}