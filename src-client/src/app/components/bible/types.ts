// UI
export interface Passage {
    previousParts: PassagePart[];
    activeParts: PassagePart[];
    nextParts: PassagePart[];
}

export interface PassagePart {
    kind: 'lineBreak' | 'chapterMarker' | 'verseMarker' | 'text' | 'choice' | 'header';
    isActive?: boolean;

    text: string;
    choices?: PassagePartChoice[];
    correctChoice?: PassagePartChoice;

    _key: string;
    _isDone?: boolean;
}

export interface PassagePartChoice {
    text: string;
    isCorrect: boolean;
    isMistake: boolean;
    isCollapsed: boolean;
}


// Data
export interface BibleMetadata {
    translationID: string;
    translationName: string;
    books: BookMetadata[];
}

export interface BookMetadata {
    bookIndex: number;
    bookID: string;
    bookName: string;
    chapterCount: number;
    chapters: ChapterMetadata[];
}

export interface ChapterMetadata {
    chapterID: string;
    // verseCount: number;
}

// User Progress
export interface BibleMetadata_UserProgress extends BibleMetadata {
    books: BookMetadata_UserProgress[];
    ratioComplete: number;
    verseCount: number;
}
export interface BookMetadata_UserProgress extends BookMetadata {
    chapters: ChapterMetadata_UserProgress[];
    ratioComplete: number;
    verseCount: number;
}
export interface ChapterMetadata_UserProgress extends ChapterMetadata {
    verses: VerseMetadata_UserProgress[];
    ratioComplete: number;
}
export interface VerseMetadata_UserProgress {
    verseID: string;
    isComplete: boolean;
}

// Bible Data
export interface BibleData {
    books: BookData[];
}

export interface BookData {
    chapters: ChapterData[];
    hasChapterDownloadStarted: boolean[];
}

export interface ChapterData {
    // Chapter
    c: number;
    verseData: VerseData[];
}

export interface VerseData {
    // Chapter
    c: number;
    // Verse Start
    vStart: number;
    // Verse End
    vEnd: number;
    vLabel?: string;
    p: VerseParagraph[];
}

export interface VerseParagraph {
    // Kind: null == default
    // h = Header
    // q1 = Poetry Indent 1
    // q2 = Poetry Indent 2
    // br = Blank Line
    k?: '' | 'header' | 'q1' | 'q2' | 'b';
    x: VerseContent[];
}

export interface VerseContent {
    // Text
    t: string;
    vStart?: number;
    vEnd?: number;
    // Kind: null == default
    // v = Verse Number
    k?: '' | 'verse';
}

export interface WordStats {

}