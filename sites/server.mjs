export default {
  async fetch(request, environment) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({ status: "ok" });
    }

    if (!environment?.ASSETS?.fetch) {
      return new Response("HoopScout assets are unavailable.", {
        status: 503,
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }

    return environment.ASSETS.fetch(request);
  },
};
