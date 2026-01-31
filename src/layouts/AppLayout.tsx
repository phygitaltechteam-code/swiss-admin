import Navbar from '@/components/common/Navbar';
import {useAppContext} from '@/components/common/PopUp';
import CreatePostion from '@/components/Company/CreatePostion';
import CreateDepartment from '@/components/Company/Department/CreateDepartment';
import DisplayDepartment from '@/components/Company/Department/DisplayDepartment';
import DisplayPosition from '@/components/Company/DisplayPosition';
import DisplayEmployee from '@/components/Employee/DisplayEmployee';
import EmpProjectWorkAssign from '@/components/Employee/EmpProjectWorkAssign';
import CopySop from '@/components/work/CopySop';
import CreateProjectWork from '@/components/work/CreateProjectWork';
import WorkPopup from '@/components/work/WorkPopup';
import {useAuthContext} from '@/context/AuthContext';
import {Outlet, useNavigate} from '@tanstack/react-router';
import React, {useEffect} from 'react';

const AppLayout = () => {
  const navigate = useNavigate();
  const {isAuthenticated, user} = useAuthContext();
  const {
    positionList,
    createDepartment,
    position,
    displayDepartment,
    empProjectWork,
    workPopup,
    projectWork,
    copySop,
  } = useAppContext();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({to: '/signin'});
      return;
    }

    if (user?.role === 'ADMIN') {
      navigate({to: '/superadmin/admin'});
    } else if (user?.role === 'COMPANY') {
      navigate({to: '/'});
    } else if (user?.role === 'EMPLOYEE') {
      navigate({to: '/employee/empdashboard'});
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="relative dark:bg-boxdark-2 dark:text-bodydark">
      <div className="flex h-screen overflow-hidden">
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <div className="">
            <Navbar />
          </div>

          <main>
            <div className="mx-auto mt-12 py-1 md:px-5">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {positionList && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <DisplayPosition />
        </div>
      )}
      {createDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <CreateDepartment />
        </div>
      )}
      {position && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <CreatePostion />
        </div>
      )}
      {displayDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <DisplayDepartment />
        </div>
      )}

      {workPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <WorkPopup />
        </div>
      )}
      {projectWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <CreateProjectWork />
        </div>
      )}
      {copySop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <CopySop />
        </div>
      )}
      {empProjectWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <EmpProjectWorkAssign />
        </div>
      )}
    </div>
  );
};

export default AppLayout;
