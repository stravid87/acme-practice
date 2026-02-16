const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3002;
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3003';
// Update your axios call to use TARGET_URL

app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/data`);
    const data = response.data;
    data.trace.push("Reverse Proxy");
    res.json(data);
  } catch (err) {
    res.status(500).json({ 
      error: "Reverse Proxy failed to reach Backend",
      attemptedUrl: BACKEND_URL 
    });
  }
});

app.listen(PORT, '0.0.0.0', () => console.log(`Reverse Proxy listening on port ${PORT}`));