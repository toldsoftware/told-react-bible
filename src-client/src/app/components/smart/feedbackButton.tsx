import * as RX from 'reactxp';
import { colors, styles } from '../../styles';
import { FeedbackIcon } from "../common/icons/feedback";

const formLinkUrl = 'https://goo.gl/forms/UqDy0bnUMON0T2ny1';

const style = { ...styles.postIcon_action, fillColor: colors.actionIcons.e_yellow };

const feedbackOnPress = () => {
    RX.Linking.openUrl(formLinkUrl);
};

export const FeedbackButton = () => (
    <RX.Button onPress={feedbackOnPress}>
        <FeedbackIcon style={style} />
    </RX.Button>
);
