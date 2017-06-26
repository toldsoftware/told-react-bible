import * as RX from 'reactxp';
import { Passage, PassagePart, PassagePartChoice } from "./types";

const colors = {
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
    inactive: RX.Styles.createViewStyle({
        opacity: 0.75,
    }),
    viewer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
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
        alignItems: 'center',
        justifyContent: 'center',
    }),
    textPart: RX.Styles.createTextStyle({
        marginRight: 2,
        marginLeft: 2,
        fontSize: 16,
    }),
    choicesPart_wrapper: RX.Styles.createViewStyle({
        height: sizes.lineHeight,
        overflow: 'hidden',
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
};



export const PassageViewer = (props: { passage: Passage, onPartDone: (part: PassagePart) => void }) => {

    return (
        <RX.View style={styles.viewer}>
            {props.passage.previousParts.map(x => <RX.View style={styles.inactive}><PassagePartViewer part={x} /></RX.View>)}
            {props.passage.activeParts.map(x => <PassagePartViewer part={x} onPartDone={() => props.onPartDone(x)} />)}
            {props.passage.nextParts.map(x => <RX.View style={styles.inactive}><PassagePartViewer part={x} /></RX.View>)}
        </RX.View>
    );
};

export const PassagePartViewer = (props: { part: PassagePart, onPartDone?: () => void }) => {

    switch (props.part.kind) {
        case 'chapterMarker': return (<RX.Text style={styles.chapterMarker}>{props.part.text}</RX.Text>);
        case 'verseMarker': return (<RX.Text style={styles.verseMarker}>{props.part.text}</RX.Text>);
        case 'choice': return (<PassageChoicesViewer part={props.part} onPartDone={props.onPartDone} />);
        case 'text': default: return (<RX.View style={styles.textPart_view}><RX.Text style={styles.textPart}>{props.part.text}</RX.Text></RX.View>);
    }
};

export class PassageChoicesViewer extends RX.Component<{
    part: PassagePart,
    onPartDone?: () => void
}, {
        isCorrect: boolean,
        choiceStates: {
            isCorrect: boolean;
            isWrong: boolean;
            isCollapsed: boolean;
        }[]
    }>{

    initState = () => {
        this.state = {
            isCorrect: false,
            choiceStates: this.state.choiceStates || this.props.part.choices.map(x => ({
                isCorrect: false,
                isWrong: false,
                isCollapsed: false,
            })),
        };
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
            const shiftAnimation = RX.Animated.timing(this._animatedTranslateValue, {
                toValue: -(i - 1) * sizes.choiceHeight,
                duration: 1000,
                easing: RX.Animated.Easing.InOut(),
            });

            setTimeout(() => {
                shiftAnimation.start();
            });

            this.props.onPartDone();

        } else {
            s[i].isWrong = true;
        }

        this.setState({ isCorrect, choiceStates: s });
    };

    _animatedTranslateValue = new RX.Animated.Value(0.0);
    _shiftStyle = RX.Styles.createAnimatedViewStyle({
        transform: [{
            translateY: this._animatedTranslateValue,
        }]
    })

    render() {
        this.initState();

        return (
            <RX.View style={styles.choicesPart_wrapper}>
                <RX.Animated.View style={[styles.choicesPart, this._shiftStyle]}>
                    {this.props.part.choices.map((x, i) => {
                        const s = this.state.choiceStates[i];
                        return (
                            <RX.View style={styles.choice}>
                                <PassageChoiceViewer part={x} {...s} onPress={() => this.selectChoice(i)} hasOnPartDoneHandler={!!this.props.onPartDone} />
                            </RX.View>
                        );
                    })}
                </RX.Animated.View>
            </RX.View>
        );
    }
}

export const PassageChoiceViewer = (props: { part: PassagePartChoice, isCorrect: boolean, isWrong: boolean, isCollapsed: boolean, onPress: () => void, hasOnPartDoneHandler: boolean }) => {
    if (props.isCorrect) {
        return <RX.Text style={styles.choice_correct}>{props.part.text}</RX.Text>
    } else if (props.isCollapsed && props.isWrong) {
        return <RX.Text style={[styles.choice_collapsed, styles.choice_wrong]}>{props.part.text}</RX.Text>
    } else if (props.isCollapsed) {
        return <RX.Text style={styles.choice_collapsed}>{props.part.text}</RX.Text>
    } else if (props.isWrong) {
        return <RX.Text style={styles.choice_wrong}>{props.part.text}</RX.Text>
    } else if (props.hasOnPartDoneHandler) {
        return <RX.Button style={styles.choice_default} onPress={props.onPress}>{props.part.text}</RX.Button>
    } else {
        return <RX.Text style={styles.choice_disabled}>{props.part.text}</RX.Text>
    }
}

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
