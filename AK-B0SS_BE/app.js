const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();

// ✅ CORRECT CORS SETUP — PLACE AT TOP
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

// ✅ Manual headers (force set) — optional but helps with debugging
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());
app.use('/api/auth', authRoutes);
 // 🔁 Ping Pong route
app.get('/ping', (req, res) => {
  res.send('pong');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));