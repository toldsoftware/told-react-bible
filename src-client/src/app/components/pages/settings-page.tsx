import * as RX from 'reactxp';
import { Store } from '../../store/store';
import { styles } from "../../styles";
import { IconDemo } from "../common/icons/icon-demo";
import { FacebookLogin } from "../common/account/facebook-login";
import { storeComp } from "../common/store-component-base";
import { PageName } from "../pages/page-names";
import { PageLayout } from "../page/page-layout";

export const SettingsPage = (props: { store: Store }) => storeComp(() => ({
    loginError: props.store.account.getError(),
    isLoggedIn: props.store.account.getIsFacebookLoggedIn(),
    accountMessage: `accessToken = '${(props.store.account.getFacebookAccessToken() || '').substr(0, 10) + '...'}'`,
    platform: RX.Platform.getType(),
}), (state) => (
    <PageLayout store={props.store}>
        <RX.View style={styles.page}>
            {!!state.loginError && <RX.Text style={styles.warning_text}>{state.loginError}</RX.Text>}

            <RX.View style={styles.heading}>
                <RX.Text style={styles.heading_text}>
                    Settings
                </RX.Text>
            </RX.View>

            <RX.View style={styles.postPanel}>
                <RX.View style={[styles.fullRow, styles.center_content]}>
                    <RX.View style={styles.flex1}>
                        <RX.Text>Facebook: </RX.Text>
                    </RX.View>
                    <FacebookLogin onLoginFinished={props.store.account.onLoginFinished} onError={props.store.account.setLoginError} />
                </RX.View>
            </RX.View>

            <RX.View style={styles.heading}>
                <RX.Text style={styles.heading_text}>
                    Other Pages
                </RX.Text>
            </RX.View>

            <RX.View style={styles.heading}>
                <RX.Text style={styles.heading_text}>
                    Debug
                </RX.Text>
            </RX.View>
            <RX.View style={styles.postPanel}>
                <RX.View style={styles.center_content}>
                    <RX.Text>{state.accountMessage}</RX.Text>
                    <RX.Text>Platform: '{state.platform}'</RX.Text>
                </RX.View>
            </RX.View>
        </RX.View>
    </PageLayout>
));

const PageLink = (props: { store: Store, title: string, pageName: PageName }) => (
    <RX.View style={styles.postPanel}>
        <RX.View style={[styles.fullRow, styles.center_content]}>
            <RX.View style={styles.flex1}>
                <RX.Text>{props.title}</RX.Text>
            </RX.View>
            <RX.Button style={styles.action_button} onPress={() => props.store.gotoPage(props.pageName)}>
                <RX.Text style={styles.action_button_text}>Open {props.title}</RX.Text>
            </RX.Button>
        </RX.View>
    </RX.View>
);
