# Locally served IBM Plex fonts

The WOFF2 files are Latin and Latin Extended subsets of IBM Plex Sans (variable weights 400–700), IBM Plex Mono (400 and 500), and IBM Plex Serif (italic 400), obtained from Google Fonts on 13 October 2026. Their accompanying SIL Open Font License files are included here.

Source stylesheet: https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400..700&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Serif:ital,wght@1,400&display=swap

The matching `@font-face` declarations in `src/fonts.css` preserve the subset Unicode ranges and use `font-display: swap`. The main Latin Sans font is preloaded. Other subsets and faces load when needed; the page no longer waits for a third-party font stylesheet.
