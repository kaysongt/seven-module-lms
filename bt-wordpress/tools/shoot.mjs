/**
 * Full-page screenshots via the Chrome DevTools Protocol.
 *
 * A plain `--screenshot` run cannot force a color scheme or measure the real
 * document height, both of which this page needs checking in.
 *
 * Usage: node tools/shoot.mjs <file-or-url> <out.png> [--scheme light|dark] [--width 1440]
 */

import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const PORT = 9333;

const [input, outArg, ...rest] = process.argv.slice(2);
if (!input || !outArg) {
  console.error("usage: node tools/shoot.mjs <file-or-url> <out.png> [--scheme light|dark] [--width N]");
  process.exit(1);
}

const flag = (name, fallback) => {
  const i = rest.indexOf(`--${name}`);
  return i === -1 ? fallback : rest[i + 1];
};

const scheme = flag("scheme", "light");
const width = Number(flag("width", 1440));
const out = resolve(outArg);
const url = /^https?:|^file:/.test(input) ? input : `file:///${resolve(input).replace(/\\/g, "/")}`;

const profile = resolve(process.env.TEMP ?? ".", `shoot-profile-${scheme}-${width}`);

const chrome = spawn(CHROME, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--no-first-run",
  "--no-default-browser-check",
  "--allow-file-access-from-files",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function endpoint() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      return (await res.json()).webSocketDebuggerUrl;
    } catch {
      await wait(250);
    }
  }
  throw new Error("Chrome did not expose a debugging endpoint");
}

let nextId = 0;
function rpc(ws, method, params = {}, sessionId) {
  const id = (nextId += 1);
  return new Promise((resolvePromise, rejectPromise) => {
    const onMessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id !== id) return;
      ws.removeEventListener("message", onMessage);
      if (msg.error) rejectPromise(new Error(`${method}: ${msg.error.message}`));
      else resolvePromise(msg.result);
    };
    ws.addEventListener("message", onMessage);
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });
}

try {
  const ws = new WebSocket(await endpoint());
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));

  const { targetId } = await rpc(ws, "Target.createTarget", { url: "about:blank" });
  const { sessionId } = await rpc(ws, "Target.attachToTarget", { targetId, flatten: true });
  const call = (method, params) => rpc(ws, method, params, sessionId);

  await call("Page.enable");
  await call("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-color-scheme", value: scheme },
      { name: "prefers-reduced-motion", value: "reduce" },
    ],
  });
  await call("Emulation.setDeviceMetricsOverride", {
    width, height: 1000, deviceScaleFactor: 1, mobile: false,
  });

  await call("Page.navigate", { url });
  await wait(2600);

  const { result } = await call("Runtime.evaluate", {
    expression: "Math.ceil(document.documentElement.scrollHeight)",
    returnByValue: true,
  });
  const height = Math.min(result.value, 30000);

  // Match the viewport to the document so lazy content and reveals settle.
  await call("Emulation.setDeviceMetricsOverride", {
    width, height, deviceScaleFactor: 1, mobile: false,
  });
  await wait(1400);

  const shot = await call("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: true,
  });

  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, Buffer.from(shot.data, "base64"));
  console.log(`${out}  ${width}x${height}  scheme=${scheme}`);
  ws.close();
} finally {
  chrome.kill();
}
