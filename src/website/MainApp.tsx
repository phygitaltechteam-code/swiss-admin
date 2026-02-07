import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from '@tanstack/react-router';

export default function MainApp() {
  const nevigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // ← add this

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside); // mousedown is often better

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);
  return (
    <div className="bg-background-light min-h-screen text-black antialiased">
      {/* Header */}
      <header className="border-gray-200 bg-background-light/95 supports-[backdrop-filter]:bg-background-light/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:h-20 md:px-6 lg:px-10">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-black transition-opacity hover:opacity-80 md:gap-3"
          >
            <div className="size-5 text-primary md:size-6">
              <svg
                className="h-full w-full"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 4L4 12V36L24 44L44 36V12L24 4Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="4"
                ></path>
                <path
                  d="M24 14V34"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="4"
                ></path>
                <path
                  d="M14 24H34"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="4"
                ></path>
              </svg>
            </div>
            <span className="font-body text-lg font-bold tracking-tight md:text-xl">
              Swissquote
            </span>
          </Link>

          {/* Desktop Navigation - Hidden on Mobile */}
          <nav className="hidden items-center gap-8 md:flex">
            <a
              className="text-sm font-medium text-black transition-colors hover:text-primary"
              href="#"
            >
              Private Banking
            </a>
            <button
              className="text-text-secondary text-sm font-medium transition-colors hover:text-primary"
              onClick={() => {
                nevigate({to: '/landingpage'});
              }}
            >
              Wealth Management
            </button>
            <a
              className="text-text-secondary text-sm font-medium transition-colors hover:text-primary"
              href="#advisory"
            >
              Advisory
            </a>
            <a
              className="text-text-secondary text-sm font-medium transition-colors hover:text-primary"
              href="#insights"
            >
              Insights
            </a>
          </nav>

          {/* Desktop CTA Buttons - Hidden on Mobile */}
          <div className="hidden items-center gap-4 md:flex">
            <div className="flex gap-3">
              <Link
                to="/signin"
                className="hover:bg-primary-dark flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md lg:px-5"
              >
                Login
              </Link>
              {/* <Link
                to="/signup"
                className="hover:bg-primary-dark flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md lg:px-5"
              >
                Open Account
              </Link> */}
            </div>
          </div>

          {/* Mobile Buttons Container */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Hamburger Menu Button - Visible on Mobile Only */}
            <Link
              to="/signin"
              className="hover:bg-primary-dark flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-sm transition-all hover:shadow-md lg:px-5"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
      </header>

      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage:
                'linear-gradient(rgba(15, 21, 53, 0.6), rgba(15, 21, 53, 0.4)), url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1D9lTvoED1u8S9P9rjU4ndJpbMxzYFyqhMOWR2s3hsM0uDz0Xv2i9qq7RUHdlwP0wJZUh2O4A5LXkRTusCfuofKURIqTqK0UpfAcJ95ncbabeVGLxastvemvmSdRyGs3lxLfzB2IPh7u3cW_vKL82aLcJUgMyPc8gDnrKrNQKTdbsBTJC_5mdoh2SDkkpC4lkV6F6B3dgB-fhaFOQqKUofXemrFFdPVQD_xu_eAy96KLb8ZPcCnwHNMVhyrM-tQllG_dLCGopQ8hw")',
            }}
          ></div>
        </div>
        <div className="relative z-10 mx-auto flex min-h-[600px] max-w-[1280px] flex-col justify-center px-6 py-20 lg:px-10 lg:py-32">
          <div className="animate-fade-in-up max-w-2xl">
            <h1 className="font-display mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-white drop-shadow-sm md:text-6xl lg:text-7xl">
              Elevating Your <br />
              <span className="bg-gradient-to-r from-orange-200 to-white bg-clip-text text-transparent">
                Wealth Potential
              </span>
            </h1>
            <p className="mb-10 max-w-lg text-lg font-light leading-relaxed text-gray md:text-xl">
              Experience bespoke financial solutions and Swiss banking
              excellence designed for the discerning investor.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/"
                className="hover:bg-primary-dark flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
              >
                Become a Client
              </Link>
              <button className="flex h-12 items-center justify-center rounded-lg border border-white/20 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20">
                Explore Services
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-gray-200 bg-background-light border-b py-12">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="divide-gray-200 grid grid-cols-1 gap-8 divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
            <div className="flex flex-col gap-2 px-4 py-2 text-center md:text-left">
              <p className="font-display text-4xl font-bold text-primary md:text-5xl">
                50B+
              </p>
              <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">
                Assets under Management
              </p>
            </div>
            <div className="flex flex-col gap-2 px-4 py-2 text-center md:pl-12 md:text-left">
              <p className="font-display text-4xl font-bold text-primary md:text-5xl">
                25%
              </p>
              <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">
                Tier 1 Capital Ratio
              </p>
            </div>
            <div className="flex flex-col gap-2 px-4 py-2 text-center md:pl-12 md:text-left">
              <p className="font-display text-4xl font-bold text-primary md:text-5xl">
                25+
              </p>
              <p className="text-text-secondary text-sm font-medium uppercase tracking-wider">
                Years of Excellence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-xl">
              <span className="mb-3 block text-sm font-bold uppercase tracking-widest text-primary">
                Our Expertise
              </span>
              <h2 className="font-display text-4xl font-bold text-black md:text-5xl">
                Tailored Wealth Solutions
              </h2>
            </div>
            <p className="text-text-secondary max-w-md leading-relaxed">
              We combine tradition with technology to offer you the most
              advanced banking experience.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="bg-background-subtle group flex flex-col overflow-hidden rounded-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/50">
              <div className="relative h-64 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCQwwAttybCmMj1lk7ZbJ6Fw70-D9Z595SF4cp91A6kDuk-igXLG37Plzvo0SSQ8ckvmzW7N2FAIdf-9sCuyPczXpdK6-DkKkZZSxY8Tlo4aK9afv0X60K5cpuHwzwYXVO6mJJr0tbSgPZW7Vl_eGjSdK-UCMbvF4MH2AtNHLM6_i0yDY1O_6_BwlbwuvlKhS3Da2ny-znwOlk9fD37bDbch5fE-l_8DhUlF4zgqNnnDKBMhhqY9W5n2BQRmaIbCP6EPxmkJvWqfBiM")',
                  }}
                ></div>
                <div className="from-background-dark/80 absolute inset-0 bg-gradient-to-t to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="material-symbols-outlined mb-2 text-3xl">
                    account_balance
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-8">
                <h3 className="font-display mb-3 text-2xl font-bold text-black">
                  Wealth Management
                </h3>
                <p className="text-text-secondary mb-6 flex-1 leading-relaxed">
                  Discretionary mandates tailored specifically to your risk
                  profile and financial goals, managed by Swiss experts.
                </p>
                <a
                  className="group/link flex items-center gap-2 text-sm font-bold text-primary"
                  href="#"
                >
                  Learn More
                  <span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-background-subtle group flex flex-col overflow-hidden rounded-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/50">
              <div className="relative h-64 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBKU3eHVDVLNBZUtZPs3WtzpMduXIHwLHGI4bTDY8GybOqiXryOGijQAIbSUO8eAcQMTM8mGud3TyWyM71LqNOcYgSwuIkJIxxY-t-Gu912yT6sjj1GRWBSkL8gEUqL5t0zm5NKTQUWfji3fGKjgPCkKvj5qRHzL6zAPaGA-PAF8x7KXRUgaP_qEPhAfLMYu8CRGf-GUNyLm7h5La5DhmaXXx9PH5k383Mh3YAuZDGXls2aYJ3t_tQ9vUxz6MFB9up5od-L5NdlTOCK")',
                  }}
                ></div>
                <div className="from-background-dark/80 absolute inset-0 bg-gradient-to-t to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="material-symbols-outlined mb-2 text-3xl">
                    handshake
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-8">
                <h3 className="font-display mb-3 text-2xl font-bold text-black">
                  Advisory Mandates
                </h3>
                <p className="text-text-secondary mb-6 flex-1 leading-relaxed">
                  Active partnership for informed decisions. Access our research
                  and market insights while retaining full control.
                </p>
                <a
                  className="group/link flex items-center gap-2 text-sm font-bold text-primary"
                  href="#"
                >
                  View Mandates
                  <span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-background-subtle group flex flex-col overflow-hidden rounded-xl shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-100/50">
              <div className="relative h-64 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDUU7yBgDo0XwIiJZ_EIhaNY5sxF-7qYEfI95Tk-PADJUWRFLP2ugdRZ-vU4L97fRWR-4qlELKmxGY2xunkYTvzSKTPNbMn9NA1mAlvHaAkTYGa0mC8VIRN5hfcJ2giO53Xefg0VGVeQ7EIOeMWmFt9_r3FvYRRHGYhp9m0D7FF-ZiYTLydbmgMKTZWV2YxRjHlEM932xNPem5o5jC7pEn0oj874TxpGJUZ3A4u960LrHe_j_1NNoUYDermB_ACFzeediLC2_EaKvl8")',
                  }}
                ></div>
                <div className="from-background-dark/80 absolute inset-0 bg-gradient-to-t to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="material-symbols-outlined mb-2 text-3xl">
                    confirmation_number
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-8">
                <h3 className="font-display mb-3 text-2xl font-bold text-black">
                  Exclusive Events
                </h3>
                <p className="text-text-secondary mb-6 flex-1 leading-relaxed">
                  Networking opportunities in art, finance, and culture. Join a
                  community of like-minded individuals.
                </p>
                <a
                  className="group/link flex items-center gap-2 text-sm font-bold text-primary"
                  href="#"
                >
                  Discover Events
                  <span className="material-symbols-outlined text-sm transition-transform group-hover/link:translate-x-1">
                    arrow_forward
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="bg-background-light py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="flex flex-col items-center gap-16 lg:flex-row">
            <div className="w-full lg:w-1/2">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  alt="Digital graph analytics on a tablet screen"
                  className="h-auto w-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAD8jjX3jJifzdNeGbkMnhynNw0pa3tH49UhRZCkoZRdwLGk2nwGWk_8o-HumCtZT2WEmaXCm0iHsPU5Caew9oxfw6Rq-5QfVsYEvR_iyK8u1_jcaVMOrWe9vY8EvSJ7EzgE1BA0Qt8f5Zkn2hv2lB24eUoiDHFlNKEwrK1g-87jfKYxVTCYNVpEPxiWtsKnpHcSTyYWrFvrfKw_jiIE5slKpiPI7EmL9bwviYiOELMRG4Wfg9ftXYAqH9zEtowlScmWBYzzvhh_4Mo"
                />
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                Digital Innovation
              </span>
              <h2 className="font-display mb-6 text-4xl font-bold text-black md:text-5xl">
                Banking at Your Fingertips
              </h2>
              <p className="text-text-secondary mb-8 text-lg leading-relaxed">
                Access your portfolio anytime, anywhere. Our award-winning
                digital platform provides real-time insights, secure messaging
                with your advisor, and seamless execution of trades across
                global markets.
              </p>
              <ul className="mb-10 space-y-4">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-0.5 text-primary">
                    check_circle
                  </span>
                  <span className="font-medium text-black">
                    Real-time portfolio analysis and reporting
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-0.5 text-primary">
                    check_circle
                  </span>
                  <span className="font-medium text-black">
                    Secure biometric authentication
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined mt-0.5 text-primary">
                    check_circle
                  </span>
                  <span className="font-medium text-black">
                    Direct market access to 3M+ products
                  </span>
                </li>
              </ul>
              <button className="border-gray-300 flex h-12 items-center justify-center rounded-lg border bg-white px-8 text-sm font-bold text-black transition-colors hover:border-primary hover:text-primary">
                View Platform Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative overflow-hidden bg-blue-950 py-24 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#F57F3D 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        ></div>
        <div className="relative z-10 mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="font-display mb-6 text-4xl font-bold text-white md:text-5xl">
                Start the Conversation
              </h2>
              <p className="text-gray-300 mb-10 max-w-lg text-lg leading-relaxed">
                Let us help you achieve your financial ambitions. Request a
                callback from one of our senior private bankers at your
                convenience.
              </p>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <span className="material-symbols-outlined text-primary">
                      phone_in_talk
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Direct Line
                    </p>
                    <p className="text-xl font-bold">+41 44 825 88 88</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/20 text-primary">
                    <span className="material-symbols-outlined text-primary">
                      mail
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm font-medium">
                      Email Us
                    </p>
                    <p className="text-xl font-bold">private@swissquote.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="border-gray-100 rounded-2xl border bg-white p-8 shadow-2xl shadow-primary/10">
              <h3 className="font-display mb-6 text-2xl font-bold text-black">
                Request a Callback
              </h3>
              <form className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-5">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-black">
                      First Name
                    </span>
                    <input
                      className="border-gray-200 placeholder-gray-400 h-11 rounded-lg border bg-white px-4 text-sm text-black focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="John"
                      type="text"
                      defaultValue="John"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-black">
                      Last Name
                    </span>
                    <input
                      className="border-gray-200 placeholder-gray-400 h-11 rounded-lg border bg-white px-4 text-sm text-black focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Doe"
                      type="text"
                      defaultValue="Doe"
                    />
                  </label>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm font-semibold text-black">
                    Email Address
                  </span>
                  <input
                    className="border-gray-200 first-line:placeholder-gray-400 h-11 rounded-lg border bg-white px-4 text-sm text-black focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="john.doe@example.com"
                    type="email"
                    defaultValue="john.doe@example.com"
                  />
                </label>
                <div className="grid grid-cols-2 gap-5">
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-black">
                      Phone
                    </span>
                    <input
                      className="border-gray-200 placeholder-gray-400 h-11 rounded-lg border bg-white px-4 text-sm text-black focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="+91 ..."
                      type="tel"
                    />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-black">
                      Preferred Time
                    </span>
                    <select className="border-gray-200 first-line:placeholder-gray-400 h-11 rounded-lg border bg-white px-4 text-sm text-black focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <option>Morning (09:00 - 12:00)</option>
                      <option>Afternoon (13:00 - 17:00)</option>
                      <option>Evening (17:00 - 19:00)</option>
                    </select>
                  </label>
                </div>
                <label className="mt-2 flex cursor-pointer items-start gap-3">
                  <input
                    className="border-gray-300 mt-1 h-4 w-4 rounded text-primary focus:ring-2 focus:ring-primary/20"
                    type="checkbox"
                  />
                  <span className="text-xs text-black">
                    I agree to the processing of my personal data according to
                    the Privacy Policy.
                  </span>
                </label>
                <button
                  className="hover:bg-primary-dark mt-4 h-12 w-full rounded-lg bg-primary text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
                  type="button"
                >
                  Submit Request
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-gray-200 bg-background-light border-t pb-8 pt-16">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
          <div className="mb-12 grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
            <div className="col-span-2 pr-8 lg:col-span-2">
              <a className="mb-6 flex items-center gap-2 text-black" href="#">
                <div className="size-5 text-primary">
                  <svg
                    className="h-full w-full"
                    fill="none"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M24 4L4 12V36L24 44L44 36V12L24 4Z"
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth="4"
                    ></path>
                  </svg>
                </div>
                <span className="text-lg font-bold">Swissquote</span>
              </a>
              <p className="text-text-secondary mb-6 max-w-sm text-sm leading-relaxed">
                Swissquote is the Swiss leader in online banking. Over 3 million
                financial products, tradable on the eTrading platform.
              </p>
              <div className="flex gap-4">
                <a
                  className="text-text-secondary transition-colors hover:text-primary"
                  href="#"
                >
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                  </svg>
                </a>
                <a
                  className="text-text-secondary transition-colors hover:text-primary"
                  href="#"
                >
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
                  </svg>
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-black">Services</h4>
              <a
                className="text-text-secondary text-sm hover:text-primary"
                href="#"
              >
                Private Banking
              </a>
              <a
                className="text-text-secondary text-sm hover:text-primary"
                href="#"
              >
                E-Trading
              </a>
              <a
                className="text-text-secondary text-sm hover:text-primary"
                href="#"
              >
                Forex
              </a>
              <a
                className="text-text-secondary text-sm hover:text-primary"
                href="#"
              >
                Robo-Advisory
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-black">Company</h4>
              <a
                className="text-text-secondary text-sm hover:text-primary"
                href="#"
              >
                About Us
              </a>
              <a
                className="text-text-secondary text-sm hover:text-primary"
                href="#"
              >
                Investor Relations
              </a>
              <a
                className="text-text-secondary text-sm hover:text-primary"
                href="#"
              >
                Careers
              </a>
              <a
                className="text-text-secondary text-sm hover:text-primary"
                href="#"
              >
                Sponsorship
              </a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-bold text-black">Support</h4>
              <a
                className="text-text-secondary text-sm hover:text-primary"
                href="#"
              >
                Contact Center
              </a>
              <a
                className="text-text-secondary text-sm hover:text-primary"
                href="#"
              >
                Support &amp; FAQ
              </a>
              <a
                className="text-text-secondary text-sm hover:text-primary"
                href="#"
              >
                Security
              </a>
              <a
                className="text-text-secondary text-sm hover:text-primary"
                href="#"
              >
                Branch Locator
              </a>
            </div>
          </div>
          <div className="border-gray-200 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
            <p className="text-text-secondary text-center text-xs md:text-left">
              © 2024 Swissquote Bank Ltd. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a
                className="text-text-secondary text-xs hover:text-primary"
                href="#"
              >
                Privacy Policy
              </a>
              <a
                className="text-text-secondary text-xs hover:text-primary"
                href="#"
              >
                Terms &amp; Conditions
              </a>
              <a
                className="text-text-secondary text-xs hover:text-primary"
                href="#"
              >
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
