import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Codeforces API endpoint
app.get('/api/contests/codeforces', async (req, res) => {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    const contests = response.data.result
      .filter(contest => contest.phase === 'BEFORE')
      .map(contest => ({
        id: `cf-${contest.id}`,
        name: contest.name,
        platform: 'codeforces',
        startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
        endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000).toISOString(),
        duration: contest.durationSeconds / 60,
        url: `https://codeforces.com/contests/${contest.id}`,
      }));
    res.json(contests);
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error);
    res.status(500).json({ error: 'Failed to fetch Codeforces contests' });
  }
});

// LeetCode API endpoint
app.get('/api/contests/leetcode', async (req, res) => {
  try {
    const query = `
      query {
        allContests {
          title
          titleSlug
          startTime
          duration
          isVirtual
        }
      }
    `;

    const response = await axios.post('https://leetcode.com/graphql', { query });
    const contests = response.data.data.allContests
      .filter(contest => !contest.isVirtual)
      .map(contest => ({
        id: `lc-${contest.titleSlug}`,
        name: contest.title,
        platform: 'leetcode',
        startTime: new Date(contest.startTime * 1000).toISOString(),
        endTime: new Date((contest.startTime + contest.duration) * 1000).toISOString(),
        duration: contest.duration,
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
      }));
    res.json(contests);
  } catch (error) {
    console.error('Error fetching LeetCode contests:', error);
    res.status(500).json({ error: 'Failed to fetch LeetCode contests' });
  }
});

// CodeChef API endpoint
app.get('/api/contests/codechef', async (req, res) => {
  try {
    const response = await axios.get('https://www.codechef.com/api/list/contests/all');
    const contests = response.data.future_contests.map(contest => ({
      id: `cc-${contest.contest_code}`,
      name: contest.contest_name,
      platform: 'codechef',
      startTime: new Date(contest.contest_start_date).toISOString(),
      endTime: new Date(contest.contest_end_date).toISOString(),
      duration: Math.round((new Date(contest.contest_end_date) - new Date(contest.contest_start_date)) / (60 * 1000)),
      url: `https://www.codechef.com/${contest.contest_code}`,
    }));
    res.json(contests);
  } catch (error) {
    console.error('Error fetching CodeChef contests:', error);
    res.status(500).json({ error: 'Failed to fetch CodeChef contests' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Contest Tracker API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

export default app; 