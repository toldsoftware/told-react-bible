import * as RX from 'reactxp';
import { BibleStore } from "../../store/bible-store";
import { storeComp } from "../common/store-component-base";

const colors = {
    back_options: '#32db64',
    text_options: '#000000',
};

const styles = {
    row: RX.Styles.createViewStyle({
        flexDirection: 'row',
        alignItems: 'center',
    }),
    picker: RX.Styles.createPickerStyle({
        flex: 1,
        margin: 4,
        padding: 4,
    }),

    options_view: RX.Styles.createViewStyle({
        backgroundColor: colors.back_options,
        padding: 8,
    }),
    options_text: RX.Styles.createTextStyle({
        color: colors.text_options,
    }),
};

export enum ChoiceKind {
    Word = 'Word',
    FirstLetter = 'First Letter',
}

export enum ChoiceSpacing {
    LongSpacing = 'Long Spacing',
    MediumSpacing = 'Medium Spacing',
    ShortSpacing = 'Short Spacing',
    EveryWord = 'Every Word',
}

export const PassageOptions = (props: { bibleStore: BibleStore }) => storeComp(() => ({
    choiceKind: props.bibleStore.getChoiceKind(),
    changeChoiceKind: props.bibleStore.changeChoiceKind,
    choiceSpacing: props.bibleStore.getChoiceSpacing(),
    changeChoiceSpacing: props.bibleStore.changeChoiceSpacing,
}), (state) => {
    return (
        <RX.View style={styles.options_view}>
            <ChoiceKindSelector value={state.choiceKind} onChange={state.changeChoiceKind} />
            <ChoiceSpacingSelector value={state.choiceSpacing} onChange={state.changeChoiceSpacing} />
        </RX.View>
    );
});

export const ChoiceKindSelector = (props: { value: ChoiceKind, onChange?: (value: ChoiceKind) => void }) => (
    <RX.View style={styles.row}>
        {/* <RX.Text style={styles.options_text} >Difficulty</RX.Text> */}
        <RX.Picker style={styles.picker} items={[
            ChoiceKind.Word,
            ChoiceKind.FirstLetter,
        ].map(x => ({ label: x, value: x }))}
            selectedValue={props.value} onValueChange={props.onChange} />
    </RX.View>
)

export const ChoiceSpacingSelector = (props: { value: ChoiceSpacing, onChange?: (value: ChoiceSpacing) => void }) => (
    <RX.View style={styles.row}>
        {/* <RX.Text style={styles.options_text} >Difficulty</RX.Text> */}
        <RX.Picker style={styles.picker} items={[
            ChoiceSpacing.EveryWord,
            ChoiceSpacing.ShortSpacing,
            ChoiceSpacing.MediumSpacing,
            ChoiceSpacing.LongSpacing,
        ].map(x => ({ label: x, value: x }))}
            selectedValue={props.value} onValueChange={props.onChange} />
    </RX.View>
)