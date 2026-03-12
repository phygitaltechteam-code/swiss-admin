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
  MdError,
} from 'react-icons/md';
import {Eye, EyeOff} from 'lucide-react';
import React from 'react';
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
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPinVisible, setIsPinVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const togglePinVisibility = () => {
    setIsPinVisible((prev) => !prev);
  };

  // Validation functions
  const validateAccountHolderName = (name: string): string => {
    if (!name.trim()) return 'Account holder name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (name.length > 100) return 'Name must be less than 100 characters';
    if (!/^[a-zA-Z\s\-']+$/.test(name))
      return 'Name can only contain letters, spaces, hyphens and apostrophes';
    return '';
  };

  const validateDateOfBirth = (dob: string): string => {
    if (!dob) return 'Date of birth is required';

    const birthDate = new Date(dob);
    const today = new Date();

    if (isNaN(birthDate.getTime())) return 'Invalid date format';
    if (birthDate > today) return 'Date of birth cannot be in the future';

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) return 'You must be at least 18 years old';
    if (age > 120) return 'Please enter a valid date of birth';

    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return 'Please enter a valid email address';
    if (email.length > 254) return 'Email is too long';
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password.length > 128)
      return 'Password must be less than 128 characters';
    if (!/(?=.*[a-z])/.test(password))
      return 'Password must contain at least one lowercase letter';
    if (!/(?=.*[A-Z])/.test(password))
      return 'Password must contain at least one uppercase letter';
    if (!/(?=.*\d)/.test(password))
      return 'Password must contain at least one number';
    if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const validateSecurityPin = (pin: string): string => {
    if (!pin) return 'Security PIN is required';
    if (!/^\d{6}$/.test(pin)) return 'Security PIN must be exactly 6 digits';
    if (/(\d)\1{4,}/.test(pin))
      return 'PIN cannot have 5 or more repeated digits';
    if (/123456|234567|345678|456789|567890|012345/.test(pin))
      return 'PIN cannot be sequential';
    return '';
  };

  const validatePhone = (phone: string): string => {
    if (!phone) return 'Phone number is required';
    if (!/^\d{10}$/.test(phone))
      return 'Phone number must be exactly 10 digits';
    if (/(\d)\1{9,}/.test(phone)) return 'Invalid phone number pattern';
    return '';
  };

  const validateStreetAddress = (address: string): string => {
    if (!address.trim()) return 'Street address is required';
    if (address.length < 5) return 'Address must be at least 5 characters';
    if (address.length > 200) return 'Address must be less than 200 characters';
    return '';
  };

  const validateCity = (city: string): string => {
    if (!city.trim()) return 'City is required';
    if (city.length < 2) return 'City must be at least 2 characters';
    if (city.length > 100) return 'City must be less than 100 characters';
    if (!/^[a-zA-Z\s\-']+$/.test(city))
      return 'City can only contain letters, spaces, hyphens and apostrophes';
    return '';
  };

  const validateState = (state: string): string => {
    if (!state.trim()) return 'State/Province is required';
    if (state.length < 2) return 'State must be at least 2 characters';
    if (state.length > 100) return 'State must be less than 100 characters';
    return '';
  };

  const validatePostalCode = (postalCode: string, country: string): string => {
    if (!postalCode.trim()) return 'Postal/ZIP code is required';

    if (country === 'IN') {
      if (!/^\d{6}$/.test(postalCode))
        return 'Indian PIN code must be exactly 6 digits';
      if (/000000/.test(postalCode)) return 'Invalid PIN code';
    } else if (country === 'US') {
      if (!/^\d{5}(-\d{4})?$/.test(postalCode))
        return 'Please enter a valid US ZIP code (e.g., 12345 or 12345-6789)';
    } else {
      if (postalCode.length < 3 || postalCode.length > 12)
        return 'Postal code must be between 3 and 12 characters';
    }
    return '';
  };

  const validateCountry = (country: string): string => {
    if (!country) return 'Country is required';
    return '';
  };

  // Validate single field
  const validateField = (
    field: keyof typeof formData,
    value: string,
  ): string => {
    switch (field) {
      case 'accountHolderName':
        return validateAccountHolderName(value);
      case 'dateOfBirth':
        return validateDateOfBirth(value);
      case 'contactEmail':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'securityPin':
        return validateSecurityPin(value);
      case 'contactPhone':
        return validatePhone(value);
      case 'streetAddress':
        return validateStreetAddress(value);
      case 'city':
        return validateCity(value);
      case 'stateProvince':
        return validateState(value);
      case 'postalCode':
        return validatePostalCode(value, formData.country);
      case 'country':
        return validateCountry(value);
      default:
        return '';
    }
  };

  // Validate all fields
  const validateAllFields = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });

    return newErrors;
  };

  // Handle field blur
  const handleBlur = (field: keyof typeof formData) => {
    setTouched((prev) => ({...prev, [field]: true}));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({...prev, [field]: error}));
  };

  // Handle input change
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    // Special handling for fields
    if (field === 'securityPin' || field === 'contactPhone') {
      value = value.replace(/\D/g, '');
    }

    if (field === 'securityPin' && value.length > 6) {
      value = value.slice(0, 6);
    }

    if (field === 'contactPhone' && value.length > 10) {
      value = value.slice(0, 10);
    }

    setFormData((prev) => ({...prev, [field]: value}));

    // Validate on change if field has been touched
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({...prev, [field]: error}));
    }
  };

  // Auto-fill city/state based on postal code
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData.postalCode.length >= 5 && formData.country === 'US') {
        lookupCityStateByZip(formData.postalCode);
      } else if (
        formData.postalCode.length === 6 &&
        formData.country === 'IN'
      ) {
        lookupCityStateByPincode(formData.postalCode);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.postalCode, formData.country]);

  const lookupCityStateByZip = async (zipCode: string) => {
    if (formData.country !== 'US' || zipCode.length < 5) return;

    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const lookupCityStateByPincode = async (pincode: string) => {
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
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch city/state from PIN code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => {
        acc[key] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setTouched(allTouched);

    // Validate all fields
    const newErrors = validateAllFields();
    setErrors(newErrors);

    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some((error) => error !== '');

    if (!hasErrors) {
      onComplete(formData);
    }
  };

  const ErrorMessage = ({message}: {message?: string}) => {
    if (!message) return null;
    return (
      <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-500 dark:text-red-400">
        <MdError className="text-red-500" />
        {message}
      </p>
    );
  };

  const SuccessIcon = ({show}: {show: boolean}) => {
    if (!show) return null;
    return (
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
        <MdCheckCircle className="text-[16px] md:text-[18px]" />
      </span>
    );
  };

  const isFieldValid = (field: keyof typeof formData): boolean => {
    return touched[field] && !errors[field] && formData[field]?.length > 0;
  };

  return (
    <div className="dark:bg-gray-950 flex min-h-screen w-full items-center justify-center bg-white font-['Inter'] antialiased selection:bg-[#F57F3D]/30 md:p-6">
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
            Let&apos;s get started
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
                    Account Holder Name <span className="text-red-500">*</span>
                  </span>
                  <div className="relative">
                    <input
                      className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.accountHolderName && touched.accountHolderName
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : isFieldValid('accountHolderName')
                            ? 'border-green-400 focus:border-green-400 focus:ring-green-400/30 dark:border-green-500'
                            : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder="Full legal name as on ID"
                      type="text"
                      value={formData.accountHolderName}
                      onChange={(e) =>
                        handleInputChange('accountHolderName', e.target.value)
                      }
                      onBlur={() => handleBlur('accountHolderName')}
                      required
                    />
                    <SuccessIcon show={isFieldValid('accountHolderName')} />
                  </div>
                  <ErrorMessage message={errors.accountHolderName} />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                    Date of Birth <span className="text-red-500">*</span>
                  </span>
                  <div className="relative">
                    <input
                      className={`h-10 w-full rounded-md border px-3 pl-9 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.dateOfBirth && touched.dateOfBirth
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : isFieldValid('dateOfBirth')
                            ? 'border-green-400 focus:border-green-400 focus:ring-green-400/30 dark:border-green-500'
                            : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder="DD / MM / YYYY"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        handleInputChange('dateOfBirth', e.target.value)
                      }
                      onBlur={() => handleBlur('dateOfBirth')}
                      required
                      max={new Date().toISOString().split('T')[0]}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <MdCalendarToday className="text-[16px] md:text-[18px]" />
                    </span>
                    <SuccessIcon show={isFieldValid('dateOfBirth')} />
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
                    Contact Email <span className="text-red-500">*</span>
                  </span>
                  <div className="relative">
                    <input
                      className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.contactEmail && touched.contactEmail
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : isFieldValid('contactEmail')
                            ? 'border-green-400 focus:border-green-400 focus:ring-green-400/30 dark:border-green-500'
                            : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder="name@example.com"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) =>
                        handleInputChange('contactEmail', e.target.value)
                      }
                      onBlur={() => handleBlur('contactEmail')}
                      required
                    />
                    <SuccessIcon show={isFieldValid('contactEmail')} />
                  </div>
                  <ErrorMessage message={errors.contactEmail} />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                    Password <span className="text-red-500">*</span>
                  </span>
                  <div className="relative">
                    <input
                      className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.password && touched.password
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : isFieldValid('password')
                            ? 'border-green-400 focus:border-green-400 focus:ring-green-400/30 dark:border-green-500'
                            : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder="Minimum 8 characters"
                      type={isPasswordVisible ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange('password', e.target.value)
                      }
                      onBlur={() => handleBlur('password')}
                      required
                      minLength={8}
                    />
                    <span className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400">
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="focus:outline-none"
                      >
                        {isPasswordVisible ? (
                          <EyeOff className="text-[16px] md:text-[18px]" />
                        ) : (
                          <Eye className="text-[16px] md:text-[18px]" />
                        )}
                      </button>
                    </span>
                    <SuccessIcon show={isFieldValid('password')} />
                  </div>
                  <ErrorMessage message={errors.password} />
                  <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    <p>Password must contain:</p>
                    <ul className="mt-1 list-disc pl-4">
                      <li
                        className={
                          formData.password.length >= 8 ? 'text-green-500' : ''
                        }
                      >
                        ✓ At least 8 characters
                      </li>
                      <li
                        className={
                          /(?=.*[a-z])/.test(formData.password)
                            ? 'text-green-500'
                            : ''
                        }
                      >
                        ✓ One lowercase letter
                      </li>
                      <li
                        className={
                          /(?=.*[A-Z])/.test(formData.password)
                            ? 'text-green-500'
                            : ''
                        }
                      >
                        ✓ One uppercase letter
                      </li>
                      <li
                        className={
                          /(?=.*\d)/.test(formData.password)
                            ? 'text-green-500'
                            : ''
                        }
                      >
                        ✓ One number
                      </li>
                      <li
                        className={
                          /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(
                            formData.password,
                          )
                            ? 'text-green-500'
                            : ''
                        }
                      >
                        ✓ One special character
                      </li>
                    </ul>
                  </div>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                    Security Pin <span className="text-red-500">*</span>
                  </span>
                  <div className="relative">
                    <input
                      className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.securityPin && touched.securityPin
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : isFieldValid('securityPin')
                            ? 'border-green-400 focus:border-green-400 focus:ring-green-400/30 dark:border-green-500'
                            : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder="6 digits"
                      type={isPinVisible ? 'text' : 'password'}
                      inputMode="numeric"
                      maxLength={6}
                      value={formData.securityPin}
                      onChange={(e) =>
                        handleInputChange('securityPin', e.target.value)
                      }
                      onBlur={() => handleBlur('securityPin')}
                      required
                    />
                    <span className="absolute right-10 top-1/2 -translate-y-1/2 text-slate-400">
                      <button
                        type="button"
                        onClick={togglePinVisibility}
                        className="focus:outline-none"
                      >
                        {isPinVisible ? (
                          <EyeOff className="text-[16px] md:text-[18px]" />
                        ) : (
                          <Eye className="text-[16px] md:text-[18px]" />
                        )}
                      </button>
                    </span>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <MdLock className="text-[16px] md:text-[18px]" />
                    </span>
                  </div>
                  <ErrorMessage message={errors.securityPin} />
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    6-digit PIN for account security (avoid repeated or
                    sequential digits)
                  </p>
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                    Contact Phone Number <span className="text-red-500">*</span>
                  </span>
                  <div className="relative">
                    <input
                      className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.contactPhone && touched.contactPhone
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : isFieldValid('contactPhone')
                            ? 'border-green-400 focus:border-green-400 focus:ring-green-400/30 dark:border-green-500'
                            : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder="10 digit Phone Number"
                      type="tel"
                      inputMode="tel"
                      value={formData.contactPhone}
                      onChange={(e) =>
                        handleInputChange('contactPhone', e.target.value)
                      }
                      onBlur={() => handleBlur('contactPhone')}
                      maxLength={10}
                      required
                    />
                    <SuccessIcon show={isFieldValid('contactPhone')} />
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
                    Street Address, Apartment, Unit{' '}
                    <span className="text-red-500">*</span>
                  </span>
                  <div className="relative">
                    <textarea
                      className={`min-h-[80px] w-full rounded-md border px-3 py-2 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.streetAddress && touched.streetAddress
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : isFieldValid('streetAddress')
                            ? 'border-green-400 focus:border-green-400 focus:ring-green-400/30 dark:border-green-500'
                            : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder="123 Main St, Apt 4B"
                      value={formData.streetAddress}
                      onChange={(e) =>
                        handleInputChange('streetAddress', e.target.value)
                      }
                      onBlur={() => handleBlur('streetAddress')}
                      required
                    />
                    <SuccessIcon show={isFieldValid('streetAddress')} />
                  </div>
                  <ErrorMessage message={errors.streetAddress} />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                    Postal/ZIP Code <span className="text-red-500">*</span>
                  </span>
                  <div className="relative">
                    <input
                      className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                        errors.postalCode && touched.postalCode
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : isFieldValid('postalCode')
                            ? 'border-green-400 focus:border-green-400 focus:ring-green-400/30 dark:border-green-500'
                            : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      placeholder={
                        formData.country === 'US'
                          ? '12345 or 12345-6789'
                          : 'Postal code'
                      }
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) =>
                        handleInputChange('postalCode', e.target.value)
                      }
                      onBlur={() => handleBlur('postalCode')}
                      required
                    />
                    {isLoading && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        <span className="material-symbols-outlined animate-spin text-[16px] text-[#F57F3D]">
                          progress_activity
                        </span>
                      </span>
                    )}
                    <SuccessIcon
                      show={isFieldValid('postalCode') && !isLoading}
                    />
                  </div>
                  <ErrorMessage message={errors.postalCode} />
                  {formData.country === 'US' &&
                    formData.postalCode.length >= 5 && (
                      <p className="mt-0.5 text-xs text-[#F57F3D] dark:text-[#F57F3D]">
                        <MdAutoAwesome className="mr-1 inline text-[12px]" />
                        City/State will auto-fill for US ZIP codes
                      </p>
                    )}
                  {formData.country === 'IN' &&
                    formData.postalCode.length === 6 && (
                      <p className="mt-0.5 text-xs text-[#F57F3D] dark:text-[#F57F3D]">
                        <MdAutoAwesome className="mr-1 inline text-[12px]" />
                        City/State will auto-fill for Indian PIN codes
                      </p>
                    )}
                </label>

                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                      City <span className="text-red-500">*</span>
                    </span>
                    <div className="relative">
                      <input
                        className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                          errors.city && touched.city
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                            : isFieldValid('city')
                              ? 'border-green-400 focus:border-green-400 focus:ring-green-400/30 dark:border-green-500'
                              : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                        } bg-white dark:bg-slate-800/80 dark:text-white`}
                        placeholder="City"
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          handleInputChange('city', e.target.value)
                        }
                        onBlur={() => handleBlur('city')}
                        required
                      />
                      <SuccessIcon show={isFieldValid('city')} />
                    </div>
                    <ErrorMessage message={errors.city} />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                      State/Province <span className="text-red-500">*</span>
                    </span>
                    <div className="relative">
                      <input
                        className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all placeholder:text-[#94a3b8] focus:ring-1 md:text-base ${
                          errors.stateProvince && touched.stateProvince
                            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                            : isFieldValid('stateProvince')
                              ? 'border-green-400 focus:border-green-400 focus:ring-green-400/30 dark:border-green-500'
                              : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                        } bg-white dark:bg-slate-800/80 dark:text-white`}
                        placeholder="State"
                        type="text"
                        value={formData.stateProvince}
                        onChange={(e) =>
                          handleInputChange('stateProvince', e.target.value)
                        }
                        onBlur={() => handleBlur('stateProvince')}
                        required
                      />
                      <SuccessIcon show={isFieldValid('stateProvince')} />
                    </div>
                    <ErrorMessage message={errors.stateProvince} />
                  </label>
                </div>

                <label className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-[#0d131c] dark:text-white md:text-base">
                    Country <span className="text-red-500">*</span>
                  </span>
                  <div className="relative">
                    <select
                      className={`h-10 w-full rounded-md border px-3 text-sm text-[#0d131c] shadow-sm outline-none transition-all focus:ring-1 md:text-base ${
                        errors.country && touched.country
                          ? 'border-red-400 focus:border-red-400 focus:ring-red-400/30 dark:border-red-500'
                          : isFieldValid('country')
                            ? 'border-green-400 focus:border-green-400 focus:ring-green-400/30 dark:border-green-500'
                            : 'border-[#ced9e9] focus:border-[#F57F3D] focus:ring-[#F57F3D]/30 dark:border-slate-600'
                      } bg-white dark:bg-slate-800/80 dark:text-white`}
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange('country', e.target.value)
                      }
                      onBlur={() => handleBlur('country')}
                      required
                    >
                      <option value="">Select a country</option>
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    <SuccessIcon show={isFieldValid('country')} />
                  </div>
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
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#F57F3D] text-base font-semibold text-white shadow-md shadow-[#F57F3D]/20 transition-all hover:bg-[#e06c2e] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#F57F3D] md:h-14 md:max-w-[400px] md:text-lg"
              onClick={handleSubmit}
              disabled={
                isLoading ||
                Object.keys(errors).some(
                  (key) => errors[key as keyof ValidationErrors],
                )
              }
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
