import type { Plugin as PluginV1 } from "@opencode-ai/plugin";

import v1Plugin from "./v1/index.js";
import v2Setup from "./v2.js";

// ── Dual-format plugin entry ───────────────────────────────────────────
//
// One default export serves both opencode plugin APIs from the same module:
//
// - opencode 1.x (v1 plugin API) reads `{ id, server }` and calls
//   `server(input)` with the v1 PluginInput (client, directory, ...); the
//   extra `setup` key is ignored.
// - opencode 2.x (v2 plugin API) reads `{ id, setup }` (packages/core/src/
//   plugin/module.ts Module schema) and calls `setup(ctx)` with the v2
//   plugin Context; the extra `server` key is ignored because the effect
//   Schema.Struct decode tolerates extra properties.
//
// The v1 implementation is frozen in src/v1 (vendored from upstream 775eac4,
// the last v1-era commit) and keeps the standalone `web-search` tool. The v2
// implementation (src/v2.ts + src/config.ts + src/providers) registers a
// `native` backend for opencode 2.x's built-in `websearch` tool instead of a
// second tool, so v2 sessions see exactly one web search tool.

// oxlint-disable-next-line import/no-default-export -- plugin entry point requires default export
export default {
  id: "opencode-websearch",
  server: v1Plugin satisfies PluginV1,
  setup: v2Setup,
};
