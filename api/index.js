const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

// Codeforces API proxy
app.get('/api/contests/codeforces', async (req, res) => {
  try {
    const response = await axios.get('https://codeforces.com/api/contest.list');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Codeforces contests' });
  }
});

// LeetCode API proxy
app.get('/api/contests/leetcode', async (req, res) => {
  try {
    const response = await axios.post('https://leetcode.com/graphql', {
      query: `
        query contestList {
          allContests {
            title
            titleSlug
            startTime
            duration
            cardImg
          }
        }
      `,
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch LeetCode contests' });
  }
});

// AtCoder API proxy
app.get('/api/contests/atcoder', async (req, res) => {
  try {
    const response = await axios.get('https://atcoder.jp/contests');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AtCoder contests' });
  }
});

// CodeChef API proxy
app.get('/api/contests/codechef', async (req, res) => {
  try {
    const response = await axios.get('https://www.codechef.com/api/contests');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch CodeChef contests' });
  }
});

module.exports = app; 