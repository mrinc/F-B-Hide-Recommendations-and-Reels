export interface LangText {
  _ad?: string;
  _reelsBlock?: string;
  _commentedOn?: string;
  _commentedOnFriend?: string;
  _peopleKnow?: string;
  _friendRequests?: string;
  _suggested?: string;
  _tagged?: string;
  _containsReels?: string;
  _answeredQuestion?: string;
}
export interface LangType {
  name: string;
  newsFeedPosts?: string;
  reelsBlock?: string;
  commentedOn?: string;
  commentedOnFriend?: string;
  friendRequests?: string;
  tagged?: string;
  peopleKnow?: string;
  suggested?: string;
  containsReels?: string;
  answeredQuestion?: string;
  createAPost?: string;
}
export interface SystemConfigSystemFormFormField {
  type: "checkbox" | "button";
  id: string;
  title: string;
  desc: string;
  colour?: string;
  addedInVersion?: string;
}
export interface SystemConfigSystemFormForm {
  title: string;
  fields?: SystemConfigSystemFormFormField[];
}
export interface SystemConfigSystemForm {
  title: string;
  desc: string;
  forms: SystemConfigSystemFormForm[];
}
export interface SystemConfigSystemBannerNotif {
  text: string;
  colour: string;
}
export interface SystemConfigSystemBanner {
  link?: string;
  linkMsg: string;
  showLangs: boolean;
  btn: string;
  colour: string;
  title: string;
  desc: string;
  desc2?: string;
  notif?: SystemConfigSystemBannerNotif;
}
export interface SystemConfigSystemHeader {
  msg: string;
  link: string;
  linkMsg: string;
}
export interface SystemConfigSystemCss {}
export interface SystemConfigSystemPopup {
  css?: SystemConfigSystemCss;
  header?: SystemConfigSystemHeader;
  banner?: SystemConfigSystemBanner;
  bannerError?: SystemConfigSystemBanner;
  bannerHello?: SystemConfigSystemBanner;
  bannerHelloUpgrade?: SystemConfigSystemBanner;
  formFieldHello?: SystemConfigSystemFormForm;
  form?: SystemConfigSystemForm;
}
export interface SystemConfigSystem extends SystemConfigSystemPopup {}
export interface SystemConfig {
  _system?: SystemConfigSystem;
}

export const langs: Record<string, LangType & LangText & SystemConfig> = {
  en: {
    name: "English",
    newsFeedPosts: "News Feed posts",
    reelsBlock: "Reels and short videos",
    commentedOn: "commented on a post from",
    commentedOnFriend: "commented.",
    peopleKnow: "People you may know",
    friendRequests: "Friend Requests",
    suggested: "Suggested for you",
    tagged: "was tagged.",
    answeredQuestion: "answered this question.",
    containsReels: "Reels",
    createAPost: "Create a post",

    _ad: "AD",
    _reelsBlock: "Reels",
    _tagged: "A friend was tagged in a post",
    _friendRequests: "Friend Requests",
    _containsReels: "Shared reels",
    _commentedOn: "A friend commented on a page that you do not follow",
    _commentedOnFriend: "A friend commented on a post",
    _peopleKnow: "Friend recommendations",
    _suggested: "Suggestions",
    _answeredQuestion: "A friend answered a question",

    _system: {
      css: {},
      header: {
        msg: "Something not working?",
        link: "https://github.com/mrinc/Facebook-Hide-Recommendations-and-Reels/issues/new",
        linkMsg: "Log an issue",
      },
      banner: {
        link: "https://github.com/mrinc/Facebook-Hide-Recommendations-and-Reels",
        linkMsg: "Learn more",
        showLangs: true,
        btn: "Configure",
        colour: "indigo",
        title: "FB Hide Recommendations and Reels",
        desc: "This extension cleans your feed of irrelevant content.",
      },
      bannerHello: {
        link: "https://github.com/mrinc/Facebook-Hide-Recommendations-and-Reels",
        linkMsg: "Learn more",
        showLangs: true,
        btn: "Start",
        colour: "green",
        title: "Welcome to FB Hide Recommendations and Reels",
        desc: "Let's get you started. Click the button below to configure the extension.",
      },
      bannerHelloUpgrade: {
        link: "https://github.com/mrinc/Facebook-Hide-Recommendations-and-Reels",
        linkMsg: "Learn more",
        showLangs: true,
        btn: "Start",
        colour: "green",
        title: "Welcome to FB Hide Recommendations and Reels",
        desc: "Let's get you started. Click the button below to configure the extension.",
        notif: {
          text: "You've got a new version",
          colour: "green",
        },
      },
      formFieldHello: {
        title: "Configuration",
        fields: [
          {
            type: "button",
            id: "closeConfig",
            colour: "green",
            title: "Save Configuration",
            desc: "Lets get you back to work.",
          },
        ],
      },
      bannerError: {
        linkMsg: "Ignore/Continue",
        showLangs: false,
        btn: "Send support diagnostic",
        colour: "green",
        title: "We are sorry, but something went wrong.",
        desc: "We were unable to find the feed elements on this page.<br />This plugin cannot function without knowing where the feed is.<br />Please click the button below to send a support diagnostic.",
        desc2:
          "When you send a support diagnostic, we'll capture a snapshot of the HTML on the page to help us identify and resolve any issues. We'll discard the diagnostic once the issue is fixed or after 30 days, whichever comes first. We won't use or share any information in the diagnostic for any other purposes.<br />After you send the diagnostic, we'll create an issue that you can follow if you're interested (Github). Once we resolve the issue and release a new version of the plugin, your browser will automatically update and the plugin will start working.<br />You don't need to uninstall the plugin after sending a diagnostic. It will remain inactive until the new version is released and it attempts to find the feed again.",
      },
      form: {
        title: "Configure FB Hide Recommendations and Reels",
        desc: "Configure how you want this plugin to work",
        forms: [
          {
            title: "Hide blocks",
            fields: [
              {
                type: "checkbox",
                id: "reels",
                title: "Reels and short videos",
                desc: "Reels and short video blocks.",
                addedInVersion: "1.0.0",
              },
              {
                type: "checkbox",
                id: "containsReels",
                title: "Shared Reels",
                desc: "A shared reel from friends.",
                addedInVersion: "1.0.0",
              },
              {
                type: "checkbox",
                id: "suggestions",
                title: "Suggested for you / Suggestions",
                desc: "Recommendations/suggestions of pages.",
                addedInVersion: "1.0.0",
              },
              {
                type: "checkbox",
                id: "commentedOn",
                title: "Friend commented on X from unknown",
                desc: "Friends comment on other pages/posts that you do not like.",
                addedInVersion: "1.0.0",
              },
              {
                type: "checkbox",
                id: "commentedOnFriend",
                title: "Friend commented on X",
                desc: "Friends comment on other pages/posts.",
                addedInVersion: "1.0.0",
              },
              {
                type: "checkbox",
                id: "tagged",
                title: "Friend was tagged",
                desc: "A friend was tagged on a post/album.",
                addedInVersion: "1.0.0",
              },
              {
                type: "checkbox",
                id: "answeredQuestion",
                title: "Friend answered a question",
                desc: "A friend answered a question block/post.",
                addedInVersion: "1.0.0",
              },
              {
                type: "checkbox",
                id: "peopleMayKnow",
                title: "Friend recommendations",
                desc: "Friends 'recommendations' or people you may know.",
                addedInVersion: "1.0.0",
              },
            ],
          },
          {
            title: "Hide Globals",
            fields: [
              {
                type: "checkbox",
                id: "friendRequests",
                title: "Friend requests",
                desc: "Friend requests.",
                addedInVersion: "1.0.0",
              },
              {
                type: "checkbox",
                id: "stories",
                title: "Stories",
                desc: "Facebook stories block.",
                addedInVersion: "1.0.0",
              },
              {
                type: "checkbox",
                id: "createPost",
                title: "Create post",
                desc: "Create new post block.",
                addedInVersion: "1.0.0",
              },
            ],
          },
          {
            title: "Plugin settings",
            fields: [
              {
                type: "checkbox",
                id: "hideBlocks",
                title: "Hide all blocks",
                desc: "Instead of showing a block with what was hidden, just hide it.",
                addedInVersion: "1.25.9",
              },
              {
                type: "checkbox",
                id: "needsDelay",
                title: "5s load delay",
                desc: "5s delay after page load before activating extension.",
                addedInVersion: "1.0.0",
              },
              {
                type: "checkbox",
                id: "clickToShow",
                title: "Click to show/hide",
                desc: "You can click to show/hide specific elements.",
                addedInVersion: "1.0.0",
              },
            ],
          },
          {
            title: "Configuration",
            fields: [
              {
                type: "button",
                id: "resetConfig",
                colour: "red",
                title: "Reset Configuration",
                desc: "Default all the config settings.",
              },
            ],
          },
        ],
      },
    },
  },
  pl: {
    name: "Polish",
    newsFeedPosts: "Posty na kanale aktualności",
    reelsBlock: "Rolki i krótkie filmy",
    commentedOn: "skomentował post z",
    peopleKnow: "Ludzie których możesz znać",
    suggested: "Proponowana dla Ciebie",
    answeredQuestion: "odpowiedziało na to pytanie",
    createAPost: "Utwórz wpis",
  },
  fr: {
    name: "French",
    newsFeedPosts: "Nouvelles publications du fil d’actualité",
    reelsBlock: "Reels et courtes vidéos",
    commentedOn: "a commenté un message de",
    peopleKnow: "Les gens que vous connaissez peut-être",
    suggested: "Suggéré pour vous",
    answeredQuestion: "a répondu à cette question",
    createAPost: "Créer une publication",
  },
  de: {
    name: "German",
    newsFeedPosts: "News Feed Beiträge",
    reelsBlock: "Reels und Kurzvideos",
    commentedOn: "kommentierte den Beitrag von",
    peopleKnow: "Personen die du vielleicht kennst",
    suggested: "Vorschläge für dich",
    answeredQuestion: "hat diese Frage beantwortet",
    createAPost: "Erstellen Sie einen Beitrag",
  },
  ja: {
    name: "Japanese",
    newsFeedPosts: "ニュースフィードの投稿",
    reelsBlock: "リールとショート動画",
    commentedOn: "commented on a post from",
    peopleKnow: "People You May Know",
    suggested: "おすすめ",
    answeredQuestion: "がこの質問に答えました",
    createAPost: "投稿を作成する",
  },
  nl: {
    name: "Dutch",
    newsFeedPosts: "Berichten in het nieuwsoverzicht",
    reelsBlock: "Reels and korte video's",
    commentedOn: "reageerde op een bericht van",
    peopleKnow: "Mensen die je misschien kent",
    suggested: "Aanbevolen voor jou",
    answeredQuestion: "beantwoordde deze vraag.",
    createAPost: "Maak een bericht aan",
  },
  th: {
    name: "Thai",
    newsFeedPosts: "โพสต์บนฟีดข่าว",
    reelsBlock: "Reels และวิดีโอสั้น",
    commentedOn: "ได้แสดงความคิดเห็น",
    commentedOnFriend: "แสดงความคิดเห็น.",
    peopleKnow: "บุคคลที่คุณอาจจะรู้จัก",
    friendRequests: "คำขอเป็นเพื่อน",
    suggested: "แนะนำสำหรับคุณ",
    tagged: "ถูกแท็ก",
    answeredQuestion: "ตอบคำถามนี้",
    createAPost: "สร้างโพสต์",
  },
  "zh-Hans": {
    name: "Chinese (Simplified)",
    newsFeedPosts: "动态消息帖子",
    reelsBlock: "Reels 和短视频",
    peopleKnow: "你可能認識的朋友",
    suggested: "为你推荐",
    tagged: "被标记了。",
    containsReels: "Reels",
    createAPost: "建立貼文",
  },
  "zh-TW": {
    name: "Chinese (Traditional, Taiwan)",
    newsFeedPosts: "動態消息貼文",
    reelsBlock: "連續短片和短片",
    commentedOnFriend: "已留言回應。",
    suggested: "為你推薦",
    tagged: "被標註在這則內容中。",
    containsReels: "Reels",
    createAPost: "建立貼文",
  },
  sv: {
    name: "Swedish",
    newsFeedPosts: "Inlägg i nyhetsflödet",
    commentedOnFriend: "har kommenterat.",
    reelsBlock: "Reels och korta videor",
    suggested: "Förslag för dig",
  },
};
