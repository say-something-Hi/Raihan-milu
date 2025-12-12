const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration
const raihan = [
  "raihan", "রাইহান", "boss", "ভাই", "bro", "brother", "dada", "দাদা"
];

const responses = [
  "Raihan ভাই, কি হে? 😊",
  "ওহো, Raihan ভাই ডাকছেন! 😄",
  "কি করছেন Raihan ভাই? 🤗",
  "Raihan ভাই, কেমন আছেন? 🥰",
  "আজকে আমাকে ডাকলেন কেন? 😏",
  "Raihan ভাই, কিছু বলবেন? 🙃",
  "হ্যালো Boss! 👋",
  "রাইহান ভাই, আজকের দিন কেমন যাচ্ছে? 🌟",
  "কি সাহেব, খবর কি? 😎",
  "Raihan ভাইকে সালাম! 🤝",
  "এসো ভাই, বসো! 🪑",
  "কি লাগবে বলুন? 😇",
  "Raihan ভাই, আমাকে মনে পড়েছে! ❤️",
  "ভাই, কিছু বলতে চান? 😊",
  "রাইহান, তুমি আমার Best Boss! 🤩",
  "হ্যাঁ ভাই, বলুন! 👂",
  "কি ব্যাপার ভাই? 😃",
  "Raihan ভাই, সাহায্য করতে পারি? 🤲",
  "আজকে ভালো তো? 😌",
  "রাইহান দা, প্রণাম! 🙏"
];

// Base API URL function
const baseApiUrl = async () => {
  try {
    const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
    return base.data.jan;
  } catch (error) {
    return "https://api.heckerman06.repl.co";
  }
};

// GET endpoint for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Raihan API Server is running!',
    author: 'Raihan',
    status: 'active',
    endpoints: ['/raihan', '/api/raihan', '/chat'],
    triggers: raihan
  });
});

// GET endpoint for Raihan chat
app.get('/raihan', (req, res) => {
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  res.json({
    message: randomResponse,
    author: 'Raihan API',
    timestamp: new Date().toISOString()
  });
});

// POST endpoint for Raihan chat
app.post('/api/raihan', async (req, res) => {
  try {
    const { message, name } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const msg = message.toLowerCase();
    const words = msg.split(" ");
    
    // Check if message starts with raihan trigger words
    const isRaihanCall = raihan.some(word => msg.startsWith(word));
    
    if (isRaihanCall) {
      if (words.length === 1) {
        const randomMsg = responses[Math.floor(Math.random() * responses.length)];
        return res.json({
          reply: randomMsg,
          triggered: true,
          triggerWord: words[0],
          type: 'random_response'
        });
      } else {
        const userText = words.slice(1).join(" ");
        const base = await baseApiUrl();
        const response = await axios.get(`${base}/jan/font3/${encodeURIComponent(userText)}`);
        
        return res.json({
          reply: response.data?.message || "কি বললেন ভাই? বুঝতে পারলাম না 😅",
          triggered: true,
          triggerWord: words[0],
          type: 'ai_response',
          userMessage: userText
        });
      }
    } else {
      return res.json({
        reply: "আমি শুধু Raihan ভাইকে রেসপন্ড করি! 😊",
        triggered: false,
        suggestion: `Try starting with: ${raihan.slice(0, 3).join(', ')}...`
      });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      reply: 'দুঃখিত ভাই, কিছু সমস্যা হয়েছে! 😔'
    });
  }
});

// Chat endpoint with query parameter
app.get('/chat', async (req, res) => {
  try {
    const { msg } = req.query;
    
    if (!msg) {
      return res.json({
        reply: 'Hi! Please provide a message with ?msg=your_message',
        author: 'Raihan Bot'
      });
    }

    const message = msg.toLowerCase();
    const words = message.split(" ");
    const isRaihanCall = raihan.some(word => message.startsWith(word));
    
    if (isRaihanCall) {
      if (words.length === 1) {
        const randomMsg = responses[Math.floor(Math.random() * responses.length)];
        return res.json({
          reply: randomMsg,
          author: 'Raihan Bot',
          triggered: true
        });
      } else {
        const userText = words.slice(1).join(" ");
        const base = await baseApiUrl();
        const response = await axios.get(`${base}/jan/font3/${encodeURIComponent(userText)}`);
        
        return res.json({
          reply: response.data?.message || "কি বললেন? আবার বলুন! 😊",
          author: 'Raihan Bot',
          triggered: true
        });
      }
    } else {
      return res.json({
        reply: `শুধু ${raihan.join(', ')} দিয়ে শুরু করুন!`,
        author: 'Raihan Bot',
        triggered: false
      });
    }
  } catch (error) {
    res.json({
      reply: 'Error processing request',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    server: 'Raihan API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Raihan API Server running on port ${PORT}`);
  console.log(`📝 Author: Raihan`);
  console.log(`🔗 Local: http://localhost:${PORT}`);
  console.log(`🎯 Triggers: ${raihan.join(', ')}`);
});

module.exports = app;
