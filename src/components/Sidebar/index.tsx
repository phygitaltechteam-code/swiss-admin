import React, {useEffect, useRef, useState} from 'react';
import {Link, useLocation} from '@tanstack/react-router';
import SidebarLinkGroup from './SidebarLinkGroup';
import {SidebarProps} from '@/types';
import {FaArrowLeftLong, FaUsers} from 'react-icons/fa6';
import {IoIosArrowUp, IoIosArrowDown} from 'react-icons/io';
import {useAuthContext} from '@/context/AuthContext';
import {
  MdDashboard,
  MdAccountCircle,
  MdDescription,
  MdFactCheck,
  MdCreditScore,
  MdPriceCheck,
  MdPercent,
  MdSettings,
  MdList,
  MdPerson,
  MdHistory,
  MdAccountBalance,
  MdChevronRight,
  MdChevronLeft,
  MdMenu,
} from 'react-icons/md';
import {FiBarChart} from 'react-icons/fi';

const Sidebar = ({sidebarOpen, setSidebarOpen}: SidebarProps) => {
  const location = useLocation();
  const {pathname} = location;
  const {user} = useAuthContext();
  const isEmployee = user?.role === 'EMPLOYEE';
  const isAdmin = user?.role === 'ADMIN';
  const isCompany = user?.role === 'COMPANY';

  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [openClientsMenu, setOpenClientsMenu] = useState(false);
  const [openReportsMenu, setOpenReportsMenu] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        // On mobile, sidebar should be closed by default
        setSidebarOpen(false);
      } else {
        // On desktop, sidebar should be open
        setSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [setSidebarOpen]);

  const handleSignOut = async () => {
    console.log('logouttt');
    localStorage.clear();
    window.location.reload();
  };

  // Define routes with React Icons
  const sidebarRoutes = isEmployee
    ? [
        {
          label: 'Dashboard',
          path: '/dashboard',
          icon: <MdDashboard size={22} />,
        },
      ]
    : isAdmin
      ? [
          {
            label: 'Dashboard',
            path: '/dashboard',
            icon: <MdDashboard size={22} />,
          },
          {
            label: 'Clients',
            icon: <FaUsers size={22} />,
            subRoutes: [
              {label: 'Client List', path: '/client/displayclient'},
              {label: 'Client Profile', path: '/client/profile'},
              {
                label: 'Transaction History',
                path: '/client/transactionhistory',
              },
              {label: 'Beneficiary Management', path: '/client/beneficiary'},
            ],
          },
          {
            label: 'Verifications',
            path: '/Approval/customerregisterapprove',
            icon: <MdFactCheck size={22} />,
          },
          {
            label: 'Top-Up Approvals',
            path: '/client/topup-approvals',
            icon: <MdCreditScore size={22} />,
          },
          {
            label: 'Transfer Approvals',
            path: '/client/transfer-approvals',
            icon: <MdPriceCheck size={22} />,
          },
          {
            label: 'Reports',
            path: '/reportCenter',
            icon: <MdDescription size={22} />,
          },
          {
            label: 'Commission Structure',
            path: '/client/comission',
            icon: <MdPercent size={22} />,
          },
          {
            label: 'Settings',
            icon: <MdSettings size={22} />,
            subRoutes: [
              {label: 'View Profile', path: '/manager/profile'},
              {label: 'Logout', onClick: () => handleSignOut()},
            ],
          },
        ]
      : isCompany
        ? [
            {
              label: 'Profile Management',
              icon: <MdAccountCircle size={22} />,
              subRoutes: [
                {label: 'View Profile', path: '/manager/profile'},
                {label: 'Logout', onClick: () => handleSignOut()},
              ],
            },
          ]
        : [];

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  // Toggle sidebar collapse (for desktop)
  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    if (!sidebarOpen || !isMobile) return;

    const clickHandler = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        sidebar.current?.contains(target) ||
        trigger.current?.contains(target) ||
        (target as HTMLElement).closest('[data-sidebar-toggle]')
      ) {
        return;
      }

      setSidebarOpen(false);
    };

    const timeout = setTimeout(() => {
      document.addEventListener('click', clickHandler);
    }, 50);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('click', clickHandler);
    };
  }, [sidebarOpen, isMobile, setSidebarOpen]);

  // Close sidebar on escape key (mobile only)
  useEffect(() => {
    const keyHandler = ({keyCode}: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27 || !isMobile) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  // Determine if a route is active
  const isRouteActive = (route: any) => {
    if (route.path) {
      return (
        pathname === route.path || (route.path && pathname.includes(route.path))
      );
    }
    return false;
  };

  // Handle link click (close sidebar on mobile)
  const handleLinkClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Menu Button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-lg lg:hidden"
          aria-label="Open menu"
        >
          <MdMenu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <aside
        ref={sidebar}
        className={`fixed left-0 top-0 z-9999 flex h-screen flex-col bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isMobile
            ? sidebarOpen
              ? 'w-72 translate-x-0'
              : 'w-72 -translate-x-full'
            : isCollapsed
              ? 'w-20 translate-x-0'
              : 'w-64 translate-x-0'
        }`}
      >
        {/* Logo Area */}
        <div className="b mt-4 flex h-16 items-center justify-between px-4 lg:px-6">
          <button
            onClick={toggleSidebar}
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="flex shrink-0 items-center justify-center rounded-lg bg-primary/10 p-1.5">
              <MdAccountBalance className="text-2xl text-primary" />
            </div>
            {(!isCollapsed || isMobile) && (
              <h1 className="text-gray-900 font-display text-lg font-bold tracking-tight">
                Swiss Admin
              </h1>
            )}
          </button>

          {/* Collapse/Expand button for desktop */}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="hover:bg-gray-100 flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <MdChevronRight className="text-gray-600" size={20} />
              ) : (
                <MdChevronLeft className="text-gray-600" size={20} />
              )}
            </button>
          )}

          {/* Close button for mobile */}
          {isMobile && (
            <button
              ref={trigger}
              onClick={() => setSidebarOpen(false)}
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              className="hover:bg-gray-100 flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
            >
              <FaArrowLeftLong className="text-gray-600" size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="flex grow flex-col gap-1 overflow-y-auto p-4">
          {(!isCollapsed || isMobile) && (
            <p className="text-gray-500 mb-2 px-3 text-xs font-semibold uppercase tracking-wider">
              Main Menu
            </p>
          )}

          {sidebarRoutes.map((route, index) => {
            if (route.subRoutes) {
              const isOpen =
                route.label === 'Clients'
                  ? openClientsMenu
                  : route.label === 'Settings'
                    ? openProfileMenu
                    : false;

              const setIsOpen =
                route.label === 'Clients'
                  ? setOpenClientsMenu
                  : route.label === 'Settings'
                    ? setOpenProfileMenu
                    : () => {};

              return (
                <div key={index} className="mb-1">
                  <button
                    onClick={() => {
                      if (!isMobile || !isCollapsed) {
                        setIsOpen(!isOpen);
                      } else {
                        handleLinkClick();
                      }
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 transition-colors ${
                      isRouteActive(route)
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-gray-100 text-black hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {route.icon}
                      {(!isCollapsed || isMobile) && (
                        <span className="text-sm font-medium">
                          {route.label}
                        </span>
                      )}
                    </div>
                    {(!isCollapsed || isMobile) && (
                      <IoIosArrowUp
                        className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        size={16}
                      />
                    )}
                  </button>

                  {/* Submenu */}
                  {isOpen && (!isCollapsed || isMobile) && (
                    <div className="border-gray-200 ml-2 mt-1 border-l pl-2">
                      <ul className="flex flex-col gap-1">
                        {route.subRoutes.map((subRoute, subIndex) => (
                          <li key={subIndex}>
                            {subRoute.path ? (
                              <Link
                                to={subRoute.path}
                                className="text-gray-600 hover:bg-gray-100 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:text-primary"
                                activeProps={{
                                  className: '!text-primary !bg-primary/10',
                                }}
                                onClick={handleLinkClick}
                              >
                                {(!isCollapsed || isMobile) &&
                                  subRoute.icon && (
                                    <span className="hidden lg:block">
                                      {subRoute.icon}
                                    </span>
                                  )}
                                <span>{subRoute.label}</span>
                              </Link>
                            ) : (
                              <button
                                onClick={() => {
                                  subRoute.onClick?.();
                                  handleLinkClick();
                                }}
                                className="text-gray-600 hover:bg-gray-100 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:text-red-600"
                              >
                                <span>{subRoute.label}</span>
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={index}
                to={route.path!}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isRouteActive(route)
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-gray-100 text-black hover:text-primary'
                }`}
                onClick={handleLinkClick}
              >
                {route.icon}
                {(!isCollapsed || isMobile) && (
                  <span className="text-sm font-medium">{route.label}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Minimal profile when collapsed on desktop */}
        {isCollapsed && !isMobile && (
          <div className="border-gray-200 border-t p-4">
            <div className="flex items-center justify-center">
              <button
                onClick={handleSignOut}
                className="hover:bg-gray-100 flex h-10 w-10 items-center justify-center rounded-full transition-colors"
                title="Logout"
              >
                <MdSettings className="text-gray-600" size={20} />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
