/* eslint-disable*/

import {useEffect, useRef, useState} from 'react';
import {Link, useLocation} from '@tanstack/react-router';
import SidebarLinkGroup from './SidebarLinkGroup';
import {SidebarProps} from '@/types';
import {IoIosArrowDown} from 'react-icons/io';
import {BiHome} from 'react-icons/bi';
import {
  MdAccountCircle,
  MdCreditScore,
  MdDashboard,
  MdDescription,
  MdFactCheck,
  MdPercent,
  MdPriceCheck,
  MdSettings,
} from 'react-icons/md';
import {useAuthContext} from '@/context/AuthContext';
import {FaUsers, FaUserTie} from 'react-icons/fa';

const Sidebar = ({sidebarOpen, setSidebarOpen}: SidebarProps) => {
  const location = useLocation();
  const {pathname} = location;
  const {user} = useAuthContext();
  const isEmployee = user?.role === 'EMPLOYEE';
  const isAdmin = user?.role === 'ADMIN';
  const isCompany = user?.role === 'COMPANY';
  const isFixedOpenRef = useRef(false);
  const [isFixedOpen, setIsFixedOpen] = useState(false);
  const isExpanded = sidebarOpen || isFixedOpen;

  console.log('isExpandedvbbbn', isExpanded);
  const [hoveredRoute, setHoveredRoute] = useState<string | null>(null);
  const [hoveredRect, setHoveredRect] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [showSubRoutes, setShowSubRoutes] = useState<{
    label: string;
    subRoutes: any[];
  } | null>(null);

  const handleSignOut = async () => {
    console.log('logouttt');
    localStorage.clear();
    window.location.reload();
  };
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
            label: 'Client',
            path: '/client/displayclient',
            icon: <FaUsers size={22} />,
          },
          {
            label: 'Beneficiary Management',
            path: '/client/beneficiary',
            icon: <FaUserTie size={22} />,
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
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{
    top: number;
    left: number;
  } | null>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  const [isHovered, setIsHovered] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      const {target} = event;
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setSidebarOpen(false);
      setHoveredRoute(null);
      setShowSubRoutes(null);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    const keyHandler = ({keyCode}: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
      setHoveredRoute(null);
      setShowSubRoutes(null);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [sidebarOpen, setSidebarOpen]);

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);
  // Handle screen resize for responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
        setIsFixedOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative z-50">
      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-white text-black transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:translate-x-0`}
      >
        {/* Header */}

        <div className="flex items-center justify-between px-4 py-3 lg:px-6 lg:py-5">
          <button
            className="flex items-center gap-3 rounded-lg transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-[0.98]"
            onClick={() => {
              const nextState = !isExpanded;

              setSidebarOpen(nextState);
              setIsFixedOpen(nextState);

              // Close any open floating submenus when toggling
              setHoveredRoute(null);
              setShowSubRoutes(null);
              setHoveredRect(null);
            }}
            aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isExpanded ? (
              <div className="flex items-center gap-3">
                <p className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text px-2 text-2xl font-bold text-primary text-transparent lg:text-3xl">
                  Swiss Quote
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-2.5 shadow-sm transition-all duration-200 hover:from-primary/15 hover:to-primary/10">
                <BiHome className="h-7 w-7 text-primary lg:h-8 lg:w-8" />
              </div>
            )}
          </button>
        </div>

        {/* SUB-MENUBAR */}
        <div className="no-scrollbar flex flex-col overflow-y-auto px-2 duration-300 ease-linear">
          <nav className="mt-4 space-y-1 p-2">
            <ul>
              {sidebarRoutes.map((route, index) =>
                route.subRoutes ? (
                  <SidebarLinkGroup activeCondition={isExpanded} key={index}>
                    {(handleClick, open) => (
                      <div className="relative">
                        <button
                          onMouseEnter={(e) => {
                            if (!isExpanded) {
                              const rect =
                                e.currentTarget.getBoundingClientRect();
                              setHoveredLabel(route.label);
                              setTooltipPos({
                                top: rect.top + rect.height / 2,
                                left: rect.right + 8,
                              });
                            }
                          }}
                          onMouseLeave={() => {
                            setHoveredLabel(null);
                            setTooltipPos(null);
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            const rect = (
                              e.currentTarget as HTMLElement
                            ).getBoundingClientRect();

                            setHoveredRect({
                              top: rect.top,
                              left: rect.right + 5,
                            });
                            setHoveredRoute(route.label);

                            setShowSubRoutes({
                              label: route.label,
                              subRoutes: route.subRoutes || [],
                            });
                          }}
                          className={`group flex w-full items-center gap-2.5 rounded px-3 py-2 text-sm font-medium text-black hover:bg-primary/10 ${
                            pathname.includes(route.path!) ? 'bg-graydark' : ''
                          }`}
                        >
                          <span className="text-black transition-colors group-hover:text-primary">
                            {route.icon}
                          </span>
                          {isExpanded && route.label}
                          {isExpanded && (
                            <IoIosArrowDown
                              className={`ml-auto transform duration-200 ${open ? 'rotate-180' : ''}`}
                            />
                          )}
                        </button>
                        {isExpanded && open && (
                          <ul className="ml-6 mt-1 space-y-1">
                            {route.subRoutes.map((subRoute, subIndex) => (
                              <li key={subIndex}>
                                <Link
                                  to={subRoute.path}
                                  onClick={() => {
                                    setHoveredRoute(null);
                                    setShowSubRoutes(null);
                                    setSidebarOpen(false);
                                  }}
                                  className="block rounded px-3 py-2 text-sm text-black hover:bg-primary/20"
                                >
                                  {subRoute.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </SidebarLinkGroup>
                ) : (
                  <li key={index}>
                    <Link
                      to={route.path}
                      onMouseEnter={(e) => {
                        const rect = (
                          e.currentTarget as unknown as HTMLAnchorElement
                        ).getBoundingClientRect();
                        setHoveredLabel(route.label);
                        setTooltipPos({
                          top: rect.top + rect.height / 2,
                          left: rect.right + 8,
                        });
                      }}
                      onMouseLeave={() => {
                        setHoveredLabel(null);
                        setTooltipPos(null);
                      }}
                      onClick={() => {
                        setHoveredRoute(null);
                        setShowSubRoutes(null);
                        setSidebarOpen(false);
                      }}
                      className={`group flex w-full items-center gap-2.5 rounded px-3 py-2 text-sm font-medium text-black hover:bg-primary/10 ${
                        pathname.includes(route.path) ? 'bg-primary/10' : ''
                      }`}
                    >
                      <span className="text-black transition-colors group-hover:text-primary">
                        {route.icon}
                      </span>
                      {isExpanded && route.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
      </aside>

      {hoveredLabel && tooltipPos && !isExpanded && (
        <div
          className="fixed z-50 rounded bg-white px-2 py-1 text-xs text-black shadow"
          style={{
            top: tooltipPos.top,
            left: tooltipPos.left,
            transform: 'translateY(-50%)',
          }}
        >
          {hoveredLabel}
        </div>
      )}

      {/* Floating Subroute Menu when sidebar is collapsed */}
      {showSubRoutes && hoveredRect && (
        <div
          className="fixed z-[999] w-56 overflow-y-auto rounded-md bg-white p-2 text-black shadow-lg"
          style={{
            top: (() => {
              const menuItemCount = showSubRoutes.subRoutes.length;
              const estimatedHeight = menuItemCount * 40 + 20; // 40px per item + padding
              const maxTop = window.innerHeight - estimatedHeight - 20;

              return Math.min(hoveredRect.top, maxTop);
            })(),
            left: hoveredRect.left + 5,
            maxHeight: 'calc(100vh - 100px)', // Reserve space for weather widget
          }}
          onMouseEnter={() => {
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current);
            }
          }}
          onMouseLeave={() => {
            closeTimeoutRef.current = setTimeout(() => {
              setHoveredRoute(null);
              setShowSubRoutes(null);
              setHoveredRect(null);
            }, 300);
          }}
        >
          {showSubRoutes.subRoutes.map((subRoute, subIndex) => (
            <Link
              key={subIndex}
              to={subRoute.path}
              onClick={() => {
                setHoveredRect(null);
                setHoveredRoute(null);
                setShowSubRoutes(null);
                if (window.innerWidth < 1024) {
                  setSidebarOpen(false);
                }
              }}
              className="flex items-center gap-2 rounded px-3 py-2 text-sm text-black hover:bg-primary/10"
            >
              {subRoute.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
