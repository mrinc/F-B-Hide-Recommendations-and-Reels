import type { Browser } from "webextension-polyfill";
import { langs } from "../lib/langs";

declare let chrome: Browser;
declare let browser: Browser;

const corb = chrome || browser;

// popup.js

for (let elem of document.getElementsByClassName("app_version"))
  elem.innerHTML = corb.runtime.getManifest().version;

for (let langKey of Object.keys(langs)) {
  document.getElementById('langs-list')!.innerHTML += `<li value="${langKey}">[${langKey}] ${langs[langKey].name}</li>`;
}

const configElems = [
  "reels",
  "suggestions",
  "commentedOn",
  "answeredQuestion",
  "peopleMayKnow",
  "stories",
  "needsDelay",
];

document.body.onload = () => {
  chrome.storage.sync.get("data").then((items) => {
    let data = (items || {}).data || {};
    console.log("Restore", data);
    //if (chrome.runtime.error) return;
    for (let configElem of configElems)
      (document.getElementById(configElem) as HTMLInputElement).checked =
        !(data[configElem] === true);
  });
};

const changeEvent = () => {
  let d: Record<string, any> = {};
  for (let configElem of configElems)
    d[configElem] =
      !((document.getElementById(configElem) as HTMLInputElement).checked ===
      true);

  chrome.storage.sync.set({ data: d }).then(() => {
    //if (chrome.runtime.error) return;
  });
};
for (let configElem of configElems)
  (document.getElementById(configElem) as HTMLInputElement).onchange =
    changeEvent;
