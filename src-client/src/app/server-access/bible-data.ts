import { ChapterData, BibleMetadata } from "../components/bible/types";

// https://toldreactbible.blob.core.windows.net/bibles/WEB/WEB_01_Gen_001.json

// TODO: Replace this
export async function downloadBibleMetadata(versionKey: string) {
    const url = `https://toldreactbible.blob.core.windows.net/bibles/${versionKey}/${versionKey}__bible.meta.json`;
    const result = await fetch(url);
    const obj = await result.json();
    console.log('downloadBibleMetadata', { data: obj.data, obj, result });
    return obj.data as BibleMetadata;
}

// https://toldreactbible.blob.core.windows.net/bibles/WEB/WEB_01_Gen_001.json

// export async function downloadBibleChapterData(versionKey: string, bookNumber: number, bookKey: string, chapterNumber: number) {
//     const bookNumberPad2 = ('00' + bookNumber).substr(-2);
//     const chapterNumberPad3 = ('000' + chapterNumber).substr(-3);
//     const url = `https://toldreactbible.blob.core.windows.net/bibles/${versionKey}/${versionKey}_${bookNumberPad2}_${bookKey}_${chapterNumberPad3}.json`;
//     const result = await fetch(url);
//     const obj = await result.json();
//     return obj.data as ChapterData;
// }


export async function downloadBibleChapterData(versionKey: string, bookNumber: number, bookKey: string, chapterNumber: number) {
    const url = `http://www.reactbible.com/api/bible/${versionKey}/${bookKey}/${chapterNumber}`;
    const result = await fetch(url);
    const obj = await result.json();
    const data = obj.data as { chapterData: ChapterData, fumsImageSource: string };

    return data.chapterData;
}