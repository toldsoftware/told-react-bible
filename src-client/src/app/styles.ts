import * as RX from 'reactxp';

import { createIconStyle } from './components/common/icons/icon-base';

// http://paletton.com/palette.php?uid=73H0w0krgXhf-YmlJXR-0VBRLKY
const pallette = {
    primary_0: '#387EF5',
    primary_1: '#8BB3F8',
    primary_2: '#5F97F7',
    primary_3: '#1466F1',
    primary_4: '#0652D4',
    secondary_1_0: '#643DF6',
    secondary_1_1: '#A48EF8',
    secondary_1_2: '#8263F7',
    secondary_1_3: '#4719F2',
    secondary_1_4: '#3307D7',
    secondary_2_0: '#FFD726',
    secondary_2_1: '#FFE883',
    secondary_2_2: '#FFDF52',
    secondary_2_3: '#FFD100',
    secondary_2_4: '#FFD100',
    complement_0: '#FFB126',
    complement_1: '#FFD383',
    complement_2: '#FFC152',
    complement_3: '#FFA400',
    complement_4: '#FFA400',
};



// const iconColors_sections = {
//     a_purple: '#BC403D',
//     b_red: '#852B77',
//     c_orange: '#BC743D',
//     d_orange_yellow: '#BC933D',

//     e_yellow: '#BCB93D',
//     f_yellow_green: '#88B039',
//     g_green: '#419C33',
//     h_teal: '#266F72',
// };

const iconColors_sections = {
    a_purple: '#880088',
    b_red: '#880000',
    c_orange: '#AA4400',
    d_orange_yellow: '#AA6600',

    e_yellow: '#AA8800',
    f_yellow_green: '#668822',
    g_green: '#008800',
    h_teal: '#4466AA',
};

const iconColors_actions = {
    a_purple: '#CC00CC',
    b_red: '#CC0000',
    c_orange: '#FF6600',
    d_orange_yellow: '#FF9900',

    e_yellow: '#FFCC00',
    f_yellow_green: '#99CC33',
    g_green: '#00CC00',
    h_teal: '#6699FF',
};

const pageColors = {
    back_heading_default: '#FFFFFF',
    text_heading_default: pallette.secondary_1_0,
    back_heading1: pallette.primary_4,
    text_heading1: '#FFFFFF',
    back_heading2: '#FFFFFF',
    text_heading2: pallette.primary_0,

    text_listItem: pallette.primary_0,
};

export const colors = {
    ...pageColors,
    actionIcons: iconColors_actions,
    sectionIcons: iconColors_sections,
    // BUG: Hex colors don't work
    loader: pallette.primary_0,
    mini_loader_native: '#FFFFFF',
    mini_loader_web: pallette.primary_0,
    mini_loader_background: pallette.primary_1,

    icon_disabled: '#CCCCCC',

    text_main: pallette.primary_0,
    icon_main: pallette.complement_0,
    back_main: '#FFFFFF',

    text_modal: pallette.primary_2,
    back_modal: '#EEEEEE',

    text_title: pallette.primary_0,

    text_title_edit: pallette.primary_3,
    back_title_edit: pallette.secondary_2_1,

    text_button: '#FFFFFF',
    back_button_action: pallette.primary_2,
    back_button_warning: pallette.secondary_1_2,
    back_button_filter: pallette.secondary_2_2,
    back_button_nav: pallette.primary_3,

    text_warning: '#FFFFFF',
    back_warning: pallette.secondary_1_2,

    // border_headerBar: pallette.primary_1,
    // back_headerBar: '#EEEEEE',
    // text_search: pallette.primary_2,
    // back_search: '#FFFFFF',
    border_headerBar: pallette.primary_1,
    back_headerBar: pallette.primary_0,
    text_search: pallette.primary_1,
    text_search_placeholder: pallette.primary_2,
    back_search: pallette.primary_4,

    border_tabBar: pallette.primary_1,
    back_tabBar: '#EEEEEE',
    text_tab: '#888888',
    text_tab_active: pallette.primary_4,

    back_page: '#EEEEEE',
    back_panel: '#FFFFFF',
    back_sponsored: '#F8F8F8',

    icon_post: pallette.primary_0,
    icon_post_action: pallette.secondary_2_0,
    text_post_title: pallette.primary_0,
    text_post_subTitle: pallette.primary_1,
    // icon_post: pallette.secondary_1_0,
    // text_post_title: pallette.secondary_1_0,
    // text_post_subTitle: pallette.secondary_1_1,
    // icon_post: pallette.secondary_2_0,
    // text_post_title: pallette.secondary_2_0,
    // text_post_subTitle: pallette.secondary_2_1,
    text_post_content: '#000000',
    text_post_content_caption: '#555555',
    text_post_content_details: '#777777',
    text_post_info: '#888888',
    back_post_image: '#000000',

    border_post_content_section: pallette.secondary_2_1,
};

export const pageSizes = {
    padding_heading_default: 24,
    font_heading_default: 20,
    padding_heading1: 64,
    font_heading1: 36,
    padding_heading2: 36,
    font_heading2: 28,

    marginTop_paragraph: 8,
    marginBottom_paragraph: 8,

    margin_loneLink: 16,
    paddingTop_loneLink: 8,
    paddingBottom_loneLink: 8,
    paddingLeft_loneLink: 24,
    paddingRight_loneLink: 24,

    paddingTop_listItem: 4,
    paddingBottom_listItem: 4,
    paddingLeft_listItem: 8,
    paddingRight_listItem: 8,
    icon_listItem: 12,
};

export const sizes = {
    // Page Sizes
    ...pageSizes,

    // Sizes
    border_tabBar: 1,
    padding_button_tab: 4,
    icon_button_tab: 24,
    font_button_tab: 12,
    footer_height: 2 * (1 + 4) + 24 + (12 + 2),

    width_miniLoader: 24,
    height_appIconImage: 24,
    width_appIconImage: 24,
    marginLeft_appIconImage: 4,
    marginRight_appIconImage: 4,

    height_appImage: 128,
    width_appImage: 128,

    margin_search: 4,
    padding_search: 4,
    paddingLeft_search: 8,
    font_search: 16,
    icon_search: 16,
    radius_search: 8,

    padding_page: 8,
    marginBottom_panel: 8,
    padding_panel: 8,

    paddingLeft_heading: 16,
    font_heading: 24,

    padding_action_button: 8,
    icon_list: 24,

    icon_post: 36,
    paddingRight_postIcon: 8,
    padding_icon_post_action: 2,
    icon_post_section: 28,
    icon_post_content: 14,
    font_post_title: 18,
    font_post_subTitle: 14,
    font_post_content: 14,
    font_post_content_caption: 13,
    font_post_content_details: 12,
    font_post_info: 10,

    font_post_comment: 12,

    marginLeft_post_section: 8,
    marginBottom_post_section: 8,
    marginTop_post_section: 8,

    image_post_height: 200,

    font_button: 18,
    icon_button: 24,

    font_stats: 24,
    icon_stats: 28,
};

// Default Provider
export const pageStyles = {
    headings: [
        // Default (No Heading, Heading 3,4,5, etc.)
        {
            section: RX.Styles.createViewStyle({
                padding: sizes.padding_heading_default,
                backgroundColor: pageColors.back_heading_default,
            }),
            view: RX.Styles.createViewStyle({
            }),
            text: RX.Styles.createTextStyle({
                fontSize: sizes.font_heading_default,
                color: pageColors.text_heading_default,
                textAlign: 'left',
                fontWeight: 'bold',
            })
        },
        // Heading 1
        {
            section: RX.Styles.createViewStyle({
                padding: sizes.padding_heading1,
                backgroundColor: pageColors.back_heading1,
                alignItems: 'center',
            }),
            view: RX.Styles.createViewStyle({
                maxWidth: 600,
            }),
            text: RX.Styles.createTextStyle({
                fontSize: sizes.font_heading1,
                color: pageColors.text_heading1,
                textAlign: 'center',
                fontWeight: 'bold',
            })
        },
        // Heading 2
        {
            section: RX.Styles.createViewStyle({
                padding: sizes.padding_heading2,
                backgroundColor: pageColors.back_heading2,
                alignItems: 'center',
            }),
            view: RX.Styles.createViewStyle({
                maxWidth: 600,
            }),
            text: RX.Styles.createTextStyle({
                fontSize: sizes.font_heading2,
                color: pageColors.text_heading2,
                textAlign: 'center',
                fontWeight: 'bold',
            })
        },
    ],

    paragraph: RX.Styles.createViewStyle({
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: pageSizes.marginTop_paragraph,
        marginBottom: pageSizes.marginBottom_paragraph,
    }),
    text: RX.Styles.createTextStyle({
        flex: -1,
        color: colors.text_main,
    }),
    inlineLink: RX.Styles.createButtonStyle({
        backgroundColor: colors.back_button_action,
        paddingLeft: sizes.padding_action_button,
        paddingRight: sizes.padding_action_button,
    }),
    inlineLink_text: RX.Styles.createTextStyle({
        flex: -1,
        color: colors.text_button,
        textDecorationLine: 'none',
    }),

    loneLink_view: RX.Styles.createViewStyle({
        flexDirection: 'row',
        flexWrap: 'wrap',
    }),
    loneLink_link: RX.Styles.createButtonStyle({
        flex: 1,

        margin: pageSizes.margin_loneLink,
        paddingTop: pageSizes.paddingTop_loneLink,
        paddingBottom: pageSizes.paddingBottom_loneLink,
        paddingLeft: pageSizes.paddingLeft_loneLink,
        paddingRight: pageSizes.paddingRight_loneLink,

        backgroundColor: colors.back_button_action,
    }),
    loneLink_text: RX.Styles.createTextStyle({
        flex: -1,
        color: colors.text_button,
        textDecorationLine: 'none',
        textAlign: 'center',
        fontSize: sizes.font_button,
    }),

    list: RX.Styles.createViewStyle({
        flexDirection: 'column',
    }),
    listItem_view: RX.Styles.createViewStyle({
        flexDirection: 'row',
        alignItems: 'center',
    }),
    listItem: RX.Styles.createTextStyle({
        flex: -1,
        color: pageColors.text_listItem,
        paddingTop: pageSizes.paddingTop_listItem,
        paddingBottom: pageSizes.paddingBottom_listItem,
        paddingLeft: pageSizes.paddingLeft_listItem,
        paddingRight: pageSizes.paddingRight_listItem,
    }),
    listItem_icon: createIconStyle({
        fillColor: pageColors.text_listItem,
        fontSize: pageSizes.icon_listItem,
        padding: 0,
    }),
};

export const styles = {
    ...pageStyles,

    row: RX.Styles.createViewStyle({
        flexDirection: 'row',
    }),
    fullRow: RX.Styles.createViewStyle({
        flexDirection: 'row',
        flex: 1,
    }),
    fullColumn: RX.Styles.createViewStyle({
        flexDirection: 'column',
        flex: 1,
    }),
    flex1: RX.Styles.createViewStyle({
        flex: 1,
    }),

    flexWrap: RX.Styles.createViewStyle({
        flexWrap: 'wrap',
    }),

    // flexRow_wrap: RX.Styles.createViewStyle({
    //     flex: 1,
    //     flexDirection: 'row',
    //     flexWrap: 'wrap',
    //     // alignItems: 'stretch',
    // }),
    // flexWrap: RX.Styles.createViewStyle({
    //     flexWrap: 'wrap',
    // }),

    space_around_content: RX.Styles.createViewStyle({
        alignItems: 'center',
        justifyContent: 'space-around',
    }),

    center_content: RX.Styles.createViewStyle({
        alignItems: 'center',
        justifyContent: 'center',
    }),
    center_text: RX.Styles.createTextStyle({
        textAlign: 'center',
    }),

    right_content: RX.Styles.createTextStyle({
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    }),

    loader: RX.Styles.createViewStyle({
        flex: 1,
        backgroundColor: colors.back_modal,
        alignItems: 'center',
        justifyContent: 'center',
    }),

    mini_loader: RX.Styles.createViewStyle({
        minWidth: sizes.width_miniLoader,
        minHeight: sizes.width_miniLoader,
        // flex: 1,
        // backgroundColor: colors.back_modal,
        alignItems: 'center',
        justifyContent: 'center',
    }),

    mini_loader_container_web: RX.Styles.createViewStyle({
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.mini_loader_background,
        borderRadius: sizes.width_miniLoader,
    }),

    appImage_view: RX.Styles.createViewStyle({
        width: sizes.width_appImage,
        height: sizes.height_appImage,
    }),
    appImage: RX.Styles.createImageStyle({
        width: sizes.width_appImage,
        height: sizes.height_appImage,
    }),

    // Header
    headerBar: RX.Styles.createViewStyle({
        flexDirection: 'row',
        flex: 1,
        backgroundColor: colors.back_headerBar,
        borderColor: colors.border_headerBar,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        alignItems: 'center',
    }),
    headerBar_appIconImage_view: RX.Styles.createViewStyle({
        width: sizes.width_appIconImage,
        height: sizes.height_appIconImage,
        marginLeft: sizes.marginLeft_appIconImage,
        marginRight: sizes.marginRight_appIconImage,
    }),
    headerBar_appIconImage: RX.Styles.createImageStyle({
        width: sizes.width_appIconImage,
        height: sizes.height_appIconImage,
    }),
    headerButtons: RX.Styles.createViewStyle({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // margin: sizes.margin_search,
        // padding: sizes.padding_search,
    }),
    searchBox_view: RX.Styles.createViewStyle({
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        margin: sizes.margin_search,
        padding: sizes.padding_search,
        backgroundColor: colors.back_search,
        borderRadius: sizes.radius_search,
    }),
    searchBox_text_placeholder_color: colors.text_search_placeholder,
    searchBox_text: RX.Styles.createTextStyle({
        fontSize: sizes.font_search,
        color: colors.text_search,
        backgroundColor: 'transparent',
        margin: 0,
        paddingLeft: sizes.paddingLeft_search,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        flex: 1,
    }),
    searchIcon: createIconStyle({
        fontSize: sizes.icon_search,
        padding: 0,
        fillColor: colors.text_search,
    }),

    // Footer
    tabBar: RX.Styles.createViewStyle({
        flexDirection: 'row',
        flex: 1,
        backgroundColor: colors.back_tabBar,
        borderColor: colors.border_tabBar,
        borderWidth: sizes.border_tabBar,
        borderStyle: 'solid',
    }),
    tab_button: RX.Styles.createButtonStyle({
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: sizes.padding_button_tab,
    }),
    tab_button_active: RX.Styles.createButtonStyle({
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: sizes.padding_button_tab,
    }),
    tab_text: RX.Styles.createTextStyle({
        textAlign: 'center',
        fontSize: sizes.font_button_tab,
        color: colors.text_tab,
    }),
    tab_text_active: RX.Styles.createTextStyle({
        textAlign: 'center',
        fontSize: sizes.font_button_tab,
        color: colors.text_tab_active,
    }),
    tabIcon: createIconStyle({
        fontSize: sizes.icon_button_tab,
        padding: 0,
        fillColor: colors.text_tab,
    }),
    tabIcon_active: createIconStyle({
        fontSize: sizes.icon_button_tab,
        padding: 0,
        fillColor: colors.text_tab_active,
    }),

    // Page
    pageBackground: RX.Styles.createViewStyle({
        backgroundColor: colors.back_page,
    }),
    page: RX.Styles.createViewStyle({
        // padding: sizes.padding_page,
        backgroundColor: colors.back_page,
    }),

    // Headings
    heading: RX.Styles.createViewStyle({
        // alignItems: 'center',
        // justifyContent: 'center',
        paddingLeft: sizes.paddingLeft_heading
    }),
    heading_text: RX.Styles.createTextStyle({
        fontSize: sizes.font_heading,
    }),

    // Actions
    action_button: RX.Styles.createButtonStyle({
        // // flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    }),
    action_button_text: RX.Styles.createTextStyle({
        padding: sizes.padding_action_button,
        backgroundColor: colors.back_button_action,
        color: colors.text_button,
        fontSize: sizes.font_button,
    }),

    facebook_button: RX.Styles.createButtonStyle({
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.back_button_action,
        // backgroundColor: '#3b5998',
        padding: sizes.padding_action_button,
        // borderRadius: 4,
    }),
    facebook_button_text: RX.Styles.createTextStyle({
        color: '#FFFFFF',
        fontSize: sizes.font_button,
        marginLeft: 8,
    }),
    facebook_icon: createIconStyle({
        fontSize: sizes.icon_button,
        padding: 0,
        fillColor: '#FFFFFF',
    }),

    warning_text: RX.Styles.createTextStyle({
        padding: sizes.padding_action_button,
        backgroundColor: colors.back_warning,
        color: colors.text_warning,
    }),

    // List
    listIcon: createIconStyle({
        fontSize: sizes.icon_list,
        padding: 0,
        fillColor: colors.icon_main,
    }),

    // Post - Wrapping

    // postList: RX.Styles.createViewStyle({
    //     flexDirection: 'row',
    //     flexWrap: 'wrap',
    // }),
    // postItem: RX.Styles.createViewStyle({
    //     flex: 1,
    // }),

    // postPanel: RX.Styles.createViewStyle({
    //     flex: 1,
    //     marginRight: sizes.marginBottom_panel,
    //     marginBottom: sizes.marginBottom_panel,
    //     padding: sizes.padding_panel,
    //     backgroundColor: colors.back_panel,
    // }),

    // Post- Normal
    postList: RX.Styles.createViewStyle({
    }),
    postItem: RX.Styles.createViewStyle({
    }),

    postPanel: RX.Styles.createViewStyle({
        flex: 1,
        marginBottom: sizes.marginBottom_panel,
        padding: sizes.padding_panel,
        backgroundColor: colors.back_panel,
    }),

    sponsored: RX.Styles.createViewStyle({
        backgroundColor: colors.back_sponsored,
    }),

    postContent_wrapper: RX.Styles.createViewStyle({
        flex: 1,
        flexDirection: 'column',

        borderColor: colors.border_post_content_section,
        borderStyle: 'solid',
        borderLeftWidth: 1,
        borderTopWidth: 1,
        marginTop: 4,
        marginLeft: 4,
        paddingTop: 4,
        paddingLeft: 4,
        minWidth: 150,
    }),

    postIcon_padding: RX.Styles.createViewStyle({
        paddingRight: sizes.paddingRight_postIcon,
    }),

    postIcon: createIconStyle({
        fontSize: sizes.icon_post,
        padding: 0,
        fillColor: colors.icon_post,
    }),
    postIcon_action: createIconStyle({
        fontSize: sizes.icon_post_section,
        padding: 0,
        fillColor: colors.icon_post_action,
    }),
    postIcon_action_disabled: createIconStyle({
        // TODO: Update
        fontSize: sizes.icon_post_section,
        padding: 0,
        fillColor: colors.icon_disabled,
    }),

    postTitle_text: RX.Styles.createTextStyle({
        fontSize: sizes.font_post_title,
        color: colors.text_post_title,
    }),
    postSubTitle_text: RX.Styles.createTextStyle({
        fontSize: sizes.font_post_subTitle,
        color: colors.text_post_subTitle,
    }),
    postContent_section: RX.Styles.createViewStyle({
        flex: 1,
        marginTop: sizes.marginTop_post_section,
        marginBottom: sizes.marginBottom_post_section,
        marginLeft: sizes.marginLeft_post_section,
    }),
    postContent_section_text: RX.Styles.createTextStyle({
        fontSize: sizes.font_post_content,
        color: colors.text_post_content
    }),
    postContent_section_caption_text: RX.Styles.createTextStyle({
        fontSize: sizes.font_post_content_caption,
        color: colors.text_post_content_caption
    }),
    postContent_section_details_text: RX.Styles.createTextStyle({
        fontSize: sizes.font_post_content_details,
        color: colors.text_post_content_details
    }),
    postContent_action: RX.Styles.createViewStyle({
        padding: sizes.padding_icon_post_action
    }),
    postInfo_text: RX.Styles.createTextStyle({
        fontSize: sizes.font_post_info,
        color: colors.text_post_info,
    }),

    postContent_comment_name_text: RX.Styles.createTextStyle({
        fontSize: sizes.font_post_comment,
        color: colors.text_post_title,
    }),
    postContent_comment_message_text: RX.Styles.createTextStyle({
        fontSize: sizes.font_post_comment,
        color: colors.text_post_content,
    }),
    postContent_comment_info_text: RX.Styles.createTextStyle({
        fontSize: sizes.font_post_info,
        color: colors.text_post_info,
    }),

    postStats_view: RX.Styles.createViewStyle({
        flex: 1,
        borderStyle: 'solid',
        borderColor: colors.border_post_content_section,
        borderTopWidth: 1,
        marginTop: sizes.marginBottom_post_section,
        paddingTop: sizes.marginBottom_post_section,
    }),

    postStats_icon: createIconStyle({
        fontSize: sizes.icon_stats,
        padding: 0,
        fillColor: colors.icon_disabled,
    }),
    postStats_text: RX.Styles.createTextStyle({
        fontSize: sizes.font_stats,
        padding: 0,
    }),

    // TEMP
    postImage_maxWidth: 375,
    postImage: RX.Styles.createImageStyle({
        flex: 1,
        // minHeight: sizes.image_post_height,
        // backgroundColor: colors.back_post_image,
        // maxHeight: 202,
        // maxWidth: 360,
    }),

    postProfilePicture: RX.Styles.createImageStyle({
        width: 32,
        height: 32,
    }),
};