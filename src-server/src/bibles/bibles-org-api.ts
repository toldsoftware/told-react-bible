import fetch from "node-fetch";
import { parseFragment } from "parse5";
import { BiblesOrgApiKey } from "../settings";
import { ChapterData, VerseParagraph, VerseContent, VerseData } from "../../../src-client/src/app/components/bible/types";
import { group, groupToArray } from "../utils/objects";

function parseHtml(t: string) {
    return parseFragment(t);
}

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

export async function fetchChapterData(version: string, book: string, chapter: number) {
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

export function convertToChapterData(chapter: number, passage: BibleOrgPassagesResponse): { chapterData: ChapterData, fumsImageSource: string } {
    const fumsImageTag = passage.response.meta.fums_noscript;
    const fumsImageSource = fumsImageTag.match(/src="([^"]*)"/)[1];

    // text =
    // <h3 class="s1">Jesus and Nicodemus</h3>
    // <p class="p"><sup id="John.3.1" class="v">1</sup>There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:<sup id="John.3.2" class="v">2</sup>the same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.<sup id="John.3.3" class="v">3</sup>Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.<sup id="John.3.4" class="v">4</sup>Nicode\u00b4mus saith unto him, How can a man be born when he is old? can he enter the second time into his mother's womb, and be born?<sup id="John.3.5" class="v">5</sup>Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and <span class="add">of</span> the Spirit, he cannot enter into the kingdom of God.</p>
    const text = passage.response.search.result.passages[0].text;
    const chapterData = parsePassageText(chapter, text);

    return { chapterData, fumsImageSource };
}

interface HtmlPassage {
    childNodes: (HtmlPassageHeaderNode | HtmlPassageParagraphNode)[];
}

interface HtmlNodeWithClass {
    attrs: { name: string, value: string }[];
}

interface HtmlPassageHeaderNode extends HtmlNodeWithClass {
    childNodes: [HtmlPassageTextContentNode];
    nodeName: 'h3';
}

interface HtmlPassageParagraphNode extends HtmlNodeWithClass {
    childNodes: (HtmlPassageVerseNode | HtmlPassageTextContentNode | HtmlPassageSpanNode)[];
    nodeName: 'p';
}

interface HtmlPassageVerseNode extends HtmlNodeWithClass {
    childNodes: [HtmlPassageTextContentNode];
    nodeName: 'sup';
}

interface HtmlPassageSpanNode extends HtmlNodeWithClass {
    childNodes: [HtmlPassageTextContentNode];
    nodeName: 'span';
}

interface HtmlPassageTextContentNode {
    value: string;
    nodeName: '#text';
}

function getClassName(n: HtmlNodeWithClass) {
    const a = n.attrs.filter(x => x.name === 'class');
    if (!a.length) { return ''; }
    return a[0].value;
}

function parsePassageText(chapter: number, passageText: string): ChapterData {
    const t = passageText.replace(/\s+/g, ' ').replace(/> </g, '><').trim();
    const o = parseHtml(t) as HtmlPassage;

    const paragraphs: VerseParagraph[] = o.childNodes.map(p => {
        if (p.nodeName === 'h3') {
            return {
                k: 'header',
                x: [{ t: p.childNodes[0].value }],
            } as VerseParagraph;
        } else if (p.nodeName === 'p') {
            return {
                k: getClassName(p),
                x: p.childNodes.map(c => {
                    if (c.nodeName === 'sup') {
                        return {
                            k: 'verse',
                            t: c.childNodes[0].value
                        } as VerseContent;
                    } else if (c.nodeName === 'span') {
                        return {
                            k: getClassName(c),
                            t: c.childNodes[0].value
                        } as VerseContent;
                    } else {
                        return {
                            t: c.value
                        } as VerseContent;
                    }
                }),
            } as VerseParagraph;
        } else {
            // Ignore other text
            console.warn('parsePassageText Ignored', { p });
            return null;
        }
    });

    const numbered = paragraphs.filter(p => p).map((p, i) => {
        let vNumbers = p.x.filter(x => x.k === 'verse');

        if (!vNumbers.length) {
            return {
                vStart: undefined,
                vEnd: undefined,
                ...p
            };
        }

        const vStart = getVerseNumbers(vNumbers[0].t).vStart;
        const vEnd = getVerseNumbers(vNumbers[vNumbers.length - 1].t).vEnd;
        return {
            vStart,
            vEnd,
            ...p
        };
    });

    numbered.forEach((p, i) => {
        if (p.vStart) { return; }

        if (p.k === 'header') {
            p.vStart = numbered[i + 1].vStart;
            p.vEnd = numbered[i + 1].vEnd;
        } else {
            p.vStart = numbered[i - 1].vStart;
            p.vEnd = numbered[i - 1].vEnd;
        }
    });

    const grouped = groupToArray(numbered, x => '' + x.vStart);

    const verseData: VerseData[] = grouped.map(g => {
        return {
            c: chapter,
            vStart: g[0].vStart,
            vEnd: g[g.length - 1].vEnd,
            p: g.map(p => ({
                k: p.k,
                x: p.x
            }))
        };
    });

    console.log('parsePassageText', { verseData })

    const chapterData = {
        c: chapter,
        verseData,
    };

    return chapterData;

    // // Remove paragraph hierarchy
    // t = t.replace(/<p ?[^<]*>/g, '');
    // t = t.replace(/<\/p>/g, '\n');

    // const verseParts = t.split(/<sup [^>]*class="v"[^>]*>/g);

    // console.log('parsePassageText', { verseParts });

    // // Ignore Headers?
    // const prefix = verseParts[0];

    // const verses = verseParts.slice(1).map(x => {
    //     console.log('parsePassageText verseParts.slice(1).map START', { x });

    //     const parts = x.match(/^(\d+)(-\d+)?<\/sup>(.*)$/);
    //     const verseStart = parts[1]
    //     const verseEnd = parts[2] ? parts[2].substr(1) : undefined;
    //     const v = verseStart;
    //     const text = parts[3];

    //     const textCleaned = text
    //         .replace(/<span ?[^<]*>/g, '')
    //         .replace(/<\/span>/g, '')
    //         .replace(/<p ?[^<]*>/g, '')
    //         .replace(/<\/p>/g, '\n')
    //         .replace(/  /g, ' ')
    //         .replace(/  /g, ' ')
    //         .replace(/  /g, ' ')

    //         // Ignore Headers?
    //         .replace(/<h\d ?[^<]*>[^<]*<\/h\d>/g, '')

    //         ;



    //     console.log('parsePassageText verseParts.slice(1).map END', { text, textCleaned, v, verseEnd });

    //     return {
    //         c: chapter,
    //         v,
    //         vEnd: verseEnd,
    //         text: textCleaned,
    //     };
    // });

    // const chapterData = {
    //     c: chapter,
    //     verses,
    // };

    // return chapterData;
}

function getVerseNumbers(v: string) {
    const parts = v.match(/^(\d+)(-\d+)?$/);
    const vStart = parseInt(parts[0]);
    const vEnd = parseInt(parts[1]) || vStart;
    return {
        vStart,
        vEnd
    };
}

export function test_convertToChapterData() {
    const data = parsePassageText(3, testPassageText2);
    console.log('test_convertToChapterData', { data });
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

const testPassageText2 = `
<p class=\"p\"><sup id=\"Isa.1.1\" class=\"v\">1<\/sup>The  vision of Isaiah the son of Amoz, which he saw concerning Judah and Jerusalem  in the days of  Uzziah,  Jotham,  Ahaz, and  Hezekiah, kings of Judah.<\/p>\n
<h3 class=\"s1\">The Wickedness of Judah<\/h3>\n<p class=\"q1\"><sup id=\"Isa.1.2\" class=\"v\">2<\/sup> Hear, O heavens, and give ear, O  earth;<\/p>\n<p class=\"q2\">for the <span class=\"nd\">Lord<\/span> has spoken:<\/p>\n<p class=\"q1\">\u201cChildren   have I reared and brought up,<\/p>\n<p class=\"q2\">but they have rebelled against me.<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.3\" class=\"v\">3<\/sup>The ox  knows its owner,<\/p>\n<p class=\"q2\">and the donkey its master\u2019s crib,<\/p>\n<p class=\"q1\">but Israel does  not know,<\/p>\n<p class=\"q2\">my people do not understand.\u201d<\/p>\n<p class=\"b\"><\/p>\n<p class=\"q1\"><sup id=\"Isa.1.4\" class=\"v\">4<\/sup>Ah, sinful nation,<\/p>\n<p class=\"q2\">a people laden with iniquity,<\/p>\n<p class=\"q1\"> offspring of evildoers,<\/p>\n<p class=\"q2\">children who deal corruptly!<\/p>\n<p class=\"q1\">They have forsaken the <span class=\"nd\">Lord<\/span>,<\/p>\n<p class=\"q2\">they have  despised  the Holy One of Israel,<\/p>\n<p class=\"q2\">they are utterly  estranged.<\/p>\n<p class=\"b\"><\/p>\n<p class=\"q1\"><sup id=\"Isa.1.5\" class=\"v\">5<\/sup>Why will you still be  struck down?<\/p>\n<p class=\"q2\">Why will you  continue to rebel?<\/p>\n<p class=\"q1\">The whole head is sick,<\/p>\n<p class=\"q2\">and the whole heart faint.<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.6\" class=\"v\">6<\/sup> From the sole of the foot even to the head,<\/p>\n<p class=\"q2\">there is no soundness in it,<\/p>\n<p class=\"q1\">but bruises and sores<\/p>\n<p class=\"q2\">and raw wounds;<\/p>\n<p class=\"q1\">they are  not pressed out or bound up<\/p>\n<p class=\"q2\">or softened with oil.<\/p>\n<p class=\"b\"><\/p>\n<p class=\"q1\"><sup id=\"Isa.1.7\" class=\"v\">7<\/sup> Your country lies desolate;<\/p>\n<p class=\"q2\">your cities are burned with fire;<\/p>\n<p class=\"q1\">in your very presence<\/p>\n<p class=\"q2\">foreigners devour your land;<\/p>\n<p class=\"q2\">it is desolate, as overthrown by foreigners.<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.8\" class=\"v\">8<\/sup>And  the daughter of Zion is left<\/p>\n<p class=\"q2\">like a  booth in a vineyard,<\/p>\n<p class=\"q1\">like a lodge in a cucumber field,<\/p>\n<p class=\"q2\">like a besieged city.<\/p>\n<p class=\"b\"><\/p>\n<p class=\"q1\"><sup id=\"Isa.1.9\" class=\"v\">9<\/sup> If the <span class=\"nd\">Lord<\/span> of hosts<\/p>\n<p class=\"q2\">had not left us  a few survivors,<\/p>\n<p class=\"q1\">we should have been like  Sodom,<\/p>\n<p class=\"q2\">and become like  Gomorrah.<\/p>\n<p class=\"b\"><\/p>\n<p class=\"q1\"><sup id=\"Isa.1.10\" class=\"v\">10<\/sup>Hear the word of the <span class=\"nd\">Lord<\/span>,<\/p>\n<p class=\"q2\">you rulers of   Sodom!<\/p>\n<p class=\"q1\">Give ear to the teaching  of our God,<\/p>\n<p class=\"q2\">you people of  Gomorrah!<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.11\" class=\"v\">11<\/sup> \u201cWhat to me is the multitude of your sacrifices?<\/p>\n<p class=\"q2\">says the <span class=\"nd\">Lord<\/span>;<\/p>\n<p class=\"q1\">I have had enough of burnt offerings of rams<\/p>\n<p class=\"q2\">and the fat of well-fed beasts;<\/p>\n<p class=\"q1\">I do not delight in the blood of bulls,<\/p>\n<p class=\"q2\">or of lambs, or of goats.<\/p>\n<p class=\"b\"><\/p>\n<p class=\"q1\"><sup id=\"Isa.1.12\" class=\"v\">12<\/sup>\u201cWhen you come to  appear before me,<\/p>\n<p class=\"q2\">who has required of you<\/p>\n<p class=\"q2\">this trampling of my courts?<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.13\" class=\"v\">13<\/sup>Bring no more vain offerings;<\/p>\n<p class=\"q2\">incense is an abomination to me.<\/p>\n<p class=\"q1\"> New moon and Sabbath and the  calling of convocations\u2014<\/p>\n<p class=\"q2\">I cannot endure  iniquity and  solemn assembly.<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.14\" class=\"v\">14<\/sup>Your  new moons and your appointed feasts<\/p>\n<p class=\"q2\">my soul hates;<\/p>\n<p class=\"q1\">they have become a burden to me;<\/p>\n<p class=\"q2\">I am weary of bearing them.<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.15\" class=\"v\">15<\/sup>When you  spread out your hands,<\/p>\n<p class=\"q2\">I will hide my eyes from you;<\/p>\n<p class=\"q1\"> even though you make many prayers,<\/p>\n<p class=\"q2\">I will not listen;<\/p>\n<p class=\"q2\"> your hands are full of blood.<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.16\" class=\"v\">16<\/sup> Wash yourselves; make yourselves clean;<\/p>\n<p class=\"q2\">remove the evil of your deeds from before my eyes;<\/p>\n<p class=\"q1\"> cease to do evil,<\/p>\n<p class=\"q2\"><sup id=\"Isa.1.17\" class=\"v\">17<\/sup>learn to do good;<\/p>\n<p class=\"q1\"> seek justice,<\/p>\n<p class=\"q2\">correct oppression;<\/p>\n<p class=\"q1\"> bring justice to the fatherless,<\/p>\n<p class=\"q2\">plead the widow\u2019s cause.<\/p>\n<p class=\"b\"><\/p>\n<p class=\"q1\"><sup id=\"Isa.1.18\" class=\"v\">18<\/sup>\u201cCome now,  let us reason  together, says the <span class=\"nd\">Lord<\/span>:<\/p>\n<p class=\"q1\">though your sins are like scarlet,<\/p>\n<p class=\"q2\">they shall be as  white as snow;<\/p>\n<p class=\"q1\">though they are red like crimson,<\/p>\n<p class=\"q2\">they shall become like wool.<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.19\" class=\"v\">19<\/sup> If you are willing and obedient,<\/p>\n<p class=\"q2\">you shall eat the good of the land;<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.20\" class=\"v\">20<\/sup>but if you refuse and rebel,<\/p>\n<p class=\"q2\">you shall be eaten by the sword;<\/p>\n<p class=\"q2\"> for the mouth of the <span class=\"nd\">Lord<\/span> has spoken.\u201d<\/p>\n<h3 class=\"s1\">The Unfaithful City<\/h3>\n<p class=\"q1\"><sup id=\"Isa.1.21\" class=\"v\">21<\/sup>How the faithful city<\/p>\n<p class=\"q2\"> has become a whore, <\/p>\n<p class=\"q2\"> she who was full of justice!<\/p>\n<p class=\"q1\">Righteousness lodged in her,<\/p>\n<p class=\"q2\">but now murderers.<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.22\" class=\"v\">22<\/sup> Your silver has become dross,<\/p>\n<p class=\"q2\">your best wine mixed with water.<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.23\" class=\"v\">23<\/sup>Your princes are rebels<\/p>\n<p class=\"q2\">and companions of thieves.<\/p>\n<p class=\"q1\">Everyone  loves a bribe<\/p>\n<p class=\"q2\">and runs after gifts.<\/p>\n<p class=\"q1\"> They do not bring justice to the fatherless,<\/p>\n<p class=\"q2\">and the widow\u2019s cause does not come to them.<\/p>\n<p class=\"b\"><\/p>\n<p class=\"q1\"><sup id=\"Isa.1.24\" class=\"v\">24<\/sup>Therefore the  Lord declares,<\/p>\n<p class=\"q2\">the <span class=\"nd\">Lord<\/span> of hosts,<\/p>\n<p class=\"q2\">the  Mighty One of Israel:<\/p>\n<p class=\"q1\">\u201cAh, I will get relief from my enemies<\/p>\n<p class=\"q2\"> and avenge myself on my foes.<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.25\" class=\"v\">25<\/sup> I will turn my hand against you<\/p>\n<p class=\"q2\">and will smelt away your  dross as with lye<\/p>\n<p class=\"q2\">and remove all your alloy.<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.26\" class=\"v\">26<\/sup>And I will restore your judges  as at the first,<\/p>\n<p class=\"q2\">and your counselors as at the beginning.<\/p>\n<p class=\"q1\">Afterward  you shall be called the city of righteousness,<\/p>\n<p class=\"q2\">the faithful city.\u201d<\/p>\n<p class=\"b\"><\/p>\n<p class=\"q1\"><sup id=\"Isa.1.27\" class=\"v\">27<\/sup> Zion shall be redeemed by justice,<\/p>\n<p class=\"q2\">and those in her who repent, by righteousness.<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.28\" class=\"v\">28<\/sup> But rebels and sinners shall be broken together,<\/p>\n<p class=\"q2\">and those who forsake the <span class=\"nd\">Lord<\/span> shall be consumed.<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.29\" class=\"v\">29<\/sup> For they  shall be ashamed of  the oaks<\/p>\n<p class=\"q2\">that you desired;<\/p>\n<p class=\"q1\">and you shall blush for  the gardens<\/p>\n<p class=\"q2\">that you have chosen.<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.30\" class=\"v\">30<\/sup>For you shall be  like an oak<\/p>\n<p class=\"q2\">whose leaf withers,<\/p>\n<p class=\"q2\">and like a garden without water.<\/p>\n<p class=\"q1\"><sup id=\"Isa.1.31\" class=\"v\">31<\/sup>And the strong shall become  tinder,<\/p>\n<p class=\"q2\">and his work a spark,<\/p>\n<p class=\"q1\">and both of them shall burn together,<\/p>\n<p class=\"q2\">with  none to quench them.<\/p>","copyright":"<p>Scripture quotations marked (ESV) are from The Holy Bible, English Standard Version\u00ae, copyright \u00a9 2001 by Crossway Bibles, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.<\/p>\n  
`;

// test_convertToChapterData();