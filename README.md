# This extension hides Reels and recommendations on Facebook.com

This extension looks for certain keys in Facebooks feed and hides elements that contain `Reels and short videos` and `Suggested for you`.

It places a small banner in the items place to let you know what was hidden.

Chrome web store: [https://chrome.google.com/webstore/detail/mgfdapnedjhfmhcaglenpnjaocjpfplj/](https://chrome.google.com/webstore/detail/mgfdapnedjhfmhcaglenpnjaocjpfplj/)  
Firefox web store: [https://addons.mozilla.org/en-US/firefox/addon/fb-hide-recomm-and-reels/](https://addons.mozilla.org/en-US/firefox/addon/fb-hide-recomm-and-reels/)
  
#### ** Note chrome extension has been republished under a new ID  
  
# Adding a new language  

Add your language via editing the `langs.ts` file with your language [/src/content/langs.ts](https://github.com/mrinc/Facebook-Hide-Recommendations-and-Reels/edit/master/src/lib/langs.ts)  
Make a pull request back into master and we'll check and merge it  

# Building package

Run `build-package.sh` and it will compile the extensions into the `dist/packed` dir.  
Requirements: Typescript, NodeJS  