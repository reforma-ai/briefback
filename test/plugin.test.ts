import { expect, test } from 'bun:test';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { BRIEFBACK_SKILLS } from '../src/skills';

const root = resolve(import.meta.dir, '..');
const portableFields = [
  '$schema',
  'name',
  'version',
  'description',
  'author',
  'homepage',
  'repository',
  'license',
  'keywords',
  'extensions',
];
const schema =
  'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';

function readJson(path: string): Record<string, unknown> {
  return JSON.parse(readFileSync(path, 'utf8')) as Record<string, unknown>;
}

test('root plugin.json is a skills-only Agent Plugins 1.0 package', () => {
  const packageJson = readJson(resolve(root, 'package.json'));
  const plugin = readJson(resolve(root, 'plugin.json'));

  expect(plugin.$schema).toBe(schema);
  expect(plugin.name).toBe('briefback');
  expect(plugin.version).toBe(packageJson.version);
  for (const key of Object.keys(plugin)) {
    expect(portableFields).toContain(key);
  }

  const skills = readdirSync(resolve(root, 'skills'), {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  expect(skills).toEqual([...BRIEFBACK_SKILLS].sort());

  for (const skill of skills) {
    expect(existsSync(resolve(root, 'skills', skill, 'SKILL.md'))).toBe(true);
  }

  expect(skills).toEqual(['briefback']);

  for (const reference of [
    'research.md',
    'grill.md',
    'plan.md',
    'tdd.md',
    'review.md',
    'handoff.md',
    'document.md',
  ]) {
    expect(
      existsSync(resolve(root, 'skills', 'briefback', 'references', reference)),
    ).toBe(true);
  }
});

test('Claude overlay names the same plugin without a portable schema', () => {
  const packageJson = readJson(resolve(root, 'package.json'));
  const overlay = readJson(resolve(root, '.claude-plugin/plugin.json'));

  expect(overlay.name).toBe('briefback');
  expect(overlay.version).toBe(packageJson.version);
  expect(overlay).not.toHaveProperty('$schema');
});
