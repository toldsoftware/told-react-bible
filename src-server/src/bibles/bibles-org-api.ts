import fetch from "node-fetch";
import { BiblesOrgApiKey } from "../settings";
import { ChapterData } from "../../../src-client/src/app/components/bible/types";

// From: http://bibles.org/pages/api/documentation/passages
// {
//     "response": {
//         "search": {
//             "result": {
//                 "passages": [
//                     {
//                         "copyright": "<p>King James Version 1611, spelling, punctuation and text formatting modernized by ABS in 1962; typesetting \u00a9 2010 American Bible Society.</p>",
//                         "text": "<h3 class=\"s1\">Jesus and Nicodemus</h3>\n<p class=\"p\"><sup id=\"John.3.1\" class=\"v\">1</sup>There was a man of the Pharisees, named Nicode\u00b4mus, a ruler of the Jews:<sup id=\"John.3.2\" class=\"v\">2</sup>the same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.<sup id=\"John.3.3\" class=\"v\">3</sup>Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.<sup id=\"John.3.4\" class=\"v\">4</sup>Nicode\u00b4mus saith unto him, How can a man be born when he is old? can he enter the second time into his mother's womb, and be born?<sup id=\"John.3.5\" class=\"v\">5</sup>Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and <span class=\"add\">of</span> the Spirit, he cannot enter into the kingdom of God.</p>",
//                         "end_verse_id": "eng-KJVA:John.3.5",
//                         "version": "eng-KJVA",
//                         "path": "/chapters/eng-KJVA:John.3/verses.js?start=1&end=5",
//                         "version_abbreviation": "KJVA",
//                         "start_verse_id": "eng-KJVA:John.3.1",
//                         "display": "John 3:1-5"
//                     }
//                 ],
//                 "type": "passages"
//             }
//         },
//         "meta": {
//             "fums_js_include": "d2ue49q0mum86x.cloudfront.net/include/fums.c.js",
//             "fums_noscript": "<img src=\"https://d3a2okcloueqyx.cloudfront.net/nf1?t=517045759045b9.17531408\" height=\"1\" width=\"1\" border=\"0\" alt=\"\" style=\"height: 0; width: 0;\" />",
//             "fums_js": "var _BAPI=_BAPI||{};if(typeof(_BAPI.t)!='undefined'){ _BAPI.t('517045759045b9.17531408'); }",
//             "fums_tid": "517045759045b9.17531408",
//             "fums": "<script>\nvar _BAPI=_BAPI||{};\nif(typeof(_BAPI.t)==='undefined'){\ndocument.write('\\x3Cscript src=\"'+document.location.protocol+'//d2ue49q0mum86x.cloudfront.net/include/fums.c.js\"\\x3E\\x3C/script\\x3E');}\ndocument.write(\"\\x3Cscript\\x3E_BAPI.t('517045759045b9.17531408');\\x3C/script\\x3E\");\n</script><noscript><img src=\"https://d3a2okcloueqyx.cloudfront.net/nf1?t=517045759045b9.17531408\" height=\"1\" width=\"1\" border=\"0\" alt=\"\" style=\"height: 0; width: 0;\" /></noscript>"
//         }
//     }
// }
export interface BibleOrgPassagesResponse {
    response: {
        search: {
            result: {
                // type: 'passages';
                passages: {
                    //     // copyright: string;
                    text: string;
                    //     // end_verse_id: string;
                    //     // version: string;
                    //     // path: string;
                    //     // version_abbreviation: string;
                    //     // start_verse_id: string;
                    //     // display: string;
                }[];
            }
        };
        meta: {
            // No Script Image
            // Parse src to get image source
            fums_noscript: string;
        };
    };
}

export async function fetchChapterData(version: string, book: string, chapter: string) {
    const passage = await fetchPassage(version, `${book} ${chapter}`);
    const data = convertToChapterData(chapter, passage);
    return data;
}

export async function fetchPassage(version: string, reference: string) {
    const url = `https://bibles.org/v2/passages.js?q[]=?${reference}&version=${version}`;
    const headers = {
        Authorization: `Basic ${btoa(BiblesOrgApiKey + ":")}`
    };
    const res = await fetch(url, { headers });
    // console.log('fetchPassage', { url, headers, res });
    const obj = await res.json() as BibleOrgPassagesResponse;
    console.log('fetchPassage', { url, headers, json: JSON.stringify(obj) });

    return obj;
}

function btoa(t: string) {
    return new Buffer(t).toString('base64')
}

export function convertToChapterData(chapter: string, passage: BibleOrgPassagesResponse): { chapterData: ChapterData, fumsImageSource: string } {
    const fumsImageTag = passage.response.meta.fums_noscript;
    const fumsImageSource = fumsImageTag.match(/src="([^"]*)"/)[1];

    // text =
    // <h3 class="s1">Jesus and Nicodemus</h3>
    // <p class="p"><sup id="John.3.1" class="v">1</sup>There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:<sup id="John.3.2" class="v">2</sup>the same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.<sup id="John.3.3" class="v">3</sup>Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.<sup id="John.3.4" class="v">4</sup>Nicode\u00b4mus saith unto him, How can a man be born when he is old? can he enter the second time into his mother's womb, and be born?<sup id="John.3.5" class="v">5</sup>Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and <span class="add">of</span> the Spirit, he cannot enter into the kingdom of God.</p>
    const text = passage.response.search.result.passages[0].text;
    const chapterData = parsePassageText(chapter, text);

    return { chapterData, fumsImageSource };
}

function parsePassageText(chapter: string, text: string) {
    const verseParts = text.split(/<sup [^>]*class="v"[^>]*>/g);

    console.log('parsePassageText', { verseParts });

    const verses = verseParts.slice(1).map(x => {
        console.log('parsePassageText verseParts.slice(1).map START', { x });
        
        const parts = x.match(/^(\d+)(-\d+)?<\/sup>(.*)$/m);
        const verseStart = parts[1]
        const verseEnd = parts[2] ? parts[2].substr(1) : undefined;
        const v = verseStart;
        const text = parts[3];

        const textCleaned = text
            .replace(/<span ?[^<]*>/g, '')
            .replace(/<\/span>/g, '')
            .replace(/<p ?[^<]*>/g, '')
            .replace(/<\/p>/g, '\n')
            .replace(/  /g, ' ')
            .replace(/  /g, ' ')
            .replace(/  /g, ' ')
            ;

        console.log('parsePassageText verseParts.slice(1).map END', { parts });

        return {
            c: chapter,
            v,
            vEnd: verseEnd,
            text: textCleaned
        };
    });

    const chapterData = {
        c: chapter,
        verses,
    };

    return chapterData;
}

export function test_convertToChapterData() {
    const data = parsePassageText('3', testPassageText);

    console.log('test_convertToChapterData', { data });
    return data;
}

const testPassageText = `
<h3 class="s1">You Must Be Born Again</h3>
<p class="p"><sup id="John.3.1" class="v">1</sup>Now there was a man of the Pharisees named  Nicodemus,  a ruler of the Jews.<sup id="John.3.2" class="v">2</sup>This man came to Jesus  by night and said to him,  “Rabbi,  we know that you are a teacher come from God, for no one can do these signs that you do  unless God is with him.”<sup id="John.3.3" class="v">3</sup>Jesus answered him, <span class="wj">“Truly, truly, I say to you, unless one is </span> <span class="wj">born </span> <span class="wj">again</span> <span class="wj">he cannot </span> <span class="wj">see the kingdom of God.”</span><sup id="John.3.4" class="v">4</sup>Nicodemus said to him, “How can a man be born when he is old? Can he enter a second time into his mother’s womb and be born?”<sup id="John.3.5" class="v">5</sup>Jesus answered, <span class="wj">“Truly, truly, I say to you, unless one is born </span> <span class="wj">of water and the Spirit, he cannot enter the kingdom of God.</span><sup id="John.3.6" class="v">6</sup> <span class="wj">That which is born of the flesh is </span> <span class="wj">flesh, and that which is born of the Spirit is spirit.</span><sup id="John.3.7" class="v">7</sup> <span class="wj">Do not marvel that I said to you, ‘You</span> <span class="wj">must be born </span> <span class="wj">again.’</span><sup id="John.3.8" class="v">8</sup> <span class="wj">The wind</span> <span class="wj">blows </span> <span class="wj">where it wishes, and you hear its sound, but you do not know where it comes from or where it goes. So it is with everyone who is born of the Spirit.”</span></p>
<p class="p"><sup id="John.3.9" class="v">9</sup>Nicodemus said to him,  “How can these things be?”<sup id="John.3.10" class="v">10</sup>Jesus answered him, <span class="wj">“Are you the teacher of Israel </span> <span class="wj">and yet you do not understand these things?</span><sup id="John.3.11" class="v">11</sup><span class="wj">Truly, truly, I say to you, </span> <span class="wj">we speak of what we know, and bear witness to what we have seen, but </span> <span class="wj">you</span> <span class="wj">do not receive our testimony.</span><sup id="John.3.12" class="v">12</sup><span class="wj">If I have told you earthly things and you do not believe, how can you believe if I tell you heavenly things?</span><sup id="John.3.13" class="v">13</sup> <span class="wj">No one has </span> <span class="wj">ascended into heaven except </span> <span class="wj">he who descended from heaven, the Son of Man.</span><sup id="John.3.14" class="v">14</sup><span class="wj">And </span> <span class="wj">as Moses lifted up the serpent in the wilderness, so must the Son of Man </span> <span class="wj">be lifted up,</span><sup id="John.3.15" class="v">15</sup><span class="wj">that whoever believes </span> <span class="wj">in him </span> <span class="wj">may have eternal life.</span> </p>
<h3 class="s1">For God So Loved the World</h3>
<p class="p"><sup id="John.3.16" class="v">16</sup><span class="wj">“For </span> <span class="wj">God so loved </span> <span class="wj">the world,</span>  <span class="wj">that he gave his only Son, that whoever believes in him should not </span> <span class="wj">perish but have eternal life.</span><sup id="John.3.17" class="v">17</sup><span class="wj">For </span> <span class="wj">God did not send his Son into the world </span> <span class="wj">to condemn the world, but in order that the world might be saved through him.</span><sup id="John.3.18" class="v">18</sup> <span class="wj">Whoever believes in him is not condemned, but whoever does not believe is condemned already, because he has not </span> <span class="wj">believed in the name of the only Son of God.</span><sup id="John.3.19" class="v">19</sup> <span class="wj">And this is the judgment: </span> <span class="wj">the light has come into the world, and </span> <span class="wj">people loved the darkness rather than the light because </span> <span class="wj">their works were evil.</span><sup id="John.3.20" class="v">20</sup> <span class="wj">For everyone who does wicked things hates the light and does not come to the light, </span> <span class="wj">lest his works should be exposed.</span><sup id="John.3.21" class="v">21</sup><span class="wj">But whoever </span> <span class="wj">does what is true </span> <span class="wj">comes to the light, so that it may be clearly seen that his works have been carried out in God.”</span></p>
<h3 class="s1">John the Baptist Exalts Christ</h3>
<p class="p"><sup id="John.3.22" class="v">22</sup>After this Jesus and his disciples went into the Judean countryside, and he remained there with them and  was baptizing.<sup id="John.3.23" class="v">23</sup>John also was baptizing at Aenon near Salim, because water was plentiful there, and people were coming and being baptized<sup id="John.3.24" class="v">24</sup>(for  John had not yet been put in prison).</p>
<p class="p"><sup id="John.3.25" class="v">25</sup>Now a discussion arose between some of John’s disciples and a Jew over  purification.<sup id="John.3.26" class="v">26</sup>And they came to John and said to him,  “Rabbi, he who was with you across the Jordan,  to whom you bore witness—look, he is baptizing, and  all are going to him.”<sup id="John.3.27" class="v">27</sup>John answered,  “A person cannot receive even one thing  unless it is given him  from heaven.<sup id="John.3.28" class="v">28</sup>You yourselves bear me witness, that I said,  ‘I am not the Christ, but  I have been sent before him.’<sup id="John.3.29" class="v">29</sup> The one who has the bride is the bridegroom.  The friend of the bridegroom, who stands and hears him,  rejoices greatly at the bridegroom’s voice. Therefore this joy of mine is now complete.<sup id="John.3.30" class="v">30</sup> He must increase, but I must decrease.” </p>
<p class="p"><sup id="John.3.31" class="v">31</sup> He who comes from above  is above all. He who is of the earth belongs to the earth and  speaks in an earthly way.  He who comes from heaven  is above all.<sup id="John.3.32" class="v">32</sup> He bears witness to what he has seen and heard,  yet no one receives his testimony.<sup id="John.3.33" class="v">33</sup>Whoever receives his testimony  sets his seal to this,  that God is true.<sup id="John.3.34" class="v">34</sup>For he whom  God has sent utters the words of God, for he gives the Spirit  without measure.<sup id="John.3.35" class="v">35</sup> The Father loves the Son and  has given all things into his hand.<sup id="John.3.36" class="v">36</sup> Whoever believes in the Son has eternal life;  whoever does not obey the Son shall not  see life, but the wrath of God remains on him.</p>
`;

// test_convertToChapterData();