const EXPAND = "↔️";
const ALLOWED_DOMAINS = [
  "https://gitlab.com/",
  "https://github.com/",
  "https://trello.com/",
];

chrome.tabs.onUpdated.addListener(function callback(id, info, tab) {
  if (tab.status !== "loading") {
    return;
  }

  if (!ALLOWED_DOMAINS.some((url) => tab.url.startsWith(url))) {
    return;
  }

  // TODO: Ensure script is injected only once
  chrome.tabs.executeScript(tab.id, {
    file: "./inject.js",
  });
});
