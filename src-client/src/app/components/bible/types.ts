// UI
export interface Passage {
    previousParts: PassagePart[];
    activeParts: PassagePart[];
    nextParts: PassagePart[];
}

export interface PassagePart {
    kind: 'lineBreak' | 'chapterMarker' | 'verseMarker' | 'text' | 'choice';
    isActive: boolean;

    text: string;
    choices?: PassagePartChoice[];
    correctChoice?: PassagePartChoice;
}

export interface PassagePartChoice {
    text: string;
    isCorrect: boolean;
    isMistake: boolean;
    isCollapsed: boolean;
}


// Data
export interface BibleMetadataData {
    translationID: string;
    translationName: string;
    books: BookMetadataData[];
}

export interface BookMetadataData {
    bookIndex: number;
    bookID: string;
    bookName: string;
    chapterCount: number;
    chapters: ChapterMetadataData[];
}

export interface ChapterMetadataData {
    chapterID: string;
    verseCount: number;
}

// User Progress
export interface BibleMetadata extends BibleMetadataData {
    books: BookMetadata[];
    ratioComplete: number;
    verseCount: number;
}
export interface BookMetadata extends BookMetadataData {
    chapters: ChapterMetadata[];
    ratioComplete: number;
    verseCount: number;
}
export interface ChapterMetadata extends ChapterMetadataData {
    verses: VerseMetadata[];
    ratioComplete: number;
}
export interface VerseMetadata {
    verseID: string; isComplete: boolean;
}

export interface BibleData {
    books: BookData[];
}

export interface BookData {
    chapters: ChapterData[];
    hasChapterDownloadStarted: boolean[];
}

export interface ChapterData {
    chapterID: string;
    verses: VerseData[];
}

export interface VerseData {
    chapterID: string;
    verseID: string;
    text: string;
}

export interface WordStats {

}