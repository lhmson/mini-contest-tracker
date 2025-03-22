import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Contest } from '../types/contest';
import { scheduleReminder } from '../services/reminderService';
import { isContestUpcoming } from '../utils/timeUtils';

export const ReminderForm: React.FC = () => {
  const [selectedContestId, setSelectedContestId] = useState('');
  const [reminderTime, setReminderTime] = useState(60); // Default: 1 hour
  const [notificationType, setNotificationType] = useState<'email' | 'sms'>(
    'email'
  );
  const [contactInfo, setContactInfo] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const upcomingContests = useSelector((state: RootState) =>
    state.contests.contests.filter((contest: Contest) =>
      isContestUpcoming(contest.startTime)
    )
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedContestId || !reminderTime || !contactInfo) {
      setError('Please fill in all fields');
      return;
    }

    if (notificationType === 'email' && !contactInfo.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (notificationType === 'sms' && !/^\+?\d{10,}$/.test(contactInfo)) {
      setError('Please enter a valid phone number');
      return;
    }

    try {
      const contest = upcomingContests.find((c) => c.id === selectedContestId);
      if (!contest) {
        throw new Error('Contest not found');
      }

      await scheduleReminder(
        contest,
        'user-id',
        reminderTime,
        notificationType
      );
      setSuccess(true);
      setError('');
      setSelectedContestId('');
      setReminderTime(60);
      setContactInfo('');
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to schedule reminder';
      setError(errorMessage);
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Set Contest Reminder
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Select Contest</InputLabel>
          <Select
            value={selectedContestId}
            onChange={(e) => setSelectedContestId(e.target.value)}
            label="Select Contest"
          >
            {upcomingContests.map((contest) => (
              <MenuItem key={contest.id} value={contest.id}>
                {contest.name} ({contest.platform})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Reminder Time</InputLabel>
          <Select
            value={reminderTime}
            onChange={(e) => setReminderTime(Number(e.target.value))}
            label="Reminder Time"
          >
            <MenuItem value={15}>15 minutes before</MenuItem>
            <MenuItem value={30}>30 minutes before</MenuItem>
            <MenuItem value={60}>1 hour before</MenuItem>
            <MenuItem value={120}>2 hours before</MenuItem>
            <MenuItem value={1440}>1 day before</MenuItem>
          </Select>
        </FormControl>

        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Notification Type
          </Typography>
          <RadioGroup
            value={notificationType}
            onChange={(e) =>
              setNotificationType(e.target.value as 'email' | 'sms')
            }
          >
            <FormControlLabel value="email" control={<Radio />} label="Email" />
            <FormControlLabel value="sms" control={<Radio />} label="SMS" />
          </RadioGroup>
        </FormControl>

        <TextField
          fullWidth
          label={
            notificationType === 'email' ? 'Email Address' : 'Phone Number'
          }
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          placeholder={
            notificationType === 'email' ? 'your@email.com' : '+1234567890'
          }
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Reminder set successfully!
          </Alert>
        )}

        <Button type="submit" variant="contained" color="primary">
          Set Reminder
        </Button>
      </Box>
    </Paper>
  );
};
