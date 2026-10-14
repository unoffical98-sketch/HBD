# Birthday Surprise 💗

A step-by-step romantic birthday website. No backend, no accounts.

## Run it in VS Code
1. Install VS Code, then open the **Extensions** panel (Ctrl+Shift+X) and install **Live Server** (by Ritwick Dey).
2. **File → Open Folder…** and choose the `birthday-surprise` folder.
3. Right-click `index.html` in the left file list → **Open with Live Server**.
4. The site opens in your browser. Saving a file refreshes it automatically.

## Folder structure
```
birthday-surprise/
├── index.html   (page structure)
├── style.css    (look & animations)
├── script.js    (settings at the top + logic)
└── assets/
    ├── images/  (moment1.jpg … moment4.jpg)
    └── audio/   (background-music.mp3)
```
If `assets` folders are missing: in VS Code click the **New Folder** icon in the Explorer and create `assets`, then `images` and `audio` inside it.

## Add your four photos
Copy your pictures into `assets/images/` and name them exactly `moment1.jpg`, `moment2.jpg`, `moment3.jpg`, `moment4.jpg`. (Other names or `.png` files: change the `file:` values in `CONFIG.photos`.) Missing photos show a pink placeholder.

## Add your music
Put an MP3 in `assets/audio/` named `background-music.mp3`. Music starts when you press **Start Our Surprise**; if the browser blocks it, use the 🎵 button (bottom right).

## What to edit (top of `script.js`)
| Variable | What it changes |
|---|---|
| `birthdayAge` | Age shown after the cake is cut |
| `CONFIG.name` | Name in the greeting |
| `CONFIG.greeting`, `welcomeMessage` | Opening texts |
| `CONFIG.gate` | The first question |
| `CONFIG.quiz` | The five quiz questions |
| `CONFIG.photos` | Photo filenames and captions |
| `loveLetterMessage`, `CONFIG.letterSignature` | The love letter |

### Editing questions
Each question looks like this:
```js
{ q: "Your question?", options: ["A", "B", "C", "D"], answer: 1, right: "Yay!", wrong: "Try again 💕" }
```
`answer` is the position of the correct option **counting from 0** (0 = first, 1 = second…). Keep the commas and quotes. Keep exactly 5 questions in `CONFIG.quiz`.

### Editing the love letter (max 200 words)
- **Permanent:** change `loveLetterMessage` in `script.js` (use `\n` for a new line). Words after 200 are cut automatically.
- **On the page:** on the last screen press **✏️ Edit letter**, type or paste, watch the live word counter, then **Save**. The editor blocks going over 200 words.
- **Persistence:** on-page edits are kept for the current browser tab (they survive a refresh) but are lost when you close the tab. For permanent changes, edit `script.js`.

## Notes
- Restart (top left) returns to the countdown; music keeps playing.
- Back goes to the previous screen without losing quiz progress.
- Prefer less motion? Your system's "reduce motion" setting skips the countdown and fireworks.
