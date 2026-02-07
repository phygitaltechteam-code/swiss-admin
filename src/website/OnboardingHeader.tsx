import React from 'react';
import {ArrowLeft, Moon, Sun, HelpCircle} from 'lucide-react';
import {useNavigate} from '@tanstack/react-router';

interface Props {
  step: number;
  title: string;
}

const OnboardingHeader: React.FC<Props> = ({step, title}) => {
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
    <header className="bg-surface-light dark:bg-surface-dark border-gray-200 dark:border-gray-800 sticky top-0 z-50 flex w-full items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate({to: '/landingpage'})}
          className="hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full p-2 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-xs font-bold text-white">
            SQ
          </div>
          <h1 className="hidden text-xl font-bold tracking-tight text-secondary dark:text-white sm:block">
            Swissquote
          </h1>
        </div>
      </div>

      {/* Progress Steps (Hidden on mobile) */}
      <div className="hidden items-center gap-2 md:flex">
        <StepIndicator
          number={1}
          label="Personal Details"
          active={step === 1}
          completed={step > 1}
        />
        <div className="bg-gray-200 dark:bg-gray-700 h-px w-8"></div>
        <StepIndicator
          number={2}
          label="Verify Identity"
          active={step === 2}
          completed={step > 2}
        />
        <div className="bg-gray-200 dark:bg-gray-700 h-px w-8"></div>
        <StepIndicator
          number={3}
          label="Facial Scan"
          active={step === 3}
          completed={step > 3}
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-500 dark:text-gray-400 text-sm font-medium transition hover:text-primary">
          Help
        </button>
        <button
          onClick={() => setIsDark(!isDark)}
          className="bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 flex h-8 w-8 items-center justify-center rounded-full transition"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  );
};

const StepIndicator = ({
  number,
  label,
  active,
  completed,
}: {
  number: number;
  label: string;
  active: boolean;
  completed: boolean;
}) => {
  if (completed) {
    return (
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-600 dark:bg-green-900 dark:text-green-400">
          ✓
        </span>
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          {label}
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${active ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}
      >
        {number}
      </span>
      <span
        className={`text-sm font-semibold ${active ? 'text-primary' : 'text-gray-400'}`}
      >
        {label}
      </span>
    </div>
  );
};

export default OnboardingHeader;
