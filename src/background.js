(chrome || browser).runtime.onInstalled.addListener((details) => {
  if (["install", "update"].includes(details.reason)) {
    // execute for every new installation or new version
    const feedbackFormUrl =
      "https://forms-za.betterportal.cloud/a95bdc16-e1fb-4cbe-8498-e3001730418c"; // to make it work for both new and old users
    if ((chrome || browser).runtime.setUninstallURL) {
      (chrome || browser).runtime.setUninstallURL(feedbackFormUrl); // set url that will be desplayed when user uninstalls extension
    } // eg feedback form on your website or Google Forms
  }
});