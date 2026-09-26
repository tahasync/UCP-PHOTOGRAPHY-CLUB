/**
 * QR destination smoke test.
 *
 *   1. npm run build
 *   2. npm run preview        (terminal 1)
 *   3. npm run routes         (terminal 2)
 *
 * Verifies every stable URL — every printed-card destination — returns the
 * SPA shell, including on a hard refresh / direct open.
 */

const BASE = process.env.PREVIEW_URL || 'http://localhost:4173';

const { memberRoutes } = await import('../src/data/members.js');
const { departmentRoutes } = await import('../src/data/hierarchy.js');

const staticRoutes = ['/', '/present-body', '/patrons', '/hierarchy'];
const expected = [...staticRoutes, ...departmentRoutes.map((s) => `/${s}`), ...memberRoutes.map((s) => `/${s}`)];

const check = async (route) => {
  const url = `${BASE}${route}`;
  try {
    const response = await fetch(url, { redirect: 'follow' });
    const body = await response.text();
    const isShell = body.includes('<div id="root"') || body.includes('id="root"');
    return { route, status: response.status, ok: response.ok && isShell };
  } catch (error) {
    return { route, status: 'ERR', ok: false, error: error.message };
  }
};

console.log(`Checking ${expected.length} routes against ${BASE}\n`);

const results = [];
for (const route of expected) {
  results.push(await check(route));
}

const failures = results.filter((result) => !result.ok);

for (const result of results) {
  const mark = result.ok ? 'OK  ' : 'FAIL';
  console.log(`${mark} ${String(result.status).padEnd(4)} ${result.route}`);
  if (result.error) console.log(`     ${result.error}`);
}

// The 404 route should still be served (SPA fallback), never a hard server error.
const unknown = await fetch(`${BASE}/this-route-does-not-exist`);
console.log(`\nUnknown route status: ${unknown.status} (SPA fallback keeps deep links alive)`);

if (failures.length > 0) {
  console.error(`\n${failures.length} route(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('\nAll QR destinations resolved.');
}
