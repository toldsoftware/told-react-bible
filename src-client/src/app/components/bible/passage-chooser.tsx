import * as RX from 'reactxp';

import { BibleStore } from "../../store/bible-store";
import { storeComp } from "../common/store-component-base";
import { styles } from "../../styles";

const localStyles = {
    chooser: RX.Styles.createViewStyle({
        padding: 8,
    }),
    selectorRow: RX.Styles.createViewStyle({
        flexDirection: 'row',
        // padding: 4,
    }),
    label: RX.Styles.createViewStyle({
        width: 80,
        marginRight: 8,
    }),
    picker: RX.Styles.createPickerStyle({
        flex: 1,
        margin: 4,
        padding: 4,
    }),
};

export const PassageChooser = (props: { bibleStore: BibleStore }) => storeComp(() => ({
    selectedVersion: props.bibleStore.getSelectedVersion(),
    versions: props.bibleStore.getVersions(),
    m: props.bibleStore.getPassageMetadata(),
    verseLabels: props.bibleStore.getVerseLabels().map(x => ({ label: x, value: x })),
}), (state) => {

    return (
        <RX.View style={localStyles.chooser}>
            <RX.View style={localStyles.selectorRow}>
                <Selector label='Version' value={state.selectedVersion} choices={state.versions} onChoice={props.bibleStore.selectVersion} shouldHideLabel={true} />
            </RX.View>
            <RX.View style={localStyles.selectorRow}>
                <Selector label='Book' value={state.m.bookKey} choices={state.m.books.map(x => ({ label: x.bookName, value: x.bookID }))} onChoice={props.bibleStore.selectBook} />
                <Selector label='Chapter' value={state.m.chapterNumber + ''} choices={getNumbersList(state.m.chapterCount)} onChoice={props.bibleStore.selectChapter} />
                <Selector label='Verse' value={state.m.verseLabel} choices={state.verseLabels} onChoice={props.bibleStore.selectVerse} />
            </RX.View>
        </RX.View>
    );
});

export const Selector = (props: { label: string, value: string, choices: RX.Types.PickerPropsItem[], onChoice: (value: string) => void, shouldHideLabel?: boolean }) => (
    <RX.Picker style={localStyles.picker} items={props.choices} selectedValue={props.value} onValueChange={props.onChoice} />
);

// export const Selector = (props: { label: string, value: string, choices: RX.Types.PickerPropsItem[], onChoice: (value: string) => void, shouldHideLabel?: boolean }) => (
//     <RX.View style={localStyles.selector}>
//         {!props.shouldHideLabel && <RX.Text style={localStyles.label}>{props.label}</RX.Text>}
//         <RX.Picker style={localStyles.picker} items={props.choices} selectedValue={props.value} onValueChange={props.onChoice} />
//     </RX.View>
// );

function getNumbersList(max: number, min = 1) {
    const a: RX.Types.PickerPropsItem[] = [];
    for (let i = min; i <= max; i++) {
        a.push({ label: i + '', value: i + '' });
    }
    return a;
}