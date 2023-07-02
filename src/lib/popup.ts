import type { Browser } from "webextension-polyfill";
import { Notif } from "../lib/notif";
import { SystemConfigSystem } from "./langs";
import { ConfigDefition, Storage } from "./storage";

const storage = new Storage();
export class Popup {
  public static async initPopupConfig(
    key: string,
    config: SystemConfigSystem,
    docu: Document,
    showSaved: boolean = true
  ) {
    await storage.setup();
    let configElems: Array<string> = [];
    for (let form of (await Notif.DefaultPopupConfig()).form!.forms) {
      for (let field of form.fields!) {
        if (field.type !== "checkbox") continue;
        configElems.push(field.id);
      }
    }
    docu.getElementById(key)!.innerHTML = await Notif.createPopup(config);
    (async () => {
      storage
        .get("data")
        .then((data) => {
          console.log("Restored", data);
          for (let configElem of configElems) {
            console.log(configElem, (data as any)[configElem]);
            (
              docu.getElementById("fbhrr-" + configElem) as HTMLInputElement
            ).checked = (data as any)[configElem] === true;
          }
          if (data.version !== storage.version) {
            changeEvent();
          }
        });
      const changeEvent = (id?: string) => {
        let d: Record<string, any> | ConfigDefition = {};
        for (let configElem of configElems)
          d[configElem] =
            (docu.getElementById("fbhrr-" + configElem) as HTMLInputElement)
              .checked === true;

        d.version = storage.version;
        storage.set("data", d as ConfigDefition).then(async () => {
          if (showSaved && typeof id === "string") {
            docu.getElementById(`fbhrr-${id}-note`)!.innerHTML = ` - <span class="rounded bg-green-600 p-x text-white">saved</span>`;
            setTimeout(() => {
              docu.getElementById(`fbhrr-${id}-note`)!.innerHTML = "";
            }, 5000);
          }
          //if (corb.runtime.error) return;
          const corb = storage.getRawInstance();
          if (corb.tabs === undefined || corb.tabs === null) return;
          if (corb.tabs.query === undefined || corb.tabs.query === null) return;
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
        (
          docu.getElementById("fbhrr-" + configElem) as HTMLInputElement
        ).onchange = () => {
          changeEvent(configElem);
        };
    })();
  }
  public static async initPopupHome(key: string) {
    let config = await Notif.DefaultPopupConfig();
    config.form = undefined;
    document.getElementById(key)!.innerHTML = await Notif.createPopup(config);

    let configConfig = await Notif.DefaultPopupConfig();
    configConfig.banner = undefined;
    (() => {
      document.getElementById("fbhrr-goConfigure")!.onclick = async () => {
        console.log("configure!");
        await Popup.initPopupConfig(key, configConfig, document);
        (() => {
          document.getElementById("fbhrr-resetConfig")!.onclick = async () => {
            await storage.delete("data");
            location.reload();
          };
        })();
      };
    })();
  }
  public static async initContainer(config: SystemConfigSystem) {
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
        (await Notif.createPopup(config)) +
        "</body></html>"
    );
    clientNode.appendChild(iframeNode);
    document.body.appendChild(clientNode);

    return { container: clientNode, node: iframeNode };
  }
  public static async initWebStartHome(upgrade: boolean) {
    let config = await Notif.DefaultPopupConfig();
    config.form = undefined;
    config.banner = config.bannerHello;
    if (upgrade) config.banner = config.bannerHelloUpgrade;
    (config.banner as any).showChangelog = true;

    let container = await Popup.initContainer(config);

    let configConfig = await Notif.DefaultPopupConfig();
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
        iframeDoc.getElementById("fbhrr-goConfigure")!.onclick = async () => {
          console.log("configure!");
          await Popup.initPopupConfig(
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
    let diagVConfig = (await storage.get<string>("diagVersion"));
    let diagVersion = diagVConfig || null;

    if (
      diagVersion !== null &&
      diagVersion === storage.version
    )
      return;

    let config = await Notif.DefaultPopupConfig();
    config.form = undefined;
    config.banner = config.bannerError;

    let container = await Popup.initContainer(config);
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
              "gathering data...";
            await new Promise(async (r) => {
              let counter = 0;
              let scrollY = 10028;
              while (counter < 30 && window.scrollY !== scrollY) {
                window.scrollTo(0, 10028);
                await new Promise((r) => setTimeout(r, 1000));
                counter++;
                "gathering data... (" + counter + "s/30s)";
              }
            });
            iframeDoc.getElementById("fbhrr-goConfigure")!.innerHTML =
              "sending...";

            const headers = new Headers();
            headers.append("Content-Type", "application/json");

            const body = {
              html: `<html>${document.documentElement.innerHTML}</html>`,
              lang:
                document.documentElement.lang +
                ":" +
                (window.localStorage.getItem("fbhrar_locale") ?? "ns"),
            };

            const options: any = {
              method: "POST",
              headers,
              mode: "cors",
              body: JSON.stringify(body),
            };

            try {
              let resp = await fetch(
                "https://chrome-facebook-hide-ads-and-reels.mrincops.net/diag",
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
              await storage.set('diagVersion', storage.version);
              container.container.remove();
            } catch (exc) {
              alert(
                "an error occured while sending your diag, this could indicate other issues at hand. Please log an issue with the link above instead."
              );
              //container.container.remove();
              return;
            }
          })();
        };
      })();
    };
  }
}
