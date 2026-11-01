import type { Plugin } from "@opencode/plugin";
import { dispatchSearch } from "./providers/index.js";
import { resolveSearchRoute } from "./config.js";

// ── Constants ──────────────────────────────────────────────────────────

const PROVIDER_ID = "native";
const PROVIDER_NAME = "Model-native search";

// ── Plugin ─────────────────────────────────────────────────────────────

// The v2 half of the dual-format entry (src/index.ts). Kept free of runtime
// @opencode/plugin imports so the standalone bundle never has to resolve it.
const v2Setup: Plugin.Plugin["setup"] = async (ctx) => {
  await ctx.websearch.transform((editor) => {
    editor.add({
      execute: async ({ query }, { signal }) => {
        const route = await resolveSearchRoute(ctx);
        return dispatchSearch(
          route.resolution.type,
          {
            ...route.resolution.credentials,
            model: route.modelID,
            modelBaseURL: route.modelBaseURL,
            providerHeaders: route.resolution.headers,
          },
          query,
          signal,
        );
      },
      id: PROVIDER_ID,
      name: PROVIDER_NAME,
    });

    if (editor.default.get() === undefined) {
      editor.default.set(PROVIDER_ID);
    }
  });
};

export default v2Setup;
