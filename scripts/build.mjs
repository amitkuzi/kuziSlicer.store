import { cp, mkdir, readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { loadCatalog, validateCatalog } from './catalog-lib.mjs';

const output = resolve('dist');
const catalog = await loadCatalog(resolve('catalog/plugins.json'));
const errors = validateCatalog(catalog);
if (errors.length) throw new Error(`Refusing to build an invalid catalog:\n${errors.join('\n')}`);

await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, 'catalog'), { recursive: true });
await mkdir(resolve(output, 'schema'), { recursive: true });
await cp(resolve('site'), output, { recursive: true });
await cp(resolve('catalog/plugins.json'), resolve(output, 'catalog/plugins.json'));
await cp(resolve('schema/catalog.schema.json'), resolve(output, 'schema/catalog.schema.json'));
const html = await readFile(resolve(output, 'index.html'), 'utf8');
if (!html.includes('kuziSlicer Plugin Store')) throw new Error('Generated site is missing its title');
console.log(`Built ${catalog.plugins.length} plugin entries into ${output}`);
