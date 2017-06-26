import * as RX from 'reactxp';
import { Passage, PassagePart, PassagePartChoice } from "./types";

const colors = {
    marker: '#777777',
};

const styles = {
    viewer: RX.Styles.createViewStyle({
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    }),
    chapterMarker: RX.Styles.createTextStyle({
        paddingRight: 4,
        fontSize: 36,
        color: colors.marker,
    }),
    verseMarker: RX.Styles.createTextStyle({
        paddingRight: 4,
        fontSize: 10,
        color: colors.marker,
        paddingBottom: 6,
    }),
    text: RX.Styles.createTextStyle({
        paddingRight: 4,
        fontSize: 16,
    }),
    choices: RX.Styles.createViewStyle({
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    }),
    choice: RX.Styles.createTextStyle({
        paddingRight: 4,
        fontSize: 16,
    }),

    choice_correct: RX.Styles.createTextStyle({
        paddingRight: 4,
        fontSize: 16,
        color: '#00FF00',
    }),
    choice_wrong: RX.Styles.createTextStyle({
        paddingRight: 4,
        fontSize: 16,
        color: '#FF0000',
        textDecorationLine: 'line-through',
        textDecorationColor: '#FF0000',
        textDecorationStyle: 'solid',
    }),
    choice_collapsed: RX.Styles.createTextStyle({
        opacity: 0.25,
    }),
};

const sizes = {
    choiceHeight: 18,
};

export const PassageViewer = (props: { passage: Passage }) => (
    <RX.View style={styles.viewer}>
        {props.passage.parts.map(x => <PassagePartViewer part={x} />)}
    </RX.View>
);

export const PassagePartViewer = (props: { part: PassagePart }) => {
    switch (props.part.kind) {
        case 'chapterMarker': return (<RX.Text style={styles.chapterMarker}>{props.part.text}</RX.Text>);
        case 'verseMarker': return (<RX.Text style={styles.verseMarker}>{props.part.text}</RX.Text>);
        case 'text': return (<RX.Text style={styles.text}>{props.part.text}</RX.Text>);
        case 'choice': return (<PassageChoicesViewer part={props.part} />);
    }
    return (
        <RX.Text>{props.part.kind} {props.part.text}</RX.Text>
    );
};

export class PassageChoicesViewer extends RX.Component<{
    part: PassagePart,
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
        const s = this.state.choiceStates;

        const p = this.props.part.choices[i];
        const isCorrect = p === this.props.part.correctChoice;

        if (isCorrect) {
            // Correct choice
            s[i].isCorrect = true;
            s.forEach(c => {
                c.isCollapsed = !c.isWrong && !c.isCorrect;
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
            <RX.Animated.View style={[styles.choices, this._shiftStyle]}>
                {this.props.part.choices.map((x, i) => {
                    const s = this.state.choiceStates[i];
                    return (
                        <PassageChoiceViewer part={x} {...s} onPress={() => this.selectChoice(i)} />
                    );
                })}
            </RX.Animated.View>
        );
    }
}

export const PassageChoiceViewer = (props: { part: PassagePartChoice, isCorrect: boolean, isWrong: boolean, isCollapsed: boolean, onPress: () => void }) => {
    if (props.isCorrect) {
        return <RX.Text style={styles.choice_correct}>{props.part.text}</RX.Text>
    } else if (props.isWrong) {
        return <RX.Text style={styles.choice_wrong}>{props.part.text}</RX.Text>
    } else if (props.isCollapsed) {
        return <RX.Text style={styles.choice_collapsed}>{props.part.text}</RX.Text>
    } else {
        return <RX.Button style={styles.choice} onPress={props.onPress}>{props.part.text}</RX.Button>
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
