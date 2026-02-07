import React from 'react';
import {ArrowLeft, ShieldCheck, Sun, Moon} from 'lucide-react';
import {useNavigate} from '@tanstack/react-router';

const VerificationStatus: React.FC = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    // <div className="bg-background-light dark:bg-background-dark flex min-h-screen flex-col items-center justify-center p-6 text-slate-900 antialiased dark:text-white">
    //   {/* Absolute Nav */}
    //   <nav className="absolute left-0 top-0 z-10 flex w-full items-center justify-between p-6">
    //     <div
    //       onClick={() => navigate({to:'/website/homepage'})}
    //       className="flex cursor-pointer items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
    //     >
    //       <ArrowLeft size={24} className="text-gray-500 dark:text-gray-400" />
    //       <span className="text-gray-500 dark:text-gray-400 hidden font-medium sm:block">
    //         Back
    //       </span>
    //     </div>
    //     <button
    //       onClick={() => setIsDark(!isDark)}
    //       className="dark:bg-surface-dark text-gray-500 rounded-full bg-white p-2 shadow-sm transition-all hover:shadow-md"
    //     >
    //       {isDark ? <Sun size={20} /> : <Moon size={20} />}
    //     </button>
    //   </nav>

    //   <main className="relative z-0 flex w-full max-w-2xl flex-col items-center text-center">
    //     {/* Pulse Animation */}
    //     <div className="relative mb-12 flex h-64 w-64 items-center justify-center">
    //       {/* CSS Animation Rings */}
    //       <div className="absolute inset-0 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border border-primary/20"></div>
    //       <div className="absolute inset-8 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1s] rounded-full border border-primary/30"></div>

    //       <div className="dark:bg-surface-dark border-gray-100 dark:border-gray-700 relative z-10 flex h-32 w-32 items-center justify-center rounded-full border bg-white shadow-lg dark:shadow-black/40">
    //         <div className="relative">
    //           <ShieldCheck size={64} className="text-primary" />
    //           <div className="dark:border-surface-dark absolute bottom-1 right-1 h-4 w-4 animate-bounce rounded-full border-2 border-white bg-yellow-400"></div>
    //         </div>
    //       </div>

    //       <div className="absolute left-1/2 top-1/2 -z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary/20 blur-xl dark:bg-primary/10"></div>
    //     </div>

    //     <div className="max-w-lg space-y-6">
    //       <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
    //         Verification in Progress
    //       </h1>
    //       <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
    //         We are reviewing your documents. This usually takes less than 24
    //         hours. We will notify you once your account is fully verified.
    //       </p>

    //       <div className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700/50 mt-4 inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5">
    //         <span className="relative flex h-2.5 w-2.5">
    //           <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
    //           <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span>
    //         </span>
    //         <span className="text-sm font-semibold uppercase tracking-wide text-primary">
    //           Scanning Documents
    //         </span>
    //       </div>
    //     </div>

    //     <div className="mt-16 w-full max-w-md space-y-6">
    //       <button
    //         onClick={() => navigate({to:'/website/homepage'})}
    //         className="hover:bg-primary-hover w-full transform rounded-xl bg-primary px-6 py-4 font-semibold text-white shadow-lg shadow-primary/30 outline-none transition-all duration-200 hover:-translate-y-0.5 focus:ring-4 focus:ring-primary/20"
    //       >
    //         Back to Dashboard
    //       </button>
    //       <div>
    //         <a
    //           href="#"
    //           className="text-gray-500 dark:text-gray-400 group flex items-center justify-center gap-1 text-sm font-medium transition-colors duration-200 hover:text-primary"
    //         >
    //           Need help?{' '}
    //           <span className="group-hover:underline">Contact Support</span>
    //         </a>
    //       </div>
    //     </div>
    //   </main>

    //   {/* Background Dots */}
    //   <div
    //     className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.03] dark:opacity-[0.05]"
    //     style={{
    //       backgroundImage: 'radial-gradient(#64748B 1px, transparent 1px)',
    //       backgroundSize: '32px 32px',
    //     }}
    //   ></div>
    // </div>
    <div className="bg-background-light dark:bg-background-dark flex min-h-screen flex-col items-center justify-center p-6 text-slate-900 antialiased dark:text-white">
      {/* Absolute Nav */}
      <nav className="absolute left-0 top-0 z-10 flex w-full items-center justify-between p-6">
        <div
          onClick={() => navigate({to: '/landingpage'})}
          className="flex cursor-pointer items-center gap-2 opacity-80 transition-opacity hover:opacity-100"
        >
          <ArrowLeft size={24} className="text-gray-500 dark:text-gray-400" />
          <span className="text-gray-500 dark:text-gray-400 hidden font-medium sm:block">
            Back
          </span>
        </div>
        <button
          onClick={() => setIsDark(!isDark)}
          className="dark:bg-surface-dark text-gray-500 rounded-full bg-white p-2 shadow-sm transition-all hover:shadow-md"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      <main className="relative z-0 flex w-full max-w-2xl flex-col items-center text-center">
        {/* Pulse Animation */}
        <div className="relative mb-12 flex h-64 w-64 items-center justify-center">
          {/* CSS Animation Rings */}
          <div className="absolute inset-0 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full border border-primary/20"></div>
          <div className="absolute inset-8 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1s] rounded-full border border-primary/30"></div>

          <div className="dark:bg-surface-dark border-gray-100 dark:border-gray-700 relative z-10 flex h-32 w-32 items-center justify-center rounded-full border bg-white shadow-lg dark:shadow-black/40">
            <div className="relative">
              <ShieldCheck size={64} className="text-primary" />
              <div className="dark:border-surface-dark absolute bottom-1 right-1 h-4 w-4 animate-bounce rounded-full border-2 border-white bg-yellow-400"></div>
            </div>
          </div>

          <div className="absolute left-1/2 top-1/2 -z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-primary/20 blur-xl dark:bg-primary/10"></div>
        </div>

        <div className="max-w-lg space-y-6">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Verification in Progress
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
            We are reviewing your documents. This usually takes less than 24
            hours. We will notify you once your account is fully verified.
          </p>

          <div className="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700/50 mt-4 inline-flex items-center gap-2.5 rounded-full border px-5 py-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary"></span>
            </span>
            <span className="text-sm font-semibold uppercase tracking-wide text-primary">
              Scanning Documents
            </span>
          </div>
        </div>

        <div className="mt-16 w-full max-w-md space-y-6">
          <button
            onClick={() => navigate({to: '/landingpage'})}
            className="hover:bg-primary-hover w-full transform rounded-xl bg-primary px-6 py-4 font-semibold text-white shadow-lg shadow-primary/30 outline-none transition-all duration-200 hover:-translate-y-0.5 focus:ring-4 focus:ring-primary/20"
          >
            Back to Dashboard
          </button>
          <div>
            <a
              href="#"
              className="text-gray-500 dark:text-gray-400 group flex items-center justify-center gap-1 text-sm font-medium transition-colors duration-200 hover:text-primary"
            >
              Need help?{' '}
              <span className="group-hover:underline">Contact Support</span>
            </a>
          </div>
        </div>
      </main>

      {/* Background Dots */}
      <div
        className="pointer-events-none fixed inset-0 z-[-1] opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(#64748B 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>
    </div>
  );
};

export default VerificationStatus;
