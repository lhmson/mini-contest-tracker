import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Proxy endpoint for LeetCode GraphQL API
app.post('/api/leetcode', async (req, res) => {
  try {
    const response = await axios.post(
      'https://leetcode.com/graphql',
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching from LeetCode:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from LeetCode' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
