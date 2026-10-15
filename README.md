# 霁境 · Jijing / AccordSpace

An ice-jade spatial experience for shared-plan negotiation on GenLayer.

The product preserves the approved original scene, WebGL displacement, touch
ripples, drag/hold transitions, sculpted jade typography and user-enabled
continuous Web Audio ambience. Open the jade scroll to use the product.

## What works

- No-wallet, offline three-person tutorial: seal each person's conditions,
  discover a genuinely three-way conflict, inspect all minimal conflict and
  correction sets with witnesses, waive only one's own condition, and approve
  the same plan unanimously. It uses fixed rules, not a pretend AI call.
- Real-session UI: wallet-free final-state reads and pagination, exact deployed
  source verification, provider-backed create/seal/compile/waive/approve/cancel,
  source-checked deployment, explicit local request budgets and receipt export.
- EIP-1193 / OKX browser wallet only. No private keys or background signers.
  Chain/account changes invalidate authorization. One request per operation,
  no automatic retry, ABI fallback send, Appeal or alternative chain.

## Verification status

**Engineering candidate, not a chain-verified submission.** No deployment,
signature, model execution or Portal submission was made. The schema read was
blocked (HTTP 403) although `eth_chainId` returned 61999 on 2026-10-15 UTC.
The browser wallet paths are prepared and tested with provider doubles; their
real execution needs a local user wallet.

`npm test` runs 15 assertion groups including a 4,369-family independent set
oracle, Python/JavaScript hash parity, 64-bit masks, sender changes, request
budgets, duplicate-send protection and a synthetic DOM lifecycle. Synthetic DOM
is not a browser render, WebGL or real-audio test. This run had no supported
managed browser preview capability; fresh desktop/mobile visual and real-wallet
acceptance remain open. Original visual source is preserved rather than redrawn.

## Run

```sh
npm ci
npm run build
npm run check
npm test
python -m http.server 8765 --bind 127.0.0.1 --directory dist
```

Open `http://127.0.0.1:8765`. The prebuilt release package includes
`START_WINDOWS.cmd` and all assets. No network is needed for the tutorial after
the site loads. A browser reload while disconnected still needs a local server;
this is not a service-worker offline cache.

## Canonical Intelligent Contract

Repository A: https://github.com/halihalibt/accord-space-genlayer

Reviewed PR: https://github.com/halihalibt/accord-space-genlayer/pull/1

Merged source commit: `b08b408d425054baa4d679d959a289e8a7d5e550`.

`contracts/accord_space.py` is the COMPLETE canonical single-file source,
identical bytes, including its deterministic core, compiler prompt and native
adapter. It is not a wrapper. SHA256:

`f99a6395f539c718027f2b6ab39801ccc22c2c0197fb7cbc27307b64563e886f`

The copy is checked in source and build output. See `SOURCE_MANIFEST.json`,
`docs/DEPLOYMENT_RUNBOOK.md`, `docs/SUBMISSION_PROJECTS.md` and
`docs/SUBMISSION_CONTRACTS.md`. SDK and test dependencies are locked.

## Scope and limitations

The protocol finds all feasible assignments within a frozen finite domain;
semantic correctness still depends on independent model interpretation. It
cannot enforce real-world delivery or an external calendar. UNKNOWN is not a
free pass and cannot be waived. Minimal means inclusion-minimal, not fairest.
All condition changes invalidate prior approvals. The demo's role switch has
no authority over a real session. The frontend world is never participant-editable.

Only Stable Studionet, chain 61999, `https://studio.genlayer.com/api`.
Zero cash; Faucet GEN only. See LICENSE and asset notices.
