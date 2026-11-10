const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function validHostname(host) {
  if (!host || host.length > 253 || host === "localhost" || host.endsWith(".local")) return false;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.includes(":")) return false;
  if (!/^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(host)) return false;
  return true;
}

function validatePublicUrl(raw) {
  let u;
  try { u = new URL(raw); } catch { throw new Error("Enter a valid URL, including https://"); }
  if (!["http:", "https:"].includes(u.protocol)) throw new Error("Only HTTP and HTTPS URLs are supported.");
  if (!validHostname(u.hostname)) throw new Error("Use a public domain name, not localhost or an IP address.");
  if (u.username || u.password) throw new Error("URLs containing credentials are not allowed.");
  return u;
}

async function safeFetch(raw, timeoutMs = 10000) {
  let current = validatePublicUrl(raw);
  for (let hop = 0; hop <= 4; hop++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    let response;
    try {
      response = await fetch(current.toString(), {
        method: "GET",
        redirect: "manual",
        signal: controller.signal,
        headers: { "user-agent": "CyberSecurityToolkit/1.0 (security-header-check)" }
      });
    } finally { clearTimeout(timer); }
    if ([301,302,303,307,308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) return response;
      if (hop === 4) throw new Error("Too many redirects.");
      current = validatePublicUrl(new URL(location, current).toString());
      continue;
    }
    return response;
  }
  throw new Error("Unable to follow destination.");
}

async function checkHeaders(request) {
  const body = await request.json();
  const target = validatePublicUrl(body.url);
  const response = await safeFetch(target.toString());
  const names = [
    ["strict-transport-security", "Strict-Transport-Security", "Enforces HTTPS in supporting browsers."],
    ["content-security-policy", "Content-Security-Policy", "Restricts which sources can load content."],
    ["x-content-type-options", "X-Content-Type-Options", "Helps prevent MIME-type sniffing."],
    ["x-frame-options", "X-Frame-Options", "Helps protect against clickjacking."],
    ["referrer-policy", "Referrer-Policy", "Controls referrer information sent to other sites."],
    ["permissions-policy", "Permissions-Policy", "Controls access to browser features."]
  ];
  const checks = names.map(([key, label, description]) => ({
    header: label, present: response.headers.has(key),
    value: response.headers.get(key) || null, description
  }));
  return json({
    target: target.origin, status: response.status,
    checks, present: checks.filter(x => x.present).length,
    missing: checks.filter(x => !x.present).length,
    note: "Results reflect headers visible to this Worker. Some sites/CDNs vary responses by region or request."
  });
}

async function checkSsl(url) {
  const host = url.searchParams.get("host")?.trim().toLowerCase();
  if (!validHostname(host)) return json({ error: "Enter a valid public hostname, e.g. example.com" }, 400);
  const api = new URL("https://api.ssllabs.com/api/v3/analyze");
  api.searchParams.set("host", host);
  api.searchParams.set("publish", "off");
  api.searchParams.set("all", "done");
  api.searchParams.set("fromCache", "on");
  api.searchParams.set("maxAge", "24");
  const response = await fetch(api, { headers: { "accept": "application/json" } });
  if (!response.ok) return json({ error: `SSL Labs returned HTTP ${response.status}. Try again later.` }, 502);
  const data = await response.json();
  const endpoint = data.endpoints?.[0];
  return json({
    host, status: data.status,
    statusMessage: data.statusMessage || null,
    grade: endpoint?.grade || null,
    endpointStatus: endpoint?.statusMessage || endpoint?.statusDetails || null,
    details: endpoint ? {
      ipAddress: endpoint.ipAddress || null,
      grade: endpoint.grade || null,
      hasWarnings: endpoint.hasWarnings ?? null,
      isExceptional: endpoint.isExceptional ?? null
    } : null,
    message: data.status === "READY"
      ? "Assessment completed. Grade and endpoint status are from SSL Labs."
      : "Assessment is not ready yet. Run the check again in a little while.",
    disclaimer: "SSL Labs is a third-party service; checks may be queued or rate-limited."
  });
}

async function lookupIp(url) {
  const ip = url.searchParams.get("ip")?.trim();
  if (!ip || ip.length > 45 || !/^[0-9a-fA-F:.]+$/.test(ip)) {
    return json({ error: "Enter a valid IPv4 or IPv6 address." }, 400);
  }
  const response = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
    headers: { "user-agent": "CyberSecurityToolkit/1.0" }
  });
  if (!response.ok) return json({ error: `IP lookup provider returned HTTP ${response.status}.` }, 502);
  const data = await response.json();
  if (data.error) return json({ error: data.reason || "IP lookup failed." }, 400);
  return json({
    ip: data.ip, version: data.version, city: data.city, region: data.region,
    country: data.country_name, countryCode: data.country_code,
    postal: data.postal, latitude: data.latitude, longitude: data.longitude,
    timezone: data.timezone, org: data.org, asn: data.asn,
    note: "Approximate network geolocation; it does not identify a person's exact location."
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (request.method === "GET" && url.pathname === "/api/health") return json({ ok: true, service: "Cyber Security Toolkit" });
      if (request.method === "POST" && url.pathname === "/api/headers") return await checkHeaders(request);
      if (request.method === "GET" && url.pathname === "/api/ssl") return await checkSsl(url);
      if (request.method === "GET" && url.pathname === "/api/ip") return await lookupIp(url);
      if (url.pathname.startsWith("/api/")) return json({ error: "API route not found." }, 404);
      return env.ASSETS.fetch(request);
    } catch (error) {
      return json({ error: error.name === "AbortError" ? "Request timed out." : (error.message || "Request failed.") }, 400);
    }
  }
};
