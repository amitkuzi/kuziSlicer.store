import { readFile } from 'node:fs/promises';

export const allowedTypes = new Set(['engine', 'importer', 'exporter', 'tool', 'rapid printer extension']);
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const semverPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/;

export async function loadCatalog(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

export function validateCatalog(catalog) {
  const errors = [];
  if (catalog.catalogVersion !== 1) errors.push('catalogVersion must be 1');
  if (!Number.isFinite(Date.parse(catalog.updatedAt))) errors.push('updatedAt must be an ISO date-time');
  if (!Array.isArray(catalog.plugins)) return [...errors, 'plugins must be an array'];

  const ids = new Set();
  for (const [index, plugin] of catalog.plugins.entries()) {
    const at = `plugins[${index}]`;
    for (const field of ['id', 'name', 'version', 'type', 'summary', 'author', 'license', 'repository', 'manifest']) {
      if (typeof plugin[field] !== 'string' || !plugin[field].trim()) errors.push(`${at}.${field} must be a non-empty string`);
    }
    if (!idPattern.test(plugin.id ?? '')) errors.push(`${at}.id must be lowercase kebab-case`);
    if (ids.has(plugin.id)) errors.push(`${at}.id is duplicated: ${plugin.id}`);
    ids.add(plugin.id);
    if (!semverPattern.test(plugin.version ?? '')) errors.push(`${at}.version must be semantic versioning`);
    if (!allowedTypes.has(plugin.type)) errors.push(`${at}.type is unsupported: ${plugin.type}`);
    for (const field of ['repository', 'manifest', 'homepage']) {
      if (plugin[field] !== undefined) {
        try { if (new URL(plugin[field]).protocol !== 'https:') throw new Error(); }
        catch { errors.push(`${at}.${field} must be an HTTPS URL`); }
      }
    }
    if (!Array.isArray(plugin.tags) || plugin.tags.some((tag) => !idPattern.test(tag))) errors.push(`${at}.tags must contain kebab-case strings`);
    if (new Set(plugin.tags ?? []).size !== (plugin.tags ?? []).length) errors.push(`${at}.tags must be unique`);
  }
  return errors;
}
