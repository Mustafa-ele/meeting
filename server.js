require("dotenv").config();
const express = require("express");
const path = require("path");
const { AccessToken } = require("livekit-server-sdk");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const { LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET } = process.env;
const configured = Boolean(LIVEKIT_URL && LIVEKIT_API_KEY && LIVEKIT_API_SECRET &&
  !LIVEKIT_URL.includes("YOUR_PROJECT") && !LIVEKIT_API_KEY.includes("YOUR_API_KEY") &&
  !LIVEKIT_API_SECRET.includes("YOUR_API_SECRET"));

app.get("/api/config", (_req, res) => {
  res.json({ configured, livekitUrl: configured ? LIVEKIT_URL : "" });
});

app.post("/api/token", async (req, res) => {
  try {
    if (!configured) return res.status(503).json({
      error: "LiveKit is not configured. Add your LiveKit URL, API key, and API secret to .env."
    });
    const room = String(req.body.room || "").trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 64);
    const name = String(req.body.name || "").trim().slice(0, 48);
    if (!room || !name) return res.status(400).json({ error: "Room and display name are required." });
    const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: `${name.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 30)}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      ttl: "2h"
    });
    at.addGrant({ roomJoin: true, room, canPublish: true, canSubscribe: true, canPublishData: true });
    const token = await at.toJwt();
    res.json({ token, url: LIVEKIT_URL, room, name });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Could not create meeting token." });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
const port = Number(process.env.PORT || 5300);
app.listen(port, () => {
  console.log(`University Live Studio running at http://localhost:${port}`);
  if (!configured) console.log("Setup needed: copy .env.example to .env and add LiveKit Cloud credentials.");
});
