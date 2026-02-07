/* eslint-disable */
import React from 'react';
import {
  User,
  Calendar,
  Home,
  Mail,
  Phone,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import OnboardingHeader from './OnboardingHeader';
import {useNavigate} from '@tanstack/react-router';

interface PersonalDetailsProps {
  onBack: () => void;
  onContinue?: () => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = ({
  onBack,
  onContinue,
}) => {
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onContinue) {
      onContinue();
    } else {
      console.log('Form submitted - no onContinue provided');
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark flex min-h-screen flex-col">
      <OnboardingHeader
        step={1}
        title="Personal Details"
        onBack={() => navigate({to: '/landingpage'})}
      />

      <main className="flex-grow px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Mobile Progress Bar */}
          <div className="mx-auto mb-8 max-w-4xl md:hidden">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-gray-500 text-sm font-medium">
                Step 1 of 4
              </span>
              <span className="text-sm font-medium text-primary">
                Personal Details
              </span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 h-2 w-full rounded-full">
              <div className="h-2 w-1/4 rounded-full bg-primary"></div>
            </div>
          </div>

          <div className="dark:bg-surface-dark border-gray-100 dark:border-gray-800 rounded-3xl border bg-white p-8 shadow-xl lg:p-12">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h1 className="mb-4 text-3xl font-bold text-black dark:text-white">
                Let's get started
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                Please enter your details exactly as they appear on your ID to
                ensure a smooth verification process.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Column 1: Identity */}
                <div className="space-y-6">
                  <SectionTitle
                    icon={<User size={20} />}
                    title="Account Identity"
                  />

                  <InputField
                    label="Account Holder Name"
                    placeholder="John Doe"
                    defaultValue="John Doe"
                    iconRight={
                      <CheckCircle className="text-green-500" size={20} />
                    }
                  />

                  <InputField
                    label="Date of Birth"
                    placeholder="DD / MM / YYYY"
                    iconLeft={<Calendar className="text-gray-400" size={20} />}
                    helperText="Must be 18 years or older to open an account."
                  />

                  <SelectField label="Nationality">
                    <option>Select nationality</option>
                    <option>United States</option>
                    <option>Switzerland</option>
                  </SelectField>

                  <InputField
                    label="SWIFT/BIC Code"
                    placeholder="ENTER SWIFT CODE"
                    uppercase
                  />

                  <SelectField label="Country of Account">
                    <option>United States</option>
                    <option>Switzerland</option>
                  </SelectField>
                </div>

                {/* Column 2: Contact */}
                <div className="space-y-6">
                  <SectionTitle
                    icon={<Mail size={20} />}
                    title="Contact Information"
                  />

                  <InputField
                    label="Contact Email"
                    placeholder="name@example.com"
                    type="email"
                  />

                  <div>
                    <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
                      Contact Phone Number
                    </label>
                    <div className="flex rounded-md shadow-sm">
                      <div className="relative w-28 flex-grow-0">
                        <select className="border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 block w-full rounded-l-lg border-r-0 py-3 pl-3 pr-8 focus:border-primary focus:ring-primary dark:text-white sm:text-sm">
                          <option>🇺🇸 +1</option>
                          <option>🇨🇭 +41</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        className="border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 block w-full flex-1 rounded-r-lg px-4 py-3 focus:border-primary focus:ring-primary dark:text-white sm:text-sm"
                        placeholder="000 000 0000"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-4">
                    <input
                      type="checkbox"
                      id="offers"
                      className="border-gray-300 mt-1 h-4 w-4 rounded text-primary focus:ring-primary"
                    />
                    <label htmlFor="offers" className="text-sm">
                      <span className="text-gray-900 block font-medium dark:text-white">
                        Receive news and offers
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 block">
                        Get updates about our products and market insights.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Column 3: Address */}
                <div className="space-y-6">
                  <SectionTitle
                    icon={<Home size={20} />}
                    title="Residential Address"
                  />

                  <div>
                    <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
                      Registered Address
                    </label>
                    <textarea
                      rows={3}
                      className="border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 block w-full resize-none rounded-lg px-4 py-3 focus:border-primary focus:ring-primary dark:text-white sm:text-sm"
                      placeholder="Street address, apartment, unit"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="City" placeholder="City" />
                    <InputField label="State/Province" placeholder="State" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Postal/ZIP Code" placeholder="12345" />
                    <InputField label="Country" placeholder="Country" />
                  </div>
                </div>
              </div>

              <div className="border-gray-200 dark:border-gray-700 mt-12 flex flex-col items-center border-t pt-8">
                <div className="mb-6 flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-green-600 dark:bg-green-900/20 dark:text-green-500">
                  <CheckCircle size={16} />
                  <span className="text-xs font-medium">
                    Bank-grade 256-bit encryption
                  </span>
                </div>
                <button
                  type="submit"
                  onClick={() => navigate({to: '/onboarding'})}
                  className="hover:bg-primary-hover flex w-full max-w-md transform items-center justify-center rounded-full border border-transparent bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Continue
                  <ArrowRight className="ml-2" size={20} />
                </button>
              </div>
            </form>
          </div>

          <div className="text-gray-500 mt-8 space-x-6 text-center text-sm">
            <a href="#" className="hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary">
              Contact Support
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};

const SectionTitle = ({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="border-gray-100 dark:border-gray-800 mb-4 flex items-center space-x-2 border-b pb-2">
    <span className="text-primary">{icon}</span>
    <h3 className="text-sm font-semibold uppercase tracking-wider text-black dark:text-white">
      {title}
    </h3>
  </div>
);

const InputField = ({
  label,
  placeholder,
  defaultValue,
  iconLeft,
  iconRight,
  helperText,
  uppercase,
  type = 'text',
}: any) => (
  <div>
    <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
      {label}
    </label>
    <div className="relative rounded-md shadow-sm">
      {iconLeft && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {iconLeft}
        </div>
      )}
      <input
        type={type}
        defaultValue={defaultValue}
        className={`border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 block w-full rounded-lg px-4 py-3 focus:border-primary focus:ring-primary dark:text-white sm:text-sm ${iconLeft ? 'pl-10' : ''} ${uppercase ? 'uppercase placeholder:normal-case' : ''}`}
        placeholder={placeholder}
      />
      {iconRight && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          {iconRight}
        </div>
      )}
    </div>
    {helperText && <p className="text-gray-500 mt-1 text-xs">{helperText}</p>}
  </div>
);

const SelectField = ({label, children}: any) => (
  <div>
    <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
      {label}
    </label>
    <select className="border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 block w-full rounded-lg px-4 py-3 focus:border-primary focus:ring-primary dark:text-white sm:text-sm">
      {children}
    </select>
  </div>
);

export default PersonalDetails;
// import React from 'react';
// import {
//   User,
//   Calendar,
//   Home,
//   Mail,
//   Phone,
//   CheckCircle,
//   ArrowRight,
//   Flag,
// } from 'lucide-react';
// import {useNavigate} from '@tanstack/react-router';

// const PersonalDetails: React.FC = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-background-light dark:bg-background-dark flex min-h-screen flex-col">
//       <main className="flex-grow px-4 py-12 sm:px-6 lg:px-8">
//         <div className="mx-auto max-w-6xl">
//           {/* Mobile Progress Bar */}
//           <div className="mx-auto mb-8 max-w-4xl md:hidden">
//             <div className="mb-2 flex items-center justify-between">
//               <span className="text-gray-500 text-sm font-medium">
//                 Step 1 of 4
//               </span>
//               <span className="text-sm font-medium text-primary">
//                 Personal Details
//               </span>
//             </div>
//             <div className="bg-gray-200 dark:bg-gray-700 h-2 w-full rounded-full">
//               <div className="h-2 w-1/4 rounded-full bg-primary"></div>
//             </div>
//           </div>

//           <div className="bg-surface-light dark:bg-surface-dark border-gray-100 dark:border-gray-800 rounded-3xl border p-8 shadow-xl lg:p-12">
//             <div className="mx-auto mb-12 max-w-2xl text-center">
//               <h1 className="mb-4 text-3xl font-bold text-secondary dark:text-white">
//                 Let's get started
//               </h1>
//               <p className="text-gray-500 dark:text-gray-400 text-lg">
//                 Please enter your details exactly as they appear on your ID to
//                 ensure a smooth verification process.
//               </p>
//             </div>

//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 navigate({to: '/onboarding'});
//               }}
//             >
//               <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
//                 {/* Column 1: Identity */}
//                 <div className="space-y-6">
//                   <SectionTitle
//                     icon={<User size={20} />}
//                     title="Account Identity"
//                   />

//                   <InputField
//                     label="Account Holder Name"
//                     placeholder="John Doe"
//                     defaultValue="John Doe"
//                     iconRight={
//                       <CheckCircle className="text-green-500" size={20} />
//                     }
//                   />

//                   <InputField
//                     label="Date of Birth"
//                     placeholder="DD / MM / YYYY"
//                     iconLeft={<Calendar className="text-gray-400" size={20} />}
//                     helperText="Must be 18 years or older to open an account."
//                   />

//                   <SelectField label="Nationality">
//                     <option>Select nationality</option>
//                     <option>United States</option>
//                     <option>Switzerland</option>
//                   </SelectField>

//                   <InputField
//                     label="SWIFT/BIC Code"
//                     placeholder="ENTER SWIFT CODE"
//                     uppercase
//                   />

//                   <SelectField label="Country of Account">
//                     <option>United States</option>
//                     <option>Switzerland</option>
//                   </SelectField>
//                 </div>

//                 {/* Column 2: Contact */}
//                 <div className="space-y-6">
//                   <SectionTitle
//                     icon={<Mail size={20} />}
//                     title="Contact Information"
//                   />

//                   <InputField
//                     label="Contact Email"
//                     placeholder="name@example.com"
//                     type="email"
//                   />

//                   <div>
//                     <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
//                       Contact Phone Number
//                     </label>
//                     <div className="flex rounded-md shadow-sm">
//                       <div className="relative w-28 flex-grow-0">
//                         <select className="border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 block w-full rounded-l-lg border-r-0 py-3 pl-3 pr-8 focus:border-primary focus:ring-primary dark:text-white sm:text-sm">
//                           <option>🇺🇸 +1</option>
//                           <option>🇨🇭 +41</option>
//                         </select>
//                       </div>
//                       <input
//                         type="text"
//                         className="border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 block w-full flex-1 rounded-r-lg px-4 py-3 focus:border-primary focus:ring-primary dark:text-white sm:text-sm"
//                         placeholder="000 000 0000"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex items-start gap-3 pt-4">
//                     <input
//                       type="checkbox"
//                       id="offers"
//                       className="border-gray-300 mt-1 h-4 w-4 rounded text-primary focus:ring-primary"
//                     />
//                     <label htmlFor="offers" className="text-sm">
//                       <span className="text-gray-900 block font-medium dark:text-white">
//                         Receive news and offers
//                       </span>
//                       <span className="text-gray-500 dark:text-gray-400 block">
//                         Get updates about our products and market insights.
//                       </span>
//                     </label>
//                   </div>
//                 </div>

//                 {/* Column 3: Address */}
//                 <div className="space-y-6">
//                   <SectionTitle
//                     icon={<Home size={20} />}
//                     title="Residential Address"
//                   />

//                   <div>
//                     <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
//                       Registered Address
//                     </label>
//                     <textarea
//                       rows={3}
//                       className="border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 block w-full resize-none rounded-lg px-4 py-3 focus:border-primary focus:ring-primary dark:text-white sm:text-sm"
//                       placeholder="Street address, apartment, unit"
//                     ></textarea>
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <InputField label="City" placeholder="City" />
//                     <InputField label="State/Province" placeholder="State" />
//                   </div>

//                   <div className="grid grid-cols-2 gap-4">
//                     <InputField label="Postal/ZIP Code" placeholder="12345" />
//                     <InputField label="Country" placeholder="Country" />
//                   </div>
//                 </div>
//               </div>

//               <div className="border-gray-200 dark:border-gray-700 mt-12 flex flex-col items-center border-t pt-8">
//                 <div className="mb-6 flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-green-600 dark:bg-green-900/20 dark:text-green-500">
//                   <CheckCircle size={16} />
//                   <span className="text-xs font-medium">
//                     Bank-grade 256-bit encryption
//                   </span>
//                 </div>
//                 <button
//                   type="submit"
//                   className="hover:bg-primary-hover flex w-full max-w-md transform items-center justify-center rounded-full border border-transparent bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
//                 >
//                   Continue
//                   <ArrowRight className="ml-2" size={20} />
//                 </button>
//               </div>
//             </form>
//           </div>

//           <div className="text-gray-500 mt-8 space-x-6 text-center text-sm">
//             <a href="#" className="hover:text-primary">
//               Privacy Policy
//             </a>
//             <a href="#" className="hover:text-primary">
//               Terms of Service
//             </a>
//             <a href="#" className="hover:text-primary">
//               Contact Support
//             </a>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// const SectionTitle = ({
//   icon,
//   title,
// }: {
//   icon: React.ReactNode;
//   title: string;
// }) => (
//   <div className="border-gray-100 dark:border-gray-800 mb-4 flex items-center space-x-2 border-b pb-2">
//     <span className="text-primary">{icon}</span>
//     <h3 className="text-sm font-semibold uppercase tracking-wider text-secondary dark:text-white">
//       {title}
//     </h3>
//   </div>
// );

// const InputField = ({
//   label,
//   placeholder,
//   defaultValue,
//   iconLeft,
//   iconRight,
//   helperText,
//   uppercase,
//   type = 'text',
// }: any) => (
//   <div>
//     <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
//       {label}
//     </label>
//     <div className="relative rounded-md shadow-sm">
//       {iconLeft && (
//         <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//           {iconLeft}
//         </div>
//       )}
//       <input
//         type={type}
//         defaultValue={defaultValue}
//         className={`border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 block w-full rounded-lg px-4 py-3 focus:border-primary focus:ring-primary dark:text-white sm:text-sm ${iconLeft ? 'pl-10' : ''} ${uppercase ? 'uppercase placeholder:normal-case' : ''}`}
//         placeholder={placeholder}
//       />
//       {iconRight && (
//         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
//           {iconRight}
//         </div>
//       )}
//     </div>
//     {helperText && <p className="text-gray-500 mt-1 text-xs">{helperText}</p>}
//   </div>
// );

// const SelectField = ({label, children}: any) => (
//   <div>
//     <label className="text-gray-700 dark:text-gray-300 mb-1 block text-sm font-medium">
//       {label}
//     </label>
//     <select className="border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 block w-full rounded-lg px-4 py-3 focus:border-primary focus:ring-primary dark:text-white sm:text-sm">
//       {children}
//     </select>
//   </div>
// );

// export default PersonalDetails;
