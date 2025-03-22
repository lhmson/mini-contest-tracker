import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateSolutionUrl } from '../store/slices/contestsSlice';
import { Contest } from '../types/contest';

export const SolutionVideoForm: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedContestId, setSelectedContestId] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const pastContests = useSelector((state: RootState) =>
    state.contests.contests.filter((contest: Contest) => {
      const contestDate = new Date(contest.endTime);
      return contestDate < new Date();
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContestId || !videoUrl) {
      setError('Please fill in all fields');
      return;
    }

    if (!videoUrl.includes('youtube.com') && !videoUrl.includes('youtu.be')) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    try {
      dispatch(
        updateSolutionUrl({
          contestId: selectedContestId,
          solutionUrl: videoUrl,
        })
      );
      setSuccess(true);
      setError('');
      setSelectedContestId('');
      setVideoUrl('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update solution URL';
      setError(errorMessage);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant='h5' gutterBottom>
        Add Solution Video
      </Typography>
      <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Contest</InputLabel>
          <Select
            value={selectedContestId}
            onChange={(e) => setSelectedContestId(e.target.value)}
            label='Select Contest'
          >
            {pastContests.map((contest: Contest) => (
              <MenuItem key={contest.id} value={contest.id}>
                {contest.name} ({contest.platform})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label='YouTube Video URL'
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity='success' sx={{ mb: 2 }}>
            Solution video link added successfully!
          </Alert>
        )}

        <Button type='submit' variant='contained' color='primary'>
          Add Solution Video
        </Button>
      </Box>
    </Paper>
  );
};
