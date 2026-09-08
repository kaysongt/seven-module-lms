// Run against a local dev/production server: node scripts/verify-locations.mjs
import assert from "node:assert/strict";
import http from "node:http";

const locations = [
  ["chicago", "chicago.kingsword.org"],
  ["nigeria", "nigeria.kingsword.org"],
  ["calgary", "calgary.kingsword.org"],
  ["dallas", "dallas.kingsword.org"],
  ["london", "londonkingsword.org"],
];
const base = process.env.LOCAL_TEST_URL ?? "http://localhost:3000";
assert.match(new URL(base).hostname, /^(localhost|127\.0\.0\.1)$/);

function request(path, host = "localhost:3000", extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get(new URL(path, base), { headers: { host, ...extraHeaders } }, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (part) => { body += part; });
      res.on("end", () => resolve({ status: res.statusCode, body }));
    });
    req.setTimeout(60000, () => req.destroy(new Error(`Timed out: ${path}`)));
    req.on("error", reject);
  });
}

let checked = 0;
for (const [slug, host] of locations) {
  const name = slug[0].toUpperCase() + slug.slice(1);
  for (const path of ["", "/about", "/contact", "/children"]) {
    const [domain, preview] = await Promise.all([
      request(path || "/", host),
      request(`/locations/${slug}${path}`),
    ]);
    for (const response of [domain, preview]) {
      assert.equal(response.status, 200, `${host}${path}`);
      assert.match(response.body, new RegExp(`<title>[^<]*KingsWord ${name}</title>`));
      assert.ok(response.body.includes('id="main-content"'), "Skip link target exists");
      if (slug !== "chicago") assert.ok(!response.body.includes("checkout.square.site"), "Chicago giving must not leak");
      checked++;
    }
    assert.ok(preview.body.includes(`href="/locations/${slug}/contact"`), "Preview contact stays local");
    assert.ok(domain.body.includes('href="/contact"'), "Domain contact stays at root");
    assert.ok(domain.body.includes('href="https://londonkingsword.org"'), "Production location switch uses domains");
  }
  const globe = await request("/explore", host);
  assert.equal(globe.status, 200, `${host}/explore`);
  assert.ok(globe.body.includes('aria-label="Explore KingsWord locations"'));
  assert.ok(globe.body.includes('href="https://londonkingsword.org"'));
  checked++;
}

for (const host of ["localhost:3000", "chicago.kingsword.org.evil.test"]) {
  const response = await request("/", host, { "x-forwarded-host": "chicago.kingsword.org" });
  assert.equal(response.status, 200);
  assert.match(response.body, /<title>KingsWord<\/title>/);
  assert.ok(response.body.includes('href="/locations/london"'));
  checked++;
}
for (const path of ["/locations/missing", "/locations/london/missing", "/locations/london/about/extra", "/locations/london/home"]) {
  assert.equal((await request(path)).status, 404, path);
  checked++;
}
console.log(`Passed ${checked} HTTP checks: all five hosts, local routes, navigation, donation separation and invalid routes.`);
