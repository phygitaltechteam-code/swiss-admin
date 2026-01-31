import {useAuthContext} from '@/context/AuthContext';
import {Outlet, useNavigate} from '@tanstack/react-router';
import React, {useEffect} from 'react';

const AppLayout = () => {
  const navigate = useNavigate();
  const {isAuthenticated, user} = useAuthContext();

  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate({to: '/signin'});
  //     return;
  //   }

  //   if (user?.role === 'ADMIN') {
  //     navigate({to: '/superadmin/admin'});
  //   } else if (user?.role === 'COMPANY') {
  //     navigate({to: '/'});
  //   } else if (user?.role === 'EMPLOYEE') {
  //     navigate({to: '/employee/empdashboard'});
  //   }
  // }, [isAuthenticated, user, navigate]);

  return (
    <div className="relative dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <main>
            <div className="mx-auto mt-12 py-1 md:px-5">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
