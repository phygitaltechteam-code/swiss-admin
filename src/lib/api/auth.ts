import {api, unAuthenticatedApi} from '@/utils/axios';
import {useMutation} from '@tanstack/react-query';
import {jwtDecode} from 'jwt-decode';
import toast from 'react-hot-toast';

export const LogIn = async (data: {username: string; password: string}) => {
  try {
    console.log('api dataaaa', data);
    const response = await unAuthenticatedApi.post('/users/login', data);

    const decodedToken = jwtDecode(response?.data?.data?.accessToken);
    localStorage.setItem('token', JSON.stringify(response?.data?.data));
    localStorage.setItem('user', JSON.stringify(decodedToken));

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: {username: string; password: string}) => LogIn(data),
    onSuccess: () => {
      toast.success('Login successful');
    },
    onError: (error) => {
      toast.error('Login failed');
    },
  });
};
