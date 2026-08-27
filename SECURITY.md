# Security Policy

## Supported versions

Security and privacy fixes are provided for the latest release line.

## Privacy boundary

Agent Skyline is designed to retain only coarse event category, outcome, duration, timestamp, and aggregate counts. It must not retain or export:

- prompts or model responses;
- tool arguments or results;
- shell commands;
- file or repository paths;
- workspace, repository, or user names;
- credentials, tokens, headers, or environment values.

Browser history is stored locally under `dsh-agent-skyline:history:v1` and can be removed from the plugin UI. The selected theme and an optional, explicitly entered public project label are also stored locally; neither is inferred from DSH content or filesystem paths.

## Reporting a vulnerability

Please report suspected data leakage, unsafe SVG output, storage corruption, or export injection privately through GitHub Security Advisories for this repository. Include a minimal reproduction with synthetic data only. Do not attach real credentials, proprietary prompts, or private filesystem paths.

A valid privacy issue receives priority over feature work.
