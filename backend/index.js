/**
 * Express backend for Cheatsheet Manager.
 * Uses MongoDB for storage; config via .env (PORT, MONGODB_URI).
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const Cheatsheets = require('./models/Cheatsheets');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

/**
 * GET /api/cheatsheets - Returns the full cheatsheets document (courses tree).
 */
app.get('/api/cheatsheets', async (req, res) => {
  try {
    const doc = await Cheatsheets.findOne().lean();
    const payload = doc ? { courses: doc.courses || [] } : { courses: [] };
    res.json(payload);
  } catch (err) {
    console.error('Error reading cheatsheets:', err);
    res.status(500).json({ message: 'Failed to read cheatsheets data' });
  }
});

/**
 * POST /api/cheatsheets - Replaces the stored cheatsheets with the request body.
 * Body must be { courses: [...] }.
 */
app.post('/api/cheatsheets', async (req, res) => {
  try {
    const courses = Array.isArray(req.body.courses) ? req.body.courses : [];
    await Cheatsheets.findOneAndUpdate(
      {},
      { courses },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Error writing cheatsheets:', err);
    res.status(500).json({ message: 'Failed to write cheatsheets data' });
  }
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Cheatsheet backend running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
