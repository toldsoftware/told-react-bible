import * as RX from 'reactxp';
import { Passage, PassagePart, PassagePartChoice } from "./types";
import { ChoiceKind } from "./passage-options";

const colors = {
    back_viewer: '#FFFFFF',

    text_marker: '#387ef5',

    back_choice: '#387ef5',
    text_choice: '#FFFFFF',

    back_choice_disabled: '#CCCCCC',
    text_choice_disabled: '#000000',

    back_wrong: '#f53d3d',
    text_wrong: '#FFFFFF',

    back_correct: '#32db64',
    text_correct: '#000000',

    // back_collapsed: '#CCCCCC',
    // text_collapsed: '#FFFFFF',
};

const sizes = {
    choiceHeight: 36,
    lineHeight: 108,
    choice_padding: 8,
};

const styles = {
    active: RX.Styles.createViewStyle({
        flex: 1,
    }),
    inactive: RX.Styles.createViewStyle({
        flex: 1,
        opacity: 0.75,
    }),

    viewer: RX.Styles.createViewStyle({

    }),
    paragraph: RX.Styles.createTextStyle({
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        backgroundColor: colors.back_viewer,
        padding: 8,
    }),
    paragraph_end: RX.Styles.createTextStyle({
        flex: 1000,
    }),
    heading: RX.Styles.createTextStyle({
        flex: 1,
        marginRight: 2,
        marginLeft: 2,
        fontSize: 48,
        color: colors.text_marker,
    }),
    chapterMarker: RX.Styles.createTextStyle({
        marginRight: 2,
        marginLeft: 2,
        fontSize: 48,
        color: colors.text_marker,
    }),
    verseMarker: RX.Styles.createTextStyle({
        marginRight: 2,
        marginLeft: 2,
        fontSize: 14,
        color: colors.text_marker,
        paddingBottom: 6,
    }),
    textPart_view: RX.Styles.createViewStyle({
        // height: sizes.lineHeight,
        // alignItems: 'center',
        // justifyContent: 'center',
    }),
    textPart: RX.Styles.createTextStyle({
        marginRight: 2,
        marginLeft: 2,
        fontSize: 16,
    }),
    choicesPart_wrapper: RX.Styles.createViewStyle({
        height: sizes.lineHeight,
        overflow: 'hidden',
        justifyContent: 'center',
    }),
    choicesPart: RX.Styles.createViewStyle({
        alignItems: 'stretch',
        justifyContent: 'center',
        // height: sizes.lineHeight,
    }),
    choice: RX.Styles.createViewStyle({
        height: sizes.choiceHeight - 2,
        marginRight: 2,
        marginLeft: 2,
        marginTop: 1,
        marginBottom: 1,
    }),
    choice_default: RX.Styles.createTextStyle({
        margin: 0,
        padding: sizes.choice_padding,
        fontSize: 16,
        textAlign: 'center',
        color: colors.text_choice,
        backgroundColor: colors.back_choice,
    }),
    choice_disabled: RX.Styles.createTextStyle({
        margin: 0,
        padding: sizes.choice_padding,
        fontSize: 16,
        textAlign: 'center',
        color: colors.text_choice_disabled,
        backgroundColor: colors.back_choice_disabled,
    }),
    choice_correct: RX.Styles.createTextStyle({
        margin: 0,
        padding: sizes.choice_padding,
        fontSize: 16,
        textAlign: 'center',
        color: colors.text_correct,
        backgroundColor: colors.back_correct,
    }),
    choice_wrong: RX.Styles.createTextStyle({
        margin: 0,
        padding: sizes.choice_padding,
        fontSize: 16,
        textAlign: 'center',
        color: colors.text_wrong,
        backgroundColor: colors.back_wrong,

        textDecorationLine: 'line-through',
        textDecorationColor: '#FF0000',
        textDecorationStyle: 'solid',
    }),
    choice_collapsed: RX.Styles.createTextStyle({
        margin: 0,
        padding: sizes.choice_padding,
        fontSize: 16,
        textAlign: 'center',

        opacity: 0.1,
    }),
    width_placeholder: RX.Styles.createTextStyle({
        margin: 0,
        height: 1,
        padding: sizes.choice_padding,
        fontSize: 16,
        textAlign: 'center',
        color: colors.back_viewer,
        backgroundColor: colors.back_viewer,
    }),
};

export const PassageViewer = (props: { passage: Passage, choiceKind: ChoiceKind, onPartDone: (part: PassagePart) => void }) => {

    const allParts = [
        ...props.passage.previousParts.map(x => ({ isActive: false, part: x, onPartDone: null })),
        ...props.passage.activeParts.map(x => ({ isActive: true, part: x, onPartDone: () => props.onPartDone(x) })),
        ...props.passage.nextParts.map(x => ({ isActive: false, part: x, onPartDone: null })),
    ];

    const paragraphs = allParts.reduce((out, x) => {
        if (x.part.kind === 'lineBreak' || !out.length) {
            out.push([]);
            return out;
        }
        const o = out[out.length - 1];
        o.push(x);
        return out;
    }, [] as (typeof allParts)[]);

    return (
        <RX.View style={styles.viewer}>
            {paragraphs.map(c => (
                <RX.View style={styles.paragraph}>
                    {
                        c.map(x => (
                            <RX.View key={x.part._key} style={x.isActive ? styles.active : styles.inactive}>
                                <PassagePartViewer part={x.part} choiceKind={props.choiceKind} onPartDone={x.onPartDone} />
                            </RX.View>
                        ))
                    }
                    <RX.View style={styles.paragraph_end}>
                    </RX.View>
                </RX.View>
            ))}
        </RX.View>
    );

    // return (
    //     <RX.View style={styles.viewer}>
    //         {props.passage.previousParts.map(x => <RX.View key={x._key} style={styles.inactive}><PassagePartViewer part={x} /></RX.View>)}
    //         {props.passage.activeParts.map(x => <PassagePartViewer key={x._key} part={x} onPartDone={() => props.onPartDone(x)} />)}
    //         {props.passage.nextParts.map(x => <RX.View key={x._key} style={styles.inactive}><PassagePartViewer part={x} /></RX.View>)}
    //     </RX.View>
    // );
};

export const PassagePartViewer = (props: { key?: string, part: PassagePart, choiceKind: ChoiceKind, onPartDone?: () => void }) => {
    // return (<RX.Text style={styles.textPart}>{props.part.kind} {props.part.text}</RX.Text>);
    switch (props.part.kind) {
        case 'chapterMarker': return (<RX.Text style={styles.chapterMarker}>{props.part.text}</RX.Text>);
        case 'verseMarker': return (<RX.Text style={styles.verseMarker}>{props.part.text}</RX.Text>);
        case 'heading': return (<RX.Text style={styles.heading}>{props.part.text}</RX.Text>);
        case 'choice': return (<PassageChoicesViewer part={props.part} choiceKind={props.choiceKind} onPartDone={props.onPartDone} />);
        case 'text': default: return (<RX.View style={styles.textPart_view}><RX.Text style={styles.textPart}>{props.part.text}</RX.Text></RX.View>);
    }
};

export class PassageChoicesViewer extends RX.Component<{
    part: PassagePart,
    choiceKind: ChoiceKind,
    onPartDone?: () => void
}, {
        wasDone?: boolean,
        choiceStates: {
            isCorrect: boolean;
            isWrong: boolean;
            isCollapsed: boolean;
        }[]
    }>{

    initState = () => {
        if (this.state && this.state.choiceStates) { return; }

        this.state = {
            wasDone: false,// !!this.props.part._isDone,
            choiceStates: this.state.choiceStates || this.props.part.choices.map(x => ({
                isCorrect: false,
                isWrong: false,
                isCollapsed: false,
            })),
        };

        // if (this.state.wasDone) {
        //     const i = 0;
        //     this._animatedTranslateValue.setValue(-(i - 1) * sizes.choiceHeight);
        // }
    };

    selectChoice = (i: number) => {
        // Ignore if no onPartDone handler
        if (!this.props.onPartDone) { return; }

        const s = this.state.choiceStates;

        const p = this.props.part.choices[i];
        const isCorrect = p === this.props.part.correctChoice;

        if (isCorrect) {
            // Correct choice
            s[i].isCorrect = true;
            s.forEach(c => {
                c.isCollapsed = !c.isCorrect; // !c.isWrong && !c.isCorrect;
            });

            // Shift animation
            if (this.props.part.choices.length === 1) {

            } else if (this.props.part.choices.length === 2) {
                const shiftAnimation = RX.Animated.timing(this._animatedTranslateValue, {
                    toValue: (i === 0 ? 1 : -1) * sizes.choiceHeight * 0.5,
                    duration: 1000,
                    easing: RX.Animated.Easing.InOut(),
                });

                setTimeout(() => {
                    shiftAnimation.start();
                });
            } else {
                const shiftAnimation = RX.Animated.timing(this._animatedTranslateValue, {
                    toValue: -(i - 1) * sizes.choiceHeight,
                    duration: 1000,
                    easing: RX.Animated.Easing.InOut(),
                });

                setTimeout(() => {
                    shiftAnimation.start();
                });
            }

            this.props.onPartDone();

        } else {
            s[i].isWrong = true;
        }

        this.setState({ choiceStates: s });
    };

    _animatedTranslateValue = new RX.Animated.Value(0.0);
    _shiftStyle = RX.Styles.createAnimatedViewStyle({
        transform: [{
            translateY: this._animatedTranslateValue,
        }]
    })

    render() {
        this.initState();

        const choiceKind = this.state.choiceStates.every(x => !x.isWrong) && this.props.choiceKind || ChoiceKind.Word;

        if (!this.state.wasDone) {
            return (
                <RX.View style={styles.choicesPart_wrapper}>
                    <RX.Animated.View style={[styles.choicesPart, this._shiftStyle]}>
                        <WidthPlaceholder items={this.props.part.choices.map(x => x.text)} />
                        {this.props.part.choices.map((x, i) => {
                            const s = this.state.choiceStates[i];
                            return (
                                <RX.View style={styles.choice}>
                                    <PassageChoiceViewer part={x} choiceKind={choiceKind} {...s} onPress={() => this.selectChoice(i)} hasOnPartDoneHandler={!!this.props.onPartDone} />
                                </RX.View>
                            );
                        })}
                        <WidthPlaceholder items={this.props.part.choices.map(x => x.text)} />
                    </RX.Animated.View>
                </RX.View>
            );
        } else {
            const x = this.props.part.correctChoice;
            const s = { isCorrect: true, isWrong: false, isCollapsed: false };
            return (
                <RX.View style={styles.choicesPart_wrapper}>
                    <RX.View style={styles.choicesPart}>
                        <WidthPlaceholder items={this.props.part.choices.map(x => x.text)} />
                        <RX.View style={styles.choice}>
                            <PassageChoiceViewer part={x} choiceKind={choiceKind} {...s} />
                        </RX.View>
                        <WidthPlaceholder items={this.props.part.choices.map(x => x.text)} />
                    </RX.View>
                </RX.View>
            );
        }
    }
}

export const PassageChoiceViewer = (props: { part: PassagePartChoice, isCorrect: boolean, isWrong: boolean, isCollapsed: boolean, choiceKind: ChoiceKind, onPress?: () => void, hasOnPartDoneHandler?: boolean }) => {
    const textRaw = props.part.text;
    let text = props.part.text;

    // Choice Kind
    if (props.choiceKind === ChoiceKind.FirstLetter) {
        let i = 0;
        do {
            i++;
            text = textRaw.substr(0, i) + textRaw.substr(i).replace(/./g, '_');
        } while (!text.match(/(?!_)\w/) && i < textRaw.length);
    }

    if (props.isCorrect) {
        return <RX.Text style={styles.choice_correct}>{textRaw}</RX.Text>
    } else if (props.isCollapsed && props.isWrong) {
        return <RX.Text style={[styles.choice_collapsed, styles.choice_wrong]}>{text}</RX.Text>
    } else if (props.isCollapsed) {
        return <RX.Text style={styles.choice_collapsed}>{text}</RX.Text>
    } else if (props.isWrong) {
        return <RX.Text style={styles.choice_wrong}>{text}</RX.Text>
    } else if (props.hasOnPartDoneHandler) {
        return <RX.Button style={styles.choice_default} onPress={props.onPress}>{text}</RX.Button>
    } else {
        return <RX.Text style={styles.choice_disabled}>{text}</RX.Text>
    }
}

export const WidthPlaceholder = (props: { items: string[] }) => {
    const maxText = props.items.sort((a, b) => a.length - b.length)[0].replace(/./g, '&nbsp;') + '';
    return (
        <RX.Text style={styles.width_placeholder}>{maxText}</RX.Text>
    )
};

//   <div *ngFor="let part of verseParts" class="versePart" [style.color]="part.color" [class.isActiveVersePart]="part.isActive"
//     [class.isNonActiveVersePart]="!part.isActive" [class.lineBreak]="part.isLineBreak">
//     <span id="activeVerse" *ngIf="part.isVerseID && part.isActive"></span>
//     <span class="activeChoice" *ngIf="part.isChoice && part.isActive"></span>
//     <span *ngIf="part.isChapterID" class="chapterID">{{part.text}}&nbsp;</span>
//     <span *ngIf="part.isVerseID" class="verseID">{{part.text}}&nbsp;</span>
//     <span *ngIf="part.isText" class="verseText">{{part.text}}&nbsp;</span>
//     <div *ngIf="part.isChoice" class="choices" [class.inactiveChoices]="part.choices.length <= 1">
//       <button *ngFor="let choice of part.choices" class="choice" [disabled]="!part.isActive" [class.correct]="choice.isCorrect"
//         [class.mistake]="choice.isMistake" [class.collapsed]="choice.isCollapsed" (click)="makeChoice(part, choice)">{{choice.text}}</button>
//     </div>
//   </div>
