# Project briefs

Four one-page PDFs summarize the shared project data in `src/data/projects.ts`. Each includes the problem and audience, contribution, technologies, workflow, system structure, engineering approach, trade-off, and clickable portfolio/source links. The case-study headers expose native download links.

## Regenerate

Use Node and Python with the pinned authoring dependencies:

```sh
python -m pip install -r scripts/briefs-requirements.txt
npm run briefs:generate
```

For a separate Python installation, use `npm run briefs:generate -- --python "absolute/path/to/python"` or set `PORTFOLIO_PYTHON`.

The generator writes document outputs to ignored `output/pdf/`, copies verified PDFs here, and records source/PDF hashes in `manifest.json`. It checks one-page output, full source paragraphs, and all PDF link annotations. Sources use normalized text hashes so Windows and Linux checkouts agree. It fails if content reaches the footer link area; revise the layout before publishing rather than clipping text.

After regeneration, render every PDF to PNG with Poppler and inspect the layout. Commit the four PDFs and updated manifest. Run the normal build and `npm run verify:build`; verification rejects stale source data, missing projects, incorrect filenames, or changed PDF bytes. Hosting uses the checked-in PDFs and does not need Python.

The PDFs use standard Helvetica fonts and selectable text. All walkthrough links point to portfolio sample interactions; they do not depend on live-demo hosting.
