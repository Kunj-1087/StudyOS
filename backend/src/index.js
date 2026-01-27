import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import { initializeFirebase } from './config/firebaseConfig.js'; // TODO: Implement later

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
