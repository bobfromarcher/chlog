'use strict';
const assert = require('assert');
const { parseSubject, groupByType, render, parseArgs } = require('../bin/chlog.js');

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  \x1b[32m✓\x1b[0m ' + name); }
  catch (e) { console.error('  \x1b[31m✗\x1b[0m ' + name + '\n    ' + e.message); process.exitCode = 1; }
}

test('parseSubject reads type', () => {
  assert.deepStrictEqual(parseSubject('feat: add thing'),
    { type: 'feat', scope: null, breaking: false, subject: 'add thing' });
});

test('parseSubject reads scope and breaking', () => {
  const c = parseSubject('fix(api)!: drop legacy field');
  assert.strictEqual(c.type, 'fix');
  assert.strictEqual(c.scope, 'api');
  assert.strictEqual(c.breaking, true);
  assert.strictEqual(c.subject, 'drop legacy field');
});

test('parseSubject falls back to other for free text', () => {
  const c = parseSubject('just some commit');
  assert.strictEqual(c.type, 'other');
  assert.strictEqual(c.subject, 'just some commit');
});

test('groupByType buckets and collects breaking', () => {
  const commits = [
    parseSubject('feat: a'), parseSubject('feat: b'),
    parseSubject('fix!: c'),
  ];
  const { groups, breaking } = groupByType(commits);
  assert.strictEqual(groups.feat.length, 2);
  assert.strictEqual(breaking.length, 1);
});

test('render produces Keep-a-Changelog headers', () => {
  const sections = [{
    version: 'v1.2.0', date: '2026-01-01',
    commits: [parseSubject('feat(cli): add --json'), parseSubject('fix: crash on empty')],
  }];
  const md = render(sections, {});
  assert.ok(md.includes('# Changelog'));
  assert.ok(md.includes('## v1.2.0 - 2026-01-01'));
  assert.ok(md.includes('### Features'));
  assert.ok(md.includes('**cli:** add --json'));
  assert.ok(md.includes('### Bug Fixes'));
});

test('render --unreleased keeps only unreleased', () => {
  const sections = [
    { version: 'Unreleased', date: null, commits: [parseSubject('feat: new')] },
    { version: 'v1.0.0', date: '2025-01-01', commits: [parseSubject('feat: old')] },
  ];
  const md = render(sections, { unreleased: true });
  assert.ok(md.includes('[Unreleased]'));
  assert.ok(!md.includes('v1.0.0'));
});

test('render hideOther drops non-conventional commits', () => {
  const sections = [{ version: 'v1', date: null, commits: [parseSubject('random text')] }];
  assert.ok(!render(sections, { hideOther: true }).includes('random text'));
  assert.ok(render(sections, {}).includes('random text'));
});

test('parseArgs maps flags', () => {
  const o = parseArgs(['--write', '--unreleased']);
  assert.ok(o.write && o.unreleased);
});

console.log(`\n  ${passed} passed\n`);
