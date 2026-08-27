# Contributing

Thank you for improving Agent Skyline.

## Principles

1. Preserve the privacy contract. Raw prompts, replies, commands, arguments, paths, workspace names, and model output must never enter normalized events, history, exports, logs, or analytics.
2. Prefer deterministic visual behavior. The same sanitized input and seed should produce the same city.
3. Keep the plugin local-first and dependency-light. A feature that requires a hosted service needs a separate proposal and must not become a default dependency.
4. Treat accessibility and reduced motion as product requirements.
5. Add behavior tests before adding visual complexity.

## Setup

```bash
npm run check
```

No local dependency installation is required for the pure build and test pipeline. A DSH Web environment is needed for host integration testing.

## Pull requests

A pull request should include:

- the user problem being solved;
- screenshots for visual changes;
- tests for data, privacy, persistence, or export changes;
- confirmation that `npm run check` passes;
- confirmation that no new raw-content field is retained.

For new event classifications, add fixtures that contain deliberately sensitive text and assert that only the intended coarse category survives.
