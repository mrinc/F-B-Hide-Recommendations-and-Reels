import type { Browser } from "webextension-polyfill";
import { langs } from "../lib/langs";

declare let chrome: Browser;
declare let browser: Browser;

const corb = chrome || browser;

// popup.js

for (let elem of document.getElementsByClassName("app_version"))
  elem.innerHTML = corb.runtime.getManifest().version;

const langSplitItem = `<svg viewBox="0 0 2 2" class="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg>`;
document.getElementById("langs-list")!.innerHTML = Object.keys(langs)
  .map((x) => langs[x].name)
  .join(langSplitItem);

const configElems = [
  "reels",
  "containsReels",
  "suggestions",
  "commentedOn",
  "commentedOnFriend",
  "friendRequests",
  "answeredQuestion",
  "peopleMayKnow",
  "stories",
  "tagged",
  "createPost",
  "needsDelay",
  "clickToShow",
];

document.body.onload = () => {
  corb.storage.sync.get("data").then((items: any) => {
    let data = (items || {}).data || {};
    console.log("Restore", data);
    //if (corb.runtime.error) return;
    for (let configElem of configElems) {
      console.log(configElem, data[configElem]);
      (document.getElementById(configElem) as HTMLInputElement).checked =
        data[configElem] === true;
    }
    if (data.version !== corb.runtime.getManifest().version) {
      changeEvent();
    }
  });
};

const changeEvent = () => {
  let d: Record<string, any> = {};
  for (let configElem of configElems)
    d[configElem] =
      (document.getElementById(configElem) as HTMLInputElement).checked ===
      true;

  d.version = corb.runtime.getManifest().version;
  corb.storage.sync.set({ data: d }).then(async () => {
    //if (corb.runtime.error) return;
    const tabs = await corb.tabs.query({
      //url: "https://www.facebook.com/*",
      active: true,
      currentWindow: true,
    });
    //console.log(tabs);
    //console.log(tabs[0].);
    for (let tab of tabs.filter((x: any) => x.id !== undefined)) {
      console.log("sending force reload request to: ", tab.id, " tab");
      // corb.tabs.reload
      //await corb.tabs.sendMessage(corb.runtime.id, {
      await corb.tabs.sendMessage(tab.id!, {
        fbhrar_reload: true,
      });
    }
  });
};
for (let configElem of configElems)
  (document.getElementById(configElem) as HTMLInputElement).onchange =
    changeEvent;

(() => {
  console.log("my id: " + corb.runtime.id);
  document.getElementById("goConfigure")!.onclick = () => {
    console.log("configure!");
    document.getElementById("headerBanner")!.style.display = "none";
    document.getElementById("configureForm")!.style.display = "block";
  };
  document.getElementById("resetConfig")!.onclick = () => {
    let config: any = {};
    config.reels = true;
    config.containsReels = true;
    config.suggestions = true;
    config.tagged = true;
    config.commentedOn = true;
    config.commentedOnFriend = true;
    config.answeredQuestion = true;
    config.peopleMayKnow = true;
    config.stories = true;
    config.friendRequests = false;
    config.needsDelay = false;
    config.clickToShow = true;
    config.createPost = true;
    config.version = corb.runtime.getManifest().version;
    corb.storage.sync.set({ data: config }).then(() => {
      //if (corb.runtime.error) return;
      location.reload();
    });
  };
})();
