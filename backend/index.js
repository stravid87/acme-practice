const express = require('express');
const app = express();
const PORT = 3003;

app.get('/api/data', (req, res) => {
  res.json({ 
    message: "Hello from the Deep Backend!",
    trace: ["Backend"] 
  });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Backend listening on port ${PORT}`));