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

export const langs: Record<string, LangType & LangText> = {
  en: {
    name: "English",
    newsFeedPosts: "News Feed posts",
    reelsBlock: "Reels and short videos",
    commentedOn: "commented on a post from",
    commentedOnFriend: "commented.",
    peopleKnow: "People You May Know",
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
    newsFeedPosts: "Messages du fil d'actualité",
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
    newsFeedPosts: "News Feed posts",
    reelsBlock: "リールとショート動画",
    commentedOn: "commented on a post from",
    peopleKnow: "People You May Know",
    suggested: "Suggested for you",
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
};
