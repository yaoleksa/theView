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
          if(rslt.results[0].size > 200) {
            await env.DB.prepare(`
              DELETE FROM articles
              ORDER BY epoch LIMIT ${rslt.results[0].size - 200}`).run();
          }
          // Find duplicates
          const IdsAndTitles = await env.DB.prepare('SELECT article_id, title FROM articles').run();
          const articles = Object.values(IdsAndTitles);
          const ids = [];
          const titles = [];
          articles.forEach(item => {
            ids.push(item.article_id);
            titles.push(item.title);
          });
          const statement = data.articles.map(article => {
            if(!titles.includes(article.title) && !ids.includes(article.article_id)) {
              return env.DB.prepare(`
                INSERT OR IGNORE INTO articles
                (article_id, title, link, description, image_url, topic, pub_date, epoch)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `).bind(
                article.article_id,
                article.title,
                article.link,
                article.description,
                article.image_url,
                data.topic,
                article.pubDate,
                new Date().toISOString()
              );
            }
            ids.push(article.article_id);
            titles.push(article.title);
          });
          try {
            await env.DB.batch(statement);
            return json({ status: "OK", message: "Article inserted" });
          } catch(err) {
            return json({ status: "FAIL", message: err.message });
          }
        }

        // RATE
        if (entity === "rate") {
          // Clear DB
          const rslt = await env.DB.prepare(`SELECT COUNT(*) as size FROM rate`).run();
          if(rslt.results[0].size > 3) {
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