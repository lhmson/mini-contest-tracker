// Fetch contests from all platforms
async function fetchAllContests() {
  try {
    const [codeforces, leetcode, codechef] = await Promise.all([
      fetch('https://codeforces.com/api/contest.list').then(res => res.json()),
      fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
          `
        })
      }).then(res => res.json()),
      fetch('https://www.codechef.com/api/list/contests/all').then(res => res.json())
    ]);

    const contests = [
      ...codeforces.result
        .filter(contest => contest.phase === 'BEFORE')
        .map(contest => ({
          id: `cf-${contest.id}`,
          name: contest.name,
          platform: 'codeforces',
          startTime: new Date(contest.startTimeSeconds * 1000).toISOString(),
          endTime: new Date((contest.startTimeSeconds + contest.durationSeconds) * 1000).toISOString(),
          duration: contest.durationSeconds / 60,
          url: `https://codeforces.com/contests/${contest.id}`,
        })),
      ...leetcode.data.allContests
        .filter(contest => !contest.isVirtual)
        .map(contest => ({
          id: `lc-${contest.titleSlug}`,
          name: contest.title,
          platform: 'leetcode',
          startTime: new Date(contest.startTime * 1000).toISOString(),
          endTime: new Date((contest.startTime + contest.duration) * 1000).toISOString(),
          duration: contest.duration,
          url: `https://leetcode.com/contest/${contest.titleSlug}`,
        })),
      ...codechef.future_contests.map(contest => ({
        id: `cc-${contest.contest_code}`,
        name: contest.contest_name,
        platform: 'codechef',
        startTime: new Date(contest.contest_start_date).toISOString(),
        endTime: new Date(contest.contest_end_date).toISOString(),
        duration: Math.round((new Date(contest.contest_end_date) - new Date(contest.contest_start_date)) / (60 * 1000)),
        url: `https://www.codechef.com/${contest.contest_code}`,
      }))
    ];

    // Store contests in chrome storage
    await chrome.storage.local.set({ contests });

    // Check for upcoming contests and set notifications
    const now = new Date();
    contests.forEach(contest => {
      const startTime = new Date(contest.startTime);
      const timeUntilStart = startTime - now;
      
      // Set notification for contests starting in the next 24 hours
      if (timeUntilStart > 0 && timeUntilStart <= 24 * 60 * 60 * 1000) {
        const notificationTime = new Date(startTime.getTime() - 30 * 60 * 1000); // 30 minutes before
        chrome.alarms.create(`contest-${contest.id}`, {
          when: notificationTime.getTime()
        });
      }
    });

    return contests;
  } catch (error) {
    console.error('Error fetching contests:', error);
    return [];
  }
}

// Handle alarm triggers for notifications
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name.startsWith('contest-')) {
    const contestId = alarm.name.replace('contest-', '');
    const { contests } = await chrome.storage.local.get('contests');
    const contest = contests.find(c => c.id === contestId);

    if (contest) {
      chrome.notifications.create(contestId, {
        type: 'basic',
        iconUrl: `icons/icon128.png`,
        title: 'Upcoming Contest!',
        message: `${contest.name} starts in 30 minutes!`
      });
    }
  }
});

// Handle notification clicks
chrome.notifications.onClicked.addListener((notificationId) => {
  const contestId = notificationId;
  chrome.storage.local.get('contests', ({ contests }) => {
    const contest = contests.find(c => c.id === contestId);
    if (contest) {
      chrome.tabs.create({ url: contest.url });
    }
  });
});

// Initial fetch
fetchAllContests();

// Fetch contests every hour
chrome.alarms.create('fetch-contests', { periodInMinutes: 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'fetch-contests') {
    fetchAllContests();
  }
}); 