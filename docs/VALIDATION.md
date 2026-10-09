# Validation and usefulness criteria

The Starter Kit is useful only if a knowledge team can replace the demo boundary without rewriting the Bot experience.

## Level 1: repository validation

Runs on every push and pull request without OpenClaw or secrets:

- the React application type-checks and builds;
- repository safety checks reject committed `.env`, build output, absolute local paths, and credential-like values;
- the MCP Server builds, starts over stdio, lists four tools, and answers a deterministic search call;
- the Bot API proxy starts on loopback and passes a health check.

## Level 2: existing-installation preflight

Run `npm run preflight` on the intended server. This is a non-mutating capability check. It distinguishes:

- OpenClaw missing;
- OpenClaw installed but Gateway unavailable;
- Gateway reachable but server token unavailable;
- authenticated model inventory available;
- optional MCP registration probe available.

Preflight does not prove answer quality. It proves only that the integration prerequisites are visible.

## Level 3: dedicated integration environment

Use a non-production OpenClaw Agent and fabricated records. Verify:

1. The browser calls only the same-origin Bot API.
2. The Bot API calls OpenClaw with a server-side token.
3. OpenClaw invokes only the four approved MCP tools.
4. A grounded query returns at least one structured citation.
5. An unsupported query returns `当前知识库中没有找到足够依据。` with no fabricated citation.
6. Cancelling a request does not leave an active browser turn.
7. A second test identity cannot read the first identity's conversations or documents.

## Level 4: pilot-team usefulness

Ask a real knowledge team to replace `src/demo-data.ts` with a test repository adapter. Track:

- time to first successful local answer;
- files that had to be changed;
- steps requiring maintainer help;
- grounded-answer and citation correctness on a fixed question set;
- unsupported-question refusal rate;
- upgrade effort between tagged releases.

A reasonable initial success target is: one engineer reaches a cited answer within 60 minutes, changes no Bot UI code, and completes all strict-grounding scenarios.

## Not validated by this repository

- model quality or cost;
- production OpenClaw availability;
- a team's identity and authorization implementation;
- accuracy of a real knowledge index;
- compliance requirements for a specific organization.
