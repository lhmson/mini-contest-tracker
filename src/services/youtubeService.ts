import axios from 'axios';
import { Contest } from '../types/contest';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const PLAYLIST_IDS = [
  'PLcXpkI9A-RZI6FhydNz3JBt_-p_i25Cbr',
  'PLcXpkI9A-RZLUfBSNp-YQBCOezZKbDSgB',
  'PLcXpkI9A-RZIZ6lsE0KCcLWeKNoG45fYr',
];

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  url: string;
}

interface YouTubeApiResponse {
  items: Array<{
    snippet: {
      resourceId: {
        videoId: string;
      };
      title: string;
      description: string;
    };
  }>;
}

export const fetchPlaylistVideos = async (): Promise<YouTubeVideo[]> => {
  if (!YOUTUBE_API_KEY) {
    throw new Error('YouTube API key is not configured');
  }

  try {
    const videos: YouTubeVideo[] = [];

    for (const playlistId of PLAYLIST_IDS) {
      const response = await axios.get<YouTubeApiResponse>(
        `https://www.googleapis.com/youtube/v3/playlistItems`,
        {
          params: {
            part: 'snippet',
            maxResults: 50,
            playlistId,
            key: YOUTUBE_API_KEY,
          },
        }
      );

      const playlistVideos = response.data.items.map((item) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      }));

      videos.push(...playlistVideos);
    }

    return videos;
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    throw error;
  }
};

export const matchContestSolutions = (
  contests: Contest[],
  videos: YouTubeVideo[]
): Contest[] => {
  return contests.map((contest) => {
    const matchingVideo = videos.find((video) =>
      video.title.toLowerCase().includes(contest.name.toLowerCase())
    );

    if (matchingVideo) {
      return {
        ...contest,
        solutionUrl: matchingVideo.url,
      };
    }

    return contest;
  });
};

export const autoUpdateSolutions = async (
  contests: Contest[]
): Promise<Contest[]> => {
  try {
    const videos = await fetchPlaylistVideos();
    return matchContestSolutions(contests, videos);
  } catch (error) {
    console.error('Error auto-updating solutions:', error);
    return contests;
  }
};
