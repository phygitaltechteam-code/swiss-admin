import {Link, useNavigate} from '@tanstack/react-router';
import {FiLock, FiMail, FiEye, FiEyeOff} from 'react-icons/fi';
import React, {useEffect, useState} from 'react';
import {useLogin} from '@/lib/api/auth';
import toast from 'react-hot-toast';
import {useAuthContext} from '@/context/AuthContext';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const {mutateAsync: login, isPending, isSuccess} = useLogin();
  const {user, isAuthenticated} = useAuthContext();

  useEffect(() => {
    if (isSuccess) {
      window.location.href = '/';
    }
  }, [isSuccess]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      toast.error('Please enter phone number and password');
      return;
    }

    try {
      await login(credentials);
    } catch (err) {
      // Error already handled in useEffect
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="mx-auto w-full max-w-md bg-white p-6">
        <h2 className="mb-9 text-center text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          Sign In
        </h2>
        <form onSubmit={handleLogin}>
          {/* Phone/Email Input */}
          <div className="mb-6">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter your phone number"
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({...credentials, username: e.target.value})
                }
                className="w-full rounded-lg border border-stroke bg-transparent bg-white py-4 pl-6 pr-10 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
              <span className="absolute right-4 top-4">
                <FiMail size={22} />
              </span>
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({...credentials, password: e.target.value})
                }
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-12 text-black outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
              />
              <span className="absolute right-4 top-4">
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <FiEyeOff size={22} className="text-gray-500" />
                  ) : (
                    <FiEye size={22} className="text-gray-500" />
                  )}
                </button>
              </span>
              <span className="absolute right-12 top-4">
                <FiLock size={22} />
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mb-5">
            <button
              type="submit"
              className="w-full rounded-lg bg-primary p-4 text-white transition hover:bg-opacity-90 disabled:opacity-50"
              disabled={isPending}
            >
              {isPending ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          {/* Sign Up Link */}
          {/* <div className="mt-6 text-center">
        <p className="text-sm">
          Don't have an account?{' '}
          <Link className="text-primary" to="/signup">
            Sign Up
          </Link>
        </p>
      </div> */}
        </form>
      </div>
    </div>
  );
};

export default SignIn;
