import { useEffect } from 'react';
import { useDailyCookd } from './useDailyCookd';

/**
 * Hook to manage daily Cook'd notifications and reminders
 * Checks if user should be notified and can trigger browser notifications
 */
export function useDailyCookdNotifications() {
  const { hasPostedToday, timeRemaining, streak } = useDailyCookd();

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {
        // User denied or error - silently fail
      });
    }
  }, []);

  useEffect(() => {
    if (hasPostedToday) return; // Don't notify if already posted

    // Notify when time is running low (less than 2 hours)
    if (timeRemaining !== null && timeRemaining > 0 && timeRemaining <= 7200) {
      const shouldNotify = timeRemaining <= 3600; // Notify when less than 1 hour left

      if (shouldNotify && 'Notification' in window && Notification.permission === 'granted') {
        const hours = Math.floor(timeRemaining / 3600);
        const minutes = Math.floor((timeRemaining % 3600) / 60);
        
        const timeStr = hours > 0 
          ? `${hours}h ${minutes}m` 
          : `${minutes}m`;

        new Notification('Daily Cook\'d Reminder', {
          body: `Only ${timeStr} left to share your cooking today! 🔥${streak > 0 ? ` Keep your ${streak} day streak going!` : ''}`,
          icon: '/favicon.ico',
          tag: 'daily-cookd-reminder', // Prevent duplicate notifications
        });
      }
    }
  }, [hasPostedToday, timeRemaining, streak]);

  return null;
}

