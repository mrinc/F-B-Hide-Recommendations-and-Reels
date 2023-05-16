import type { Browser } from "webextension-polyfill";
import { langs, LangText, LangType } from "../lib/langs";
import { Popup } from "../lib/popup";
declare let chrome: Browser;
declare let browser: Browser;
interface MWindow extends Window {
  pausecc?: boolean;
}
declare let window: MWindow;

const LANGS = () => JSON.parse(JSON.stringify(langs));

let forceReloadRequested = false;
let asLang =
  window.localStorage.getItem("fbhrar_locale") ??
  document.documentElement.lang ??
  "en";
let parsedLang: (LangType & LangText) | undefined = LANGS()[asLang];
const setLANG = (lang: string) => {
  asLang = lang;
  parsedLang = LANGS()[lang];

  if (parsedLang !== undefined && lang !== "en") {
    for (let key of Object.keys(LANGS().en)) {
      if ((parsedLang as any)[key] === undefined) {
        (parsedLang as any)[key] = (LANGS()["en"] as any)[key];
      }
    }
  }
};

const DEBUG_MODE =
  window.location.hostname ===
    "chrome-facebook-hide-ads-and-reels.mrincops.net" &&
  window.location.pathname.indexOf("/diag/") === 0;

if (DEBUG_MODE) console.warn("DEBUG MODE ENABLED");

const corb = chrome || browser;

const redactAddElem = (key: string, elemA: Element, config: any) => {
  let elem = elemA as HTMLElement;

  if (elem.innerHTML == "") {
    elem.style.display = "none";
  }

  // generate a random UUID
  let uid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

  elem.classList.add("redact-elem");
  if (config.hideBlocks === true) {
    elem.classList.add("complete-redact");
  }
  elem.classList.add("redact-elemid-" + uid);
  let setText: string | null = null;
  if ((parsedLang as any)["_" + key] !== undefined)
    setText = (parsedLang as any)["_" + key];
  if (setText !== null) {
    try {
      let elem = document.querySelector(
        ".redact-elemid-" + uid + " h4 span a span"
      )!;
      while (elem.children.length > 0) {
        elem = elem.children[0] as HTMLElement;
      }
      let itemTitle = elem.innerHTML;
      setText += ` (${decodeURIComponent(itemTitle)})`;
    } catch (e) {}
    elem.setAttribute("ctext", setText);
  }

  if (config.clickToShow !== false) {
    elem.classList.add("can-show");
    elem.addEventListener("click", (e) => {
      if (elem.classList.contains("temp-show")) {
        e.preventDefault();
        elem.classList.remove("temp-show");
        return;
      }
      e.preventDefault();
      elem.classList.add("temp-show");
    });
  }
};

let definedFeedHolder = false;
const findFeedHolder = (lang: string) => {
  if (definedFeedHolder) {
    let newsFeedHolder = window.document.getElementsByClassName(
      "defined-feed-holder"
    );
    if (newsFeedHolder.length > 0) return newsFeedHolder[0];
    definedFeedHolder = false;
    console.warn("Couldnt find defined-feed-holder, trying again");
  }
  setLANG(lang);
  console.warn("contentCleaner: findFeedHolder: lang: ", lang);
  for (let feedHeader of window.document.querySelectorAll('h3[dir="auto"]')) {
    if (feedHeader.innerHTML.toLowerCase() === parsedLang!.newsFeedPosts!.toLowerCase()) {
      console.log("contentCleaner: try main finder - 1");
      if (feedHeader.parentNode!.children.length > 3) {
        definedFeedHolder = true;
        (feedHeader.parentNode as Element).classList.add("defined-feed-holder");
        return feedHeader.parentNode as Element;
      }
      break;
    }
  }
  for (let feedHeader of window.document.querySelectorAll('h3[dir="auto"]')) {
    if (feedHeader.innerHTML.toLowerCase() === parsedLang!.newsFeedPosts!.toLowerCase()) {
      console.log("contentCleaner: try main finder - 2");
      if ((feedHeader.parentNode as Element).children.length === 2) {
        if (
          (feedHeader.parentNode as Element).children[0].tagName !== "H3" ||
          (feedHeader.parentNode as Element).children[1].tagName !== "DIV"
        )
          continue;
        definedFeedHolder = true;
        (feedHeader.parentNode as Element).children[1].classList.add(
          "defined-feed-holder"
        );
        return (feedHeader.parentNode as Element).children[1];
      }
      break;
    }
  }
  for (let feedHeader of window.document.querySelectorAll('h3[dir="auto"]')) {
    if (feedHeader.innerHTML.toLowerCase() === parsedLang!.newsFeedPosts!.toLowerCase()) {
      console.log("contentCleaner: try main finder - 3");
      if ((feedHeader.parentNode as Element).children.length === 3) {
        if (
          (feedHeader.parentNode as Element).children[0].tagName !== "H3" ||
          (feedHeader.parentNode as Element).children[1].tagName !== "DIV" ||
          (feedHeader.parentNode as Element).children[2].tagName !== "DIV" ||
          (feedHeader.parentNode as Element).children[2].children.length === 0
        )
          continue;
        definedFeedHolder = true;
        (feedHeader.parentNode as Element).children[2].classList.add(
          "defined-feed-holder"
        );
        return (feedHeader.parentNode as Element).children[2];
      }
      break;
    }
  }

  return null;
};

let triedAllLangs = false;
let errorNotified = false;
let ccDebounceTimer: NodeJS.Timeout | null = null;
const contentCleaner = (
  key: string | undefined,
  isreRun = false,
  config: any
) => {
  if (errorNotified) return;
  if (window.pausecc === true) return;
  if (window.location.pathname !== "/" && !DEBUG_MODE) {
    console.log(
      "contentCleaner:v" +
        corb.runtime.getManifest().version +
        " - paused as not on home page"
    );
    definedFeedHolder = false;
    return;
  }
  console.log(
    "contentCleaner:v" +
      corb.runtime.getManifest().version +
      " " +
      key +
      " lang: " +
      asLang
  );
  if (forceReloadRequested) {
    forceReloadRequested = false;
    return window.location.reload();
  }

  try {
    let feed: Element | null = findFeedHolder(asLang);
    /*feed = null as any;
    errorNotified = false;*/

    if (feed == null) {
      console.warn(
        "Cannot find feed with document lang, lets find it another way"
      );
      for (let lang of Object.keys(LANGS())) {
        feed = findFeedHolder(lang);
        if (feed != null) {
          console.log("Found feed with lang: " + lang);
          break;
        }
      }
    }
    //feed = null as any;
    if (feed == null) {
      if (!triedAllLangs) {
        window.pausecc = true;
        setTimeout(() => {
          window.pausecc = false;
          triedAllLangs = true;
        }, 5000);
        console.warn("Cannot find feed with any lang, trying again one more time.");
        return;
      }
      errorNotified = true;
      if (!DEBUG_MODE) Popup.initWebError();
      return console.warn("cannot find facebook feed");
    }
    if (window.localStorage.getItem("fbhrar_locale") ?? "ns" !== asLang) {
      window.localStorage.setItem("fbhrar_locale", asLang);
    }
    console.log(
      "contentCleaner:v" +
        corb.runtime.getManifest().version +
        " " +
        key +
        " -clean"
    );
    let result = {
      total: feed.children.length,
      alreadyRedacted: 0,
      ignored: 0,
      opsignored: 0,
      redacted: {
        total: 0,
        reels: 0,
        ads: 0,
        suggestions: 0,
        commentedOn: 0,
        answeredQuestion: 0,
        peopleMayKnow: 0,
      },
      monitoring: 0,
    };
    for (let elem of feed.children) {
      if (elem.classList.contains("redact-elem")) {
        result.alreadyRedacted += 1;
        continue;
      }
      if (elem.classList.contains("no-redact-elem")) {
        result.ignored += 1;
        continue;
      }
      if (elem.innerHTML.toLowerCase().indexOf(parsedLang!.friendRequests!.toLowerCase()) >= 0) {
        if (config.friendRequests !== true) {
          elem.classList.add("no-redact-elem");
          elem.classList.add("no-reels-redact");
          result.opsignored += 1;
          continue;
        }
        redactAddElem("friendRequests", elem, config);
        elem.classList.add("redact-elem-reels");
        result.redacted.reels += 1;
        continue;
      }
      if (elem.innerHTML.toLowerCase().indexOf(parsedLang!.reelsBlock!.toLowerCase()) >= 0) {
        if (config.reels !== true) {
          elem.classList.add("no-redact-elem");
          elem.classList.add("no-reels-redact");
          result.opsignored += 1;
          continue;
        }
        redactAddElem("reelsBlock", elem, config);
        elem.classList.add("redact-elem-reels");
        result.redacted.reels += 1;
        continue;
      }
      if (elem.innerHTML.toLowerCase().indexOf(parsedLang!.containsReels!.toLowerCase()) >= 0) {
        if (config.containsReels !== true) {
          elem.classList.add("no-redact-elem");
          elem.classList.add("no-reels-redact");
          result.opsignored += 1;
          continue;
        }
        redactAddElem("containsReels", elem, config);
        elem.classList.add("redact-elem-reels");
        result.redacted.reels += 1;
        continue;
      }
      if (elem.innerHTML.toLowerCase().indexOf(" " + parsedLang!.commentedOn!.toLowerCase()) >= 0) {
        if (config.commentedOn !== true) {
          elem.classList.add("no-redact-elem");
          elem.classList.add("no-commentedOn-redact");
          result.opsignored += 1;
          continue;
        }
        redactAddElem("commentedOn", elem, config);
        elem.classList.add("redact-elem-commentedOn");
        result.redacted.commentedOn += 1;
        continue;
      }
      if (elem.innerHTML.toLowerCase().indexOf(" " + parsedLang!.commentedOnFriend!.toLowerCase()) >= 0) {
        if (config.commentedOnFriend !== true) {
          elem.classList.add("no-redact-elem");
          elem.classList.add("no-commentedOn-redact");
          result.opsignored += 1;
          continue;
        }
        redactAddElem("commentedOnFriend", elem, config);
        elem.classList.add("redact-elem-commentedOn");
        result.redacted.commentedOn += 1;
        continue;
      }
      if (elem.innerHTML.toLowerCase().indexOf(" " + parsedLang!.tagged!.toLowerCase()) >= 0) {
        if (config.tagged !== true) {
          elem.classList.add("no-redact-elem");
          elem.classList.add("no-answeredQuestion-redact");
          result.opsignored += 1;
          continue;
        }
        redactAddElem("tagged", elem, config);
        elem.classList.add("redact-elem-answeredQuestion");
        result.redacted.answeredQuestion += 1;
        continue;
      }
      if (elem.innerHTML.toLowerCase().indexOf(" " + parsedLang!.answeredQuestion!.toLowerCase()) >= 0) {
        if (config.answeredQuestion !== true) {
          elem.classList.add("no-redact-elem");
          elem.classList.add("no-answeredQuestion-redact");
          result.opsignored += 1;
          continue;
        }
        redactAddElem("answeredQuestion", elem, config);
        elem.classList.add("redact-elem-answeredQuestion");
        result.redacted.answeredQuestion += 1;
        continue;
      }
      if (elem.innerHTML.toLowerCase().indexOf(parsedLang!.peopleKnow!.toLowerCase()) >= 0) {
        if (config.peopleMayKnow !== true) {
          elem.classList.add("no-redact-elem");
          elem.classList.add("no-peopleMayKnow-redact");
          result.opsignored += 1;
          continue;
        }
        redactAddElem("peopleKnow", elem, config);
        elem.classList.add("redact-elem-peopleMayKnow");
        result.redacted.peopleMayKnow += 1;
        continue;
      }
      if (
        elem.innerHTML.indexOf("/ads/about/") > 0 /* ||
      (elem.innerHTML.indexOf(">p</div>") > 0 &&
        elem.innerHTML.indexOf(">S</div>") > 0 &&
        elem.innerHTML.indexOf(">o</div>") > 0 &&
        elem.innerHTML.indexOf(">n</div>") > 0 &&
        elem.innerHTML.indexOf(">s</div>") > 0 &&
        elem.innerHTML.indexOf(">r</div>") > 0 &&
        elem.innerHTML.indexOf(">e</div>") > 0 &&
        elem.innerHTML.indexOf(">d</div>") > 0 &&

        elem.innerHTML.indexOf('/groups/') < 0 &&
        elem.innerHTML.indexOf('/posts/') < 0
        )*/
      ) {
        redactAddElem("ad", elem, config);
        elem.classList.add("redact-elem-ads");
        result.redacted.ads += 1;
        continue;
      }
      if (elem.innerHTML.toLowerCase().indexOf(">" + parsedLang!.suggested!.toLowerCase() + "<") >= 0) {
        if (config.suggestions !== true) {
          elem.classList.add("no-redact-elem");
          elem.classList.add("no-suggestions-redact");
          result.opsignored += 1;
          continue;
        }
        redactAddElem("suggested", elem, config);
        elem.classList.add("redact-elem-suggestions");
        result.redacted.suggestions += 1;
        continue;
      }
      let contentCounter: string | number = `${
        elem.getAttribute("ccount") || ""
      }`;
      if (contentCounter == "") contentCounter = "0";
      contentCounter = Number.parseInt(contentCounter);
      contentCounter++;
      elem.setAttribute("ccount", contentCounter.toString());
      result.monitoring += 1;
      if (contentCounter >= 20) elem.classList.add("no-redact-elem");
    }
    result.redacted.total =
      result.redacted.reels +
      result.redacted.ads +
      result.redacted.suggestions +
      result.redacted.commentedOn +
      result.redacted.answeredQuestion +
      result.redacted.peopleMayKnow +
      result.alreadyRedacted;
    console.log(
      `contentCleaner: ` +
        `[opsIgnored: ${result.opsignored}/${result.total}] ` +
        `[alreadyRedacted: ${result.alreadyRedacted}/${result.total}] ` +
        `[ignored: ${result.ignored}/${result.total}] ` +
        `[monitoring: ${result.monitoring}/${result.total}] ` +
        `[redacted(reels,ads,suggestions,commentedOn,answeredQuestion,peopleMayKnow): ${result.redacted.reels},${result.redacted.ads},${result.redacted.suggestions},${result.redacted.commentedOn},${result.redacted.answeredQuestion},${result.redacted.peopleMayKnow}/${result.total}] ` +
        `[cleaned(redacted,ignored,monitoring): ${result.redacted.total},${
          result.ignored
        },${result.monitoring}=${
          result.redacted.total + result.ignored + result.monitoring
        }/${result.total}] `
    );

    if (ccDebounceTimer !== null) clearTimeout(ccDebounceTimer);
    if (document.getElementById("stories-container") === null) {
      let storiesDoc = document.querySelectorAll('div[aria-label="Stories"]');
      if (storiesDoc.length > 0) {
        let hiracDiv = storiesDoc[0].parentElement!;
        let max = 30;
        while (hiracDiv.classList.length > 0) {
          hiracDiv = hiracDiv.parentElement!;
          max = max - 1;
          if (max <= 0) return;
        }
        hiracDiv.setAttribute("id", "stories-container");
      }
      if (config.stories !== false) {
        let storiesDoc2 = document.getElementById("stories-container")!;
        for (let childH of storiesDoc2.children) {
          if (childH.getAttribute("id") === "fbcont-banner") continue;
          childH.classList.add("stories");
        }
      }
      if (document.getElementById("fbcont-banner") === null) {
        document.getElementById("stories-container")!.innerHTML =
          '<div id="fbcont-banner" class="redact-elem redact-elem-fbhaar" fbver="' +
          corb.runtime.getManifest().version +
          '" fbtxt="Facebook Hide Recommendations and Reels v' +
          corb.runtime.getManifest().version +
          '"></div>' +
          document.getElementById("stories-container")!.innerHTML;
      }
    }
    if (
      config.createPost !== false &&
      document.getElementById("createPost-container") === null
    ) {
      try {
        for (let elem of document.getElementsByTagName("h3")) {
          if (elem.innerHTML === parsedLang!.createAPost) {
            elem.parentElement!.parentElement!.parentElement!.parentElement!.setAttribute(
              "id",
              "createPost-container"
            );
            elem.parentElement!.parentElement!.parentElement!.parentElement!.style.display =
              "none";
            break;
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    if (isreRun) return;
    ccDebounceTimer = setTimeout(() => {
      //if (`${lastAction}` != lastActionKey) return;
      contentCleaner("re-clear:" + key, true, config);
    }, 2000);
  } catch (xcc) {
    console.error(xcc);
  }
};

if (parsedLang === undefined) {
  // unknown lang
  console.warn("Unknown lang!");
  if (window.location.pathname === "/") {
    alert(
      "FB Hide Recommendations and Reels: Unknown language! - Please log an issue on our GitHub page to add your language (" +
        (window.localStorage.getItem("fbhrar_locale") ??
          document.documentElement.lang) +
        "). This plugin cannot work without defining a language."
    );
  }
} else
  document.body.onload = () => {
    corb.storage.sync.get("data").then(async (items) => {
      let config = (items || {}).data || {};
      if (config.version !== corb.runtime.getManifest().version) {
        // new version alert
      }
      if (config.version === undefined) {
        // config never set
        Popup.initWebStartHome(false);
        return;
      }
      if (
        config.version !== corb.runtime.getManifest().version &&
        !DEBUG_MODE
      ) {
        Popup.initWebStartHome(
          config.version !== undefined &&
            config.version !== null &&
            config.version !== ""
        );
        return;
      }
      console.log("Known CC Config", config);
      if (config.needsDelay !== false) {
        console.log(
          "Delaying CC by 5s as per https://github.com/mrinc/Facebook-Hide-Recommendations-and-Reels/issues/15"
        );
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
      let contentClearTimer = setInterval(
        () => contentCleaner("timer", false, config),
        60000
      );
      contentCleaner(undefined, false, config);

      let lastAction = 0;
      let debounceTimer: NodeJS.Timeout | null = null;
      document.addEventListener("scroll", function (e) {
        let now = new Date().getTime();

        if (now - lastAction > 1000) {
          clearTimeout(debounceTimer!);
          contentCleaner("force", false, config);
          lastAction = now;
          return;
        }
        if (now - lastAction > 250) {
          clearTimeout(debounceTimer!);
          //let lastActionKey = `${lastAction}`;
          debounceTimer = setTimeout(() => {
            //if (`${lastAction}` != lastActionKey) return;
            contentCleaner("scroll", false, config);
            lastAction = now;
          }, 500);
        }
      });

      window.addEventListener("blur", () => {
        contentCleaner("blur", false, config);
        clearInterval(contentClearTimer);
        contentClearTimer = setInterval(
          () => contentCleaner("timer", false, config),
          60000
        );
      });
      window.addEventListener("focus", () => {
        contentCleaner("focus", false, config);
        clearInterval(contentClearTimer);
        contentClearTimer = setInterval(
          () => contentCleaner("timer", false, config),
          10000
        );
      });

      corb.runtime.onMessage.addListener(function (
        request,
        sender,
        sendResponse
      ) {
        if (request.fbhrar_reload === true) {
          console.log("force reload requested: config changed");
          forceReloadRequested = true;
        }
      });
    });
  };
