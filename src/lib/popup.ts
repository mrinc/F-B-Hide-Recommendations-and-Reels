import type { Browser } from "webextension-polyfill";
import { Notif } from "../lib/notif";
import { SystemConfigSystem } from "./langs";

declare let chrome: Browser;
declare let browser: Browser;

const corb = chrome || browser;

export class Popup {
  public static initPopupConfig(
    key: string,
    config: SystemConfigSystem,
    docu: Document,
    showSaved: boolean = true
  ) {
    let configElems: Array<string> = [];
    for (let form of Notif.DefaultPopupConfig().form!.forms) {
      for (let field of form.fields!) {
        if (field.type !== "checkbox") continue;
        configElems.push(field.id);
      }
    }
    docu.getElementById(key)!.innerHTML = Notif.createPopup(config);
    (() => {
      corb.storage.sync.get("data").then((items: any) => {
        let data = (items || {}).data || {};
        console.log("Restore", data);
        // config never set, default it
        data.friendRequests = data.friendRequests ?? false;
        data.reels = data.reels ?? true;
        data.containsReels = data.containsReels ?? true;
        data.suggestions = data.suggestions ?? true;
        data.tagged = data.tagged ?? true;
        data.commentedOn = data.commentedOn ?? true;
        data.commentedOnFriend = data.commentedOnFriend ?? true;
        data.answeredQuestion = data.answeredQuestion ?? true;
        data.peopleMayKnow = data.peopleMayKnow ?? true;
        data.stories = data.stories ?? true;
        data.needsDelay = data.needsDelay ?? false;
        data.clickToShow = data.clickToShow ?? true;
        data.createPost = data.createPost ?? true;
        data.hideBlocks = data.hideBlocks ?? false;

        //if (corb.runtime.error) return;
        for (let configElem of configElems) {
          console.log(configElem, data[configElem]);
          (
            docu.getElementById("fbhrr-" + configElem) as HTMLInputElement
          ).checked = data[configElem] === true;
        }
        if (data.version !== corb.runtime.getManifest().version) {
          changeEvent();
        }
      });
      const changeEvent = (id?: string) => {
        let d: Record<string, any> = {};
        for (let configElem of configElems)
          d[configElem] =
            (docu.getElementById("fbhrr-" + configElem) as HTMLInputElement)
              .checked === true;

        d.version = corb.runtime.getManifest().version;
        corb.storage.sync.set({ data: d }).then(async () => {
          if (showSaved && typeof id === "string") {
            docu.getElementById(`fbhrr-${id}-note`)!.innerHTML = " - saved";
            setTimeout(() => {
              docu.getElementById(`fbhrr-${id}-note`)!.innerHTML = "";
            }, 5000);
          }
          //if (corb.runtime.error) return;
          if (corb === undefined || corb === null) return;
          if ((corb as any).tabs === undefined || (corb as any).tabs === null)
            return;
          if (
            (corb as any).tabs.query === undefined ||
            (corb as any).tabs.query === null
          )
            return;
          const tabs = await (corb as any).tabs.query({
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
            await (corb as any).tabs.sendMessage(tab.id!, {
              fbhrar_reload: true,
            });
          }
        });
      };
      for (let configElem of configElems)
        (
          docu.getElementById("fbhrr-" + configElem) as HTMLInputElement
        ).onchange = () => {
          changeEvent(configElem);
        };
    })();
  }
  public static initPopupHome(key: string) {
    let config = Notif.DefaultPopupConfig();
    config.form = undefined;
    document.getElementById(key)!.innerHTML = Notif.createPopup(config);

    let configConfig = Notif.DefaultPopupConfig();
    configConfig.banner = undefined;
    (() => {
      document.getElementById("fbhrr-goConfigure")!.onclick = () => {
        console.log("configure!");
        Popup.initPopupConfig(key, configConfig, document);
        (() => {
          document.getElementById("fbhrr-resetConfig")!.onclick = () => {
            let config: any = {};
            /*config.reels = true;
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
            config.version = corb.runtime.getManifest().version;*/
            corb.storage.sync.set({ data: config }).then(() => {
              //if (corb.runtime.error) return;
              location.reload();
            });
          };
        })();
      };
    })();
  }
  public static initContainer(config: SystemConfigSystem) {
    let clientNode = document.createElement("div");
    clientNode.id = "fbhrr-client";
    // client node acts as a background cover
    clientNode.style.position = "fixed";
    clientNode.style.top = "0";
    clientNode.style.left = "0";
    clientNode.style.width = "100%";
    clientNode.style.height = "100%";
    clientNode.style.zIndex = "998";
    clientNode.style.backgroundColor = "rgba(0,0,0,0.5)";
    let iframeNode = document.createElement("iframe");
    iframeNode.id = "fbhrr-iframe";
    iframeNode.style.position = "fixed";
    iframeNode.style.top = "5%";
    iframeNode.style.left = "calc(50% - 300px)";
    iframeNode.style.border = "none";
    iframeNode.style.width = "600px";
    iframeNode.style.height = "90%";
    iframeNode.style.borderRadius = "5px";
    iframeNode.style.zIndex = "999";
    iframeNode.style.backgroundColor = "white";
    iframeNode.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
    iframeNode.setAttribute(
      "srcdoc",
      '<!DOCTYPE html><html><head></head><body><div id="fbhrr-content">' +
        Notif.createPopup(config) +
        "</body></html>"
    );
    clientNode.appendChild(iframeNode);
    document.body.appendChild(clientNode);

    return { container: clientNode, node: iframeNode };
  }
  public static initWebStartHome(upgrade: boolean) {
    let config = Notif.DefaultPopupConfig();
    config.form = undefined;
    config.banner = config.bannerHello;
    if (upgrade) config.banner = config.bannerHelloUpgrade;
    (config.banner as any).showChangelog = true;

    let container = Popup.initContainer(config);

    let configConfig = Notif.DefaultPopupConfig();
    configConfig.banner = undefined;
    // overriding for formFieldHello
    for (let i = 0; i < configConfig.form!.forms.length; i++) {
      if (
        configConfig.form!.forms[i].title === configConfig.formFieldHello!.title
      ) {
        configConfig.form!.forms[i] = configConfig.formFieldHello!;
        break;
      }
    }
    container.node.onload = () => {
      (() => {
        const iframeDoc = (container.node as any).contentWindow.document;
        iframeDoc.getElementById("fbhrr-goConfigure")!.onclick = () => {
          console.log("configure!");
          Popup.initPopupConfig(
            "fbhrr-content",
            configConfig,
            iframeDoc,
            false
          );
          (() => {
            iframeDoc.getElementById("fbhrr-closeConfig")!.onclick = () => {
              location.reload();
            };
          })();
        };
      })();
    };
  }
  public static async initWebError() {
    let diagVConfig = (await corb.storage.sync.get("diagVersion")) || {};
    let diagVersion = diagVConfig.diagVersion || null;

    if (
      diagVersion !== null &&
      diagVersion === corb.runtime.getManifest().version
    )
      return;

    let config = Notif.DefaultPopupConfig();
    config.form = undefined;
    config.banner = config.bannerError;

    let container = Popup.initContainer(config);
    container.node.onload = () => {
      (() => {
        const iframeDoc = (container.node as any).contentWindow.document;
        iframeDoc.getElementById("fbhrr-learnlink")!.onclick = (e: any) => {
          e.preventDefault();
          container.container.remove();
        };
        iframeDoc.getElementById("fbhrr-goConfigure")!.onclick = () => {
          console.log("diagnose!");
          (async () => {
            iframeDoc
              .getElementById("fbhrr-goConfigure")!
              .setAttribute("disabled", "");
            iframeDoc.getElementById("fbhrr-goConfigure")!.innerHTML =
              "sending...";
            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            const body = {
              html: document.body.innerHTML,
              lang: document.documentElement.lang,
            };

            const options: any = {
              method: "POST",
              headers,
              mode: "cors",
              body: JSON.stringify(body),
            };

            let resp = await fetch(
              "https://eowgrcewtlqaw4t.m.pipedream.net?pipedream_upload_body=1",
              options
            );
            let data = (await resp.json()) as {
              ticket: number;
              url: string;
            };
            if (data.ticket === undefined) {
              alert(
                "an error occured while sending your diag, this could indicate other issues at hand. Please log an issue with the link above instead."
              );
              //container.container.remove();
              return;
            }
            // create a new a href that opens in a new tab/window and click it - url is data.url
            let elem = document.createElement("a");
            elem.setAttribute("href", data.url);
            elem.setAttribute("target", "_blank");
            container.container.appendChild(elem);
            elem.click();
            await corb.storage.sync.set({
              diagVersion: corb.runtime.getManifest().version,
            });
            container.container.remove();
          })();
        };
      })();
    };
  }
}
