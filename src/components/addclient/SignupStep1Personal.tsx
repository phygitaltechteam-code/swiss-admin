/*eslint-disable*/
import {useNavigate} from '@tanstack/react-router';
import type {FC} from 'react';
import {useEffect, useState} from 'react';
import {COUNTRIES} from './constant';
import {BiArrowBack} from 'react-icons/bi';
import {BsArrowRight} from 'react-icons/bs';
import {
  MdAutoAwesome,
  MdCalendarToday,
  MdCheckCircle,
  MdLock,
} from 'react-icons/md';
import {Eye, EyeOff} from 'lucide-react';

interface SignupStep1PersonalProps {
  initialData: {
    accountHolderName: string;
    dateOfBirth: string;
    contactEmail: string;
    password: string;
    securityPin: string;
    contactPhone: string;
    phoneCode: string;
    streetAddress: string;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
  };
  onComplete: (data: any) => void;
  onBack: () => void;
}

interface ValidationErrors {
  accountHolderName?: string;
  dateOfBirth?: string;
  contactEmail?: string;
  password?: string;
  securityPin?: string;
  contactPhone?: string;
  streetAddress?: string;
  city?: string;
  stateProvince?: string;
  postalCode?: string;
  country?: string;
}

// Add interface for PIN code API response
interface PinCodeResponse {
  Message: string;
  Status: string;
  PostOffice: Array<{
    Name: string;
    Description: null;
    BranchType: string;
    DeliveryStatus: string;
    Circle: string;
    District: string;
    Division: string;
    Region: string;
    Block: string;
    State: string;
    Country: string;
    Pincode: string;
  }>;
}

const SignupStep1Personal: FC<SignupStep1PersonalProps> = ({
  initialData,
  onComplete,
  onBack,
}) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isValidating, setIsValidating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // Validate form on input change
  useEffect(() => {
    if (isValidating) {
      validateField('accountHolderName', formData.accountHolderName);
      validateField('dateOfBirth', formData.dateOfBirth);
      validateField('contactEmail', formData.contactEmail);
      validateField('password', formData.password);
      validateField('securityPin', formData.securityPin);
      validateField('contactPhone', formData.contactPhone);
      validateField('streetAddress', formData.streetAddress);
      validateField('city', formData.city);
      validateField('stateProvince', formData.stateProvince);
      validateField('postalCode', formData.postalCode);
      validateField('country', formData.country);
    }
  }, [formData, isValidating]);

  // Auto-fill city/state based on postal code
  useEffect(() => {
    // Debounce the API call
    const timeoutId = setTimeout(() => {
      if (formData.postalCode.length >= 5 && formData.country === 'US') {
        lookupCityStateByZip(formData.postalCode);
      } else if (
        formData.postalCode.length === 6 &&
        formData.country === 'IN'
      ) {
        lookupCityStateByPincode(formData.postalCode);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [formData.postalCode, formData.country]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({...prev, [field]: value}));

    // Start validating after first interaction
    if (!isValidating) {
      setIsValidating(true);
    }

    // Validate this specific field
    validateField(field, value);
  };

  const validateField = (field: keyof typeof formData, value: string) => {
    let error = '';

    switch (field) {
      case 'accountHolderName':
        if (!value.trim()) {
          error = 'Account holder name is required';
        } else if (value.length < 2) {
          error = 'Name must be at least 2 characters';
        }
        break;

      case 'dateOfBirth':
        if (!value) {
          error = 'Date of birth is required';
        } else {
          const dob = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < dob.getDate())
          ) {
            age--;
          }

          if (age < 18) {
            error = 'You must be at least 18 years old';
          }
        }
        break;

      case 'contactEmail':
        if (!value) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email address';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 8) {
          error = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(value)) {
          error = 'Password must contain at least one number';
        } else if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(value)) {
          error = 'Password must contain at least one special character';
        }
        break;

      case 'securityPin':
        if (!value) {
          error = 'Security PIN is required';
        } else if (!/^\d{6}$/.test(value)) {
          error = 'Security PIN must be exactly 6 digits';
        } else if (value.length > 6) {
          // Prevent extra digits
          setFormData((prev) => ({...prev, securityPin: value.slice(0, 6)}));
        }
        break;

      case 'contactPhone':
        if (!value) {
          error = 'Phone number is required';
        } else if (!/^\d{10}$/.test(value.replace(/\D/g, ''))) {
          error = 'Phone number must be exactly 10 digits';
        }
        break;

      case 'streetAddress':
        if (!value.trim()) {
          error = 'Street address is required';
        }
        break;

      case 'city':
        if (!value.trim()) {
          error = 'City is required';
        }
        break;

      case 'stateProvince':
        if (!value.trim()) {
          error = 'State/Province is required';
        }
        break;

      // case 'postalCode':
      //   if (!value.trim()) {
      //     error = 'Postal/ZIP code is required';
      //   } else if (formData.country === 'IN' && !/^\d{6}$/.test(value)) {
      //     error = 'Indian PIN code must be exactly 6 digits';
      //   } else if (
      //     formData.country === 'US' &&
      //     !/^\d{5}(-\d{4})?$/.test(value)
      //   ) {
      //     error = 'Please enter a valid US ZIP code';
      //   }
      //   break;

      case 'country':
        if (!value) {
          error = 'Country is required';
        }
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const lookupCityStateByZip = async (zipCode: string) => {
    // Only for US ZIP codes
    if (formData.country !== 'US' || zipCode.length < 5) return;

    try {
      setIsLoading(true);
      // Using a free ZIP code API
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (response.ok) {
        const data = await response.json();
        if (data.places && data.places[0]) {
          setFormData((prev) => ({
            ...prev,
            city: data.places[0]['place name'] || prev.city,
            stateProvince:
              data.places[0]['state abbreviation'] || prev.stateProvince,
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch city/state:', error);
      // Fallback: Keep existing values
    } finally {
      setIsLoading(false);
    }
  };

  const lookupCityStateByPincode = async (pincode: string) => {
    // Only for Indian PIN codes
    if (formData.country !== 'IN' || pincode.length !== 6) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
      );

      if (response.ok) {
        const data: PinCodeResponse[] = await response.json();

        if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const firstPostOffice = data[0].PostOffice[0];

          setFormData((prev) => ({
            ...prev,
            city: firstPostOffice.District || prev.city,
            stateProvince: firstPostOffice.State || prev.stateProvince,
            // Optionally, you can also auto-fill the country if it's not set
            country: formData.country || 'IN',
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch city/state from PIN code:', error);
      // Fallback: Keep existing values
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);

    // Validate all fields before submission
    const newErrors: ValidationErrors = {};

    Object.keys(formData).forEach((key) => {
      validateField(
        key as keyof typeof formData,
        formData[key as keyof typeof formData],
      );
    });

    // Check if there are any errors
    const hasErrors = Object.values(errors).some((error) => error !== '');

    if (!hasErrors) {
      onComplete(formData);
    }
  };

  const ErrorMessage = ({message}: {message?: string}) => {
    if (!message) return null;

    return (
      <p className="mt-1 text-xs font-medium text-red-500 dark:text-red-400">
        {message}
      </p>
    );
  };

  return (
    <div className="dark:bg-gray-950 flex min-h-screen w-full items-center justify-center bg-white font-['Inter'] antialiased selection:bg-[#F57F3D]/30 md:p-6">
      {/* Main container with responsive width */}
      <div className="relative mx-auto w-full max-w-[min(390px,95vw,500px)] overflow-hidden rounded-2xl bg-white dark:bg-[#221610] md:min-h-[600px] md:max-w-[700px]">
        {/* Header section */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-white/95 p-4 pb-2 backdrop-blur-sm dark:bg-[#221610]/95 md:p-6 md:pb-3">
          <button
            onClick={() => {
              navigate({to: '/client/displayclient'});
            }}
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-[#0d131c] transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800 md:size-12"
          >
            <BiArrowBack className="text-[20px] md:text-[22px]" />
          </button>
          <h2 className="flex-1 pr-12 text-center text-lg font-bold leading-tight tracking-[-0.015em] text-[#0d131c] dark:text-white md:text-xl">
            Sign Up
          </h2>
        </div>

        {/* Progress bar */}
        <div className="relative z-10 flex flex-col gap-2 px-6 py-2 md:px-8 md:py-3">
          <div className="flex items-center justify-between gap-6">
            <p className="dark:text-gray-300 text-sm font-medium leading-normal text-[#0d131c]">
              Step 1 of 3
            </p>
            <p className="text-sm font-medium text-[#F57F3D]">
              Personal Details
            </p>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[#ced9e9] dark:bg-slate-700">
            <div
              className="h-1.5 rounded-full bg-[#F57F3D] transition-all"
              style={{width: '33%'}}
            />
          </div>
        </div>

        {/* Main content area */}
        <div className="relative z-10 px-6 pb-1 pt-4 md:px-8 md:pt-6">
          <h1 className="text-[22px] font-bold leading-tight tracking-tight text-[#0d131c] dark:text-white md:text-[26px]">
            Let's get started
          </h1>
        </div>

        {/* Scrollable form content */}
        <form
          onSubmit={handleSubmit}
          className="relative z-10 flex-1 overflow-y-auto pb-20 md:pb-10"
        >
          <div className="px-6 pb-6 pt-4 md:px-8 md:pb-8">
            <div className="flex flex-col gap-5 md:gap-6">
              {/* ACCOUNT IDENTITY */}
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                    Account Holder Name
                  </span>
                  <div className="relative">
                    <input
                      className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.accountHolderName
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder="Full legal name as on ID"
                      type="text"
                      value={formData.accountHolderName}
                      onChange={(e) =>
                        handleInputChange('accountHolderName', e.target.value)
                      }
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                      <MdCheckCircle className="text-[16px] md:text-[18px]" />
                    </span>
                  </div>
                  <ErrorMessage message={errors.accountHolderName} />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                    Date of Birth
                  </span>
                  <div className="relative">
                    <input
                      className={`h-10 w-full rounded-md border px-3 pl-9 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.dateOfBirth
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder="DD / MM / YYYY"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange('dateOfBirth', e.target.value)
                      }
                      required
                      max={new Date().toISOString().split('T')[0]}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <span className="material-symbols-outlined text-[16px] md:text-[18px]">
                        <MdCalendarToday />
                      </span>
                    </span>
                  </div>
                  <ErrorMessage message={errors.dateOfBirth} />
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    You must be 18 years or older to open an account.
                  </p>
                </label>
              </div>

              {/* CONTACT INFORMATION */}
              <div className="flex flex-col gap-3">
                <h3 className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 md:text-sm">
                  Contact Information
                </h3>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                    Contact Email
                  </span>
                  <input
                    className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                      errors.contactEmail
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                        : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                    } bg-white dark:bg-slate-800/80 dark:text-white`}
                    placeholder="name@example.com"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) =>
                      handleInputChange('contactEmail', e.target.value)
                    }
                    required
                  />
                  <ErrorMessage message={errors.contactEmail} />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                    Password
                  </span>
                  <div className="relative">
                    <input
                      className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.password
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder="Minimum 8 characters"
                      type={isPasswordVisible ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange('password', e.target.value)
                      }
                      required
                      minLength={8}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <span
                        className="material-symbols-outlined cursor-pointer text-[16px] md:text-[18px]"
                        onClick={toggleVisibility}
                      >
                        {isPasswordVisible ? <Eye /> : <EyeOff />}
                      </span>
                    </span>
                  </div>
                  <ErrorMessage message={errors.password} />
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Must contain at least 8 characters, including uppercase,
                    lowercase, number and special character
                  </p>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                    Security Pin
                  </span>
                  <div className="relative">
                    <input
                      className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.securityPin
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder="6 digits"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      value={formData.securityPin}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, '');
                        handleInputChange('securityPin', value);
                      }}
                      required
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <MdLock className="text-[16px] md:text-[18px]" />
                    </span>
                  </div>
                  <ErrorMessage message={errors.securityPin} />
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    6-digit PIN for account security
                  </p>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                    Contact Phone Number
                  </span>
                  <div className="flex gap-2 md:gap-3">
                    <input
                      className={`h-10 flex-1 rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.contactPhone
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder="10 digit Phone Number"
                      type="tel"
                      inputMode="tel"
                      value={formData.contactPhone}
                      onChange={(e) => {
                        // Remove non-numeric characters
                        const value = e.target.value.replace(/\D/g, '');
                        handleInputChange('contactPhone', value);
                      }}
                      maxLength={10}
                      required
                    />
                  </div>
                  <ErrorMessage message={errors.contactPhone} />
                </label>
              </div>

              {/* REGISTERED ADDRESS */}
              <div className="flex flex-col gap-3">
                <h3 className="mb-0.5 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 md:text-sm">
                  Registered Address
                </h3>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                    Street Address, Apartment, Unit
                  </span>
                  <textarea
                    className={`min-h-[80px] w-full rounded-md border px-3 py-2 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                      errors.streetAddress
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                        : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                    } bg-white dark:bg-slate-800/80 dark:text-white`}
                    placeholder="123 Main St, Apt 4B"
                    value={formData.streetAddress}
                    onChange={(e) =>
                      handleInputChange('streetAddress', e.target.value)
                    }
                    required
                  />
                  <ErrorMessage message={errors.streetAddress} />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                    Postal/ZIP Code
                  </span>
                  <div className="relative">
                    <input
                      className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.postalCode
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder="12345 or 12345-6789"
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) =>
                        handleInputChange('postalCode', e.target.value)
                      }
                      required
                    />
                    {isLoading && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        <span className="material-symbols-outlined animate-spin text-[16px] text-[#F57F3D]">
                          progress_activity
                        </span>
                      </span>
                    )}
                  </div>
                  <ErrorMessage message={errors.postalCode} />
                  {formData.country === 'US' &&
                    formData.postalCode.length >= 5 && (
                      <p className="mt-0.5 text-xs text-[#F57F3D] dark:text-[#F57F3D]">
                        <span className="material-symbols-outlined mr-1 align-middle text-[12px]">
                          <MdAutoAwesome />
                        </span>
                        City/State will auto-fill for US ZIP codes
                      </p>
                    )}
                  {formData.country === 'IN' &&
                    formData.postalCode.length === 6 && (
                      <p className="mt-0.5 text-xs text-[#F57F3D] dark:text-[#F57F3D]">
                        <span className="material-symbols-outlined mr-1 align-middle text-[12px]">
                          <MdAutoAwesome />
                        </span>
                        City/State will auto-fill for Indian PIN codes
                      </p>
                    )}
                </label>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                      City
                    </span>
                    <input
                      className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.city
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder="City"
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange('city', e.target.value)
                      }
                      required
                    />
                    <ErrorMessage message={errors.city} />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                      State/Province
                    </span>
                    <input
                      className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.stateProvince
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder="State"
                      type="text"
                      value={formData.stateProvince}
                      onChange={(e) =>
                        handleInputChange('stateProvince', e.target.value)
                      }
                      required
                    />
                    <ErrorMessage message={errors.stateProvince} />
                  </label>
                </div>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                    Country
                  </span>
                  <select
                    className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all focus:ring-1 md:text-base ${
                      errors.country
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                        : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                    } bg-white dark:bg-slate-800/80 dark:text-white`}
                    value={formData.country}
                    onChange={(e) =>
                      handleInputChange('country', e.target.value)
                    }
                    required
                  >
                    <option value="">Select a country</option>
                    {COUNTRIES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  <ErrorMessage message={errors.country} />
                </label>
              </div>
            </div>
          </div>
        </form>

        {/* Fixed bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 z-20 mx-auto w-full max-w-[min(390px,95vw,500px)] border-t border-slate-100 bg-white p-2 backdrop-blur-md dark:border-slate-800 dark:bg-[#221610]/80 md:relative md:mt-4 md:max-w-[700px] md:border-t-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
          <div className="flex flex-col items-center gap-3 md:px-8 md:pb-6">
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#F57F3D] text-base font-semibold text-white shadow-md shadow-[#F57F3D]/20 transition-all hover:bg-[#e06c2e] active:scale-[0.98] md:h-14 md:max-w-[400px] md:text-lg"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px] md:text-[20px]">
                    progress_activity
                  </span>
                  Loading...
                </>
              ) : (
                <>
                  Continue
                  <BsArrowRight />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupStep1Personal;
