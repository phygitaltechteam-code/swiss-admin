import React, {useState} from 'react';
import {Menu, X} from 'lucide-react';
import {NavItem} from '../types';
import {useNavigate} from '@tanstack/react-router';

const navItems: NavItem[] = [
  {label: 'Products', href: '#'},
  {label: 'Markets', href: '#'},
  {label: 'Institutional', href: '#'},
  {label: 'Education', href: '#'},
  {label: 'Company', href: '#'},
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => {
              navigate({
                to: '/',
              });
            }}
          >
            <div className="text-primary">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
                <path
                  clipRule="evenodd"
                  d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                  fill="currentColor"
                  fillRule="evenodd"
                ></path>
              </svg>
            </div>
            <span className="text-navy text-xl font-bold tracking-tight">
              Swissquote
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden flex-1 justify-center lg:flex">
            <ul className="flex gap-8">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-navy text-sm font-medium transition-colors hover:text-primary"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                navigate({to: '/signin'});
              }}
              className="hover:bg-primary-dark flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md lg:px-5"
            >
              Login
            </button>
            {/* <button
              className="hover:bg-primary-dark rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-colors"
              onClick={() => {
                navigate({to: '/signup'});
              }}
            >
              Open an Account
            </button> */}
            <button
              className="text-navy lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-gray-200 absolute left-0 top-20 w-full border-b bg-white p-4 shadow-xl lg:hidden">
          <ul className="flex flex-col gap-4">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-navy border-gray-100 block border-b py-2 text-base font-medium"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <button
                onClick={() => {
                  navigate({to: '/signin'});
                }}
                className="text-navy border-gray-200 mb-3 w-full rounded-lg border py-3 text-center font-semibold"
              >
                Login
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
