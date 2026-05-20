# CyberSend

CyberSend is a cyberpunk terminal-inspired MVP for private ephemeral messaging. The app is designed for Netlify: a Vite React frontend in `dist` and TypeScript Netlify Functions in `netlify/functions`.

## Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Netlify Functions in TypeScript
- Browser Web Crypto API
- WebRTC DataChannel-ready architecture

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

For frontend plus Netlify Functions:

```bash
npm run build
netlify dev
```

Or use the project script:

```bash
npm run netlify:dev
```

## Build

```bash
npm run build
```

Netlify uses:

- build command: `npm run build`
- publish directory: `dist`
- functions directory: `netlify/functions`

## MVP Privacy Rule

CyberSend must not persist message content. In this MVP, chat messages live only in React component state on `/session`. The app does not write messages to `localStorage`, `sessionStorage`, Netlify Functions, logs, or durable storage. The `/burn` command and Burn button wipe the local session state immediately and show:

- `session memory wiped`
- `no logs persisted`

The only persistent data categories planned for future durable storage are:

- users
- contacts
- invitations
- public keys
- minimal relationship metadata

## Current MVP Limits

- Auth is mock-oriented and not production secure.
- Password handling in Functions has explicit TODO comments for real server-side hashing.
- The storage adapter is in-memory in `netlify/functions/_lib/storage.ts`; it is ready to be replaced with Netlify Database/Postgres.
- Invite keys are generated with browser crypto randomness and hashed in the Function layer before future storage.
- Message encryption has Web Crypto structure and TODOs, but complete E2E encryption is not finished.
- WebRTC files are skeletons. Netlify Functions are intended for signaling only; future message traffic should move through WebRTC DataChannel.

## Roadmap

Phase 1: UI terminal  
Phase 2: real auth  
Phase 3: Netlify Database  
Phase 4: WebRTC signaling  
Phase 5: full end-to-end encryption
