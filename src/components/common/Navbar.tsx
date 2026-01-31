import React, {useState} from 'react';
import {Menu, X, Users, Building, Plus} from 'lucide-react';
import DarkModeSwitcher from '../Header/DarkModeSwitcher';
import DropdownUser from '../Header/DropdownUser';
import {Link, useLocation, useNavigate} from '@tanstack/react-router';
import {useAppContext} from './PopUp';
import {useAuthContext} from '@/context/AuthContext';
import path from 'path';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {user} = useAuthContext();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const toggleMenu = () => setIsOpen(!isOpen);
  const navigate = useNavigate();
  const {setPositionList, setDisplayDepartment} = useAppContext();
  const isActive = (path?: string) =>
    path && location.pathname.startsWith(path);

  const getMenu = () => {
    if (user?.role === 'ADMIN') return superAdminMenu;
    if (user?.role === 'COMPANY') return adminMenu;
    return employeeMenu;
  };

  const adminMenu = [
    {
      label: 'Department',
      icon: <Building size={18} />,
      action: () => setDisplayDepartment(true),
    },
    {
      label: 'Position',
      icon: <Building size={18} />,
      action: () => setPositionList(true),
    },

    {
      label: 'Employee',
      icon: <Building size={18} />,
      path: '/employee/CreateEmp',
      action: () => navigate({to: `/employee/CreateEmp`}),
    },
    {
      label: 'Project',
      icon: <Building size={18} />,
      path: '/project/createproject',
      action: () => navigate({to: '/project/createproject'}),
    },
    {
      label: 'Daily Work',
      icon: <Building size={18} />,
      path: '/work/DailyWork',
      action: () => navigate({to: '/work/DailyWork'}),
    },
    {
      label: 'Review Work',
      icon: <Building size={18} />,
      path: '/company/review',
      action: () => navigate({to: '/company/review'}),
    },
    {
      label: 'Attendance',
      icon: <Building size={18} />,
      path: '/company/Attendance',
      action: () => navigate({to: '/company/Attendance'}),
    },
  ];

  const employeeMenu = [
    {
      label: 'Project',
      icon: <Building size={18} />,
      path: '/employee/empproject',
      action: () => navigate({to: '/employee/empproject'}),
    },
    {
      label: 'Daily Work',
      icon: <Building size={18} />,
      path: '/employee/empdailywork',
      action: () => navigate({to: '/employee/empdailywork'}),
    },
    {
      label: 'Review Work',
      icon: <Building size={18} />,
      path: '/employee/tasktoreview',
      action: () => navigate({to: '/employee/tasktoreview'}),
    },
  ];

  const superAdminMenu = [
    {
      label: 'Industry',
      icon: <Building size={18} />,
      path: '/superadmin/industry',
      action: () => navigate({to: '/superadmin/industry'}),
    },
    {
      label: 'Department',
      icon: <Building size={18} />,
      path: '/superadmin/department',
      action: () => navigate({to: '/superadmin/department'}),
    },
    {
      label: 'Company Register',
      icon: <Building size={18} />,
      path: '/superadmin/admin',
      action: () => navigate({to: '/superadmin/admin'}),
    },
  ];

  return (
    <>
      <nav className="dark:bg-gray-900 dark:border-gray-800 font-inter fixed left-0 top-0 z-30 w-full bg-white py-0 shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <div
                  className="flex items-center space-x-2"
                  onClick={() => {
                    if (user?.role === 'COMPANY') {
                      navigate({to: '/'});
                    } else {
                      navigate({to: '/employee/empdashboard'});
                    }
                  }}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{background: '#0284C7'}}
                  >
                    <span className="text-sm font-bold text-white">S</span>
                  </div>
                  <span
                    className="font-poppins bg-clip-text text-xl font-bold text-transparent"
                    style={{color: '#0284C7'}}
                  >
                    SOP
                  </span>
                </div>
              </div>

              <div className="hidden items-center space-x-1 md:flex">
                {(user?.role === 'COMPANY' ? adminMenu : employeeMenu).map(
                  (item) => (
                    <div className="group relative" key={item.label}>
                      {/* <button
                        onClick={item.action}
                        className="text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 flex items-center gap-2 rounded-lg px-3 py-2 font-medium transition-all duration-200 hover:bg-[#E0F2FE] hover:text-[#0284C7]"
                      >
                        {item.icon}
                        {item.label}
                      </button> */}
                      <button
                        onClick={item.action}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 font-medium transition-all duration-200 ${
                          isActive(item.path)
                            ? 'bg-[#E0F2FE] text-[#0284C7]'
                            : 'text-gray-700 hover:bg-[#E0F2FE] hover:text-[#0284C7]'
                        } dark:text-gray-300 dark:hover:bg-gray-800`}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ul className="hidden items-center gap-2 md:flex">
                <DarkModeSwitcher />
              </ul>

              <div className="hidden md:block">
                <DropdownUser />
              </div>

              <button
                onClick={toggleMenu}
                className="text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg p-2 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:text-white md:hidden"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div
        className={`dark:bg-gray-900 border-gray-100 dark:border-gray-800 fixed left-0 top-0 z-40 h-full w-80 transform border-r bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="border-gray-100 dark:border-gray-800 flex items-center justify-between border-b px-6 py-5">
          <div className="flex items-center space-x-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{background: '#0284C7'}}
            >
              <span className="text-sm font-bold text-white">S</span>
            </div>
            <span
              className="font-poppins bg-clip-text text-xl font-bold text-transparent"
              style={{color: '#0284C7'}}
            >
              SOP
            </span>
          </div>
          <button
            onClick={toggleMenu}
            className="text-gray-600 dark:text-gray-400 dark:hover:bg-gray-800 rounded-lg p-2 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col space-y-1 px-4 py-6">
          {getMenu().map((item) => (
            <div key={item.label} className="space-y-1">
              <button
                onClick={() => {
                  item.action();
                  toggleMenu();
                }}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium ${
                  isActive(item.path)
                    ? 'bg-[#E0F2FE] text-[#0284C7]'
                    : 'text-gray-700 hover:bg-[#E0F2FE] hover:text-[#0284C7]'
                } dark:text-gray-300 dark:hover:bg-gray-800`}
              >
                {item.icon}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {isOpen && (
        <div
          className="animate-in fade-in-0 fixed inset-0 z-30 bg-black bg-opacity-50 backdrop-blur-sm md:hidden"
          onClick={toggleMenu}
        />
      )}
    </>
  );
};

export default Navbar;
