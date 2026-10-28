// The service worker can be stopped at any time, so the toggle state lives in
// session storage (cleared when the browser exits, like the Firefox version).
let color = [99, 33, 33, 35];

async function getDarkMode() {
  const {darkMode} = await chrome.storage.session.get("darkMode");
  return !!darkMode;
}

async function toggleDarkMode() {
  const darkMode = !(await getDarkMode());
  await chrome.storage.session.set({darkMode});
  let tabs = await chrome.tabs.query({});
  for (let tab of tabs) {
    await updateDarkMode(tab, darkMode);
  }
}

function addScreen(color) {
  if (!document.getElementById("dark-mode-screen-extension")) {
    let darkModeScreen = document.createElement("div");
    darkModeScreen.id = "dark-mode-screen-extension";
    darkModeScreen.style.cssText = `width: 100%; height: 100%; position: fixed; top: 0px; left: 0px; background-color: rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] / 100}); z-index: 2147483647; pointer-events: none; mix-blend-mode: multiply;`;
    (document.body || document.documentElement).append(darkModeScreen);
  }
  return matchMedia("(prefers-color-scheme: dark)").matches;
}

function removeScreen() {
  if (document.getElementById("dark-mode-screen-extension")) document.getElementById("dark-mode-screen-extension").remove();
  return matchMedia("(prefers-color-scheme: dark)").matches;
}

async function updateDarkMode(tab, darkMode) {
  if (darkMode === undefined) darkMode = await getDarkMode();

  try {
    let [result] = await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      func: darkMode ? addScreen : removeScreen,
      args: darkMode ? [color] : []
    });
    await updateIcon(result?.result);
  } catch (e) {
    // Pages such as chrome:// and the Web Store can't be scripted.
  }

  await updateBadge(darkMode);
}

async function newTab(details) {
  if (details.frameId !== 0) return;
  await updateDarkMode(await chrome.tabs.get(details.tabId));
}

async function updatedTab(t, c, tab) {
  await updateDarkMode(tab);
}

// Chromium has no equivalent of Firefox's theme_icons, so use the colour
// scheme reported by the page to pick an icon that contrasts with the toolbar.
async function updateIcon(dark) {
  if (dark === undefined) return;
  const variant = dark ? "light" : "dark";
  await chrome.action.setIcon({path: {
    16: `icons/sun-${variant}-16.png`,
    32: `icons/sun-${variant}-32.png`
  }});
}

async function updateBadge(darkMode) {
  const text = darkMode ? "✓" : "";
  const title = darkMode ? "On" : "Off";

  await chrome.action.setBadgeText({text: text});
  await chrome.action.setTitle({title: title});
}

chrome.action.onClicked.addListener(toggleDarkMode);
chrome.tabs.onUpdated.addListener(updatedTab);
chrome.webNavigation.onDOMContentLoaded.addListener(newTab);

getDarkMode().then(updateBadge);
