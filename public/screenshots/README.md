# Responsive project screenshots

Generated from the original project PNGs by `npm run images:generate` using Sharp 0.34.5. These previews use WebP quality 86, preserve aspect ratios, and never enlarge the source. The original screenshots remain in the repository; IsdaLog walkthrough links still open the full-resolution PNG.

Widths are 480, 800, 1200, and up to 1600 pixels, limited by the source dimensions. `src/data/screenshots.json` records dimensions, byte sizes, source hashes, and candidates. `ResponsiveScreenshot` supplies `srcset`, layout-specific `sizes`, actual dimensions, and asynchronous decoding. Explore and home images remain lazy-loaded; case-study hero images load eagerly.

After replacing a source PNG, regenerate the previews and rebuild. The build verification rejects stale source hashes, missing previews, incorrect dimensions, upscaled candidates, or changed aspect ratios. Generated WebP files are regular Git assets so static deployments receive real image bytes rather than LFS pointers.
