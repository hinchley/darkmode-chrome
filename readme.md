# Poor Mans Dark Mode

A Chromium extension (Chrome, Chromium, Edge, Brave, Vivaldi, etc.) that reduces white shock by adding a mildly darkened transparent layer over each opened web page. Pin the extension to your toolbar and click the icon to toggle the state.

This is a port of the [Firefox version](https://git.hinchley.net/hinchley/darkmode) to Manifest V3.

I have written this extension for myself, so I haven't bothered adding support for changing the colour or opacity of the overlay. Everything is hard coded.

## Install locally (Developer Mode)

1. Clone or download this folder somewhere permanent (Chromium loads the extension from this location, so don't delete or move it afterwards).
2. Open `chrome://extensions` (in Edge, `edge://extensions`; in Brave, `brave://extensions`).
3. Turn on **Developer mode** (toggle in the top-right corner; in Edge it's in the left sidebar).
4. Click **Load unpacked** and select this folder (the one containing `manifest.json`).
5. Click the puzzle-piece (Extensions) icon in the toolbar and click the pin next to **Poor Mans Dark Mode**.
6. Click the icon to toggle the overlay on or off. A ✓ badge shows when it's on.

Pages that were already open before the extension was loaded are covered as soon as you toggle it on. Browser pages (`chrome://...`) and the Chrome Web Store can't be modified by extensions, so the overlay won't appear there.

To update after changing the code, click the reload (↻) button on the extension's card in `chrome://extensions`.

## Notes

- The on/off state is kept for the browser session and resets to off when the browser is restarted (same as the Firefox version).
- Chromium doesn't support SVG icons or Firefox's `theme_icons`, so the PNGs in `icons/` are rendered from the SVGs. The extension switches between the light and dark icon based on the colour scheme reported by the current page, which follows the browser's light/dark appearance setting.

To regenerate the icons (requires `librsvg`):
```
for v in light dark; do for s in 16 32 48 128; do rsvg-convert -w $s -h $s sun-$v.svg -o icons/sun-$v-$s.png; done; done
```

To package as a zip (e.g. for the Chrome Web Store):
```
zip -r DarkMode.zip manifest.json main.js icons
```
