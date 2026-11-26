# An Inspector Calls (Windows)

A small Windows desktop app with the IC badge. Opening it greets the inspector by name
("Good afternoon, Inspector Smith") and then opens the An Inspector Calls workspace
(https://claude.ai/artifact/Dq6idUVy5f5mZRYDLS4iuQ) in its own Chrome app window (or Edge if
Chrome isn't installed), so it uses the inspector's existing Claude login and connections.

Built by GitHub Actions on every push (Tauri, so the installer is only a few MB and uses the Edge WebView2 already built into Windows). The latest installer,
`Inspector-Calls-Setup.exe`, is on the Releases page (tag `latest`). The installer is not
code-signed, so Windows SmartScreen may warn on first run: choose More info, then Run anyway.

## Rebuilding in Microsoft Copilot

See [HANDOVER.md](HANDOVER.md) for the full build information (features, design, data, AI prompts and ready-to-paste Copilot prompts). The complete web app source is in `source/an-inspector-calls.html`.
