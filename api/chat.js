const DASHSCOPE_API_URL =env.DASHSCOPE_API_URL
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const apiKey = process.env.DASHSCOPE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing DASHSCOPE_API_KEY" });
  }

  try {
    const upstreamResponse = await fetch(DASHSCOPE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body || {}),
    });

    const contentType =
      upstreamResponse.headers.get("content-type") || "text/event-stream";
    res.statusCode = upstreamResponse.status;
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Accel-Buffering", "no");

    if (!upstreamResponse.body) {
      return res.end();
    }

    const reader = upstreamResponse.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) res.write(Buffer.from(value));
    }
    res.end();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upstream request failed";
    res.status(500).json({ error: message });
  }
}
