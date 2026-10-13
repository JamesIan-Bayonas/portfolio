# Mobile performance review

Measured on 13 October 2026 using PageSpeed Insights' mobile Lighthouse test: emulated Moto G Power, Slow 4G throttling, Lighthouse 13.5.0, initial page load. These are individual lab runs, not field Core Web Vitals; PageSpeed reported no field data for these pages.

## Baseline

| Page | Performance | FCP | LCP | Blocking time | Layout shift | Speed index |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 90 | 2.56 s | 3.08 s | 67 ms | 0 | 2.56 s |
| Explore | 85 | 2.57 s | 3.42 s | 0 ms | 0 | 4.86 s |
| IsdaLog case study | 88 | 2.55 s | 3.30 s | 0 ms | 0 | 2.55 s |

Baseline reports: [Home](https://pagespeed.web.dev/analysis/https-jamesian-portfolio-vercel-app/5zxjjovjln?form_factor=mobile), [Explore](https://pagespeed.web.dev/analysis/https-jamesian-portfolio-vercel-app-explore/ppqqbzd3p9?form_factor=mobile), [IsdaLog](https://pagespeed.web.dev/analysis/https-jamesian-portfolio-vercel-app-projects-isdalog/h7ptopivpy?form_factor=mobile).

The common bottleneck was render-blocking requests, with estimated savings of about 1.0–1.19 seconds. The home report showed the Google Fonts stylesheet taking 750 ms. Reports also identified unused JavaScript and oversized screenshot delivery; Explore's image-delivery opportunity was estimated at 657 KiB. The home report flagged contrast in the red diff rows.

## Targeted changes

- Serve the existing IBM Plex families as local WOFF2 subsets, retaining their licenses and Unicode ranges; preload the main Latin Sans face and keep `font-display: swap`.
- Remove the third-party font stylesheet from the rendering path.
- Render the homepage headline and description immediately, keeping the illustrative terminal animation.
- Move non-hero homepage sections into a separate chunk so other routes do not load that section code. Restore home fragments after the sections mount.
- Increase diff-row text contrast in both themes.
- Add actual dimensions to the original IsdaLog walkthrough screenshots to reserve their layout space.

Validation before publication: TypeScript, all 43 tests, the production build, and the 12-page/static-font checks passed. Local mobile checks covered fonts, layout, filtering, and an expanded case-study deep link. The implementation was published in commit `cc4370e` for a comparable live retest.

## Retest

The same three pages were retested against the public deployment of `cc4370e`.

| Page | Performance before → after | FCP | LCP | Blocking time | Layout shift | Speed index |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 90 → 96 | 1.88 s | 2.10 s | 0 ms | 0 | 4.10 s |
| Explore | 85 → 96 | 1.71 s | 2.29 s | 1 ms | 0 | 3.96 s |
| IsdaLog case study | 88 → 94 | 1.97 s | 2.57 s | 53 ms | 0 | 4.05 s |

Retest reports: [Home](https://pagespeed.web.dev/analysis/https-jamesian-portfolio-vercel-app/u2ow7i8cp6?form_factor=mobile), [Explore](https://pagespeed.web.dev/analysis/https-jamesian-portfolio-vercel-app-explore/iwhy1wqdtg?form_factor=mobile), [IsdaLog](https://pagespeed.web.dev/analysis/https-jamesian-portfolio-vercel-app-projects-isdalog/eelj5xqkfl?form_factor=mobile).

All three pages painted their main content sooner. Estimated render-blocking savings fell to 300–450 ms. The IsdaLog report no longer flagged missing image dimensions. Best Practices and SEO scored 100 on each page; accessibility scored 100 on Explore and IsdaLog, and 96 on Home.

These single runs do not establish a sustained improvement for every metric: Home and IsdaLog Speed Index increased, and IsdaLog blocking time increased from 0 to 53 ms. The homepage still has a staged terminal animation. No claim of passing field Core Web Vitals is made.

The remaining Home contrast warning identified opacity applied to removed diff text. Commit `03dff1c` removes that opacity and the faded prefix, retaining the strike-through and line markers. A separate published homepage verification is recorded below.

### Final homepage verification

The [published homepage report](https://pagespeed.web.dev/analysis/https-jamesian-portfolio-vercel-app/xtg6h5vesv?form_factor=mobile), captured at 15:23 GMT+8, scored 96 for Performance and 100 for Accessibility, Best Practices, and SEO. FCP was 1.726 s, LCP 2.101 s, blocking time 0 ms, layout shift 0, and Speed Index 4.036 s. The removed diff rows no longer failed the contrast audit; their computed opacity was also checked at 1 in both light and dark themes.

This run estimated 600 ms of render-blocking savings and reported an error for the document-request-latency diagnostic. That diagnostic is not interpreted as a measured latency result. The automated accessibility score covers only its tested rules and does not replace manual keyboard and screen-reader testing.

## Remaining work

The font-update retests estimated image-delivery opportunities of 153 KiB for Home, 657 KiB for Explore, and 149 KiB for IsdaLog. The screenshot update below addresses that opportunity. Unused JavaScript estimates remain 45–55 KiB; optimize only after checking which shared features contribute to that cost.

Keep the report dates and links when comparing future changes. Repeat runs or collect real-user data before treating small timing differences as reliable trends.

## Responsive screenshot update

The four project previews and five IsdaLog walkthrough captures now have 33 WebP variants, from 480 pixels to a maximum of 1600 pixels. No source is enlarged. A shared image component supplies candidate widths, page-specific layout sizes, source aspect ratios, and asynchronous decoding. Explore and home previews retain lazy loading; case-study heroes load eagerly. Walkthrough links retain their original PNG destinations.

The four original project preview PNGs total 763,247 bytes. Their 800-pixel WebP candidates total 110,322 bytes, a reduction of 85.5%; the 480-pixel set totals 46,052 bytes. These are file-size comparisons, not a claim that every visitor downloads that exact set: selection depends on viewport width, pixel density, browser behavior, and which lazy images become visible.

Local checks confirmed 480-pixel candidates at a 390-pixel viewport and 800-pixel candidates on the tested desktop viewport. Both layouts fit without horizontal overflow. Explore search and reset worked, and the harvester/buyer walkthrough previews loaded while retaining full-resolution original links. TypeScript, 43 tests, the production build, and verification of 12 routes and all 33 preview files passed. Build verification also checks source hashes to catch stale previews after a PNG is replaced.
