# Contest Tracker

A comprehensive platform for tracking coding contests from various platforms including Codeforces, CodeChef, and Leetcode.

## Features

- View upcoming and past coding contests
- Platform-specific filtering
- Contest bookmarking
- Solution video linking with YouTube integration
- Contest reminders (Email/SMS)
- Mobile and tablet responsive design
- Light/Dark mode support

## Tech Stack

- React.js
- TypeScript
- Redux Toolkit
- GraphQL
- Material-UI
- React Query
- Styled Components
- Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- YouTube API key (for solution video integration)
- Email service provider API key (for email reminders)
- SMS service provider API key (for SMS reminders)

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd contest-tracker
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Fill in your API keys in the `.env` file:
     - `VITE_YOUTUBE_API_KEY`: Your YouTube API key
     - `VITE_EMAIL_API_KEY`: Your email service provider API key
     - `VITE_SMS_API_KEY`: Your SMS service provider API key

4. Start the development server:

```bash
npm run dev
```

5. Build for production:

```bash
npm run build
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API and external service integrations
├── store/         # Redux store configuration
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── hooks/         # Custom React hooks
├── assets/        # Static assets (images, icons)
└── styles/        # Global styles and theme configuration
```

## Features in Detail

### Contest Tracking

- Real-time updates of contest schedules
- Filter contests by platform (Codeforces, CodeChef, LeetCode)
- View upcoming and past contests
- Bookmark favorite contests

### Solution Videos

- Automatic integration with YouTube playlists
- Manual linking of solution videos to contests
- Easy access to solution videos from contest cards

### Contest Reminders

- Set email or SMS reminders for contests
- Customizable reminder timing
- Support for multiple notification methods

### Theme Support

- Light and dark mode
- Responsive design for all devices
- Modern Material-UI components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
