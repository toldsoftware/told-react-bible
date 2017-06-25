import * as RX from 'reactxp';
import { storeComp } from '../common/store-component-base';
import { Store } from '../../store/store';
import { styles } from "../../styles";
import { PostList } from "../posts/post-list";
import { FacebookLogin } from "../common/account/facebook-login";
import { PostsBaseList } from "../page/posts-base-list";
import { PageLayout } from "../page/page-layout";

export const ReadPage = (props: { store: Store }) => (
    <PageLayout store={props.store}>
        <RX.View style={styles.page}>
            <RX.Text>Read</RX.Text>
        </RX.View>
    </PageLayout>
);
