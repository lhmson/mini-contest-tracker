import axios from 'axios';
import { Contest, Platform } from '../types/contest';

const CODEFORCES_API = 'https://codeforces.com/api';
const CODECHEF_API =
  'https://competitive-coding-api.herokuapp.com/api/codechef';
const LEETCODE_API = 'https://leetcode.com/graphql';
const PROXY_URL = 'http://localhost:3001/api';

interface CodeforcesContest {
  id: number;
  name: string;
  phase: string;
  startTimeSeconds: number;
  durationSeconds: number;
}

interface LeetCodeContest {
  title: string;
  titleSlug: string;
  startTime: number;
  duration: number;
  isVirtual: boolean;
}

interface LeetCodeResponse {
  data: {
    allContests: LeetCodeContest[];
  };
}

export const fetchContests = async (): Promise<Contest[]> => {
  try {
    // Fetch from Codeforces
    const codeforcesResponse = await fetch(
      'https://codeforces.com/api/contest.list'
    );
    const codeforcesData = await codeforcesResponse.json();
    const codeforcesContests = codeforcesData.result
      .filter((contest: CodeforcesContest) => contest.phase === 'BEFORE')
      .map((contest: CodeforcesContest) => ({
        id: `cf-${contest.id}`,
        name: contest.name,
        platform: 'codeforces',
        startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
        endTime: new Date(
          (contest.startTimeSeconds + contest.durationSeconds) * 1000
        ).toISOString(),
        duration: contest.durationSeconds / 60,
        url: `https://codeforces.com/contests/${contest.id}`,
      }));

    // Fetch from LeetCode using proxy
    const leetcodeQuery = {
      query: `
        query {
          allContests {
            title
            titleSlug
            startTime
            duration
            isVirtual
          }
        }
      `,
    };

    const leetcodeResponse = await fetch(`${PROXY_URL}/leetcode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leetcodeQuery),
    });

    const leetcodeData = (await leetcodeResponse.json()) as LeetCodeResponse;
    const leetcodeContests = leetcodeData.data.allContests
      .filter((contest: LeetCodeContest) => !contest.isVirtual)
      .map((contest: LeetCodeContest) => ({
        id: `lc-${contest.titleSlug}`,
        name: contest.title,
        platform: 'leetcode',
        startTime: new Date(contest.startTime * 1000).toISOString(),
        endTime: new Date(
          (contest.startTime + contest.duration) * 1000
        ).toISOString(),
        duration: contest.duration / 60,
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
      }));

    return [...codeforcesContests, ...leetcodeContests];
  } catch (error) {
    console.error('Error fetching contests:', error);
    return [];
  }
};

const fetchCodeforcesContests = async (): Promise<Contest[]> => {
  try {
    const response = await axios.get(`${CODEFORCES_API}/contest.list`);
    return response.data.result
      .filter((contest: any) => contest.phase === 'BEFORE')
      .map((contest: any) => ({
        id: `cf-${contest.id}`,
        name: contest.name,
        platform: 'codeforces' as Platform,
        startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
        endTime: new Date(
          (contest.startTimeSeconds + contest.durationSeconds) * 1000
        ).toISOString(),
        duration: contest.durationSeconds / 60,
        url: `https://codeforces.com/contests/${contest.id}`,
      }));
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error);
    return [];
  }
};

const fetchCodechefContests = async (): Promise<Contest[]> => {
  try {
    const response = await axios.get(`${CODECHEF_API}/contests`);
    return response.data.contests
      .filter((contest: any) => contest.status === 'Upcoming')
      .map((contest: any) => ({
        id: `cc-${contest.contest_code}`,
        name: contest.contest_name,
        platform: 'codechef' as Platform,
        startTime: new Date(contest.contest_start_date).toISOString(),
        endTime: new Date(contest.contest_end_date).toISOString(),
        duration: 180, // Default duration in minutes
        url: `https://www.codechef.com/${contest.contest_code}`,
      }));
  } catch (error) {
    console.error('Error fetching Codechef contests:', error);
    return [];
  }
};

const fetchLeetcodeContests = async (): Promise<Contest[]> => {
  try {
    const response = await axios.post(LEETCODE_API, {
      query: `
        query {
          allContests {
            title
            titleSlug
            startTime
            duration
            isVirtual
            company {
              name
            }
          }
        }
      `,
    });

    return response.data.data.allContests
      .filter((contest: any) => new Date(contest.startTime) > new Date())
      .map((contest: any) => ({
        id: `lc-${contest.titleSlug}`,
        name: contest.title,
        platform: 'leetcode' as Platform,
        startTime: new Date(contest.startTime).toISOString(),
        endTime: new Date(
          new Date(contest.startTime).getTime() + contest.duration * 60000
        ).toISOString(),
        duration: contest.duration,
        url: `https://leetcode.com/contest/${contest.titleSlug}`,
      }));
  } catch (error) {
    console.error('Error fetching Leetcode contests:', error);
    return [];
  }
};
