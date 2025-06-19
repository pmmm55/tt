const express = require("express");
const { json } = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(json({ verify: verifyLineSignature }));

app.post("/webhook", (req, res) => {
  const events = req.body.events;
  for (const event of events) {
    if (event.type === "message" && event.message.type === "image") {
      console.log("📷 Image received!");
    }
  }
  res.status(200).end();
});

function verifyLineSignature(req, res, buf) {
  const signature = req.headers["x-line-signature"];
  const channelSecret = process.env.CHANNEL_SECRET || "";
  const hash = crypto
    .createHmac("SHA256", channelSecret)
    .update(buf)
    .digest("base64");
  if (hash !== signature) {
    throw new Error("Invalid signature");
  }
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Bot server listening on port", port);
});
