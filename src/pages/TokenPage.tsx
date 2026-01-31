import React, {useEffect} from 'react';
import {Route} from '@/routes/_native/token.$user.$pass';
import {useRouter} from '@tanstack/react-router';
import axios from 'axios';
import {useAuthContext} from '@/context/AuthContext';

const apiBaseUrl = import.meta.env.VITE_SERVER_URL;

const TokenPage = () => {
  const {setIsAuthenticated, setUser} = useAuthContext();
  const {user, pass} = Route.useParams();
  const router = useRouter();

  useEffect(() => {
    const loginAndRedirect = async () => {
      try {
        const response = await axios.post(`${apiBaseUrl}/users/login`, {
          phoneNumber: user,
          password: pass,
        });

        const data = response?.data?.data;

        if (!data?.accessToken || !data?.user) {
          throw new Error('Invalid login response');
        }

        localStorage.setItem('token', JSON.stringify(data));
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        setIsAuthenticated(true);
        if (data.user.role === 'ADMIN' || data.user.role === 'MANAGER') {
          router.navigate({to: '/dashboard'});
        } else if (data.user.role === 'EMPLOYEE') {
          router.navigate({to: '/employee/dashboard'});
        }
      } catch (err) {
        console.error('Login failed in Web:', err);
        router.navigate({to: '/'});
      }
    };

    loginAndRedirect();
  }, [user, pass]);

  return (
    <div className="bg-gray-900 flex h-screen items-center justify-center">
      <div className="flex h-20 w-20 gap-2">
        <div className="h-5 w-5 animate-pulse rounded-full bg-blue-500"></div>
        <div className="h-5 w-5 animate-pulse rounded-full bg-blue-500 delay-200"></div>
        <div className="delay-400 h-5 w-5 animate-pulse rounded-full bg-blue-500"></div>
      </div>
    </div>
  );
};

export default TokenPage;
