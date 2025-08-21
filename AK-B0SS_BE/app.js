const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

// ✅ CORRECT CORS SETUP — PLACE AT TOP

const allowedOrigins = [
  'http://localhost:4200',   // ✅ Local Angular dev
  'https://ak247pro.com'     // ✅ Production
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser clients like Postman
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ✅ Preflight handle

app.use(express.json());
app.use('/api/auth', authRoutes);
 // 🔁 Ping Pong route
app.get('/ping', (req, res) => {
  res.send('pong');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));