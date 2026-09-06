# kuziSlicer.store

Static, public plugin catalog for kuziSlicer. It is designed for GitHub Pages and builds without third-party runtime dependencies.

## Quick start

```bash
npm run check
npm run build
npx serve dist
```

Open the local URL printed by `serve`. The generated site reads `catalog/plugins.json` and supports text and type filters.

## Add a plugin

1. Copy one of the demo records in `catalog/plugins.json`.
2. Give it a unique lowercase `id` and a valid semantic `version`.
3. Use an HTTPS `repository`, `manifest`, and optional `homepage` URL.
4. Run `npm run check` before opening a pull request.

The machine-readable contract is in `schema/catalog.schema.json`. The current validator deliberately implements the required subset without downloading packages, so contributors can validate from a clean Node.js installation.

## Publishing

- `ci.yml` validates, tests, and builds pushes and pull requests.
- `pages.yml` deploys `dist/` on pushes to `main`, or by manual dispatch.
- Before enabling deployment, set GitHub Pages source to **GitHub Actions** in the repository settings.

This scaffold does not create or push a GitHub repository.

## License

Repository code and documentation are licensed under GPL-3.0-only. Catalog entries retain the licenses declared by their respective plugin authors; demo entries point to the five canonical kuziSlicer plugin starter types and declare GPL-3.0-or-later.
