// @ts-nocheck
// `.open-next/worker.js` and `cloudflare-env.d.ts` are generated at build time;
// this file is bundled by esbuild (via wrangler/opennextjs-cloudflare) and is
// intentionally excluded from the Next.js `tsc` typecheck pass, see tsconfig.json.
import { default as handler } from "./.open-next/worker.js";

const worker = {
  fetch: handler.fetch,

  async scheduled(_event, env, ctx) {
    ctx.waitUntil(
      env.WORKER_SELF_REFERENCE.fetch(
        "https://runningfinder.joels.tech/api/cron/scrape",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${env.CRON_SECRET}` },
        },
      ).then(async (res) => {
        if (!res.ok) {
          console.error("Cron scrape failed", res.status, await res.text());
        }
      }),
    );
  },
};

export default worker;
