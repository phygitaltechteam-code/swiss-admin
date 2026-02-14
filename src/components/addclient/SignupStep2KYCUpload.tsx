import {useState, type FC, useEffect} from 'react';
import {BiArrowBack} from 'react-icons/bi';
import {MdCheckCircle, MdUploadFile} from 'react-icons/md';
import React from 'react';

type KYCPassportData = {
  type: 'Passport';
  number: string;
  file: File | null;
};

interface SignupStep2KYCUploadProps {
  initialData: KYCPassportData;
  onComplete: (data: KYCPassportData) => void;
  onBack: () => void;
}

// Validation functions
const validatePassportNumber = (
  passportNumber: string,
): {
  isValid: boolean;
  error: string;
  formattedNumber: string;
} => {
  // Trim and normalize
  const trimmed = passportNumber.trim().toUpperCase();
  const formattedNumber = trimmed;

  // Check if empty
  if (!trimmed) {
    return {
      isValid: false,
      error: 'Passport number is required',
      formattedNumber: trimmed,
    };
  }

  // Remove spaces for validation
  const normalized = trimmed.replace(/\s/g, '');

  // Common passport number patterns by country
  const patterns = {
    // US: 9 digits
    US: /^[0-9]{9}$/,
    // UK: Starts with letter, followed by 7 numbers
    UK: /^[0-9]{9}$|^[A-Z][0-9]{7}$|^[A-Z]{2}[0-9]{6}$/,
    // Canada: Starts with 2 letters, followed by 6 numbers
    CA: /^[A-Z]{2}[0-9]{6}$/,
    // Australia: Starts with letter, followed by 7 numbers
    AU: /^[A-Z][0-9]{7}$/,
    // New Zealand: Starts with 2 letters, followed by 4 numbers, then 3 letters
    NZ: /^[A-Z]{2}[0-9]{4}[A-Z]{3}$/,
    // India: Starts with letter, followed by 7 numbers
    IN: /^[A-Z][0-9]{7}$/,
    // Generic: 6-9 alphanumeric characters, starting with a letter
    GENERIC: /^[A-Z][A-Z0-9]{5,8}$/,
  };

  // Check against patterns
  let isValid = false;
  let error = '';

  // First check specific patterns
  if (patterns.US.test(normalized)) {
    isValid = true;
    error = '';
  } else if (patterns.UK.test(normalized)) {
    isValid = true;
    error = '';
  } else if (patterns.CA.test(normalized)) {
    isValid = true;
    error = '';
  } else if (patterns.AU.test(normalized)) {
    isValid = true;
    error = '';
  } else if (patterns.NZ.test(normalized)) {
    isValid = true;
    error = '';
  } else if (patterns.IN.test(normalized)) {
    isValid = true;
    error = '';
  } else if (patterns.GENERIC.test(normalized)) {
    // Generic check - length between 6-9 characters
    if (normalized.length >= 6 && normalized.length <= 9) {
      isValid = true;
      error = '';
    } else {
      isValid = false;
      error = 'Passport number must be 6-9 characters';
    }
  } else {
    isValid = false;
    error = 'Invalid passport number format';
  }

  // Additional validation checks
  if (isValid) {
    // Check for obviously invalid patterns
    if (/^0+$/.test(normalized)) {
      isValid = false;
      error = 'Invalid passport number';
    }

    // Check for repeated characters (e.g., AAAAAAAA)
    if (/([A-Z0-9])\1{7,}/.test(normalized)) {
      isValid = false;
      error = 'Invalid passport number pattern';
    }
  }

  return {
    isValid,
    error,
    formattedNumber,
  };
};

// Format input as user types
const formatPassportInput = (value: string): string => {
  // Remove all non-alphanumeric characters and convert to uppercase
  let cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  // Limit length to 12 characters for display
  if (cleaned.length > 12) {
    cleaned = cleaned.substring(0, 12);
  }

  // Add space after every 3 characters for readability (but not for storage)
  return cleaned.replace(/(.{3})/g, '$1 ').trim();
};

const SignupStep2KYCUpload: FC<SignupStep2KYCUploadProps> = ({
  initialData,
  onComplete,
  onBack,
}) => {
  const [docNumber, setDocNumber] = useState(initialData.number);
  const [formattedDisplay, setFormattedDisplay] = useState(
    formatPassportInput(initialData.number),
  );
  const [file, setFile] = useState<File | null>(initialData.file);
  const [validation, setValidation] = useState({
    error: '',
    isValid: false,
  });
  const [isTouched, setIsTouched] = useState(false);

  // Validate passport number when it changes
  useEffect(() => {
    if (docNumber.trim() || isTouched) {
      const result = validatePassportNumber(docNumber);
      setValidation({
        error: result.error,
        isValid: result.isValid,
      });
    }
  }, [docNumber, isTouched]);

  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Store raw value (without formatting) for validation
    const rawValue = inputValue.replace(/\s/g, '').toUpperCase();
    setDocNumber(rawValue);

    // Set formatted value for display
    setFormattedDisplay(formatPassportInput(inputValue));

    if (!isTouched) {
      setIsTouched(true);
    }
  };

  const handleSubmit = () => {
    if (!validation.isValid || !file) {
      // If form is invalid, mark as touched to show errors
      if (!isTouched) setIsTouched(true);
      return;
    }

    const validationResult = validatePassportNumber(docNumber);

    onComplete({
      type: 'Passport',
      number: validationResult.formattedNumber, // Store formatted (without spaces)
      file,
    });
  };

  const isFormValid = () => validation.isValid && file !== null;

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  // Example passport numbers for help text
  const examplePassports = [
    'US: 123456789',
    'UK: 123456789 or A1234567',
    'CA: AB123456',
    'AU: A1234567',
    'NZ: AB1234XYZ',
  ];

  return (
    <div className="dark:bg-gray-950 flex min-h-screen w-full justify-center bg-white font-['Inter'] antialiased">
      {/* Main container */}
      <div className="relative mx-auto w-full max-w-[min(390px,95vw,500px)] overflow-hidden rounded-2xl bg-white dark:bg-[#221610] md:min-h-[600px] md:max-w-[700px]">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-white p-4 dark:bg-[#221610] md:p-6">
          <button
            onClick={onBack}
            className="flex size-12 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 md:size-14"
          >
            <BiArrowBack className="text-[20px] md:text-[22px]" />
          </button>
          <h2 className="flex-1 pr-12 text-center text-lg font-bold dark:text-white md:text-xl">
            Verify Identity
          </h2>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 text-center md:px-8 md:py-6">
          <div className="flex gap-2 md:gap-3">
            <div className="h-1.5 flex-1 rounded-full bg-slate-300" />
            <div className="h-1.5 flex-1 rounded-full bg-[#F57F3D]" />
            <div className="h-1.5 flex-1 rounded-full bg-slate-300" />
          </div>
          <p className="mt-2 text-xs text-slate-500 md:text-sm">
            Step 2 of 3 • Passport Verification
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-32 md:px-8 md:pb-8">
          <h2 className="text-[28px] font-bold dark:text-white md:text-[32px]">
            Passport Verification
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300 md:mt-3 md:text-lg">
            Upload your passport. We&apos;ll verify it securely using encrypted
            OCR checks.
          </p>

          {/* Passport Number */}
          <div className="mt-6 md:mt-8">
            <label className="block">
              <span className="text-base font-medium dark:text-white md:text-lg">
                Passport Number
              </span>
              <input
                className={`border-gray-300 mt-2 w-full rounded-md border bg-white px-4 py-1.5 outline-none transition-all focus:ring-2 dark:border-slate-600 dark:bg-slate-800/80 md:py-2 md:text-lg ${
                  isTouched && !validation.isValid
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                    : validation.isValid
                      ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30'
                      : 'focus:border-[#F57F3D] focus:ring-[#F57F3D]/30'
                }`}
                placeholder="Enter passport number (e.g. G12345678)"
                value={formattedDisplay}
                onChange={handlePassportChange}
                onBlur={() => setIsTouched(true)}
                maxLength={20}
                required
              />

              {/* Help text */}
              <div className="mt-1 flex flex-col gap-1">
                {isTouched && validation.error && (
                  <p className="text-xs text-red-600 md:text-sm">
                    {validation.error}
                  </p>
                )}

                {validation.isValid && (
                  <p className="text-xs text-green-600 md:text-sm">
                    ✓ Valid passport number format
                  </p>
                )}

                {!isTouched && (
                  <p className="text-xs text-slate-500 md:text-sm">
                    Enter your passport number exactly as shown on your document
                  </p>
                )}
              </div>
            </label>
          </div>

          {/* Upload Section */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 md:text-base">
              Upload Passport
            </h3>

            {file ? (
              <div className="mt-4 rounded-2xl border-2 border-green-200 bg-green-50 p-6 text-center md:p-8">
                <span className="material-symbols-outlined text-4xl text-green-500 md:text-5xl">
                  <MdCheckCircle />
                </span>
                <p className="mt-2 text-sm font-medium text-green-700 md:text-base">
                  Passport uploaded
                </p>
                <p className="text-xs text-green-600 md:text-sm">
                  {file.name} ({formatFileSize(file.size)})
                </p>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="mt-3 text-sm text-red-500 hover:text-red-700 md:text-base"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <label
                className={`border-gray-300 bg-gray-50 hover:bg-gray-100 mt-4 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed p-6 text-center md:p-8 ${
                  isTouched && !file
                    ? 'hover:border-red-500'
                    : 'hover:border-[#F57F3D]'
                }`}
              >
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <span className="material-symbols-outlined text-4xl text-slate-400 md:text-5xl">
                  <MdUploadFile />
                </span>
                <p className="mt-2 text-sm text-slate-600 md:text-base">
                  Upload passport main page
                </p>
                <p className="text-xs text-slate-500 md:text-sm">
                  JPG, PNG or PDF • Max 10MB
                </p>
                {isTouched && !file && (
                  <p className="mt-2 text-xs text-red-600 md:text-sm">
                    Please upload your passport document
                  </p>
                )}
              </label>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="border-gray-200 fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[min(390px,95vw,500px)] border-t bg-white/95 p-6 backdrop-blur md:relative md:mt-6 md:max-w-[700px] md:border-t-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
          <div className="md:px-8 md:pb-6">
            <button
              onClick={handleSubmit}
              disabled={!isFormValid()}
              className={`h-14 w-full rounded-xl text-lg font-semibold transition-all md:mx-auto md:block md:h-16 md:max-w-[400px] md:text-xl ${
                isFormValid()
                  ? 'bg-[#F57F3D] text-white shadow-lg shadow-[#F57F3D]/20 hover:bg-[#e06c2e]'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400'
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupStep2KYCUpload;
