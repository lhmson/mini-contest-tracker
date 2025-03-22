import axios from 'axios';
import { Contest } from '../types/contest';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const fetchAllContests = async (): Promise<Contest[]> => {
  try {
    const [codeforcesContests, codechefContests, leetcodeContests] = await Promise.all([
      fetchCodeforcesContests(),
      fetchCodechefContests(),
      fetchLeetcodeContests()
    ]);

    return [...codeforcesContests, ...codechefContests, ...leetcodeContests];
  } catch (error) {
    console.error('Error fetching contests:', error);
    throw error;
  }
};

export const fetchCodeforcesContests = async (): Promise<Contest[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/contests/codeforces`);
    return response.data;
  } catch (error) {
    console.error('Error fetching Codeforces contests:', error);
    return [];
  }
};

export const fetchCodechefContests = async (): Promise<Contest[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/contests/codechef`);
    return response.data;
  } catch (error) {
    console.error('Error fetching CodeChef contests:', error);
    return [];
  }
};

export const fetchLeetcodeContests = async (): Promise<Contest[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/contests/leetcode`);
    return response.data;
  } catch (error) {
    console.error('Error fetching LeetCode contests:', error);
    return [];
  }
};
