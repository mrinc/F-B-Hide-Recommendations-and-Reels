let ccDebounceTimer = null;
const contentCleaner = (key, isreRun = false, config) => {
  if (window.pausecc === true) return;
  console.log("contentCleaner:v1.18:" + key);
  const feed = window.document.querySelectorAll('[role="feed"]');
  if (feed.length !== 1) {
    console.log("contentCleaner: ignore");
    return;
  }
  let result = {
    total: feed[0].children.length,
    alreadyRedacted: 0,
    ignored: 0,
    opsignored: 0,
    redacted: {
      total: 0,
      reels: 0,
      ads: 0,
      suggestions: 0,
    },
    monitoring: 0,
  };
  for (let elem of feed[0].children) {
    if (elem.classList.contains("redact-elem")) {
      result.alreadyRedacted += 1;
      continue;
    }
    if (elem.classList.contains("no-redact-elem")) {
      result.ignored += 1;
      continue;
    }
    if (elem.innerHTML.indexOf("Reels and short videos") >= 0) {
      if (config.reels === true) {
        elem.classList.add("no-redact-elem");
        result.opsignored += 1;
        continue;
      }
      elem.classList.add("redact-elem");
      elem.classList.add("redact-elem-reels");
      result.redacted.reels += 1;
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
    if (elem.innerHTML.indexOf(">Suggested for you<") >= 0) {
      if (config.suggestions === true) {
        elem.classList.add("no-redact-elem");
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
    result.alreadyRedacted;
  console.log(
    `contentCleaner: ` +
      `[opsIgnored: ${result.opsignored}/${result.total}] ` +
      `[alreadyRedacted: ${result.alreadyRedacted}/${result.total}] ` +
      `[ignored: ${result.ignored}/${result.total}] ` +
      `[monitoring: ${result.monitoring}/${result.total}] ` +
      `[redacted(reels,ads,suggestions): ${result.redacted.reels},${result.redacted.ads},${result.redacted.suggestions}/${result.total}] ` +
      `[cleaned(redacted,ignored,monitoring): ${result.redacted.total},${
        result.ignored
      },${result.monitoring}=${
        result.redacted.total + result.ignored + result.monitoring
      }/${result.total}] `
  );

  clearTimeout(ccDebounceTimer);
  if (isreRun) return;
  ccDebounceTimer = setTimeout(() => {
    //if (`${lastAction}` != lastActionKey) return;
    contentCleaner("re-clear:" + key, true, config);
  }, 2000);
};

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
