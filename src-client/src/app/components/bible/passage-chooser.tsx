import * as RX from 'reactxp';

import { BibleStore } from "../../store/bible-store";
import { storeComp } from "../common/store-component-base";
import { styles } from "../../styles";

const localStyles = {
    chooser: RX.Styles.createViewStyle({
        padding: 8,
    }),
    selector: RX.Styles.createViewStyle({
        flexDirection: 'row',
        padding: 4,
    }),
    label: RX.Styles.createViewStyle({
        width: 80,
    }),
    picker: RX.Styles.createPickerStyle({
        flex: 1,
        marginLeft: 8,
    }),
};

export const PassageChooser = (props: { bibleStore: BibleStore }) => storeComp(() => ({
    m: props.bibleStore.getPassageMetadata(),
}), (state) => {
    return (
        <RX.View style={localStyles.chooser}>
            <Selector label='Book' value={state.m.bookKey} choices={state.m.books.map(x => ({ label: x.bookName, value: x.bookID }))} onChoice={props.bibleStore.selectBook} />
            <Selector label='Chapter' value={state.m.chapterNumber + ''} choices={getNumbersList(state.m.chapterCount)} onChoice={props.bibleStore.selectChapter} />
            <Selector label='Verse' value={state.m.verseNumber + ''} choices={getNumbersList(state.m.verseCount)} onChoice={props.bibleStore.selectVerse} />
        </RX.View>
    );
});

export const Selector = (props: { label: string, value: string, choices: RX.Types.PickerPropsItem[], onChoice: (value: string) => void }) => (
    <RX.View style={localStyles.selector}>
        <RX.Text style={localStyles.label}>{props.label}</RX.Text>
        <RX.Picker style={localStyles.picker} items={props.choices} selectedValue={props.value} onValueChange={props.onChoice} />
    </RX.View>
);

function getNumbersList(max: number, min = 1) {
    const a: RX.Types.PickerPropsItem[] = [];
    for (let i = min; i <= max; i++) {
        a.push({ label: i + '', value: i + '' });
    }
    return a;
}