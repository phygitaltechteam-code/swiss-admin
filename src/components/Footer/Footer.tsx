/*eslint-disable*/
import {FiBarChart, FiMenu, FiX} from 'react-icons/fi';
import {useState} from 'react';
import MobileNotification from '../Header/MobileNotification';
import {AiFillNotification} from 'react-icons/ai';
import ClickOutside from '../ClickOutside';
import {FaThLarge, FaUsers} from 'react-icons/fa';
import {motion, AnimatePresence} from 'framer-motion';
import {useNavigate} from '@tanstack/react-router';

interface FooterProps {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}

const Footer = ({sidebarOpen, setSidebarOpen}: FooterProps) => {
  const [showNotification, setShowNotification] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const navigate = useNavigate();

  console.log('side bar', sidebarOpen);

  // Handler for showing tooltip
  const handleShowTooltip = (tooltipName: string) => {
    console.log(`Showing tooltip: ${tooltipName}`);
    setActiveTooltip(tooltipName);
  };

  // Handler for hiding tooltip
  const handleHideTooltip = () => {
    console.log('Hiding tooltip');
    setActiveTooltip(null);
  };

  return (
    <>
      <footer className="border-gray-100 fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 shadow-lg backdrop-blur-sm dark:border-strokedark dark:bg-boxdark">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="relative">
            <button
              onClick={() => {
                setSidebarOpen(!sidebarOpen);
                handleHideTooltip();
              }}
              onTouchStart={() => handleShowTooltip('Menu')}
              onTouchEnd={handleHideTooltip}
              onMouseDown={() => handleShowTooltip('Menu')}
              onMouseUp={handleHideTooltip}
              onMouseLeave={handleHideTooltip}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 flex h-10 w-10 items-center justify-center rounded-lg md:hidden"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? (
                <FiX className="text-xl text-black dark:text-white" />
              ) : (
                <FiMenu className="text-xl text-black dark:text-white" />
              )}
            </button>
            <AnimatePresence>
              {activeTooltip === 'Menu' && (
                <motion.div
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: 10}}
                  transition={{duration: 0.2}}
                  className="bg-gray-800 dark:bg-gray-200 dark:text-gray-800 absolute bottom-12 left-1/2 z-[60] -translate-x-1/2 rounded-md px-3 py-1.5 text-sm font-medium text-black shadow-lg"
                  aria-label="Menu tooltip"
                >
                  Menu
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                navigate({to: '/manager/customer'});
                handleHideTooltip();
              }}
              onTouchStart={() => handleShowTooltip('Customers')}
              onTouchEnd={handleHideTooltip}
              onMouseDown={() => handleShowTooltip('Customers')}
              onMouseUp={handleHideTooltip}
              onMouseLeave={handleHideTooltip}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 flex h-10 w-10 items-center justify-center rounded-lg"
              aria-label="Navigate to Customers"
            >
              <FaUsers className="text-3xl text-black dark:text-white" />
            </button>
            <AnimatePresence>
              {activeTooltip === 'Customers' && (
                <motion.div
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: 10}}
                  transition={{duration: 0.2}}
                  className="bg-gray-800 dark:bg-gray-200 dark:text-gray-800 absolute bottom-12 left-1/2 z-[60] -translate-x-1/2 rounded-md px-3 py-1.5 text-sm font-medium text-black shadow-lg"
                  aria-label="Customers tooltip"
                >
                  Customers
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                navigate({to: '/dashboard'});
                handleHideTooltip();
              }}
              onTouchStart={() => handleShowTooltip('Dashboard')}
              onTouchEnd={handleHideTooltip}
              onMouseDown={() => handleShowTooltip('Dashboard')}
              onMouseUp={handleHideTooltip}
              onMouseLeave={handleHideTooltip}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 flex h-10 w-10 items-center justify-center rounded-lg"
              aria-label="Navigate to Dashboard"
            >
              <FaThLarge className="text-xl text-black dark:text-white" />
            </button>
            <AnimatePresence>
              {activeTooltip === 'Dashboard' && (
                <motion.div
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: 10}}
                  transition={{duration: 0.2}}
                  className="bg-gray-800 dark:bg-gray-200 dark:text-gray-800 absolute bottom-12 left-1/2 z-[60] -translate-x-1/2 rounded-md px-3 py-1.5 text-sm font-medium text-black shadow-lg"
                  aria-label="Dashboard tooltip"
                >
                  Dashboard
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowReports(true);
                handleHideTooltip();
              }}
              onTouchStart={() => handleShowTooltip('Reports')}
              onTouchEnd={handleHideTooltip}
              onMouseDown={() => handleShowTooltip('Reports')}
              onMouseUp={handleHideTooltip}
              onMouseLeave={handleHideTooltip}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 flex h-10 w-10 items-center justify-center rounded-lg"
              aria-label="Open Reports"
            >
              <FiBarChart className="text-3xl font-bold text-black dark:text-white" />
            </button>
            <AnimatePresence>
              {activeTooltip === 'Reports' && (
                <motion.div
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: 10}}
                  transition={{duration: 0.2}}
                  className="bg-gray-800 dark:bg-gray-200 dark:text-gray-800 absolute bottom-12 left-1/2 z-[60] -translate-x-1/2 rounded-md px-3 py-1.5 text-sm font-medium text-black shadow-lg"
                  aria-label="Reports tooltip"
                >
                  Reports
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowNotification(true);
                handleHideTooltip();
              }}
              onTouchStart={() => handleShowTooltip('Notifications')}
              onTouchEnd={handleHideTooltip}
              onMouseDown={() => handleShowTooltip('Notifications')}
              onMouseUp={handleHideTooltip}
              onMouseLeave={handleHideTooltip}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 flex h-10 w-10 items-center justify-center rounded-lg"
              aria-label="Open Notifications"
            >
              <AiFillNotification className="text-xl text-black dark:text-white" />
            </button>
            <AnimatePresence>
              {activeTooltip === 'Notifications' && (
                <motion.div
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  exit={{opacity: 0, y: 10}}
                  transition={{duration: 0.2}}
                  className="bg-gray-800 dark:bg-gray-200 dark:text-gray-800 absolute bottom-12 left-1/2 z-[60] -translate-x-1/2 rounded-md px-3 py-1.5 text-sm font-medium text-black shadow-lg"
                  aria-label="Notifications tooltip"
                >
                  Notifications
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </footer>

      {showNotification && (
        <ClickOutside
          onClick={() => setShowNotification(false)}
          className="relative"
        >
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
            <div className="relative">
              <MobileNotification
                setShowNotification={setShowNotification}
                showNotification={showNotification}
              />
            </div>
          </div>
        </ClickOutside>
      )}

      {showReports && (
        <ClickOutside
          onClick={() => setShowReports(false)}
          className="relative"
        >
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="animate-slide-up border-gray-100 w-96 max-w-[90vw] rounded-2xl border bg-white p-6 shadow-xl dark:border-strokedark dark:bg-boxdark">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-black dark:text-white">
                    <svg
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Reports
                  </h2>
                  <button
                    onClick={() => setShowReports(false)}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-1 transition-colors"
                  >
                    <svg
                      className="text-gray-500 dark:text-gray-300 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <ul className="mb-6 space-y-2">
                <li
                  className="dark:hover:bg-gray-700 group flex cursor-pointer items-center justify-between rounded-xl border border-stroke p-3 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 dark:border-strokedark dark:hover:border-blue-600"
                  onClick={() => {
                    navigate({to: '/manager/reports/bookingreport'});
                    setShowReports(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2 transition-colors group-hover:bg-blue-200 dark:bg-blue-900/30 dark:group-hover:bg-blue-900/50">
                      <svg
                        className="h-4 w-4 text-blue-600 dark:text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-black dark:text-white">
                        Daily Report
                      </span>
                    </div>
                  </div>
                  <svg
                    className="text-gray-400 h-4 w-4 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </li>
                <li
                  className="dark:hover:bg-gray-700 group flex cursor-pointer items-center justify-between rounded-xl border border-stroke p-3 transition-all duration-200 hover:border-green-300 hover:bg-green-50 dark:border-strokedark dark:hover:border-green-600"
                  onClick={() => {
                    navigate({to: '/manager/incomereport'});
                    setShowReports(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2 transition-colors group-hover:bg-green-200 dark:bg-green-900/30 dark:group-hover:bg-green-900/50">
                      <svg
                        className="h-4 w-4 text-green-600 dark:text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="font-semibold text-black dark:text-white">
                        Income Report
                      </span>
                    </div>
                  </div>
                  <svg
                    className="text-gray-400 h-4 w-4 transition-colors group-hover:text-green-600 dark:group-hover:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </li>
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowReports(false)}
                  className="hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 flex-1 rounded-xl border border-stroke px-4 py-3 font-medium text-black transition-colors dark:border-strokedark"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </ClickOutside>
      )}
    </>
  );
};

export default Footer;
