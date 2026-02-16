const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3001;
const REVERSE_PROXY_URL = process.env.REVERSE_PROXY_URL || 'http://localhost:3002';
// Update your axios call to use TARGET_URL

app.use(cors()); // Allow SPA to talk to this proxy

app.get('/fetch-all', async (req, res) => {
  try {
    // Calling the Reverse Proxy
    const response = await axios.get(`${REVERSE_PROXY_URL}/api/data`);
    const data = response.data;
    data.trace.push("Forward Proxy");
    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ 
      error: "Forward Proxy failed to reach Reverse Proxy",
      attemptedUrl: REVERSE_PROXY_URL 
    });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Forward Proxy listening on port ${PORT}`));