const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

// Allow all origins
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

// Root path
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Proxy handler (catch-all)
app.use(async (req, res) => {
  const targetUrl = req.originalUrl.slice(1); // remove leading "/"

  if (!/^https?:\/\//.test(targetUrl)) {
    return res.status(400).send('Invalid target URL');
  }

  try {
    // Override request to target
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        'User-Agent': req.get('User-Agent') || ''
      }
    });

    // Print log access
    console.log(`[${response.status}] ${req.method} ${targetUrl}`);

    // Exclude Forward headers
    const excludeHeaders = [
      "content-encoding",
      "transfer-encoding",
    ];

    // Forward headers (filtered)
    response.headers.forEach((value, name) => {
      if (!excludeHeaders.includes(name.toLowerCase())) {
        res.setHeader(name, value);
      }
    });

    // Get Body
    const bodyArrayBuffer = await response.arrayBuffer();
    const bodyBuffer = Buffer.from(bodyArrayBuffer);

    // Override CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Send Response
    res.status(response.status).send(bodyBuffer);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error');
  }
});

app.listen(PORT, () => {
  console.log(`No-CORS Proxy running at http://localhost:${PORT}`);
});
