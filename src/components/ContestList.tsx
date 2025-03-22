import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useInView } from 'react-intersection-observer';
import { FixedSizeGrid as VirtualGrid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { AppDispatch, RootState } from '../store';
import { fetchContests } from '../store/slices/contestsSlice';
import { ContestCard } from './ContestCard';
import { Contest } from '../types/contest';
import { isUpcoming, isPast, getContestStatus } from '../utils/timeUtils';

const CONTESTS_PER_PAGE = 12;
const CARD_WIDTH = 380;
const CARD_HEIGHT = 300;
const GRID_GAP = 20;

interface GridCellProps {
  columnIndex: number;
  rowIndex: number;
  style: React.CSSProperties;
}

interface AutoSizerProps {
  height: number;
  width: number;
}

export const ContestList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { contests, loading, error } = useSelector(
    (state: RootState) => state.contests
  );
  const { platforms, timeRange, searchQuery } = useSelector(
    (state: RootState) => state.filters
  ) as { platforms: string[]; timeRange: string[]; searchQuery: string };

  const [displayedContests, setDisplayedContests] = useState<Contest[]>([]);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    dispatch(fetchContests());
  }, [dispatch]);

  // Filter contests based on current filters
  useEffect(() => {
    const filtered = contests.filter((contest) => {
      // Platform filter
      if (platforms.length > 0 && !platforms.includes(contest.platform)) {
        return false;
      }

      // Time range filter
      if (timeRange.length > 0) {
        const status = getContestStatus(contest.startTime, contest.endTime);
        if (!timeRange.includes(status)) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          contest.name.toLowerCase().includes(query) ||
          contest.platform.toLowerCase().includes(query)
        );
      }

      return true;
    });

    // Reset pagination when filters change
    setPage(1);
    setDisplayedContests(filtered.slice(0, CONTESTS_PER_PAGE));
  }, [contests, platforms, timeRange, searchQuery]);

  // Load more contests when scrolling to the bottom
  useEffect(() => {
    if (inView && !loading) {
      const filtered = contests.filter((contest) => {
        if (platforms.length > 0 && !platforms.includes(contest.platform)) {
          return false;
        }
        if (timeRange.length > 0) {
          const status = getContestStatus(contest.startTime, contest.endTime);
          if (!timeRange.includes(status)) {
            return false;
          }
        }
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            contest.name.toLowerCase().includes(query) ||
            contest.platform.toLowerCase().includes(query)
          );
        }
        return true;
      });

      const startIndex = page * CONTESTS_PER_PAGE;
      const endIndex = startIndex + CONTESTS_PER_PAGE;
      const newContests = filtered.slice(startIndex, endIndex);

      if (newContests.length > 0) {
        setDisplayedContests((prev) => [...prev, ...newContests]);
        setPage((prev) => prev + 1);
      }
    }
  }, [inView, loading, contests, platforms, timeRange, searchQuery, page]);

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (displayedContests.length === 0 && !loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          No contests found matching your filters.
        </Typography>
      </Box>
    );
  }

  const CARD_WIDTH_WITH_GAP = CARD_WIDTH + GRID_GAP;
  const CARD_HEIGHT_WITH_GAP = CARD_HEIGHT + GRID_GAP;

  const VirtualizedGrid: React.FC<AutoSizerProps> = ({ width, height }) => {
    const columnCount = Math.max(1, Math.floor((width + GRID_GAP) / CARD_WIDTH_WITH_GAP));
    const rowCount = Math.ceil(displayedContests.length / columnCount);

    return (
      <VirtualGrid
        columnCount={columnCount}
        columnWidth={CARD_WIDTH_WITH_GAP}
        height={height}
        rowCount={rowCount}
        rowHeight={CARD_HEIGHT_WITH_GAP}
        width={width}
        style={{ overflowX: 'hidden' }}
      >
        {({ columnIndex, rowIndex, style }: GridCellProps) => {
          const index = rowIndex * columnCount + columnIndex;
          const contest = displayedContests[index];

          if (!contest) return null;

          return (
            <div
              style={{
                ...style,
                padding: GRID_GAP / 2,
                width: CARD_WIDTH_WITH_GAP,
                height: CARD_HEIGHT_WITH_GAP,
              }}
            >
              <Box
                sx={{
                  height: '100%',
                  '& > *': {
                    height: '100%',
                    '& .MuiPaper-root': {
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    },
                  },
                }}
              >
                <ContestCard contest={contest} />
              </Box>
            </div>
          );
        }}
      </VirtualGrid>
    );
  };

  return (
    <Box sx={{ position: 'relative', height: 'calc(100vh - 10px)' }}>
      <Box sx={{ height: '100%' }}>
        <AutoSizer>
          {({ height, width }: AutoSizerProps) => (
            <VirtualizedGrid width={width} height={height} />
          )}
        </AutoSizer>
      </Box>

      {/* Loading indicator */}
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            bgcolor: 'background.paper',
            borderRadius: '50%',
            p: 1,
            boxShadow: 2,
          }}
        >
          <CircularProgress size={32} />
        </Box>
      )}

      {/* Intersection observer target */}
      <Box
        ref={ref}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
        }}
      />
    </Box>
  );
};
