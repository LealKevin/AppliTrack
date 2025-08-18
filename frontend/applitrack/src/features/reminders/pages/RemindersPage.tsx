import React, { useState, useMemo } from 'react';
import { useDashboardReminders } from '../hooks/useDashboardReminders';
import { useRemindersWithApplications } from '../hooks/useRemindersWithApplications';
import ReminderCard from '../components/ReminderCard';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Input } from '@/shared/components/ui/input';
import { Calendar, Clock, AlertCircle, Search, X, Filter } from 'lucide-react';
import { REMINDER_URGENCIES } from '../types/dashboard';
import { startOfDay, endOfDay, endOfWeek, endOfMonth, isWithinInterval } from 'date-fns';

type TimeFilter = 'today' | 'this_week' | 'this_month' | 'all';

const RemindersPage: React.FC = () => {
  const { data, isLoading, error } = useDashboardReminders();
  const { reminders, isLoading: allRemindersLoading } = useRemindersWithApplications();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('today');
  
  const filteredReminders = useMemo(() => {
    let filtered = reminders;
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(reminder => {
        const company = reminder.Application?.company?.toLowerCase() || '';
        const title = reminder.Application?.title_application?.toLowerCase() || '';
        const notes = reminder.Application?.notes?.toLowerCase() || '';
        
        return company.includes(query) || 
               title.includes(query) || 
               notes.includes(query);
      });
    }
    
    if (timeFilter !== 'all') {
      const now = new Date();
      const today = startOfDay(now);
      const todayEnd = endOfDay(now);
      const weekEnd = endOfWeek(now, { weekStartsOn: 0 });
      const monthEnd = endOfMonth(now);
      
      filtered = filtered.filter(reminder => {
        const reminderDate = new Date(reminder.reminder_date);
        
        switch (timeFilter) {
          case 'today':
            // Show overdue + today's reminders
            return reminderDate <= todayEnd && reminder.status === 'pending';
          case 'this_week':
            // Show from today through end of current week
            return isWithinInterval(reminderDate, { start: today, end: weekEnd }) && reminder.status === 'pending';
          case 'this_month':
            // Show from today through end of current month
            return isWithinInterval(reminderDate, { start: today, end: monthEnd }) && reminder.status === 'pending';
          default:
            return true;
        }
      });
    }
    
    return filtered;
  }, [reminders, searchQuery, timeFilter]);
  
  // Debug logging
  console.log('RemindersPage - isLoading:', isLoading);
  console.log('RemindersPage - error:', error);
  console.log('RemindersPage - data:', data);
  console.log('RemindersPage - all reminders:', reminders);

  if (isLoading || allRemindersLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="h-6 w-6" />
          <h1 className="text-2xl font-bold">All Reminders</h1>
        </div>
        <div className="text-center py-8">Loading reminders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="h-6 w-6" />
          <h1 className="text-2xl font-bold">All Reminders</h1>
        </div>
        <div className="text-center py-8 text-red-500">
          Error loading reminders: {error.message}
        </div>
      </div>
    );
  }

  // Smart date grouping
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const thisWeekEnd = new Date(today);
  thisWeekEnd.setDate(today.getDate() + (7 - today.getDay())); // End of this week
  const nextWeekEnd = new Date(thisWeekEnd);
  nextWeekEnd.setDate(thisWeekEnd.getDate() + 7);
  const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  
  // Get all reminder IDs that are already shown in dashboard sections to avoid duplicates
  const dashboardReminderIds = new Set([
    ...(data?.overdue?.map(r => r.id) || []),
    ...(data?.due_today?.map(r => r.id) || []),
    ...(data?.due_this_week?.map(r => r.id) || [])
  ]);

  // Filter out reminders that are already shown in dashboard sections
  const remainingReminders = filteredReminders.filter(reminder => 
    !dashboardReminderIds.has(reminder.id)
  );

  // Filter remaining reminders into smart groups
  const tomorrowReminders = remainingReminders.filter(reminder => {
    const reminderDate = new Date(reminder.reminder_date);
    return reminderDate.toDateString() === tomorrow.toDateString() && reminder.status === 'pending';
  });
  
  const thisWeekReminders = remainingReminders.filter(reminder => {
    const reminderDate = new Date(reminder.reminder_date);
    return reminderDate > tomorrow && reminderDate <= thisWeekEnd && reminder.status === 'pending';
  });
  
  const nextWeekReminders = remainingReminders.filter(reminder => {
    const reminderDate = new Date(reminder.reminder_date);
    return reminderDate > thisWeekEnd && reminderDate <= nextWeekEnd && reminder.status === 'pending';
  });
  
  const thisMonthReminders = remainingReminders.filter(reminder => {
    const reminderDate = new Date(reminder.reminder_date);
    return reminderDate > nextWeekEnd && reminderDate <= thisMonthEnd && reminder.status === 'pending';
  });
  
  const laterReminders = remainingReminders.filter(reminder => {
    const reminderDate = new Date(reminder.reminder_date);
    return reminderDate > thisMonthEnd && reminder.status === 'pending';
  });

  // Calculate visible reminders based on current filter
  const getVisibleRemindersCount = () => {
    if (searchQuery) {
      return filteredReminders.length;
    }
    
    let count = 0;
    
    // Count based on what sections are visible for each filter
    switch (timeFilter) {
      case 'today':
        count += (data?.overdue?.length || 0);
        count += (data?.due_today?.length || 0);
        break;
        
      case 'this_week':
        count += (data?.overdue?.length || 0);
        count += (data?.due_today?.length || 0); 
        count += (data?.due_this_week?.length || 0);
        count += tomorrowReminders.length;
        count += thisWeekReminders.length;
        break;
        
      case 'this_month':
        count += (data?.overdue?.length || 0);
        count += (data?.due_today?.length || 0); 
        count += (data?.due_this_week?.length || 0);
        count += tomorrowReminders.length;
        count += thisWeekReminders.length;
        count += nextWeekReminders.length;
        count += thisMonthReminders.length;
        break;
        
      case 'all':
      default:
        count += (data?.overdue?.length || 0);
        count += (data?.due_today?.length || 0); 
        count += (data?.due_this_week?.length || 0);
        count += tomorrowReminders.length;
        count += thisWeekReminders.length;
        count += nextWeekReminders.length;
        count += thisMonthReminders.length;
        count += laterReminders.length;
        break;
    }
    
    return count;
  };
  
  const totalReminders = getVisibleRemindersCount();
                          
  console.log('RemindersPage - totalReminders:', totalReminders);
  console.log('RemindersPage - overdue count:', data?.overdue?.length || 0);
  console.log('RemindersPage - due_today count:', data?.due_today?.length || 0);
  console.log('RemindersPage - tomorrow count:', tomorrowReminders.length);
  console.log('RemindersPage - this week count:', thisWeekReminders.length);
  console.log('RemindersPage - next week count:', nextWeekReminders.length);
  console.log('RemindersPage - this month count:', thisMonthReminders.length);
  console.log('RemindersPage - later count:', laterReminders.length);
  console.log('RemindersPage - should show no reminders state:', totalReminders === 0);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="h-6 w-6" />
          <h1 className="text-2xl font-bold">All Reminders</h1>
          <Badge variant="secondary">{totalReminders} total</Badge>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-1 mr-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Show:</span>
        </div>
        
        {[
          { key: 'today', label: 'Today' },
          { key: 'this_week', label: 'This Week' },
          { key: 'this_month', label: 'This Month' },
          { key: 'all', label: 'All' }
        ].map(filter => (
          <Button
            key={filter.key}
            variant={timeFilter === filter.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter(filter.key as TimeFilter)}
            className="text-xs"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search reminders by company, job title, or notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>


      {/* No reminders state */}
      {totalReminders === 0 && !searchQuery && timeFilter === 'today' && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reminders set</h3>
            <p className="text-muted-foreground text-center">
              Start setting reminders on your job applications to stay organized!
            </p>
          </CardContent>
        </Card>
      )}

      {/* No search/filter results state */}
      {totalReminders === 0 && (searchQuery || timeFilter !== 'today') && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reminders found</h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your search terms or filters to see more reminders.
            </p>
            <div className="flex gap-2 mt-4">
              {searchQuery && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search
                </Button>
              )}
              {timeFilter !== 'today' && (
                <Button 
                  variant="outline" 
                  onClick={() => setTimeFilter('today')}
                >
                  Reset Filter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overdue reminders */}
      {data?.overdue && data.overdue.length > 0 && (timeFilter === 'all' || timeFilter === 'today' || timeFilter === 'this_week' || timeFilter === 'this_month') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Overdue ({data.overdue.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.overdue.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                urgency={REMINDER_URGENCIES.overdue}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Due today */}
      {data?.due_today && data.due_today.length > 0 && (timeFilter === 'all' || timeFilter === 'today' || timeFilter === 'this_week' || timeFilter === 'this_month') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Clock className="h-5 w-5" />
              Due Today ({data.due_today.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.due_today.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                urgency={REMINDER_URGENCIES.today}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Due this week */}
      {data?.due_this_week && data.due_this_week.length > 0 && (timeFilter === 'all' || timeFilter === 'this_week' || timeFilter === 'this_month') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Calendar className="h-5 w-5" />
              Due This Week ({data.due_this_week.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.due_this_week.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                urgency={REMINDER_URGENCIES.week}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tomorrow */}
      {tomorrowReminders && tomorrowReminders.length > 0 && (timeFilter === 'all' || timeFilter === 'this_week' || timeFilter === 'this_month') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-600">
              <Clock className="h-5 w-5" />
              Tomorrow ({tomorrowReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tomorrowReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                urgency={REMINDER_URGENCIES.week}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Rest of This Week */}
      {thisWeekReminders && thisWeekReminders.length > 0 && (timeFilter === 'all' || timeFilter === 'this_week' || timeFilter === 'this_month') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Calendar className="h-5 w-5" />
              Rest of This Week ({thisWeekReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {thisWeekReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                urgency={REMINDER_URGENCIES.week}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Next Week */}
      {nextWeekReminders && nextWeekReminders.length > 0 && (timeFilter === 'all' || timeFilter === 'this_month') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <Calendar className="h-5 w-5" />
              Next Week ({nextWeekReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nextWeekReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                urgency={REMINDER_URGENCIES.future}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* This Month */}
      {thisMonthReminders && thisMonthReminders.length > 0 && (timeFilter === 'all' || timeFilter === 'this_month') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Calendar className="h-5 w-5" />
              This Month ({thisMonthReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {thisMonthReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                urgency={REMINDER_URGENCIES.future}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Later */}
      {laterReminders && laterReminders.length > 0 && (timeFilter === 'all') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-5 w-5" />
              Later ({laterReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {laterReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                reminder={reminder}
                urgency={REMINDER_URGENCIES.future}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RemindersPage;