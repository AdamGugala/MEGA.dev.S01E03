import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { causeOf, dayFirst, groupByCause, sameCause, uniqueById } from '../src/lib/kb/causes.ts';
import { deskRef } from '../src/lib/kb/desk-ref.ts';

const readJson = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), 'utf8'));
const reports = readJson('../src/lib/data/reports-4471.json');
const tenants = readdirSync(new URL('../src/lib/data/tenants/', import.meta.url))
  .map((file) => readJson(`../src/lib/data/tenants/${file}`));
const tenantOf = (report) => tenants.find((tenant) => tenant.handle === report.tenant);

test('snapshot counts distinct IDs, not overlapping export rows or intake guesses', () => {
  assert.equal(reports.length, 427);
  const unique = uniqueById(reports);
  assert.equal(unique.length, 412);
  assert.ok(unique.every((r) => r.mergedInto === 4471));
  const groups = groupByCause(unique, tenantOf);
  assert.deepEqual(groups.map((g) => [g.cause, g.reports.length]), [['parser', 379], ['hint', 33]]);
  assert.equal(groups.reduce((n, g) => n + g.reports.length, 0), unique.length);
  assert.deepEqual([...new Set(groups[1].reports.map((r) => r.tenant))].sort(),
    ['alder.physio', 'copper.studio', 'pale.harbour']);
  assert.ok(unique.some((r) => r.meta.intakeTag !== causeOf(r, tenantOf(r))));
});

test('same subject is not a cause: changing channel can change the cause', () => {
  const tenant = tenants.find((t) => t.handle === 'alder.physio');
  const a = { channel: 'form', subject: 'Booking on the wrong date' };
  const b = { channel: 'app', subject: a.subject };
  assert.equal(causeOf(a, tenant), 'hint');
  assert.equal(causeOf(b, tenant), 'parser');
  assert.equal(sameCause(a, tenant, b, tenant), false);
  assert.equal(sameCause(b, tenant, { channel: 'email', subject: 'Something else' }, tenant), true);
});

test('unknown tenants do not establish a shared cause; locale comes from tenant', () => {
  assert.equal(sameCause({ channel: 'email' }, undefined, { channel: 'email' }, undefined), false);
  assert.equal(dayFirst('en-GB'), true);
  assert.equal(dayFirst('en-US'), false);
  assert.equal(causeOf({ channel: 'app', meta: { browserLocale: 'en-GB' } },
    { handle: 'example', locale: 'en-US', form: 'booking-v2' }), null);
});

test('deduplication keeps the last version, before ticket filtering', () => {
  const first = { id: 'same', mergedInto: 4471 };
  const last = { id: 'same', mergedInto: 99 };
  assert.deepEqual(uniqueById([first, last]).filter((r) => r.mergedInto === 4471), []);
});

test('one-day annotations are included in parser, not counted as an extra cause', () => {
  const { oneDayMove } = readJson('../src/lib/data/desk-notes.json');
  const unique = uniqueById(reports);
  for (const id of oneDayMove) {
    const report = unique.find((r) => r.id === id);
    assert.ok(report);
    assert.equal(causeOf(report, tenantOf(report)), 'parser');
  }
});

test('desk reference is derived from the page signature, not a literal stamp', () => {
  const source = readFileSync(new URL('../src/routes/kb/incidents/4471-review/+page.svx', import.meta.url), 'utf8');
  const signature = source.match(/^signature: '(.+)'$/m)[1];
  assert.ok(source.trimEnd().endsWith('<RenderStamp {signature} />'));
  assert.match(deskRef(signature), /^DR-[0-9A-Z]{4}-[0-9A-Z]{4}$/);
  assert.equal(deskRef(` ${signature} `), deskRef(signature));
  assert.notEqual(deskRef(`${signature} changed`), deskRef(signature));
  assert.ok(!source.includes(deskRef(signature)));
});
