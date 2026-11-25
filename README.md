# AI Delivery Manager Academy

Learn to plan and deliver AI-enabled products in short sessions. The academy has 150 topics across 16 chapters, spanning AI foundations, prompting, RAG, agents, evaluation, governance, security, operations, adoption and delivery management.

**Live app:** https://alex-sirenka.github.io/ai-delivery/

## Learning features

- Choose the complete curriculum or a goal-based path: AI delivery foundations, RAG, agents or production readiness.
- Take a five-question placement check to identify familiar sample topics and get a starting-path recommendation.
- Study one or two new topics per session, then complete a single-choice knowledge check.
- Correct answers schedule reviews at 1, 3, 7 and 21 days; missed answers return the topic the next day.
- Save practice notes locally, use the glossary, browse source links and earn chapter milestones.
- Download a learning summary and export/import all progress to continue on another device.
- Install on mobile and continue offline after the app has loaded once.

The materials are intended for delivery managers, not as a substitute for specialist engineering, security, privacy or legal advice. Source links are further reading; product documentation and regulation can change. Existing topics still need a named subject-matter review, and their fact-check dates are explicitly shown as unrecorded until that work is completed.

Scenarios are realistic composites, not real client cases; numbers are illustrative.

## Files and maintenance

- `index.html` contains the page structure and styles.
- `curriculum.js` contains the original topic catalogue.
- `curriculum-extra.js` contains new topics, source maps, paths and glossary entries.
- `learning-core.js` holds pure quiz, review-scheduling and import-validation logic.
- `app.js` contains the browser application.
- `sw.js` caches the static app files for offline use.

When adding a topic, keep the fields `ch`, `t`, `m`, `s`, `h`, `tl`, `x` and `q`; assign a subject-matter owner and record fact-check dates before publishing a reviewed status. Update the service-worker cache list when adding a static runtime file.

Run the dependency-free checks with:

```powershell
npm test
```

## Deployment

GitHub Pages serves the repository root of the `main` branch at the live URL above. No build step is required.

Run `npm test` before publishing, commit the updated static files (including `.nojekyll` and all runtime JavaScript files), and push to `main`. Wait for the GitHub Pages deployment to finish before checking the live app.

Asset links, the installable app's start URL and the service worker are relative, so they remain within `/ai-delivery/`. Existing browser progress is retained when updating at the same URL. If an already-open tab still shows the previous version, reload it after deployment; do not clear site data, which also removes saved progress.
