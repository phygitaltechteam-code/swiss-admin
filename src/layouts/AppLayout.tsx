import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import {useAuthContext} from '@/context/AuthContext';
import {Outlet, useNavigate} from '@tanstack/react-router';
import React, {useEffect, useState} from 'react';

const AppLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const {isAuthenticated, user} = useAuthContext();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({to: '/signin'});
      return;
    }

    if (user?.role === 'ADMIN') {
      navigate({to: '/dashboard'});
    }

    // else if (user?.role === 'MANAGER') {
    //   navigate({to: '/'});
    // } else if (user?.role === 'EMPLOYEE') {
    //   navigate({to: '/dashboard'});
    // } else if (user?.role === 'SUPERADMIN') {
    //   navigate({to: '/superadmin/superadmindash'});
    // }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        {user?.role !== 'EMPLOYEE' && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto max-w-screen-2xl p-1">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
