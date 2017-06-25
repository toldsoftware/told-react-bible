import * as RX from 'reactxp';
import { Store } from './store/store';
import { handleRoute } from "./routes";
import { Root } from "./components/page/root";

const store = Store;

handleRoute();

export const App = () => (
    <Root store={store} />
);
