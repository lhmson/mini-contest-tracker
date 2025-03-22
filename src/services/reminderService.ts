import { Contest, ContestReminder } from '../types/contest';

const EMAIL_API_KEY = import.meta.env.VITE_EMAIL_API_KEY;
const SMS_API_KEY = import.meta.env.VITE_SMS_API_KEY;

export const scheduleReminder = async (
  contest: Contest,
  userId: string,
  reminderTime: number,
  notificationType: 'email' | 'sms'
): Promise<ContestReminder> => {
  const reminder: ContestReminder = {
    contestId: contest.id,
    userId,
    reminderTime,
    notificationType,
    isEnabled: true,
  };

  // Here you would typically save the reminder to your backend
  // For now, we'll just return the reminder object
  return reminder;
};

export const sendEmailReminder = async (
  contest: Contest,
  email: string
): Promise<void> => {
  if (!EMAIL_API_KEY) {
    throw new Error('Email API key is not configured');
  }

  // Here you would integrate with your email service provider (e.g., SendGrid)
  console.log(`Sending email reminder for ${contest.name} to ${email}`);
};

export const sendSMSReminder = async (
  contest: Contest,
  phoneNumber: string
): Promise<void> => {
  if (!SMS_API_KEY) {
    throw new Error('SMS API key is not configured');
  }

  // Here you would integrate with your SMS service provider (e.g., Twilio)
  console.log(`Sending SMS reminder for ${contest.name} to ${phoneNumber}`);
};

export const processReminders = async (
  contests: Contest[],
  reminders: ContestReminder[]
): Promise<void> => {
  const now = new Date();

  for (const contest of contests) {
    const contestStart = new Date(contest.startTime);
    const contestReminders = reminders.filter(
      (r) => r.contestId === contest.id && r.isEnabled
    );

    for (const reminder of contestReminders) {
      const reminderTime = new Date(
        contestStart.getTime() - reminder.reminderTime * 60 * 1000
      );

      if (reminderTime <= now) {
        // Send reminder based on notification type
        // In a real application, you would fetch the user's contact information from your backend
        if (reminder.notificationType === 'email') {
          await sendEmailReminder(contest, 'user@example.com');
        } else {
          await sendSMSReminder(contest, '+1234567890');
        }

        // Disable the reminder after sending
        reminder.isEnabled = false;
      }
    }
  }
};
