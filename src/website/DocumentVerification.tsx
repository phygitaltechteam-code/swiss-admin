/* eslint-disable */
import React, {useState} from 'react';
import OnboardingHeader from './OnboardingHeader';
import {
  FileText,
  CreditCard,
  Car,
  CheckCircle,
  Upload,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {useNavigate} from '@tanstack/react-router';

const DocumentVerification: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDoc, setSelectedDoc] = useState<'passport' | 'id' | 'driver'>(
    'passport',
  );

  return (
    <div className="bg-background-light dark:bg-background-dark flex min-h-screen flex-col">
      <OnboardingHeader step={2} title="Verify Identity" />

      {/* Background Pattern */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#F37936 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      ></div>

      <main className="relative z-10 flex flex-grow items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Left Column: Info */}
          <div className="flex flex-col justify-center space-y-8 lg:col-span-5">
            <div>
              <h2 className="mb-4 text-4xl font-extrabold text-black dark:text-white">
                Document Verification
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                Please upload a clear image of your official identification
                document. This ensures a secure and smooth verification process
                for your new account.
              </p>
            </div>

            <div className="dark:bg-surface-dark border-gray-200 dark:border-gray-700 space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
              <h3 className="text-gray-500 mb-2 text-sm font-bold uppercase tracking-wider">
                Photo Requirements
              </h3>

              <RequirementItem
                icon="📝"
                color="bg-green-100 text-green-600"
                title="Text must be readable"
                desc="Details should be clear, sharp and not blurry."
              />
              <RequirementItem
                icon="⛶"
                color="bg-blue-100 text-blue-600"
                title="All corners visible"
                desc="Capture the full document within the frame."
              />
              <RequirementItem
                icon="⚡"
                color="bg-red-100 text-red-600"
                title="Avoid flash and glare"
                desc="Reflections make it hard to verify details."
              />
            </div>

            <div className="text-gray-500 flex items-center gap-2 text-xs">
              <ShieldCheck className="text-green-500" size={16} />
              <span>Bank-grade 256-bit encryption</span>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="dark:bg-surface-dark border-gray-200 dark:border-gray-700 flex h-full flex-col rounded-3xl border bg-white p-8 shadow-xl lg:col-span-7 lg:p-10">
            <div className="mb-8">
              <label className="text-gray-600 dark:text-gray-300 mb-4 block text-sm font-medium">
                Select Document Type
              </label>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <DocOption
                  label="Passport"
                  icon={<FileText size={32} />}
                  selected={selectedDoc === 'passport'}
                  onClick={() => setSelectedDoc('passport')}
                />
                <DocOption
                  label="ID Card"
                  icon={<CreditCard size={32} />}
                  selected={selectedDoc === 'id'}
                  onClick={() => setSelectedDoc('id')}
                />
                <DocOption
                  label="Driver's License"
                  icon={<Car size={32} />}
                  selected={selectedDoc === 'driver'}
                  onClick={() => setSelectedDoc('driver')}
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Document Number
              </label>
              <input
                type="text"
                placeholder="Enter document number"
                className="bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 w-full rounded-xl border px-4 py-3 text-black outline-none focus:border-transparent focus:ring-2 focus:ring-primary dark:text-white"
              />
            </div>

            <div className="flex flex-grow flex-col">
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Upload Front Side
              </label>
              <div className="bg-gray-50 dark:bg-gray-800/50 group flex min-h-[250px] flex-grow cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 p-8 transition-colors hover:bg-primary/5 dark:border-primary/20 dark:hover:bg-primary/10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 transition-transform duration-300 group-hover:scale-110 dark:bg-orange-900/30">
                  <Upload className="text-primary" size={32} />
                </div>
                <h5 className="mb-1 text-lg font-semibold text-black dark:text-white">
                  Click to upload or drag & drop
                </h5>
                <p className="text-gray-500 text-sm">
                  Supported formats: JPG, PNG (Max 5MB)
                </p>

                {/* Hidden input for semantics */}
                <input type="file" className="hidden" />
              </div>
            </div>

            <div className="border-gray-100 dark:border-gray-700 mt-8 flex items-center justify-between border-t pt-6">
              <button
                onClick={() => navigate({to: '/personalaccount'})}
                className="text-gray-500 rounded-xl px-6 py-3 font-medium transition-colors hover:text-black dark:hover:text-white"
              >
                Back
              </button>
              <button
                onClick={() => navigate({to: '/verification'})}
                className="hover:bg-primary-hover flex transform items-center gap-2 rounded-xl bg-primary px-8 py-3 font-semibold text-white shadow-lg shadow-primary/30 transition-all active:scale-95"
              >
                Continue
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const RequirementItem = ({icon, color, title, desc}: any) => (
  <div className="flex items-start gap-4">
    <div
      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${color} bg-opacity-20`}
    >
      <span className="text-lg">{icon}</span>
    </div>
    <div>
      <h4 className="font-semibold text-black dark:text-white">{title}</h4>
      <p className="text-gray-500 mt-1 text-sm">{desc}</p>
    </div>
  </div>
);

const DocOption = ({label, icon, selected, onClick}: any) => (
  <button
    onClick={onClick}
    className={`group relative flex flex-col items-center justify-center rounded-xl border-2 p-4 transition-all ${selected ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700 dark:bg-gray-800 bg-white hover:border-primary/50'}`}
  >
    {selected && (
      <div className="absolute right-2 top-2 text-primary">
        <CheckCircle
          size={18}
          fill="currentColor"
          className="text-primary-100"
        />
      </div>
    )}
    <div
      className={`mb-2 transition-colors ${selected ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`}
    >
      {icon}
    </div>
    <span
      className={`font-semibold ${selected ? 'text-primary' : 'text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white'}`}
    >
      {label}
    </span>
  </button>
);

export default DocumentVerification;
