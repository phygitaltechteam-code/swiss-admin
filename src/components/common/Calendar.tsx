import {useNavigate} from '@tanstack/react-router';
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import React, {useEffect, useMemo, useState} from 'react';
import {FaAngleLeft, FaAngleRight, FaStar} from 'react-icons/fa6';

import {useAuthContext} from '@/context/AuthContext';
import toast from 'react-hot-toast';
import {useAddProject, useGetAllProjects} from '@/lib/api/occassionApi';
import CreateEventModal from './CreateEventModal';

import EventDetailsModal from './EventDetailsModal';
import UpdateEventModal from './UpdateEventModal';

import {useEmployees} from '@/lib/api/employeeApi';

interface IEventTypes {
  EventID: string;
  StartDate: string;
  EndDate: string;
  EventName: string;
  status: string;
  paid: number;
  pending: number;
  isPremium: boolean;
  banquet: any;
}

const statusColorMap = {
  ENQUIRY: 'bg-[#87CEEB] dark:bg-[#87CEEB]',
  FINALIZED: 'bg-[#FF1493] dark:bg-[#FF1493]',
  PREPARATION: 'bg-[#0097A7] dark:bg-[#0097A7]',
  PAID: 'bg-[#32CD32] dark:bg-[#2E8B57]',
};

const Calendar = () => {
  const navigate = useNavigate();
  const {user} = useAuthContext();
  const isManager = user?.role === 'MANAGER';
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  console.log('state date', selectedDate);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState(null);
  const [selectedOccasionId, setSelectedOccasionId] = useState(null);
  const [occationStatus, setOcstionStatus] = useState<string>('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [priority, setPriority] = useState('');
  // const {data: expiryData} = useGetAdminExpiry();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopup, setIsPopup] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const startOfMonthDate = startOfMonth(currentMonth);
  const endOfMonthDate = endOfMonth(currentMonth);
  const startWeekDate = startOfWeek(startOfMonthDate);
  const endWeekDate = endOfWeek(endOfMonthDate);
  const days = eachDayOfInterval({start: startWeekDate, end: endWeekDate});
  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const [eventToEdit, setEventToEdit] = useState<IEventTypes | null>(null);
  const {mutateAsync: addProject, isSuccess} = useAddProject(user?.roleId);
  const {data, refetch} = useGetAllProjects();
  console.log('data', data);

  const {data: employees} = useEmployees();

  console.log('all projectss', employees);

  // const {data: muhurts} = useMuhurts(user?.roleId);
  // const tithiMap = React.useMemo(() => {
  //   const map = {};
  //   muhurts?.forEach((entry) => {
  //     const dateKey = new Date(entry.date).toISOString().slice(0, 10);
  //     if (!map[dateKey]) {
  //       map[dateKey] = [];
  //     }
  //     map[dateKey].push(entry.tithi);
  //   });
  //   return map;
  // }, [muhurts]);

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    event: IEventTypes | null;
    dayEvents?: IEventTypes[];
  }>({visible: false, x: 0, y: 0, event: null});

  useEffect(() => {
    const handleClick = () => {
      if (contextMenu.visible) {
        setContextMenu((prev) => ({...prev, visible: false}));
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [contextMenu.visible]);

  const handlePopupClose = () => {
    setIsPopup(false);
  };

  const events = data?.data?.events.map(
    (event: {id: number; name: string}) => ({
      id: event.id,
      name: event.name,
    }),
  );

  const formatLocalTime = (dateString: string) => {
    const [datePart, timePart] = dateString?.split('T');
    const [year, month, day] = datePart?.split('-');
    const [time] = timePart?.split('.');
    const [hours, minutes] = time?.split(':');

    return format(
      new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hours),
        parseInt(minutes),
      ),
      'PPp',
    );
  };

  const loadEventDates: IEventTypes[] = useMemo(() => {
    return (
      data?.map(
        (event: {
          id: string;
          name: string;
          startDate: string;
          endDate: string;
          status: string;
          banquet: any;
          paid: number;
          pending: number;
          amount: number;
        }) => {
          const {
            id,
            name,
            startDate,
            endDate,
            status,
            banquet,
            paid,
            pending,
            amount,
          } = event;

          return {
            EventID: id,
            StartDate: startDate.split('T')[0],
            EndDate: endDate.split('T')[0],
            EventName: name,
            status: status?.toUpperCase(),
            isPremium: name.toLowerCase().includes('premium'),
            banquet: banquet,
            paid: paid || 0,
            pending: pending || 0,
            amount: amount || 0,
          };
        },
      ) || []
    );
  }, [data]);
  useEffect(() => {
    if (!selectedOccasionId) return;

    const one = data?.find((event: any) => event.id === selectedOccasionId);
    setSelectedOccasion(one || null);
  }, [selectedOccasionId, data]);

  function getEventsForDay(date: Date) {
    return loadEventDates.filter((event) => {
      const eventStart = new Date(event.StartDate + 'T00:00');
      const eventEnd = new Date(event.EndDate + 'T23:59');
      return date >= eventStart && date <= eventEnd;
    });
  }

  const eventsInCurrentMonth = useMemo(() => {
    const currentMonthStart = startOfMonth(currentMonth);
    const currentMonthEnd = endOfMonth(currentMonth);

    return loadEventDates.filter((event) => {
      const eventStart = new Date(event.StartDate + 'T00:00');
      const eventEnd = new Date(event.EndDate + 'T00:00');
      return eventStart <= currentMonthEnd && eventEnd >= currentMonthStart;
    });
  }, [loadEventDates, currentMonth]);

  const navigateToEvents = (path: string) => navigate({to: path});

  const addEventHandler = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const addDatesToLocalStorage = (startDate: string, endDate: string) => {
    localStorage.setItem('startDate', startDate);
    localStorage.setItem('endDate', endDate);
  };

  function organizeEventsByWeek(
    allEvents: IEventTypes[],
    weekStart: Date,
    weekEnd: Date,
  ) {
    const filteredEvents = allEvents.filter((e) => {
      const start = new Date(e.StartDate + 'T00:00');
      const end = new Date(e.EndDate + 'T00:00');
      return end >= weekStart && start <= weekEnd;
    });

    const sortedEvents = [...filteredEvents].sort((a, b) => {
      const startA = new Date(a.StartDate + 'T00:00').getTime();
      const startB = new Date(b.StartDate + 'T00:00').getTime();
      if (startA === startB) {
        return (
          new Date(a.EndDate + 'T00:00').getTime() -
          new Date(b.EndDate + 'T00:00').getTime()
        );
      }
      return startA - startB;
    });

    const eventRows: Record<string, number> = {};
    const rowEndDates: Date[] = [];

    sortedEvents.forEach((event) => {
      const start = new Date(event.StartDate + 'T00:00');
      const end = new Date(event.EndDate + 'T00:00');

      let row = 0;
      while (row < rowEndDates.length) {
        if (start > rowEndDates[row]) break;
        row++;
      }

      eventRows[event.EventID] = row;
      rowEndDates[row] = end;
    });

    const maxRow = rowEndDates.length;

    return {
      events: sortedEvents,
      eventRows,
      maxRow,
    };
  }

  const handleSave = (e) => {
    e.preventDefault();

    if (!selectedDate || !endDate) {
      toast.error('Please select start and end dates');
      return;
    }

    const startDateTime = new Date(`${selectedDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    const startDateTimeISO =
      startDateTime.toISOString().split('T')[0] +
      'T' +
      startDateTime.toTimeString().split(' ')[0] +
      '.000Z';
    const endDateTimeISO =
      endDateTime.toISOString().split('T')[0] +
      'T' +
      endDateTime.toTimeString().split(' ')[0] +
      '.000Z';

    const formData = {
      name: eventName,
      employeeId: selectedEmployee?.id,
      description: description,
      startDate: startDateTimeISO,
      endDate: endDateTimeISO,
      status: occationStatus,
      priority: priority,
    };

    addProject(formData);
    setSearch('');
    setSelectedDate(null);
    setEndDate('');
    setEventName('');
    setPriority('');
    setDescription('');
    setStartTime('09:00');
    setEndTime('17:00');
    console.log(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      setShowCreateModal(false); // Close create modal
      setSelectedDate(null);
      setSelectedCustomer(null);
      setSearch('');
      setEventName('');
      setEndDate('');
      setStartTime('09:00');
      setEndTime('17:00');
    }
  }, [isSuccess]);

  // useEffect(() => {
  //   if (expiryData?.endDate) {
  //     const today = new Date();
  //     const expiryDate = new Date(expiryData.endDate);

  //     const timeDiff = expiryDate.getTime() - today.getTime();
  //     const calculatedDaysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  //     setDaysLeft(calculatedDaysLeft);

  //     if (
  //       (calculatedDaysLeft > 0 && calculatedDaysLeft <= 7) ||
  //       calculatedDaysLeft <= 0
  //     ) {
  //       setShowPopup(true);
  //     }
  //   }
  // }, [expiryData]);

  const formatToYMD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = (date) => {
    const formatted = formatToYMD(date); // Correct local format without shifting
    setSelectedDate(formatted);
    setShowCreateModal(true);
  };

  const filteredEmployees = employees?.filter((c) =>
    c?.user?.fullname?.toLowerCase().includes(search.toLowerCase()),
  );

  const renderEventsForWeek = (weekDays: Date[]) => {
    const weekStart = weekDays[0];
    const weekEnd = weekDays[6];
    const rowHeight = 24;

    const {events, eventRows} = organizeEventsByWeek(
      loadEventDates,
      weekStart,
      weekEnd,
    );

    return events.flatMap((event) => {
      console.log('eventss', event);
      const eventStart = new Date(event.StartDate + 'T00:00');
      const eventEnd = new Date(event.EndDate + 'T00:00');

      const clampedStart = eventStart < weekStart ? weekStart : eventStart;
      const clampedEnd = eventEnd > weekEnd ? weekEnd : eventEnd;

      let startCol = weekDays.findIndex((day) => isSameDay(day, clampedStart));
      let endCol = weekDays.findIndex((day) => isSameDay(day, clampedEnd));

      if (startCol === -1) startCol = 0;
      if (endCol === -1) endCol = 6;

      const colSpan = endCol - startCol + 1;
      const rowPosition = eventRows[event.EventID] ?? 0;
      const eventColor =
        statusColorMap[event.status as keyof typeof statusColorMap] ||
        'bg-neutral-300';

      const gapPercentage = 1;
      const adjustedWidth = (colSpan * 100) / 7 - gapPercentage * 2;
      const adjustedLeft = (startCol * 100) / 7 + gapPercentage;

      return (
        <div
          key={`week-${weekStart.toISOString()}-event-${event.EventID}`}
          className="group absolute mt-2"
          style={{
            left: `${adjustedLeft}%`,
            width: `${adjustedWidth}%`,
            top: `calc(25px + ${rowPosition * rowHeight}px)`,
            height: `${rowHeight - 4}px`,
          }}
        >
          <div
            className={`h-full w-full cursor-pointer rounded-sm px-1`}
            style={{
              backgroundColor: event?.banquet?.colour || '#3B82F6',
            }}
            onClick={() => {
              setShowDetailsModal(true);
              setSelectedOccasionId(event.EventID);
              addDatesToLocalStorage(event.StartDate, event.EndDate);
            }}
            onContextMenu={(e) => {
              e.preventDefault();
            }}
          >
            <p className="truncate text-xs text-white">
              {event.EventName}
              {event.isPremium && (
                <FaStar className="ml-1 inline text-yellow-500" size={10} />
              )}
            </p>
          </div>

          {/* Tooltip positioned below the event strip */}
          {user?.plan !== 'FREE' && (
            <div
              className="pointer-events-none absolute left-1/2 z-[9999] hidden w-64 -translate-x-1/2 transform rounded-md border border-gray bg-graydark p-3 text-sm opacity-0 shadow-lg transition-opacity duration-200 group-hover:block group-hover:opacity-100 dark:border-graydark dark:bg-gray"
              style={{
                top: `calc(100% + 5px)`,
              }}
            >
              <div className="mb-1 font-semibold text-gray dark:text-black">
                {event.EventName}
                {event.isPremium && (
                  <FaStar className="ml-1 inline text-yellow-400" />
                )}
              </div>
              <div className="text-xs text-gray dark:text-graydark">
                <div>
                  <span className="font-medium">Start:</span>{' '}
                  {formatLocalTime(
                    data?.find((e: {id: string}) => e.id === event.EventID)
                      ?.startDate,
                  )}
                </div>
                <div>
                  <span className="font-medium">End:</span>{' '}
                  {formatLocalTime(
                    data?.find((e: {id: string}) => e.id === event.EventID)
                      ?.endDate,
                  )}
                </div>
                <div>
                  <span className="font-medium">Status:</span> {event.status}
                </div>
                <div>
                  <span className="font-medium">Paid:</span>{' '}
                  {
                    data?.find((e: {id: string}) => e.id === event.EventID)
                      ?.paid
                  }
                </div>

                <div>
                  <span className="font-medium">pending:</span>{' '}
                  {
                    data?.find((e: {id: string}) => e.id === event.EventID)
                      ?.pending
                  }
                </div>
                <div>
                  <span className="font-medium">Amount:</span>{' '}
                  {
                    data?.find((e: {id: string}) => e.id === event.EventID)
                      ?.amount
                  }
                </div>
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <div className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <header className="flex items-center justify-between bg-primary p-4 text-white">
          <button onClick={handlePrevMonth} className="text-sm">
            <FaAngleLeft />
          </button>
          <h2 className="text-xl font-semibold">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button onClick={handleNextMonth} className="text-sm">
            <FaAngleRight />
          </button>
        </header>

        <table className="w-full">
          <thead>
            <tr className="grid grid-cols-7 rounded-t-sm bg-primary text-white">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <th
                  key={day}
                  className="flex h-10 items-center justify-center p-1 text-xs font-semibold sm:text-base xl:p-5"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({length: days.length / 7}).map((_, rowIndex) => {
              const weekDays = days.slice(rowIndex * 7, rowIndex * 7 + 7);
              const {maxRow} = organizeEventsByWeek(
                loadEventDates,
                weekDays[0],
                weekDays[6],
              );

              return (
                <tr
                  key={rowIndex}
                  className="relative grid grid-cols-7"
                  style={{minHeight: `${(maxRow + 1) * 28}px`}}
                >
                  {weekDays.map((date, colIndex) => {
                    const isCurrentMonthDay =
                      date.getMonth() === currentMonth.getMonth() &&
                      date.getFullYear() === currentMonth.getFullYear();

                    return (
                      <td
                        key={colIndex}
                        className={`relative h-30 border border-stroke transition duration-500 hover:bg-gray dark:border-strokedark dark:hover:bg-meta-4 md:p-1 ${
                          isToday(date)
                            ? 'bg-blue-100 text-white dark:bg-primary'
                            : ''
                        } ${
                          isBefore(date, new Date()) && !isToday(date)
                            ? 'text-gray-500 dark:text-gray-400 bg-gray dark:bg-graydark'
                            : isCurrentMonthDay
                              ? 'text-black dark:text-white'
                              : 'text-gray-400 dark:text-gray-600'
                        } ${
                          !isBefore(date, new Date()) && isCurrentMonthDay
                            ? 'hover:bg-gray-100 cursor-pointer dark:hover:bg-meta-4'
                            : 'cursor-default'
                        }`}
                        onClick={() => {
                          handleDateClick(date);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          const eventsForThisDay = getEventsForDay(date);
                          if (eventsForThisDay.length > 0) {
                            setContextMenu({
                              visible: true,
                              x: e.pageX,
                              y: e.pageY,
                              event: null,
                              dayEvents: eventsForThisDay,
                            });
                          }
                        }}
                      >
                        {/* Date number and Tithi symbols in the top area */}
                        <div className="flex items-center gap-1 sm:gap-2 md:gap-11">
                          <span
                            className={`text-sm font-medium sm:text-base ${
                              isToday(date) && isCurrentMonthDay
                                ? 'flex h-5 w-5 items-center justify-center rounded-full text-lg font-semibold text-blue-500 dark:text-white sm:h-6 sm:w-6 sm:text-xl'
                                : ''
                            }`}
                          >
                            {format(date, 'd')}
                          </span>
                        </div>
                      </td>
                    );
                  })}

                  {renderEventsForWeek(weekDays)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* <div className="mt-4 rounded border border-stroke bg-white p-4 shadow dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-sm font-semibold text-black dark:text-white">
          Tithi Legend
        </h3>
        <div className="flex flex-wrap gap-4">
          {[
            ...new Map(muhurts?.map((t) => [t?.tithi?.id, t?.tithi])).values(),
          ].map((tithi) => (
            <div key={tithi?.id} className="flex items-center gap-2">
              <span
                style={{
                  color: tithi?.colour,
                  fontSize: 14,
                  fontWeight: 'bold',
                }}
              >
                卐
              </span>
              <span className="text-sm text-black dark:text-white">
                {tithi?.name}
              </span>
            </div>
          ))}
        </div>
      </div> */}

      <CreateEventModal
        showModal={showCreateModal}
        setShowModal={setShowCreateModal}
        eventName={eventName}
        setEventName={setEventName}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        endDate={endDate}
        setEndDate={setEndDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        search={search}
        setSearch={setSearch}
        handleSave={handleSave}
        navigate={navigate}
        occationStatus={occationStatus}
        setOcstionStatus={setOcstionStatus}
        priority={priority}
        setPriority={setPriority}
        description={description}
        setDescription={setDescription}
        filterEmployees={filteredEmployees}
        showOptions={showOptions}
        setShowOptions={setShowOptions}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
      />

      <EventDetailsModal
        showDetailsModal={showDetailsModal}
        setShowDetailsModal={setShowDetailsModal}
        selectedOccasion={selectedOccasion}
        setSelectedOccasion={setSelectedOccasion}
        navigate={navigate}
        setShowUpdateModal={setShowUpdateModal}
        setEventName={setEventName}
        setSelectedDate={setSelectedDate}
        setEndDate={setEndDate}
        setSelectedCustomer={setSelectedCustomer}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
      />

      <UpdateEventModal
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        selectedOccasion={selectedOccasion}
        eventName={eventName}
        setEventName={setEventName}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        endDate={endDate}
        setEndDate={setEndDate}
        startTime={startTime}
        setStartTime={setStartTime}
        endTime={endTime}
        setEndTime={setEndTime}
        search={search}
        setSearch={setSearch}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        showOptions={showOptions}
        setShowOptions={setShowOptions}
        navigate={navigate}
      />

      {/* {showPopup && daysLeft !== null && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-strokedark">
              <h2 className="text-lg font-semibold text-black dark:text-white">
                Expiry
              </h2>
            </div>
            <div className="space-y-4 p-6 text-black dark:text-white">
              {daysLeft === 0
                ? 'Your pack is expired'
                : `Your pack will expire in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`}
            </div>
            <div className="flex justify-end p-6">
              <button
                onClick={() => {
                  if (daysLeft > 0) {
                    setShowPopup(false);
                    setDaysLeft(null);
                  }
                }}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* 
      {isUpdateModalOpen && eventToEdit && (
        <UpdateEventModal
          showModal={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          eventData={eventToEdit}
        />
      )} */}

      {/* {isPopup && (
        <ExpiryPopup
          onClose={handlePopupClose}
          daysRemaining={daysRemaining}
          expiryDate={data?.data?.expiry?.expiryDate || null}
        />
      )} */}
    </>
  );
};

export default Calendar;
