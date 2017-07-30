import * as RX from 'reactxp';
import { storeComp } from '../common/store-component-base';
import { Store } from '../../store/store';
import { PageLayout } from "../page/page-layout";
import { styles } from "../../styles";
import { PassageViewer } from "../bible/passage";
import { BibleStore } from "../../store/bible-store";
import { PassageChooser } from "../bible/passage-chooser";
import { PassageOptions } from "../bible/passage-options";

export const InteractPage = (props: { store: Store }) => (
    <PageLayout store={props.store} postsStore={props.store.bibleStore} shouldHideTabBar={true}>
        <RX.View style={styles.page}>
            <InteractView store={props.store} />
        </RX.View>
    </PageLayout>
);

export const InteractView = (props: { store: Store }) => storeComp(() => ({
    passage: props.store.bibleStore.getPassage(),
    choiceKind: props.store.bibleStore.getChoiceKind(),
}), (state) => {
    // console.log('InteractView  RENDER', { state, passage: state.passage, active: state.passage.activeParts });
    return (
        <RX.View>
            <PassageChooser bibleStore={props.store.bibleStore} />
            <PassageOptions bibleStore={props.store.bibleStore} />
            <PassageViewer passage={state.passage} choiceKind={state.choiceKind} onPartDone={props.store.bibleStore.completePart} />
        </RX.View>
    );
});

// TODO: Debug not refreshing UI (but state is changing)