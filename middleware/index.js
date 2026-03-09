require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = 4000;

app.use(morgan('dev'));

app.use(cors({
  origin: 'http://localhost:3000',
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));


// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Middleware is running', timestamp: new Date() });
});

// Proxy to Spring Boot
const proxy = createProxyMiddleware({
  target: 'http://localhost:4000',
  changeOrigin: true,
  on: {
    proxyReq: (proxyReq, req) => {
      if (req.headers['authorization']) {
        proxyReq.setHeader('Authorization', req.headers['authorization']);
      }
      if (req.headers['content-type']) {
        proxyReq.setHeader('Content-Type', req.headers['content-type']);
      }
      console.log(`[PROXY] ${req.method} ${req.url} → Spring Boot`);
    },
    error: (err, req, res) => {
      console.error('[PROXY ERROR]', err.message);
      res.status(500).json({ error: 'Proxy error', message: err.message });
    }
  }
});

app.use('/api', proxy);

app.listen(PORT, () => {
  console.log(`Middleware running on http://localhost:${PORT}`);
});