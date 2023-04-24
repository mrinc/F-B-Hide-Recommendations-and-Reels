export interface LangType {
  newsFeedPosts: string;
  reelsBlock: string;
  commentedOn: string;
  peopleKnow: string;
  suggested: string;
  answeredQuestion: string;
}

export const langs: Record<string, LangType> = {
  en: {
    // English
    newsFeedPosts: "News Feed posts",
    reelsBlock: "Reels and short videos",
    commentedOn: " commented on a post from ",
    peopleKnow: "People You May Know",
    suggested: ">Suggested for you<",
    answeredQuestion: " answered this question."
  },
  pl: {
    // Polish
    newsFeedPosts: "Posty na kanale aktualności",
    reelsBlock: "Rolki i krótkie filmy",
    commentedOn: " skomentował post z ",
    peopleKnow: "Ludzie których możesz znać",
    suggested: ">Proponowana dla Ciebie<",
    answeredQuestion: " odpowiedziało na to pytanie"
  },
  fr: {
    // French
    newsFeedPosts: "Messages du fil d'actualité",
    reelsBlock: "Reels et courtes vidéos",
    commentedOn: " a commenté un message de ",
    peopleKnow: "Les gens que vous connaissez peut-être",
    suggested: ">Suggéré pour vous<",
    answeredQuestion: " a répondu à cette question"
  },
  de: {
    // German
    newsFeedPosts: "News Feed Beiträge",
    reelsBlock: "Reels und Kurzvideos",
    commentedOn: " kommentierte den Beitrag von ",
    peopleKnow: "Personen die du vielleicht kennst",
    suggested: ">Vorschläge für dich<",
    answeredQuestion: " hat diese Frage beantwortet"
  },
  ja: {
    // Japanese
    newsFeedPosts: "News Feed posts",
    reelsBlock: "リールとショート動画",
    commentedOn: " commented on a post from ",
    peopleKnow: "People You May Know",
    suggested: ">Suggested for you<",
    answeredQuestion: "がこの質問に答えました"
  },
};
