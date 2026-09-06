import { resolve } from 'node:path';
import { loadCatalog, validateCatalog } from './catalog-lib.mjs';

const catalogPath = resolve('catalog/plugins.json');
const errors = validateCatalog(await loadCatalog(catalogPath));
if (errors.length) {
  console.error(`Catalog validation failed:\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`Catalog validation passed: ${catalogPath}`);
}
