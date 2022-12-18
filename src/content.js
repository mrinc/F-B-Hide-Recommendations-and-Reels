const langs = {
  en: {
    newsFeedPosts: "News Feed posts",
    reelsBlock: "Reels and short videos",
    commentedOn: " commented on a post from ",
    peopleKnow: "People you may know",
    suggested: ">Suggested for you<",
  },
  pl: {
    newsFeedPosts: "Posty na kanale aktualności",
    reelsBlock: "Rolki i krótkie filmy",
    commentedOn: " skomentował post z ",
    peopleKnow: "Ludzie których możesz znać",
    suggested: "Proponowana dla Ciebie",
  },
};

let ccDebounceTimer = null;
let definedFeedHolder = false;
const contentCleaner = (key, isreRun = false, config) => {
  if (window.pausecc === true) return;
  if (window.location.pathname !== "/") {
    console.log(
      "contentCleaner:v" +
        (chrome || browser).runtime.getManifest().version +
        " - paused as not on home page"
    );
    definedFeedHolder = false;
    return;
  }
  console.log(
    "contentCleaner:v" +
      (chrome || browser).runtime.getManifest().version +
      " " +
      key
  );
  try {
    let feed = null;
    if (!definedFeedHolder) {
      //try method 1
      for (let feedHeader of window.document.querySelectorAll(
        'h3[dir="auto"]'
      )) {
        if (
          feedHeader.innerText ===
          langs[document.documentElement.lang].newsFeedPosts
        ) {
          console.log("contentCleaner: try main finder - 1");
          if (feedHeader.parentNode.children.length > 3) {
            definedFeedHolder = true;
            feedHeader.parentNode.classList.add("defined-feed-holder");
          }
          break;
        }
      }
    }
    if (!definedFeedHolder) {
      //try method 2
      for (let feedHeader of window.document.querySelectorAll(
        'h3[dir="auto"]'
      )) {
        if (
          feedHeader.innerText ===
          langs[document.documentElement.lang].newsFeedPosts
        ) {
          console.log("contentCleaner: try main finder - 2");
          if (feedHeader.parentNode.children.length === 2) {
            if (
              feedHeader.parentNode.children[0].tagName !== "H3" ||
              feedHeader.parentNode.children[1].tagName !== "DIV"
            )
              continue;
            definedFeedHolder = true;
            feedHeader.parentNode.children[1].classList.add(
              "defined-feed-holder"
            );
          }
          break;
        }
      }
    }
    if (definedFeedHolder) {
      feed = window.document.getElementsByClassName("defined-feed-holder")[0];
    }

    if (feed == null) {
      return console.warn("cannot find facebook feed");
    }
    console.log(
      "contentCleaner:v" +
        (chrome || browser).runtime.getManifest().version +
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
      if (
        elem.innerHTML.indexOf(
          langs[document.documentElement.lang].reelsBlock
        ) >= 0
      ) {
        if (config.reels === true) {
          elem.classList.add("no-redact-elem");
          elem.classList.add("no-reels-redact");
          result.opsignored += 1;
          continue;
        }
        elem.classList.add("redact-elem");
        elem.classList.add("redact-elem-reels");
        result.redacted.reels += 1;
        continue;
      }
      if (
        elem.innerHTML.indexOf(
          langs[document.documentElement.lang].commentedOn
        ) >= 0
      ) {
        if (config.commentedOn === true) {
          elem.classList.add("no-redact-elem");
          elem.classList.add("no-commentedOn-redact");
          result.opsignored += 1;
          continue;
        }
        elem.classList.add("redact-elem");
        elem.classList.add("redact-elem-commentedOn");
        result.redacted.commentedOn += 1;
        continue;
      }
      if (
        elem.innerHTML.indexOf(
          langs[document.documentElement.lang].peopleKnow
        ) >= 0
      ) {
        if (config.peopleMayKnow === true) {
          elem.classList.add("no-redact-elem");
          elem.classList.add("no-peopleMayKnow-redact");
          result.opsignored += 1;
          continue;
        }
        elem.classList.add("redact-elem");
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
        elem.classList.add("redact-elem");
        elem.classList.add("redact-elem-ads");
        result.redacted.ads += 1;
        continue;
      }
      if (
        elem.innerHTML.indexOf(
          langs[document.documentElement.lang].suggested
        ) >= 0
      ) {
        if (config.suggestions === true) {
          elem.classList.add("no-redact-elem");
          elem.classList.add("no-suggestions-redact");
          result.opsignored += 1;
          continue;
        }
        elem.classList.add("redact-elem");
        elem.classList.add("redact-elem-suggestions");
        result.redacted.suggestions += 1;
        continue;
      }
      let contentCounter = `${elem.getAttribute("ccount") || ""}`;
      if (contentCounter == "") contentCounter = "0";
      contentCounter = Number.parseInt(contentCounter);
      contentCounter++;
      elem.setAttribute("ccount", contentCounter);
      result.monitoring += 1;
      if (contentCounter >= 20) elem.classList.add("no-redact-elem");
    }
    result.redacted.total =
      result.redacted.reels +
      result.redacted.ads +
      result.redacted.suggestions +
      result.redacted.commentedOn +
      result.redacted.peopleMayKnow +
      result.alreadyRedacted;
    console.log(
      `contentCleaner: ` +
        `[opsIgnored: ${result.opsignored}/${result.total}] ` +
        `[alreadyRedacted: ${result.alreadyRedacted}/${result.total}] ` +
        `[ignored: ${result.ignored}/${result.total}] ` +
        `[monitoring: ${result.monitoring}/${result.total}] ` +
        `[redacted(reels,ads,suggestions,commentedOn,peopleMayKnow): ${result.redacted.reels},${result.redacted.ads},${result.redacted.suggestions},${result.redacted.commentedOn},${result.redacted.peopleMayKnow}/${result.total}] ` +
        `[cleaned(redacted,ignored,monitoring): ${result.redacted.total},${
          result.ignored
        },${result.monitoring}=${
          result.redacted.total + result.ignored + result.monitoring
        }/${result.total}] `
    );

    clearTimeout(ccDebounceTimer);
    if (document.getElementById("stories-container") === null) {
      let storiesDoc = document.querySelectorAll('div[aria-label="Stories"]');
      if (storiesDoc.length > 0) {
        let hiracDiv = storiesDoc[0].parentElement;
        let max = 30;
        while (hiracDiv.classList.length > 0) {
          hiracDiv = hiracDiv.parentElement;
          max = max - 1;
          if (max <= 0) return;
        }
        hiracDiv.setAttribute("id", "stories-container");
      }
      if (config.stories !== true) {
        let storiesDoc = document.getElementById("stories-container");
        for (let childH of storiesDoc.children) {
          if (childH.getAttribute("id") === "fbcont-banner") continue;
          childH.classList.add("stories");
        }
      }
      if (document.getElementById("fbcont-banner") === null) {
        document.getElementById("stories-container").innerHTML =
          '<div id="fbcont-banner" class="redact-elem redact-elem-fbhaar" fbver="' +
          (chrome || browser).runtime.getManifest().version +
          '" fbtxt="Facebook Hide Recommendations and Reels v' +
          (chrome || browser).runtime.getManifest().version +
          '"></div>' +
          document.getElementById("stories-container").innerHTML;
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

if (langs[document.documentElement.lang] === undefined) {
  // unknown lang
  console.warn("Unknown lang!");
} else
  document.body.onload = () => {
    chrome.storage.sync.get("data", (items) => {
      let config = (items || {}).data || {};
      console.log("Known CC Config", config);
      let contentClearTimer = setInterval(
        () => contentCleaner("timer", false, config),
        60000
      );
      contentCleaner(undefined, false, config);

      let lastAction = 0;
      let debounceTimer = null;
      document.addEventListener("scroll", function (e) {
        let now = new Date().getTime();

        if (now - lastAction > 1000) {
          clearTimeout(debounceTimer);
          contentCleaner("force", false, config);
          lastAction = now;
          return;
        }
        if (now - lastAction > 250) {
          clearTimeout(debounceTimer);
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
    });
  };
