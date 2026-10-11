/**
 * Riga SaaS Cloudflare Worker (Data Plane)
 * 
 * Deploy this script to your Cloudflare Worker handling *.riga.site and custom domains.
 * It extracts the merchant subdomain from the Host header, fetches the pre-compiled static HTML
 * from Cloudflare R2 in < 10ms, and serves it globally with edge caching.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const host = request.headers.get('host') || url.hostname;
    
    // Extract subdomain (e.g. megadoses.riga.site -> megadoses)
    let subdomain = '';
    const parts = host.split('.');
    if (parts.length >= 3) {
      subdomain = parts[0];
    } else if (host.includes('riga.site') && parts.length === 2) {
      subdomain = parts[0];
    }

    // Handle apex domain or app root -> redirect or serve app dashboard
    if (!subdomain || subdomain === 'www' || subdomain === 'app' || subdomain === 'riga') {
      return fetch(request); // Forward to MERN Control Plane
    }

    try {
      // Construct R2 key for the compiled merchant site HTML
      const r2Key = `sites/${subdomain}/index.html`;
      
      // Fetch directly from Cloudflare R2 bucket in < 10ms
      let object = await env.R2_BUCKET.get(r2Key);

      if (!object) {
        // Fallback search by siteId or default fallback page
        const fallbackKey = `sites/site_1/index.html`;
        object = await env.R2_BUCKET.get(fallbackKey);
      }

      if (!object) {
        return new Response(JSON.stringify({
          error: "Site Not Found",
          subdomain,
          message: "The requested merchant site is not published or does not exist."
        }), {
          status: 404,
          headers: { "Content-Type": "application/json;charset=UTF-8" }
        });
      }

      // Return the pre-compiled static HTML with edge caching headers
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("etag", object.httpEtag);
      headers.set("Cache-Control", "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400");
      headers.set("X-Riga-Edge-POP", "Cloudflare-Global-Edge");
      headers.set("X-Riga-Subdomain", subdomain);

      return new Response(object.body, {
        status: 200,
        headers
      });

    } catch (err) {
      return new Response(`Riga Edge Error: ${err.message}`, { status: 500 });
    }
  }
};
