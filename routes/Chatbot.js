const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post('http://localhost:8000/chat', {
      message,
    });
    res.json({ response: response.data.response });
  } catch (error) {
    res.status(500).json({ error: 'Chatbot error', error: error.message });
  }
});

module.exports = router;
