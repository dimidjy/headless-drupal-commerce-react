const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/graphql',
    createProxyMiddleware({
      target: 'https://chic-nest.lndo.site',
      changeOrigin: true,
      secure: false,
      headers: {
        'Connection': 'keep-alive'
      },
      onProxyReq: (proxyReq) => {
        // Add any custom headers if needed
        proxyReq.setHeader('X-Forwarded-Proto', 'https');
      },
      onProxyRes: (proxyRes) => {
        // Log response headers for debugging
        console.log('GraphQL Proxy Response Headers:', proxyRes.headers);
      },
      onError: (err, req, res) => {
        console.error('Proxy Error:', err);
        res.writeHead(500, {
          'Content-Type': 'text/plain',
        });
        res.end('Proxy Error: ' + err.message);
      }
    })
  );
}; 