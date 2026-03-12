import {useState, type FC, useEffect, useRef} from 'react';
import {BiArrowBack} from 'react-icons/bi';
import {MdCheckCircle, MdUploadFile, MdError} from 'react-icons/md';
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

interface ValidationErrors {
  number?: string;
  file?: string;
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

  // Check length
  if (normalized.length < 6) {
    return {
      isValid: false,
      error: 'Passport number must be at least 6 characters',
      formattedNumber: trimmed,
    };
  }

  if (normalized.length > 12) {
    return {
      isValid: false,
      error: 'Passport number must be less than 12 characters',
      formattedNumber: trimmed,
    };
  }

  // Common passport number patterns by country
  const patterns = {
    US: /^[0-9]{9}$/, // US: 9 digits
    UK: /^[0-9]{9}$|^[A-Z][0-9]{7}$|^[A-Z]{2}[0-9]{6}$/, // UK: 9 digits or letter + 7 numbers
    CA: /^[A-Z]{2}[0-9]{6}$/, // Canada: 2 letters + 6 numbers
    AU: /^[A-Z][0-9]{7}$/, // Australia: letter + 7 numbers
    NZ: /^[A-Z]{2}[0-9]{4}[A-Z]{3}$/, // New Zealand: 2 letters + 4 numbers + 3 letters
    IN: /^[A-Z][0-9]{7}$/, // India: letter + 7 numbers
    GENERIC: /^[A-Z][A-Z0-9]{5,8}$/, // Generic: starts with letter, 6-9 alphanumeric
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
    isValid = true;
    error = '';
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
    formattedNumber: trimmed,
  };
};

// Validate file
const validateFile = (file: File | null): {isValid: boolean; error: string} => {
  if (!file) {
    return {isValid: false, error: 'Please upload your passport document'};
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be less than 10MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
    };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Only JPG, PNG, or PDF files are allowed',
    };
  }

  return {isValid: true, error: ''};
};

// Format input as user types
const formatPassportInput = (value: string): string => {
  // Remove all non-alphanumeric characters and convert to uppercase
  let cleaned = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  // Limit length to 12 characters for display
  if (cleaned.length > 12) {
    cleaned = cleaned.substring(0, 12);
  }

  // Add space after every 4 characters for readability
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
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
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({
    number: false,
    file: false,
  });

  // Validation state
  const [validation, setValidation] = useState({
    isValid: false,
    numberValid: false,
    fileValid: false,
  });

  // Validate passport number when it changes
  useEffect(() => {
    if (docNumber || touched.number) {
      const result = validatePassportNumber(docNumber);
      setValidation((prev) => ({
        ...prev,
        numberValid: result.isValid,
        isValid: result.isValid && validation.fileValid,
      }));
      setErrors((prev) => ({
        ...prev,
        number: result.error,
      }));
    }
  }, [docNumber, touched.number]);

  // Validate file when it changes
  useEffect(() => {
    if (file || touched.file) {
      const result = validateFile(file);
      setValidation((prev) => ({
        ...prev,
        fileValid: result.isValid,
        isValid: result.isValid && validation.numberValid,
      }));
      setErrors((prev) => ({
        ...prev,
        file: result.error,
      }));
    }
  }, [file, touched.file]);

  const handlePassportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Store raw value (without formatting) for validation
    const rawValue = inputValue.replace(/\s/g, '').toUpperCase();
    setDocNumber(rawValue);

    // Set formatted value for display
    setFormattedDisplay(formatPassportInput(inputValue));

    if (!touched.number) {
      setTouched((prev) => ({...prev, number: true}));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    if (!touched.file) {
      setTouched((prev) => ({...prev, file: true}));
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    setTouched((prev) => ({...prev, file: true}));
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBlur = (field: 'number' | 'file') => {
    setTouched((prev) => ({...prev, [field]: true}));
  };

  const handleSubmit = () => {
    // Mark all fields as touched
    setTouched({
      number: true,
      file: true,
    });

    // Revalidate
    const numberValidation = validatePassportNumber(docNumber);
    const fileValidation = validateFile(file);

    if (numberValidation.isValid && fileValidation.isValid) {
      onComplete({
        type: 'Passport',
        number: docNumber,
        file,
      });
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const ErrorMessage = ({message}: {message?: string}) => {
    if (!message) return null;
    return (
      <p className="mt-1 flex items-center gap-1 text-xs text-red-600 dark:text-red-400 md:text-sm">
        <MdError className="text-red-500" />
        {message}
      </p>
    );
  };

  const SuccessMessage = ({
    show,
    message,
  }: {
    show: boolean;
    message: string;
  }) => {
    if (!show) return null;
    return (
      <p className="mt-1 flex items-center gap-1 text-xs text-green-600 dark:text-green-400 md:text-sm">
        <MdCheckCircle className="text-green-500" />
        {message}
      </p>
    );
  };

  return (
    <div className="dark:bg-gray-950 flex min-h-screen w-full justify-center bg-white font-['Inter'] antialiased">
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
        <div className="px-6 py-4 md:px-8 md:py-6">
          <div className="flex gap-2 md:gap-3">
            <div className="h-1.5 flex-1 rounded-full bg-[#F57F3D]" />
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
                Passport Number <span className="text-red-500">*</span>
              </span>
              <input
                className={`mt-2 w-full rounded-md border bg-white px-4 py-3 outline-none transition-all focus:ring-2 dark:border-slate-600 dark:bg-slate-800/80 md:py-4 md:text-lg ${
                  touched.number && errors.number
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                    : validation.numberValid
                      ? 'border-green-500 focus:border-green-500 focus:ring-green-500/30'
                      : 'border-gray-300 focus:border-[#F57F3D] focus:ring-[#F57F3D]/30'
                }`}
                placeholder="Enter passport number (e.g., G12345678)"
                value={formattedDisplay}
                onChange={handlePassportChange}
                onBlur={() => handleBlur('number')}
                maxLength={15}
                required
              />

              {/* Validation messages */}
              {touched.number && errors.number && (
                <ErrorMessage message={errors.number} />
              )}

              {validation.numberValid && (
                <SuccessMessage
                  show={true}
                  message="Valid passport number format"
                />
              )}

              {!touched.number && !errors.number && (
                <p className="mt-1 text-xs text-slate-500 md:text-sm">
                  Enter your passport number exactly as shown on your document
                </p>
              )}
            </label>

            {/* Example passport numbers */}
            <div className="mt-4 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/50">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 md:text-sm">
                Common formats:
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>US: 123456789</span>
                <span>UK: 123456789 or A1234567</span>
                <span>CA: AB123456</span>
                <span>AU: A1234567</span>
                <span>IN: A1234567</span>
                <span>NZ: AB1234XYZ</span>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 md:text-base">
              Upload Passport <span className="text-red-500">*</span>
            </h3>

            {file ? (
              <div className="mt-4 rounded-2xl border-2 border-green-200 bg-green-50 p-6 text-center dark:border-green-900 dark:bg-green-900/20 md:p-8">
                <span className="material-symbols-outlined text-4xl text-green-500 md:text-5xl">
                  <MdCheckCircle />
                </span>
                <p className="mt-2 text-sm font-medium text-green-700 dark:text-green-300 md:text-base">
                  Passport uploaded
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 md:text-sm">
                  {file.name} ({formatFileSize(file.size)})
                </p>
                <button
                  type="button"
                  onClick={handleFileRemove}
                  className="mt-3 text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 md:text-base"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div>
                <label
                  className={`mt-4 flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed p-6 text-center transition-colors md:p-8 ${
                    touched.file && errors.file
                      ? 'border-red-300 bg-red-50 hover:border-red-400 dark:border-red-800 dark:bg-red-900/10'
                      : 'border-gray-300 bg-gray-50 hover:border-[#F57F3D] dark:border-slate-700 dark:bg-slate-800/50'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/jpeg,image/png,application/pdf"
                    onChange={handleFileChange}
                    onBlur={() => handleBlur('file')}
                  />
                  <span className="material-symbols-outlined text-4xl text-slate-400 md:text-5xl">
                    <MdUploadFile />
                  </span>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 md:text-base">
                    Click to upload passport main page
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 md:text-sm">
                    JPG, PNG or PDF • Max 10MB
                  </p>
                </label>

                {touched.file && errors.file && (
                  <ErrorMessage message={errors.file} />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="border-gray-200 fixed bottom-0 left-0 right-0 mx-auto w-full max-w-[min(390px,95vw,500px)] border-t bg-white/95 p-6 backdrop-blur dark:border-slate-800 dark:bg-[#221610]/80 md:relative md:mt-6 md:max-w-[700px] md:border-t-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
          <div className="md:px-8 md:pb-6">
            <button
              onClick={handleSubmit}
              disabled={!validation.isValid}
              className={`h-14 w-full rounded-xl text-lg font-semibold transition-all md:mx-auto md:block md:h-16 md:max-w-[400px] md:text-xl ${
                validation.isValid
                  ? 'bg-[#F57F3D] text-white shadow-lg shadow-[#F57F3D]/20 hover:bg-[#e06c2e]'
                  : 'cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500'
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
