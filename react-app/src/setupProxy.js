const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Log when the proxy is initialized
  console.log('=== Setting up Proxy Middleware ===');
  console.log('Target URL: https://chic-nest.lndo.site');
  
  // Add proxy for cart endpoints
  app.use(
    '/cart',
    createProxyMiddleware({
      target: 'https://chic-nest.lndo.site',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req) => {
        console.log('\n=== Cart Request Debug ===');
        console.log('Cart Request URL:', req.url);
        console.log('Cart Request Method:', req.method);
        console.log('Cart Target URL:', 'https://chic-nest.lndo.site' + proxyReq.path);
        
        // If the request has a body, ensure it's properly forwarded
        if (req.body) {
          const bodyData = JSON.stringify(req.body);
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('\n=== Cart Response Debug ===');
        console.log('Cart Response Status:', proxyRes.statusCode);
        console.log('Cart Response Headers:', proxyRes.headers);
      },
      onError: (err, req, res) => {
        console.error('\n=== Cart Proxy Error ===');
        console.error('Error Message:', err.message);
        console.error('Request URL that caused error:', req.url);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ 
          errors: [{ message: 'Cart Proxy Error: ' + err.message }] 
        }));
      }
    })
  );
  
  // Add proxy for webform_rest endpoint
  app.use(
    '/webform_rest',
    createProxyMiddleware({
      target: 'https://chic-nest.lndo.site',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req) => {
        console.log('\n=== Webform Request Debug ===');
        console.log('Webform Request URL:', req.url);
        console.log('Webform Request Method:', req.method);
        console.log('Webform Target URL:', 'https://chic-nest.lndo.site' + proxyReq.path);
        
        // If the request has a body, ensure it's properly forwarded
        if (req.body) {
          const bodyData = JSON.stringify(req.body);
          console.log('Webform Request Body:', JSON.stringify(req.body, null, 2));
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('\n=== Webform Response Debug ===');
        console.log('Webform Response Status:', proxyRes.statusCode);
        console.log('Webform Response Headers:', proxyRes.headers);
      },
      onError: (err, req, res) => {
        console.error('\n=== Webform Proxy Error ===');
        console.error('Error Message:', err.message);
        console.error('Request URL that caused error:', req.url);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ 
          errors: [{ message: 'Proxy Error: ' + err.message }] 
        }));
      }
    })
  );
  
  app.use(
    '/graphql-default-api',
    createProxyMiddleware({
      target: 'https://chic-nest.lndo.site',
      changeOrigin: true,
      secure: false,
      headers: {
        'Connection': 'keep-alive',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      logLevel: 'debug', // Add debug logging for the proxy
      onProxyReq: (proxyReq, req) => {
        // Debug original request details
        console.log('\n=== GraphQL Request Debug ===');
        console.log('Original Request URL:', req.url);
        console.log('Original Request Method:', req.method);
        console.log('Original Request Query Params:', req.query);
        console.log('Original Request Path:', req.path);
        console.log('Original Request Base URL:', req.baseUrl);
        
        // Add any custom headers if needed
        proxyReq.setHeader('X-Forwarded-Proto', 'https');
        proxyReq.setHeader('Accept', 'application/json');
        proxyReq.setHeader('Content-Type', 'application/json');
        
        // If the request has a body, ensure it's properly forwarded
        if (req.body) {
          const bodyData = JSON.stringify(req.body);
          console.log('GraphQL Request Body:', JSON.stringify(req.body, null, 2));
          proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
          proxyReq.write(bodyData);
        }
        
        // Log the request for debugging
        console.log('Proxied Request URL:', proxyReq.path);
        console.log('Proxied Request Headers:', proxyReq.getHeaders());
        console.log('Target Endpoint:', 'https://chic-nest.lndo.site' + proxyReq.path);
        console.log('Full Target URL:', 'https://chic-nest.lndo.site/api/graphql' + (req.url !== '/' ? req.url : ''));
      },
      onProxyRes: (proxyRes, req, res) => {
        // Log response details for debugging
        console.log('\n=== GraphQL Response Debug ===');
        console.log('GraphQL Response Status:', proxyRes.statusCode);
        console.log('GraphQL Response Headers:', proxyRes.headers);
        
        // Check if the response is HTML when it should be JSON
        const contentType = proxyRes.headers['content-type'] || '';
        if (contentType.includes('text/html') && req.headers['accept'] === 'application/json') {
          console.error('ERROR: Received HTML response when JSON was expected');
          console.error('This usually indicates an authentication issue or incorrect endpoint');
          console.error('Request URL that caused error:', req.url);
          console.error('Proxied URL:', 'https://chic-nest.lndo.site/api/graphql' + (req.url !== '/' ? req.url : ''));
          
          // Collect the response body to log it
          let responseBody = '';
          proxyRes.on('data', (chunk) => {
            responseBody += chunk;
          });
          
          proxyRes.on('end', () => {
            console.error('HTML Response Body (first 500 chars):', responseBody.substring(0, 500));
          });
        } else {
          // For successful JSON responses, log a sample of the data
          let responseBody = '';
          proxyRes.on('data', (chunk) => {
            responseBody += chunk;
          });
          
          proxyRes.on('end', () => {
            try {
              const jsonResponse = JSON.parse(responseBody);
              console.log('Response Data Sample:', 
                JSON.stringify(jsonResponse).substring(0, 200) + 
                (JSON.stringify(jsonResponse).length > 200 ? '...' : '')
              );
            } catch (e) {
              console.log('Response is not valid JSON or empty');
              console.log('Raw response (first 500 chars):', responseBody.substring(0, 500));
            }
          });
        }
      },
      onError: (err, req, res) => {
        console.error('\n=== GraphQL Proxy Error ===');
        console.error('Error Message:', err.message);
        console.error('Request URL that caused error:', req.url);
        console.error('Request Method:', req.method);
        console.error('Target URL:', 'https://chic-nest.lndo.site/api/graphql' + (req.url !== '/' ? req.url : ''));
        if (req.body) {
          console.error('Request Body:', JSON.stringify(req.body, null, 2));
        }
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ 
          errors: [{ message: 'Proxy Error: ' + err.message }] 
        }));
      }
    })
  );
  
  // Add proxy for API endpoints
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://chic-nest.lndo.site',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug', // Add debug logging for the proxy
      onProxyReq: (proxyReq, req) => {
        console.log('\n=== API Request Debug ===');
        console.log('API Request URL:', req.url);
        console.log('API Request Method:', req.method);
        console.log('API Target URL:', 'https://chic-nest.lndo.site' + proxyReq.path);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('\n=== API Response Debug ===');
        console.log('API Response Status:', proxyRes.statusCode);
        console.log('API Response Headers:', proxyRes.headers);
      },
      onError: (err, req, res) => {
        console.error('\n=== API Proxy Error ===');
        console.error('API Proxy Error:', err.message);
        console.error('Request URL that caused error:', req.url);
        res.writeHead(500, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify({ 
          errors: [{ message: 'API Proxy Error: ' + err.message }] 
        }));
      }
    })
  );
  
  // Log when proxy setup is complete
  console.log('=== Proxy Middleware Setup Complete ===');
}; 