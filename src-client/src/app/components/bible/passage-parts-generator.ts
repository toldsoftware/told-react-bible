import { PassagePartChoice, PassagePart, VerseData, VerseParagraph } from "./types";

const MIN_CHOICE_SPACING = 2;
const MAX_CHOICE_SPACING = 5;
const TARGET_COUNT = 3;

export class PassagePartsGenerator {

    constructor() {

    }

    private _iToChoice = MIN_CHOICE_SPACING + Math.ceil((MAX_CHOICE_SPACING - MIN_CHOICE_SPACING) * Math.random());
    private _nextKey = 0;

    createParts(verseData: VerseData, shouldMakeChoices = true): PassagePart[] {
        if (!verseData || !verseData.p.length) { return []; }

        const parts: PassagePart[] = [];

        verseData.p.forEach(x => {
            parts.push(...this.createParts_paragraph(x));
        });

        return parts;
    }

    createParts_paragraph(verseParagraph: VerseParagraph, shouldMakeChoices = true): PassagePart[] {
        if (!verseParagraph || !verseParagraph.x) { return []; }

        if (verseParagraph.k === 'h') {
            return [{
                _key: '' + this._nextKey++,
                kind: 'header',
                text: verseParagraph.x.map(x => x.t).join(' '),
            }];
        }

        const parts: PassagePart[] = [];

        for (let c of verseParagraph.x) {
            if (c.k === 'v') {
                if (c.t.match(/(1|1-)/)) {
                    // Add Chapter Marker Also
                    parts.push({
                        _key: '' + this._nextKey++,
                        kind: 'chapterMarker',
                        text: '' + verseParagraph.x,
                    });
                }
                parts.push({
                    _key: '' + this._nextKey++,
                    kind: 'verseMarker',
                    text: c.t,
                });
            } else {
                parts.push(...this.createParts_text(c.t));
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
            const altWords = wordParts.map(w => w.text);

            wordParts = wordParts.map(p => {
                if (p.text.trim().length <= 0) { return p; }
                if (!p.text.match(/\w/)) { return p; }

                this._iToChoice--;
                if (this._iToChoice > 0) { return p; }

                this._iToChoice = MIN_CHOICE_SPACING + Math.ceil((MAX_CHOICE_SPACING - MIN_CHOICE_SPACING) * Math.random());

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
    const simple = [simplify(correct)];

    let attempts = 0;
    while (attempts < 10 && choices.length < TARGET_COUNT) {

        const c = altWords[Math.floor(altWords.length * Math.random())];
        const s = simplify(c);

        if (s.length > 0 && simple.indexOf(s) < 0) {
            choices.push(c);
            simple.push(s);
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