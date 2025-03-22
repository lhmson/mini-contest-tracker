import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Link,
} from '@mui/material';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import { Contest } from '../types/contest';
import {
  formatTimeRemaining,
  formatContestTime,
  getContestStatus,
} from '../utils/timeUtils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleBookmark } from '../store/slices/contestsSlice';

interface ContestCardProps {
  contest: Contest;
}

const platformColors = {
  codeforces: '#1F8ACB',
  codechef: '#5B4638',
  leetcode: '#FFA116',
};

export const ContestCard: React.FC<ContestCardProps> = ({ contest }) => {
  const dispatch = useDispatch();
  const bookmarkedContests = useSelector(
    (state: RootState) => state.contests.bookmarkedContests
  );
  const isBookmarked = bookmarkedContests.includes(contest.id);

  const handleBookmarkToggle = () => {
    dispatch(toggleBookmark(contest.id));
  };

  const status = getContestStatus(contest.startTime, contest.endTime);
  const statusColor =
    status === 'upcoming'
      ? 'success'
      : status === 'ongoing'
        ? 'warning'
        : 'default';

  return (
    <Card sx={{ mb: 2, position: 'relative' }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="div" gutterBottom>
              {contest.name}
            </Typography>
            <Chip
              label={contest.platform}
              size="small"
              sx={{
                backgroundColor: platformColors[contest.platform],
                color: 'white',
                mb: 1,
              }}
            />
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Start: {formatContestTime(contest.startTime)}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Duration: {Math.floor(contest.duration / 60)} hours{' '}
              {contest.duration % 60} minutes
            </Typography>
            {status === 'upcoming' && (
              <Typography variant="body2" color="primary" gutterBottom>
                Time remaining: {formatTimeRemaining(contest.startTime)}
              </Typography>
            )}
            <Chip
              label={status}
              color={statusColor}
              size="small"
              sx={{ mr: 1 }}
            />
            {contest.solutionUrl && (
              <Link
                href={contest.solutionUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ ml: 1 }}
              >
                Solution Video
              </Link>
            )}
          </Box>
          <IconButton onClick={handleBookmarkToggle} color="primary">
            {isBookmarked ? <Bookmark /> : <BookmarkBorder />}
          </IconButton>
        </Box>
        <Link
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ mt: 1, display: 'block' }}
        >
          View Contest
        </Link>
      </CardContent>
    </Card>
  );
};
