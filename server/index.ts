import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Parse JSON bodies
  app.use(express.json());

  // Contact form API endpoint
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, projectType, budget, timeline, message } = req.body;

      // Validate required fields
      if (!name || !email || !projectType || !budget) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Format message for Telegram
      const telegramMessage = `🎬 New Collaboration Inquiry\n\n` +
        `👤 Name: ${name}\n` +
        `📧 Email: ${email}\n` +
        `🎯 Project Type: ${projectType}\n` +
        `💰 Budget: ${budget}\n` +
        `⏱️ Timeline: ${timeline || 'Not specified'}\n\n` +
        `📝 Message:\n${message || 'No message provided'}`;

      // Send to Telegram
      const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
      const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
      if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return res.status(503).json({ error: "Contact form is not configured" });
      }

      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: "HTML"
        }
      );

      res.json({ success: true });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Serve static files in production or integrate Vite in development
  if (process.env.NODE_ENV === "production") {
    const staticPath = path.resolve(__dirname, "public");
    app.use(express.static(staticPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(staticPath, "index.html"));
    });
  } else {
    // Development: Use Vite dev server
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  }

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
