import { storeComp } from '../common/store-component-base';
import * as RX from 'reactxp';
import { Store } from '../../store/store';
import { PageLayout } from "./page-layout";
import { PageSelector } from "../pages/page-selector";

export const Root = (props: { store: Store }) => storeComp(() => ({
    page: props.store.getPage()
}), (state) => (
    <PageSelector store={props.store} pageName={state.page} />
));
