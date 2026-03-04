const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 3001;
const REVERSE_PROXY_URL = process.env.REVERSE_PROXY_URL || 'http://localhost:8080';
// Update your axios call to use TARGET_URL

app.use(cors()); // Allow SPA to talk to this proxy

// Health check 
app.get('/', (req, res) => res.status(200).send('Healthy'));

app.get('/test-rp', async (req, res) => {
  try {
    // 1. We call our LOCAL sidecar on port 8080 over plain HTTP
    // 2. We MUST pass the 'Host' header so Traefik knows where to route the request

    const response = await axios.get(`${REVERSE_PROXY_URL}/test-mtls`, {
      headers: {
        'Host': 'reverse-proxy-service.sidecar.svc.cluster.local'
      }
    });

    res.json({
      status: "mTLS Handshake Successful",
      reverse_proxy_response: response.data
    });
  } catch (err) {
    // This now catches errors from the Sidecar, not just network errors
    res.status(500).json({ 
      error: "Sidecar failed to complete mTLS handshake",
      message: err.message,
      raw_error: err.toString()
    });
  }
});

app.get(['/fetch-all', '/api-proxy/fetch-all'], async (req, res) => {
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