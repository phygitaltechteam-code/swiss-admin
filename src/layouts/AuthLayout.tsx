import {Outlet, useNavigate} from '@tanstack/react-router';
import MenuBook from '../assets/images/logo/Menubook.png';
import React from 'react';
import {useAuthContext} from '@/context/AuthContext';

const AuthLayout = () => {
  const navigate = useNavigate();
  const {isAuthenticated} = useAuthContext();

  if (isAuthenticated) {
    navigate({to: '/dashboard'});
  }

  return (
    // <div className="flex h-screen w-screen flex-col items-center justify-center rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
    //   <div className="flex w-full items-center justify-center xl:w-1/2">
    //     <div className="w-[70vh] bg-white p-4 shadow-md sm:p-12.5 xl:p-17.5">
    <Outlet />
    //     </div>
    //   </div>
    // </div>
  );
};

export default AuthLayout;
