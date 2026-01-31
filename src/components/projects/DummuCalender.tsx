import React, {useState} from 'react';
import {EventStatus, StudioEvent, ViewMode} from './types';
import {STATUS_COLORS, INITIAL_EVENTS} from './constants';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 9, 1)); // October 2023
  const [events] = useState<StudioEvent[]>(INITIAL_EVENTS);
  const [viewMode, setViewMode] = useState<ViewMode>('Month');

  // Helper to get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const days = [];
    // Prefix with previous month days to start on correct day of week
    const startOffset = firstDayOfMonth.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        currentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        currentMonth: true,
      });
    }

    // Suffix with next month days to complete grid (up to 42 cells for 6 weeks)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        currentMonth: false,
      });
    }

    return days;
  };

  const calendarDays = getDaysInMonth(currentDate);

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (e) =>
        e.date.getFullYear() === date.getFullYear() &&
        e.date.getMonth() === date.getMonth() &&
        e.date.getDate() === date.getDate(),
    );
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1),
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="dark:bg-gray-900 flex flex-1 flex-col overflow-hidden bg-white">
      {/* Calendar Controls */}
      <div className="border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark no-scrollbar z-10 flex shrink-0 items-center justify-between gap-4 overflow-x-auto border-b px-4 py-2">
        <div className="flex shrink-0 items-center gap-3">
          <h1 className="text-gray-900 min-w-[140px] whitespace-nowrap text-lg font-bold dark:text-white">
            {currentDate.toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </h1>
          <div className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center overflow-hidden rounded-md border shadow-sm">
            <button
              onClick={() => changeMonth(-1)}
              className="dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 p-1 transition-all hover:bg-white hover:text-primary"
            >
              <span className="material-icons-outlined text-lg">
                chevron_left
              </span>
            </button>
            <div className="bg-gray-200 dark:bg-gray-700 h-4 w-[1px]"></div>
            <button
              onClick={() => changeMonth(1)}
              className="dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 p-1 transition-all hover:bg-white hover:text-primary"
            >
              <span className="material-icons-outlined text-lg">
                chevron_right
              </span>
            </button>
          </div>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md border px-2.5 py-1 text-xs font-semibold shadow-sm transition-colors active:scale-95"
          >
            Today
          </button>
        </div>

        {/* Legend */}
        <div className="text-gray-500 dark:text-gray-400 hidden items-center gap-4 whitespace-nowrap text-[10px] font-semibold xl:flex">
          {Object.entries(EventStatus).map(([key, status]) => (
            <div
              key={key}
              className="hover:text-gray-800 dark:hover:text-gray-200 flex cursor-help items-center gap-1.5 transition-colors"
            >
              <span
                className={`h-2 w-2 rounded-full ${STATUS_COLORS[status].dot}`}
              ></span>
              {status}
            </div>
          ))}
        </div>

        {/* View Switcher */}
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex rounded-md shadow-sm">
            {(['Month', 'Week', 'Day'] as ViewMode[]).map((mode, idx) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`border-gray-200 dark:border-gray-700 border-y border-r px-3 py-1 text-xs font-medium transition-all ${
                  idx === 0 ? 'rounded-l-md border-l' : ''
                } ${idx === 2 ? 'rounded-r-md' : ''} ${
                  viewMode === mode
                    ? 'border-primary bg-primary text-white'
                    : 'dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white'
                }`}
              >
                {mode.substring(0, 2)}
              </button>
            ))}
          </div>
          <button
            className="text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-md border bg-white p-1 shadow-sm transition-colors hover:text-primary"
            title="Filter"
          >
            <span className="material-icons-outlined text-lg">filter_list</span>
          </button>
        </div>
      </div>

      {/* Grid Header */}
      <div className="border-gray-200 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 grid shrink-0 grid-cols-7 border-b text-center shadow-sm">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-gray-500 dark:text-gray-400 py-1.5 text-[10px] font-bold uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid h-full flex-1 grid-cols-7 grid-rows-6 overflow-hidden">
        {calendarDays.map((dayObj, idx) => {
          const dateEvents = getEventsForDate(dayObj.date);
          const isSelectedMonth = dayObj.currentMonth;
          const isCurrentDay = isToday(dayObj.date);

          return (
            <div
              key={idx}
              className={`border-gray-100 dark:border-gray-800 group relative flex flex-col border-b border-r ${
                !isSelectedMonth
                  ? 'bg-gray-50/40 dark:bg-gray-900/40'
                  : 'dark:bg-gray-900 bg-white'
              } h-full overflow-hidden transition-colors duration-150 hover:bg-blue-50/30 dark:hover:bg-blue-900/10`}
            >
              <div className="flex shrink-0 items-start justify-between p-1">
                <span
                  className={`text-xs font-bold leading-none ${
                    !isSelectedMonth
                      ? 'text-gray-300 dark:text-gray-700'
                      : isCurrentDay
                        ? 'flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow-sm'
                        : 'text-gray-400 dark:text-gray-500'
                  }`}
                >
                  {dayObj.date.getDate()}
                </span>
                {isSelectedMonth && (
                  <button className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded p-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="material-icons-outlined text-gray-400 text-[10px]">
                      add
                    </span>
                  </button>
                )}
              </div>

              <div className="no-scrollbar flex flex-1 flex-col gap-0.5 overflow-y-auto px-0.5 pb-1">
                {dateEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`w-full ${STATUS_COLORS[event.status].bg} ${STATUS_COLORS[event.status].text} cursor-pointer truncate rounded-sm border border-transparent px-1.5 py-0.5 text-[10px] font-bold shadow-sm transition-all hover:border-black/5 hover:opacity-85 active:scale-95 dark:hover:border-white/5`}
                    title={`${event.title} - ${event.status}`}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
