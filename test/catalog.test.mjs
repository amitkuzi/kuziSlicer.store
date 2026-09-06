import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { loadCatalog, validateCatalog } from '../scripts/catalog-lib.mjs';

test('demo catalog is valid and covers the starter plugin types', async () => {
  const catalog = await loadCatalog(resolve('catalog/plugins.json'));
  assert.deepEqual(validateCatalog(catalog), []);
  assert.deepEqual(new Set(catalog.plugins.map(({ type }) => type)), new Set(['engine', 'importer', 'exporter', 'tool', 'rapid printer extension']));
});

test('validator rejects duplicate ids and insecure URLs', () => {
  const plugin = {
    id: 'duplicate', name: 'Example', version: '1.0.0', type: 'tool',
    summary: 'A sufficiently descriptive example plugin.', author: 'Tester',
    license: 'GPL-3.0-only', repository: 'http://example.com/repo',
    manifest: 'https://example.com/plugin.json', tags: ['example']
  };
  const errors = validateCatalog({ catalogVersion: 1, updatedAt: new Date().toISOString(), plugins: [plugin, { ...plugin }] });
  assert.ok(errors.some((error) => error.includes('duplicated')));
  assert.ok(errors.some((error) => error.includes('HTTPS')));
});

test('validator rejects unknown plugin types', () => {
  const errors = validateCatalog({
    catalogVersion: 1,
    updatedAt: new Date().toISOString(),
    plugins: [{ id: 'bad-type', name: 'Bad', version: '1.0.0', type: 'unknown', summary: 'An invalid plugin type for testing.', author: 'Tester', license: 'GPL-3.0-only', repository: 'https://example.com/repo', manifest: 'https://example.com/plugin.json', tags: [] }]
  });
  assert.ok(errors.some((error) => error.includes('unsupported')));
});
