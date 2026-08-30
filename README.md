# Gargari Quiz

Tournament-based trivia app — "adventures" theme, high-energy game feel rather than a form.

The repo holds two things:

| Folder | What it is |
| --- | --- |
| `design/` | The hi-fi design source, imported 1:1 from the Claude Design project. Plain HTML + JSX + CSS, opens in a browser, pan/zoom canvas with all six screens side by side. This is the visual source of truth. |
| `app/`, `src/` | The real app — Expo / React Native, expo-router. |

## Design system

Adventures palette, light. Paper-cream backgrounds, deep forest green, coral accent, gold tokens.

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#F2E9D5` | Page background |
| `cream` | `#FAF4E5` | Recessed surfaces |
| `surface` | `#FFFFFF` | Cards |
| `ink` | `#181512` | Text, dark cards, tab bar |
| `forest` | `#144132` | Primary action, correct answer |
| `coral` | `#FF4D2E` | Urgency, live, wrong answer |
| `gold` | `#F0B23E` | Tokens, rewards, first place |

Rules that give it the signature look:

- **Border radius is either `0` or `24`.** Never anything in between. Adjacent elements deliberately alternate.
- **Thick borders.** `2–3px` of `rgba(24,21,18,0.85)` on every interactive surface.
- **Tactile shadow.** A hard `0 4px 0` offset under buttons and cards, which collapses to `0 1px 0` while pressed. In React Native this is a sibling `View` behind the element — RN has no hard box-shadow.
- **Type.** Bebas Neue (condensed, uppercase) for titles; Space Grotesk for UI.
- **Mesh gradient background.** Slow-drifting radial blobs, always alive behind the content.
- **Frosted glass** for reward and prize callouts.

## Screens

1. **Arena** (home) — Grand Tournament card with live countdown + prize art, horizontal category scroll, live battle list, glowing token balance.
2. **Quiz** — 5-second depleting progress bar, central media box (the anti-AI question format), four tactile answer buttons with spring press.
3. **Leaderboard** — your rank banner, podium, live rank list with fire icons for streaks.
4. **Wallet & Store** — balance hero, token pack grid, one-tap buy, activity log.
5. **Victory** / 6. **Defeat** — end states with animated trophy and cracked compass.

## Running

The app:

```bash
npm install
```

```bash
npm start
```

The design canvas (any static server works):

```bash
npm run design
```

Then open `Gargari Quiz.html`. It pulls React and Babel from a CDN, so it needs a network connection but no build step.

Types and tests:

```bash
npm run typecheck
```

```bash
npm test
```

The suites cover the token economy and number formatting — the parts with rules
rather than layout. They run under `node --test` with type stripping, no test
framework installed.

## State

One zustand store (`src/store/game.ts`), persisted to AsyncStorage: token
balance, points, streak, a ledger of every charge and credit, round history and
which tournaments have been paid into. Every screen reads from it, so the
balance in the arena header and the balance in the wallet cannot disagree.

Its shape is deliberately what a `GET /me` would return, so the store becomes
the response type when there is a server.

## Localisation

Georgian and English, switchable from the profile tab and persisted with the
rest of the state. Georgian is the default.

`src/i18n/en.ts` defines both the English copy and the type every other locale
has to satisfy — a missing or renamed key is a compile error, never a blank
label. Strings that interpolate are functions rather than templates with
placeholders, so word order stays the translator's decision.

Two things the script forces, handled in `src/theme/`:

- **Fonts.** Neither Bebas Neue nor Space Grotesk has Georgian glyphs; set
  either one and every character renders as a box. Noto Sans Georgian covers
  both roles, with the heaviest weight standing in for the condensed display
  face. Both scripts load at startup so switching never shows boxes.
- **Case and fit.** Georgian has no uppercase, so the small-caps treatment on
  labels is dropped and the tracking pulled in. Titles are scaled to about 72%
  of the English size, since Noto is far wider than Bebas and would otherwise
  clip. Call sites keep asking for `size={48}`; `typeMetrics` does the rest.

Question text lives with the questions in `src/data/questions.ts` rather than in
the string tables — it is content, and a server will return it the same way.

Numbers are grouped by `src/lib/number.ts` rather than `toLocaleString()`, which
reads the device locale and would otherwise print "12,408" next to "3 402" on
the same screen.

## Web → React Native mapping

The design is CSS; several of its effects have no direct RN equivalent. What was substituted:

| Design (CSS) | React Native |
| --- | --- |
| `backdrop-filter: blur()` | `expo-blur` `BlurView` |
| Animated mesh gradient | Layered `expo-linear-gradient` + Reanimated loop |
| `box-shadow: 0 4px 0` | Offset sibling `View` behind the element |
| CSS `@keyframes` | `react-native-reanimated` |
| Inline `<svg>` | `react-native-svg` |
| Google Fonts `<link>` | `@expo-google-fonts/*` + `expo-font` |
| Confetti / ash particle fields | `lottie-react-native`, JSON generated by `tools/make-lottie.mjs` |

The two end-state Lottie files are generated rather than hand-drawn — both
are particle fields whose layers differ only in position, timing and tint.
Change the numbers in the generator and re-run it:

```bash
node tools/make-lottie.mjs
```
