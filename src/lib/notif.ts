import type { Browser } from "webextension-polyfill";
import {
  SystemConfigSystem,
  SystemConfigSystemPopup,
  langs,
} from "../lib/langs";
import { Logs } from "../changelog";
import {Storage} from './storage'

const storage = new Storage();
export class Notif {
  public static async DefaultPopupConfig(): Promise<SystemConfigSystem> {
    await storage.setup();
    let sysConfig: SystemConfigSystem = JSON.parse(
      JSON.stringify(langs.en._system)
    ) as SystemConfigSystem;

    if ((window.localStorage.getItem('fbhrar_locale')??document.documentElement.lang) !== "en") {
      if (
        (langs as any)[(window.localStorage.getItem('fbhrar_locale')??document.documentElement.lang)] !== undefined &&
        (langs as any)[(window.localStorage.getItem('fbhrar_locale')??document.documentElement.lang)]._system !== undefined
      ) {
        for (let key of Object.keys(langs.en._system!)) {
          if (
            (langs as any)[(window.localStorage.getItem('fbhrar_locale')??document.documentElement.lang)]._system[key] !==
            undefined
          ) {
            (sysConfig as any)[key] = JSON.parse(
              JSON.stringify(
                (langs as any)[(window.localStorage.getItem('fbhrar_locale')??document.documentElement.lang)]._system[key]
              )
            );
          }
        }
      }
    }
    return sysConfig;
  }
  public static async generate(layoutpart: string, meta: any = {}) {
    await storage.setup();
    if (layoutpart === "css") {
      let output =
        ".tag { display: inline-block; font-size: 0.775rem; line-height: 0.7rem; margin-left: 10px; }";
      let colours: Record<string, Record<string, string>> = {
        gray: {
          "50": "249 250 251",
          "500": "156 163 175",
          "600": "107 114 128",
          "700": "75 85 99",
          "900": "17 24 39",
        },
        red: {
          "50": "254 242 242",
          "500": "229 62 62",
          "600": "220 38 38",
          "700": "185 28 28",
          "900": "52 8 8",
        },
        white: {
          "100": "255 255 255",
        },
        green: {
          "50": "243 249 244",
          "500": "52 211 153",
          "600": "16 185 129",
          "700": "5 150 105",
          "900": "6 95 70",
        },
        indigo: {
          "50": "237 242 255",
          "500": "79 70 229",
          "600": "67 56 202",
          "700": "55 48 163",
          "900": "24 19 112",
        },
        blue: {
          "50": "239 246 255",
          "500": "59 130 246",
          "600": "37 99 235",
          "700": "29 78 216",
          "900": "16 42 111",
        },
      };
      for (let colour of Object.keys(colours)) {
        for (let shade of Object.keys(colours[colour])) {
          output += `.bg-${colour}-${shade}{--tw-bg-opacity:1;background-color:rgb(${colours[colour][shade]} / var(--tw-bg-opacity))}`;
          output += `.border-${colour}-${shade}{--tw-border-opacity:1;border-color:rgb(${colours[colour][shade]} / var(--tw-border-opacity))}`;
          output += `.hover\\:bg-${colour}-${shade}:hover{--tw-bg-opacity:1;background-color:rgb(${colours[colour][shade]} / var(--tw-bg-opacity))}`;
          output += `.border-${colour}-${shade}\\/10{border-color:rgb(${colours[colour][shade]} / 0.1)}`;
          output += `.text-${colour}-${shade}{color:rgb(${colours[colour][shade]})}`;
          output += `input[type="checkbox"]:checked.cb-${colour}-${shade}{accent-color:rgb(${colours[colour][shade]})}`;
        }
      }

      /* .bg-gray-50{--tw-bg-opacity:1;background-color:rgb(249 250 251 / var(--tw-bg-opacity))}
      .bg-gray-900{--tw-bg-opacity:1;background-color:rgb(17 24 39 / var(--tw-bg-opacity))}
      .bg-indigo-600{--tw-bg-opacity:1;background-color:rgb(79 70 229 / var(--tw-bg-opacity))}
      .bg-red-600{--tw-bg-opacity:1;background-color:rgb(220 38 38 / var(--tw-bg-opacity))}
      .bg-white{--tw-bg-opacity:1;background-color:rgb(255 255 255 / var(--tw-bg-opacity))}
      

      .border-gray-300{--tw-border-opacity:1;border-color:rgb(209 213 219 / var(--tw-border-opacity))}
      .border-gray-900\\/10{border-color:rgb(17 24 39 / 0.1)}

      .hover\\:bg-gray-700:hover{--tw-bg-opacity:1;background-color:rgb(55 65 81 / var(--tw-bg-opacity))}
      .hover\\:bg-indigo-500:hover{--tw-bg-opacity:1;background-color:rgb(99 102 241 / var(--tw-bg-opacity))}
      .hover\\:bg-red-500:hover{--tw-bg-opacity:1;background-color:rgb(239 68 68 / var(--tw-bg-opacity))}
      .focus\\:ring-indigo-600:focus{--tw-ring-opacity:1;--tw-ring-color:rgb(79 70 229 / var(--tw-ring-opacity))}*/

      return `<style scoped>${`/* ! tailwindcss v3.3.1 | MIT License | https://tailwindcss.com */*,::after,::before{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}::after,::before{--tw-content:''}html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;tab-size:4;font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,pre,samp{font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}[type=button],[type=reset],[type=submit],button{-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}menu,ol,ul{list-style:none;margin:0;padding:0}textarea{resize:vertical}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}[role=button],button{cursor:pointer}:disabled{cursor:default}audio,canvas,embed,iframe,img,object,svg,video{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]{display:none}*, ::before, ::after{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::-webkit-backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgb(59 130 246 / 0.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: }.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-x-0{left:0px;right:0px}.-top-40{top:-10rem}.left-\\[calc\\(50\\%-11rem\\)\\]{left:calc(50% - 11rem)}.left-\\[max\\(-7rem\\2c calc\\(50\\%-52rem\\)\\)\\]{left:max(-7rem,calc(50% - 52rem))}.left-\\[max\\(45rem\\2c calc\\(50\\%\\+8rem\\)\\)\\]{left:max(45rem,calc(50% + 8rem))}.top-1\\/2{top:50%}.isolate{isolation:isolate}.-z-10{z-index:-10}.z-10{z-index:10}.mx-2{margin-left:0.5rem;margin-right:0.5rem}.mx-auto{margin-left:auto;margin-right:auto}.mt-1{margin-top:0.25rem}.mt-10{margin-top:2.5rem}.mt-6{margin-top:1.5rem}.block{display:block}.inline{display:inline}.flex{display:flex}.aspect-\\[1155\\/678\\]{aspect-ratio:1155/678}.aspect-\\[577\\/310\\]{aspect-ratio:577/310}.h-0{height:0px}.h-0\\.5{height:0.125rem}.h-4{height:1rem}.h-6{height:1.5rem}.w-0{width:0px}.w-0\\.5{width:0.125rem}.w-4{width:1rem}.w-\\[36\\.0625rem\\]{width:36.0625rem}.w-\\[36\\.125rem\\]{width:36.125rem}.w-full{width:100%}.max-w-2xl{max-width:42rem}.max-w-7xl{max-width:80rem}.flex-none{flex:none}.-translate-x-1\\/2{--tw-translate-x:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.-translate-y-1\\/2{--tw-translate-y:-50%;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.rotate-\\[30deg\\]{--tw-rotate:30deg;transform:translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.transform-gpu{transform:translate3d(var(--tw-translate-x), var(--tw-translate-y), 0) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.justify-center{justify-content:center}.gap-x-3{column-gap:0.75rem}.gap-x-4{column-gap:1rem}.gap-x-6{column-gap:1.5rem}.gap-y-2{row-gap:0.5rem}.space-y-10 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(2.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(2.5rem * var(--tw-space-y-reverse))}.space-y-12 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(3rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(3rem * var(--tw-space-y-reverse))}.space-y-6 > :not([hidden]) ~ :not([hidden]){--tw-space-y-reverse:0;margin-top:calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.5rem * var(--tw-space-y-reverse))}.overflow-hidden{overflow:hidden}.rounded{border-radius:0.25rem}.rounded-full{border-radius:9999px}.rounded-md{border-radius:0.375rem}.border-b{border-bottom-width:1px}.bg-gradient-to-tr{background-image:linear-gradient(to top right, var(--tw-gradient-stops))}.from-\\[\\#ff80b5\\]{--tw-gradient-from:#ff80b5 var(--tw-gradient-from-position);--tw-gradient-from-position: ;--tw-gradient-to:rgb(255 128 181 / 0)  var(--tw-gradient-from-position);--tw-gradient-to-position: ;--tw-gradient-stops:var(--tw-gradient-from), var(--tw-gradient-to)}.to-\\[\\#9089fc\\]{--tw-gradient-to:#9089fc var(--tw-gradient-to-position);--tw-gradient-to-position: }.fill-current{fill:currentColor}.p-10{padding:2.5rem}.px-3{padding-left:0.75rem;padding-right:0.75rem}.px-3\\.5{padding-left:0.875rem;padding-right:0.875rem}.px-6{padding-left:1.5rem;padding-right:1.5rem}.py-1{padding-top:0.25rem;padding-bottom:0.25rem}.py-2{padding-top:0.5rem;padding-bottom:0.5rem}.py-2\\.5{padding-top:0.625rem;padding-bottom:0.625rem}.py-32{padding-top:8rem;padding-bottom:8rem}.py-6{padding-top:1.5rem;padding-bottom:1.5rem}.pb-0{padding-bottom:0px}.pb-12{padding-bottom:3rem}.pb-4{padding-bottom:1rem}.pt-14{padding-top:3.5rem}.p-x{padding:2px 5px 2px 5px}.text-center{text-align:center}.text-4xl{font-size:2.25rem;line-height:2.5rem}.text-base{font-size:1rem;line-height:1.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:0.875rem;line-height:1.25rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-semibold{font-weight:600}.leading-6{line-height:1.5rem}.leading-7{line-height:1.75rem}.leading-8{line-height:2rem}.tracking-tight{letter-spacing:-0.025em}.text-gray-500{--tw-text-opacity:1;color:rgb(107 114 128 / var(--tw-text-opacity))}.text-gray-600{--tw-text-opacity:1;color:rgb(75 85 99 / var(--tw-text-opacity))}.text-gray-900{--tw-text-opacity:1;color:rgb(17 24 39 / var(--tw-text-opacity))}.text-indigo-600{--tw-text-opacity:1;color:rgb(79 70 229 / var(--tw-text-opacity))}.text-white{--tw-text-opacity:1;color:rgb(255 255 255 / var(--tw-text-opacity))}.opacity-30{opacity:0.3}.shadow-sm{--tw-shadow:0 1px 2px 0 rgb(0 0 0 / 0.05);--tw-shadow-colored:0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)}.blur-2xl{--tw-blur:blur(40px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.blur-3xl{--tw-blur:blur(64px);filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.drop-shadow-lg{--tw-drop-shadow:drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.focus-visible\\:outline:focus-visible{outline-style:solid}.focus-visible\\:outline-2:focus-visible{outline-width:2px}.focus-visible\\:outline-offset-2:focus-visible{outline-offset:2px}.focus-visible\\:outline-gray-900:focus-visible{outline-color:#111827}.focus-visible\\:outline-indigo-600:focus-visible{outline-color:#4f46e5}.focus-visible\\:outline-red-600:focus-visible{outline-color:#dc2626}@media (min-width: 640px){.sm\\:-top-80{top:-20rem}.sm\\:left-\\[calc\\(50\\%-30rem\\)\\]{left:calc(50% - 30rem)}.sm\\:w-\\[72\\.1875rem\\]{width:72.1875rem}.sm\\:px-3{padding-left:0.75rem;padding-right:0.75rem}.sm\\:px-3\\.5{padding-left:0.875rem;padding-right:0.875rem}.sm\\:px-6{padding-left:1.5rem;padding-right:1.5rem}.sm\\:py-48{padding-top:12rem;padding-bottom:12rem}.sm\\:text-6xl{font-size:3.75rem;line-height:1}.sm\\:before\\:flex-1::before{content:var(--tw-content);flex:1 1 0%}}@media (min-width: 1024px){.lg\\:px-8{padding-left:2rem;padding-right:2rem}.lg\\:py-56{padding-top:14rem;padding-bottom:14rem}}.bg-gradient-to-r{background-image:linear-gradient(to right, var(--tw-gradient-stops))}`}${output}</style>`;
    }
    if (layoutpart === "header")
      return (
        `<div class="fixed l-0 r-0 z-10 isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1 drop-shadow-lg bg-white inset-x-0">` +
        `<div class="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">` +
        `<div class="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"` +
        ` style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)">` +
        `</div></div>` +
        `<div class="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl" aria-hidden="true">` +
        `<div class="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"` +
        ` style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)">` +
        `</div></div>` +
        `<div class="flex flex-wrap items-center gap-x-4 gap-y-2 w-full justify-center">` +
        `<p class="text-sm leading-6 text-gray-900">` +
        `<strong class="font-semibold">v<span class="app_version">${
          storage.version
        }</span></strong><svg viewBox="0 0 2 2" class="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">` +
        `<circle cx="1" cy="1" r="1" /></svg>${meta.msg}</p>` +
        `<a target="_blank" href="${meta.link}"` +
        ` class="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900">` +
        `${meta.linkMsg}<span aria-hidden="true">&rarr;</span></a>` +
        `</div></div>`
      );

    if (layoutpart === "banner")
      return (
        `<div class="relative isolate px-6 pt-14 lg:px-8 pb-4" id="fbhrr-headerBanner" style="display: block;">` +
        `<div class="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">` +
        `<div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"` +
        ` style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)">` +
        `</div></div>` +
        `<div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 pb-0">` +
        `<div class="text-center">` +
        (meta.notif === undefined
          ? ""
          : `<div class="flex-none rounded-full bg-${meta.notif.colour}-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-${meta.notif.colour}-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${meta.notif.colour}-900">${meta.notif.text}</div>`) +
        `<h1 class="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">${meta.title}</h1>` +
        `<p class="mt-6 text-lg leading-8 text-gray-600">${meta.desc}</p>` +
        `<div class="mt-10 flex items-center justify-center gap-x-6">` +
        `<button id="fbhrr-goConfigure" class="rounded-md bg-${meta.colour}-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-${meta.colour}-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${meta.colour}-600">` +
        `${meta.btn}</button><a target="_blank" id="fbhrr-learnlink" href="${
          meta.link ?? "javascript:;"
        }"` +
        ` class="text-sm font-semibold leading-6 text-gray-900"> ${meta.linkMsg} <span aria-hidden="true">→</span></a>` +
        `</div></div>` +
        (meta.showLangs !== false
          ? `<div class="text-center">` +
            `<div class="mt-10 flex items-center justify-center gap-x-6">` +
            `<div class="mt-6 text-sm leading-6 text-gray-600 block">- Supported languages -</div>` +
            `</div><div class="flex items-center justify-center gap-x-6">` +
            `<div class="text-sm leading-6 text-gray-600 block" id="fbhrr-langs-list">${Object.keys(
              langs
            )
              .map((x) => langs[x].name)
              .join(
                '<svg viewBox="0 0 2 2" class="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg>'
              )}</div>` +
            `</div></div>`
          : "") +
        (meta.desc2 !== undefined
          ? `<div class="text-center"><div class="mt-10 flex items-center justify-center gap-x-6"></div>` +
            `<div class="flex items-center justify-center gap-x-6">` +
            `<div class="text-sm leading-6 text-gray-600 block" id="fbhrr-langs-list">${meta.desc2}</div>` +
            `</div></div>`
          : "") +
        (meta.showChangelog === true &&
        Logs.filter((x) => x.version === storage.version)
          .length > 0
          ? `<div class="text-center">` +
            `<div class="mt-10 flex items-center justify-center gap-x-6">` +
            `<div class="mt-6 text-sm leading-6 text-gray-600 block">- Changes in v${
              storage.version
            } -</div>` +
            `</div><div class="flex items-center justify-center gap-x-6">` +
            Logs.filter(
              (x) => x.version === storage.version
            ).map((x) => {
              return `<div class="text-sm leading-6 text-gray-600 block">${x.changes
                .map((xc) => {
                  return `(${xc.type}) ${xc.description}`;
                })
                .join(
                  '<svg viewBox="0 0 2 2" class="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg>'
                )}</div>`;
            }) +
            `</div></div>`
          : "") +
        `</div></div>`
      );
    if (layoutpart === "form") {
      const isFieldNew = (version: string) => {
        let currentVersion = storage.version;
        let currentVersionSplit = currentVersion
          .split(".")
          .map((x: string) => Number.parseInt(x));
        let fieldVersionSplit = version
          .split(".")
          .map((x) => Number.parseInt(x));
        if (currentVersionSplit[0] > fieldVersionSplit[0]) return false;
        if (currentVersionSplit[1] > fieldVersionSplit[1]) return false;
        if (currentVersionSplit[2] > fieldVersionSplit[2]) return false;
        return true;
      };
      let output =
        `<div id="fbhrr-configureForm" class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8" style="display:block;">` +
        `<div class="space-y-12 p-10"><div class=""><div class="border-b border-gray-900/10 pb-12">` +
        `<h2 class="text-base font-semibold leading-7 text-gray-900">${meta.title}</h2>` +
        `<p class="mt-1 text-sm leading-6 text-gray-600">${meta.desc}</p></div>`;
      for (let formIndex = 0; formIndex < meta.forms.length; formIndex++) {
        output +=
          `<div class="mt-10 space-y-10 ${
            formIndex < meta.forms.length - 1
              ? "border-b border-gray-900/10 pb-12"
              : ""
          }"><fieldset>` +
          `<legend class="text-sm font-semibold leading-6 text-gray-900">${meta.forms[formIndex].title}</legend><div class="mt-6 space-y-6">`;
        for (let formField of meta.forms[formIndex].fields) {
          if (formField.type === "checkbox")
            output +=
              `<div class="relative flex gap-x-3">` +
              `<div class="flex h-6 items-center">` +
              `<input type="checkbox" class="cb-green-600" id="fbhrr-${formField.id}" name="${formField.id}"` +
              ` class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600">` +
              `</div><div class="text-sm leading-6">` +
              `<label for="reels" class="font-medium text-gray-900">${formField.title}<span id="fbhrr-${formField.id}-note"></span>` +
              (formField.addedInVersion !== undefined &&
              isFieldNew(formField.addedInVersion)
                ? `<div class="flex-none tag rounded-full bg-blue-500 px-3.5 py-1 font-semibold text-white shadow-sm">NEW IN v${formField.addedInVersion}</div>`
                : "") +
              `</label>` +
              `<p class="text-gray-500">${formField.desc}</p>` +
              `</div></div>`;
          else if (formField.type === "button")
            output +=
              `<div class="relative flex gap-x-3"><div class="flex h-6 items-center">` +
              `<button id="fbhrr-${formField.id}" name="${formField.id}"` +
              ` class="rounded-md bg-${formField.colour}-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-${formField.colour}-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${formField.colour}-600">` +
              `${formField.title}</button></div>` +
              `<div class="text-sm leading-6"><p class="text-gray-500">${formField.desc}</p></div></div>`;
        }
        output += `</div></fieldset></div>`;
      }
      output += `</div></div></div>`;
      return output;
    }
    return "";
  }
  public static async createPopup(meta: SystemConfigSystemPopup) {
    await storage.setup();
    let output = "";
    if (meta.css) output += await Notif.generate("css", meta.css);
    if (meta.header) output += await Notif.generate("header", meta.header);
    if (meta.banner) output += await Notif.generate("banner", meta.banner);
    if (meta.form) output += await Notif.generate("form", meta.form);
    return output;
  }
}
