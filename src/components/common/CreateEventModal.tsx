import React from 'react';
import toast from 'react-hot-toast';
import {X} from 'lucide-react';
import {useGetBanquet} from '@/lib/react-query/banquet';

const CreateEventModal = ({
  showModal,
  setShowModal,
  eventName,
  setEventName,
  selectedDate,
  setSelectedDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  search,
  setSearch,
  handleSave,
  navigate,
  occationStatus,
  setOcstionStatus,
  priority,
  setPriority,
  description,
  setDescription,
  filterEmployees,
  showOptions,
  setShowOptions,
  selectedEmployee,
  setSelectedEmployee,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 mb-6 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent mx-auto mt-20 max-h-[80vh] w-full max-w-md overflow-y-auto rounded-lg bg-white shadow-xl dark:bg-boxdark">
        {/* Header */}
        <div className="border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 z-10 border-b px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-gray-900 text-xl font-semibold dark:text-white">
              Add New Event
            </h2>
            <div className="flex items-center gap-2">
              <button
                className="hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-2 transition"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <X className="text-gray-700 dark:text-gray-300 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-gray-700 dark:text-gray-300 block text-sm font-medium">
                Name
              </label>
              <input
                className="border-gray-300 text-gray-900 placeholder-gray-500 w-full rounded-md border bg-white px-3 py-1 transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-boxdark dark:text-white"
                type="text"
                placeholder="Enter event name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
              />
            </div>
            <div className="relative space-y-2">
              <label className="text-gray-700 dark:text-gray-300 block text-sm font-medium">
                Customer Name
              </label>
              <input
                type="text"
                value={selectedEmployee?.user?.fullname || search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedEmployee(null);
                  setShowOptions(true);
                }}
                onFocus={() => setShowOptions(true)}
                onBlur={() => setTimeout(() => setShowOptions(false), 200)}
                placeholder="Search customer"
                className="border-gray-300 dark:border-gray-600 text-gray-900 placeholder-gray-500 w-full rounded-lg border bg-white px-3 py-1 transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-boxdark dark:text-white"
                required
              />
              {showOptions && (
                <div className="border-gray-300 dark:border-gray-600 absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-white shadow-lg dark:bg-boxdark">
                  {filterEmployees.length > 0 ? (
                    filterEmployees.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedEmployee(c);
                          setSearch(c?.user?.fullname);
                          setShowOptions(false);
                        }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 border-gray-100 dark:border-gray-600 cursor-pointer border-b px-4 py-3 transition-colors duration-150 last:border-b-0 dark:text-white"
                      >
                        {c?.user?.fullname}
                      </div>
                    ))
                  ) : (
                    <div
                      className="text-gray-500 dark:text-gray-400 px-4 py-3 text-center"
                      onClick={() => navigate({to: '/manager/customer'})}
                    >
                      + add new
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-gray-700 dark:text-gray-300 block text-sm font-medium">
                Description
              </label>
              <input
                className="border-gray-300 text-gray-900 placeholder-gray-500 w-full rounded-md border bg-white px-3 py-1 transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-boxdark dark:text-white"
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative">
                <label className="text-gray-700 dark:text-gray-300 mb-2 block text-sm font-medium">
                  Status
                </label>
                <select
                  name="status"
                  required
                  onChange={(e) => setOcstionStatus(e.target.value)}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 w-full rounded-lg border bg-white px-3 py-2 shadow-sm focus:outline-none dark:bg-boxdark"
                >
                  <option value="">Select Status</option>
                  <option value="STARTED">STARTED</option>
                  <option value="WORKING">WORKING</option>
                  <option value="DONE">DONE</option>
                  <option value="DELAYED">DELAYED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
              <div className="relative">
                <label className="text-gray-700 dark:text-gray-300 mb-2 block text-sm font-medium">
                  Priority
                </label>
                <input
                  name="totalGuest"
                  onChange={(e) => setPriority(e.target.value)}
                  className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 w-full rounded-lg border bg-white px-3 py-1 shadow-sm focus:outline-none dark:bg-boxdark"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300 block text-sm font-medium">
                  Start Date
                </label>
                <input
                  type="date"
                  className="border-gray-300 dark:border-gray-600 text-gray-900 w-full rounded-lg border bg-white px-3 py-1 transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-boxdark dark:text-white"
                  value={selectedDate || ''}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300 block text-sm font-medium">
                  End Date
                </label>
                <input
                  type="date"
                  className="border-gray-300 dark:border-gray-600 text-gray-900 w-full rounded-lg border bg-white px-3 py-1 transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-boxdark dark:text-white"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300 block text-sm font-medium">
                  Start Time
                </label>
                <input
                  type="time"
                  className="border-gray-300 dark:border-gray-600 text-gray-900 w-full rounded-lg border bg-white px-3 py-1 transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-boxdark dark:text-white"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-gray-700 dark:text-gray-300 block text-sm font-medium">
                  End Time
                </label>
                <input
                  type="time"
                  className="border-gray-300 dark:border-gray-600 text-gray-900 w-full rounded-lg border bg-white px-3 py-1 transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-boxdark dark:text-white"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-white transition-colors duration-200 hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20"
              >
                Save Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
