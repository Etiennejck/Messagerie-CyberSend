import { copyFile, mkdir } from "node:fs/promises";

await mkdir("dist/server", { recursive: true });
await mkdir("dist/.openai", { recursive: true });

await copyFile("sites/server.mjs", "dist/server/index.js");
await copyFile(".openai/hosting.json", "dist/.openai/hosting.json");

console.log("Sites deployment bundle prepared.");
