// server/index.js
// npm install express axios dotenv express-rate-limit cors
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
app.use(express.json());

// Configure CORS: replace process.env.ALLOWED_ORIGIN with your site's origin (e.g. https://yourdomain.com)
// To allow all origins (NOT recommended) set ALLOW_ALL_ORIGINS=true in .env
if (process.env.ALLOW_ALL_ORIGINS === 'true') {
  app.use(cors());
} else {
  const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5500';
  app.use(cors({
    origin: allowedOrigin
  }));
}

// Basic rate limiting
const limiter = rateLimit({ windowMs: 60*1000, max: 30 }); // 30 requests / minute per IP
app.use(limiter);

// Optional project-level auth: set PROJECT_SECRET in env and send header x-project-secret from client
function requireProjectSecret(req, res, next) {
  if (!process.env.PROJECT_SECRET) return next(); // not enabled
  const secret = req.get('x-project-secret');
  if (!secret || secret !== process.env.PROJECT_SECRET) {
    return res.status(401).json({ error: 'Missing or invalid project secret' });
  }
  next();
}

app.post('/api/chat', requireProjectSecret, async (req, res) => {
  try {
    const messages = req.body.messages || [{ role: 'user', content: req.body.input || 'Hello from JENZY' }];
    const resp = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages,
        max_tokens: parseInt(process.env.MAX_TOKENS || '800', 10)
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60 * 1000
      }
    );
    res.json(resp.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data || { message: err.message };
    res.status(status).json({ error: data });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Chat proxy listening on ${port}`));
