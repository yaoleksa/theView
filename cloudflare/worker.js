export default {
  async fetch(request, env, ctx) {

    const url = new URL(request.url);
    const entity = url.searchParams.get("entity");

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    try {

      // =========================
      // POST - INSERT DATA
      // =========================
      if (request.method === "POST") {

        const data = await request.json();

        // ARTICLE
        if (entity === "article") {
          // Clear DB
          const rslt = await env.DB.prepare(`SELECT COUNT(*) as size FROM articles`).run();
          if(rslt.results[0].size > 20 && false) {
            await env.DB.prepare(`
              DELETE FROM articles
              ORDER BY epoch LIMIT ${rslt.results[0].size - 20}`).run();
          }
          await env.DB.prepare('DELETE FROM articles').run();
          await env.DB.prepare(`
            INSERT INTO articles
            (article_id, title, link, description, image_url, topic, pub_date, epoch)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(
            data.article_id,
            data.title,
            data.link,
            data.description,
            data.image_url,
            url.searchParams.get("q"),
            data.pubDate,
            new Date().toISOString()
          ).run();

          return json({ status: "OK", message: "Article inserted" });
        }

        // RATE
        if (entity === "rate") {
          // Clear DB
          const rslt = await env.DB.prepare(`SELECT COUNT(*) as size FROM rate`).run();
          if(rslt.results[0].size > 3 && false) {
            await env.DB.prepare(`
              DELETE FROM rate
              ORDER BY id LIMIT ${rslt.results[0].size - 3}`).run();
          }
          await env.DB.prepare(`
            INSERT INTO rate (id, USD, EUR, PLN)
            VALUES (?, ?, ?, ?)
          `).bind(
            Date.now(),
            data.USD,
            data.EUR,
            data.PLN
          ).run();
          return json({ status: "OK", message: "Rates inserted" });
        }

        return json({ error: "Unknown entity" }, 400);
      }

      // =========================
      // GET - READ DATA
      // =========================
      if (request.method === "GET") {

        if (entity === "article") {
          const result = await env.DB.prepare(`
            SELECT * FROM articles ORDER BY article_id DESC LIMIT 10
          `).all();

          return json(result.results);
        }

        if (entity === "rate") {
          const result = await env.DB.prepare(`
            SELECT * FROM rate ORDER BY id DESC LIMIT 20
          `).all();

          return json(result.results);
        }

        return json({ error: "Unknown entity" }, 400);
      }

      return json({ error: "Method not allowed" }, 405);

    } catch (err) {
      return json({ error: err.message }, 500);
    }
  }
};

// =========================
// HELPERS
// =========================

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders()
    }
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}