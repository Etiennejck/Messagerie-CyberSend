import { createHash } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const appPath = path.join(root, "src/app/App.tsx");
const statusPath = path.join(root, "public/source-status.json");
const appSource = await readFile(appPath, "utf8");
const urls = [...new Set(
  [...appSource.matchAll(/(?:sourceUrl|url):\s*"(https:\/\/[^"\s]+)"/g)].map((match) => match[1]),
)];

let previous = { sources: [] };
try {
  previous = JSON.parse(await readFile(statusPath, "utf8"));
} catch {
  // The first run creates the source ledger.
}
const previousByUrl = new Map(previous.sources.map((source) => [source.url, source]));

const check = async (url) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18_000);
  try {
    const response = await fetch(url, {
      headers: { "user-agent": "HoopScout-SourceWatch/1.0 (+https://hoopscout-benelux.dunkonfire.chatgpt.site/)" },
      redirect: "follow",
      signal: controller.signal,
    });
    const body = await response.text();
    const normalized = body.replace(/\s+/g, " ").trim();
    const hash = createHash("sha256").update(normalized).digest("hex").slice(0, 16);
    const prior = previousByUrl.get(url);
    return {
      url,
      host: new URL(url).hostname.replace(/^www\./, ""),
      ok: response.ok,
      status: response.status,
      hash,
      changed: Boolean(prior?.hash && prior.hash !== hash),
      checkedAt: new Date().toISOString(),
    };
  } catch (error) {
    return {
      url,
      host: new URL(url).hostname.replace(/^www\./, ""),
      ok: false,
      status: 0,
      hash: previousByUrl.get(url)?.hash || null,
      changed: false,
      error: error instanceof Error ? error.name : "FetchError",
      checkedAt: new Date().toISOString(),
    };
  } finally {
    clearTimeout(timeout);
  }
};

const sources = [];
for (let index = 0; index < urls.length; index += 8) {
  sources.push(...await Promise.all(urls.slice(index, index + 8).map(check)));
}

const status = {
  generatedAt: new Date().toISOString(),
  total: sources.length,
  reachable: sources.filter((source) => source.ok).length,
  changed: sources.filter((source) => source.changed).length,
  schedule: "daily",
  sources,
};

await mkdir(path.dirname(statusPath), { recursive: true });
await writeFile(statusPath, `${JSON.stringify(status, null, 2)}\n`);
console.log(`Checked ${status.total} sources: ${status.reachable} reachable, ${status.changed} changed.`);
