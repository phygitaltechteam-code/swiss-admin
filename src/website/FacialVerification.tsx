/* eslint-disable */
import React from 'react';

import {ArrowLeft, Sun, EyeOff, Camera, User, Lock} from 'lucide-react';
import {useNavigate} from '@tanstack/react-router';

const FacialVerification: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-background-light dark:bg-background-dark font-sans flex min-h-screen flex-col text-slate-900 dark:text-white">
      {/* Simple Nav for this screen as per mock */}
      <nav className="dark:bg-surface-dark border-gray-200 dark:border-gray-800 sticky top-0 z-50 flex w-full items-center justify-between border-b bg-white px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate({to: '/personalaccount'})}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2 transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600 dark:text-gray-300" />
          </button>
          <span className="text-xl font-semibold tracking-tight">
            Verify Identity
          </span>
        </div>
        <div className="hidden items-center space-x-6 md:flex">
          <span className="text-gray-500 text-sm font-medium">Need help?</span>
          <button className="text-sm font-medium text-primary transition-colors hover:text-orange-600">
            Contact Support
          </button>
        </div>
      </nav>

      <main className="relative flex flex-grow flex-col items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
        {/* Ambient Background */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-10">
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-tr from-orange-100 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary opacity-20 blur-[120px] filter"></div>
        </div>

        <div className="z-10 grid w-full max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Instructions */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-2">
              <div className="flex space-x-2">
                <div className="h-1.5 flex-1 rounded-full bg-primary"></div>
                <div className="h-1.5 flex-1 rounded-full bg-primary"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-1.5 flex-1 overflow-hidden rounded-full">
                  <div className="h-full w-1/2 bg-primary"></div>
                </div>
              </div>
              <p className="text-gray-500 text-right text-sm font-medium">
                Step 3 of 3
              </p>
            </div>

            <div>
              <h1 className="mb-4 text-4xl font-bold tracking-tight">
                Facial Verification
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
                Place your face within the oval frame and follow the on-screen
                instructions. We use this to match your face with your ID
                document.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TipCard
                icon={<Sun size={24} />}
                title="Good Lighting"
                desc="Avoid shadows on your face. Ensure the light source is in front of you."
              />
              <TipCard
                icon={<EyeOff size={24} />}
                title="No Glasses"
                desc="Remove glasses, masks, or hats that obscure your face."
              />
            </div>
          </div>

          {/* Right: Camera UI */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="bg-gray-100 dark:bg-gray-800 dark:border-gray-700 relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
              {/* Fake Camera Feed */}
              <div className="bg-gray-200 dark:bg-gray-900 absolute inset-0 flex items-center justify-center overflow-hidden">
                <div className="from-gray-300 to-gray-400 dark:from-gray-800 dark:to-gray-900 absolute inset-0 bg-gradient-to-b opacity-50"></div>
                <User
                  size={120}
                  className="text-gray-400 dark:text-gray-600 absolute opacity-40"
                />
              </div>

              {/* Overlay UI */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between p-8">
                <div className="glass-effect mt-4 flex animate-pulse items-center gap-2 rounded-full bg-black/30 px-4 py-1.5 text-sm font-medium text-white">
                  <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  Looking Good
                </div>

                {/* Oval Cutout */}
                <div className="absolute left-1/2 top-1/2 z-10 h-[60%] w-[70%] -translate-x-1/2 -translate-y-1/2 transform rounded-[50%] border-4 border-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] dark:shadow-[0_0_0_9999px_rgba(0,0,0,0.7)]"></div>

                <p className="z-20 mb-4 text-center text-sm font-medium text-white opacity-90 drop-shadow-md">
                  Position your face in the frame
                </p>
              </div>
            </div>

            <div className="mt-8 flex w-full max-w-md flex-col gap-4">
              <button
                onClick={() => navigate({to: '/verifystatus'})}
                className="hover:bg-primary-hover group flex w-full transform items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Camera size={24} className="group-hover:animate-pulse" />
                Capture Photo
              </button>
              <button className="text-gray-500 text-sm underline decoration-dotted transition-colors hover:text-primary">
                Switch Camera
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="dark:bg-surface-dark border-gray-200 dark:border-gray-800 border-t bg-white py-6">
        <div className="text-gray-500 mx-auto flex max-w-7xl flex-col items-center justify-between px-4 text-xs sm:px-6 md:flex-row lg:px-8">
          <div className="mb-4 flex items-center space-x-2 md:mb-0">
            <Lock size={14} className="text-green-500" />
            <span>Bank-grade 256-bit encryption</span>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Terms of Service
            </a>
            <span>© 2023 Swissquote Bank Ltd.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

const TipCard = ({icon, title, desc}: any) => (
  <div className="dark:bg-surface-dark border-gray-100 dark:border-gray-800 flex flex-col items-center rounded-xl border bg-white p-6 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1 lg:items-start lg:text-left">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-primary dark:bg-orange-900/20">
      {icon}
    </div>
    <h3 className="mb-1 font-semibold text-slate-900 dark:text-white">
      {title}
    </h3>
    <p className="text-gray-500 text-sm">{desc}</p>
  </div>
);

export default FacialVerification;
