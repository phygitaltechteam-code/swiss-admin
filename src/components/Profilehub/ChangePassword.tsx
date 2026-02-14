import React, {useState} from 'react';
import {MdVisibilityOff, MdVisibility, MdCheck, MdError} from 'react-icons/md';
import {useChangePassword} from './mutation';

const ChangePassword: React.FC = () => {
  const {
    mutate: changePassword,
    isLoading,
    isSuccess,
    error,
    reset,
  } = useChangePassword();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    hasUpperCase: false,
    hasNumber: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));

    if (errors[name]) {
      setErrors((prev) => ({...prev, [name]: ''}));
    }

    if (error || isSuccess) {
      reset();
    }

    if (name === 'newPassword') {
      validatePasswordRequirements(value);
    }
  };

  const validatePasswordRequirements = (password: string) => {
    setPasswordRequirements({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
    });
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword =
        'Password must contain at least one uppercase letter';
    } else if (!/\d/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one number';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    const passwordData = {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    };

    changePassword(passwordData, {
      onSuccess: () => {
        setSuccessMessage('Password changed successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setPasswordRequirements({
          minLength: false,
          hasUpperCase: false,
          hasNumber: false,
        });
        window.location.href = '/dashboard';
      },
    });
  };

  const allRequirementsMet =
    passwordRequirements.minLength &&
    passwordRequirements.hasUpperCase &&
    passwordRequirements.hasNumber;

  return (
    <div className="dark:bg-gray-950 flex min-h-screen w-full items-center justify-center bg-white">
      {/* Main container */}
      <div className="relative mx-auto flex h-screen w-full max-w-[min(390px,95vw,500px)] flex-col bg-white dark:bg-[#221610] md:max-w-[600px]">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between bg-white/95 px-4 py-3 backdrop-blur-md dark:bg-[#221610]/95 md:px-6 md:py-4">
          {/* <button
            onClick={() => window.history.back()}
            className="-ml-2 flex items-center justify-center rounded-full p-2 text-slate-900 transition-colors hover:bg-slate-50 dark:text-white dark:hover:bg-slate-800 md:p-2.5"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button> */}
          <h1 className="flex-1 pr-8 text-center text-base font-bold tracking-tight text-slate-900 dark:text-white md:text-lg">
            Change Password
          </h1>
        </div>

        <main className="no-scrollbar flex flex-1 flex-col overflow-y-auto px-4 py-2 md:px-6 md:py-4">
          <p className="pb-6 pt-2 text-base font-normal leading-normal text-slate-900/70 dark:text-white/70 md:pb-8 md:text-lg">
            Your new password must be different from previous used passwords.
          </p>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 rounded-lg bg-green-50 p-4 dark:bg-green-900/20 md:p-5">
              <div className="flex items-center gap-2">
                <MdCheck className="text-green-600 dark:text-green-400 md:text-[20px]" />
                <p className="text-sm font-medium text-green-800 dark:text-green-300 md:text-base">
                  {successMessage}
                </p>
              </div>
            </div>
          )}

          {/* Mutation Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20 md:p-5">
              <div className="flex items-center gap-2">
                <MdError className="text-red-600 dark:text-red-400 md:text-[20px]" />
                <p className="text-sm font-medium text-red-800 dark:text-red-300 md:text-base">
                  {error instanceof Error
                    ? error.message
                    : 'Failed to change password. Please try again.'}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-5 md:gap-6">
              {/* Current Password */}
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="text-sm font-medium leading-normal text-slate-900 dark:text-white md:text-base">
                  Current Password
                </label>
                <div className="group relative flex items-center">
                  <input
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className={`flex h-14 w-full rounded-xl border bg-white px-4 pr-12 text-base text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 md:h-16 md:text-lg ${
                      errors.currentPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                        : 'border-slate-200 focus:border-primary focus:ring-primary/30 dark:border-white/10'
                    }`}
                    placeholder="Enter current password"
                    type={showPasswords.current ? 'text' : 'password'}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('current')}
                    className="absolute bottom-0 right-0 top-0 flex items-center justify-center px-4 text-slate-400 transition-colors hover:text-primary focus:outline-none dark:text-white/50 dark:hover:text-primary md:px-5"
                    disabled={isLoading}
                  >
                    {showPasswords.current ? (
                      <MdVisibilityOff className="text-2xl md:text-[24px]" />
                    ) : (
                      <MdVisibility className="text-2xl md:text-[24px]" />
                    )}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400 md:text-base">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="text-sm font-medium leading-normal text-slate-900 dark:text-white md:text-base">
                  New Password
                </label>
                <div className="relative flex items-center">
                  <input
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={`flex h-14 w-full rounded-xl border bg-white px-4 pr-12 text-base text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 md:h-16 md:text-lg ${
                      errors.newPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                        : 'border-slate-200 focus:border-primary focus:ring-primary/30 dark:border-white/10'
                    }`}
                    placeholder="Enter new password"
                    type={showPasswords.new ? 'text' : 'password'}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute bottom-0 right-0 top-0 flex items-center justify-center px-4 text-slate-400 transition-colors hover:text-primary focus:outline-none dark:text-white/50 dark:hover:text-primary md:px-5"
                    disabled={isLoading}
                  >
                    {showPasswords.new ? (
                      <MdVisibilityOff className="text-2xl md:text-[24px]" />
                    ) : (
                      <MdVisibility className="text-2xl md:text-[24px]" />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400 md:text-base">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="flex flex-col gap-2 md:gap-3">
                <label className="text-sm font-medium leading-normal text-slate-900 dark:text-white md:text-base">
                  Confirm New Password
                </label>
                <div className="relative flex items-center">
                  <input
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`flex h-14 w-full rounded-xl border bg-white px-4 pr-12 text-base text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 dark:bg-white/5 dark:text-white dark:placeholder:text-white/30 md:h-16 md:text-lg ${
                      errors.confirmPassword
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
                        : 'border-slate-200 focus:border-primary focus:ring-primary/30 dark:border-white/10'
                    }`}
                    placeholder="Re-enter new password"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute bottom-0 right-0 top-0 flex items-center justify-center px-4 text-slate-400 transition-colors hover:text-primary focus:outline-none dark:text-white/50 dark:hover:text-primary md:px-5"
                    disabled={isLoading}
                  >
                    {showPasswords.confirm ? (
                      <MdVisibilityOff className="text-2xl md:text-[24px]" />
                    ) : (
                      <MdVisibility className="text-2xl md:text-[24px]" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400 md:text-base">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Requirements */}
            <div className="mb-8 mt-8 md:mt-10">
              <p className="mb-3 text-sm font-medium text-slate-900/80 dark:text-white/80 md:text-base">
                Password requirements:
              </p>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full md:h-6 md:w-6 ${
                      passwordRequirements.minLength
                        ? 'bg-primary/10 dark:bg-primary/20'
                        : 'border border-slate-200 dark:border-white/20'
                    }`}
                  >
                    {passwordRequirements.minLength && (
                      <MdCheck className="text-[14px] font-bold text-primary md:text-[16px]" />
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      passwordRequirements.minLength
                        ? 'font-medium text-slate-900 dark:text-white'
                        : 'font-normal text-slate-900 opacity-60 dark:text-white'
                    } md:text-base`}
                  >
                    Min 8 characters
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full md:h-6 md:w-6 ${
                      passwordRequirements.hasUpperCase
                        ? 'bg-primary/10 dark:bg-primary/20'
                        : 'border border-slate-200 dark:border-white/20'
                    }`}
                  >
                    {passwordRequirements.hasUpperCase && (
                      <MdCheck className="text-[14px] font-bold text-primary md:text-[16px]" />
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      passwordRequirements.hasUpperCase
                        ? 'font-medium text-slate-900 dark:text-white'
                        : 'font-normal text-slate-900 opacity-60 dark:text-white'
                    } md:text-base`}
                  >
                    At least 1 uppercase letter
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-5 w-5 items-center justify-center rounded-full md:h-6 md:w-6 ${
                      passwordRequirements.hasNumber
                        ? 'bg-primary/10 dark:bg-primary/20'
                        : 'border border-slate-200 dark:border-white/20'
                    }`}
                  >
                    {passwordRequirements.hasNumber && (
                      <MdCheck className="text-[14px] font-bold text-primary md:text-[16px]" />
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      passwordRequirements.hasNumber
                        ? 'font-medium text-slate-900 dark:text-white'
                        : 'font-normal text-slate-900 opacity-60 dark:text-white'
                    } md:text-base`}
                  >
                    At least 1 number
                  </p>
                </div>
              </div>

              {/* Requirement Status */}
              {formData.newPassword && (
                <div className="mt-4">
                  <p
                    className={`text-sm font-medium md:text-base ${
                      allRequirementsMet
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {allRequirementsMet
                      ? '✓ All requirements met'
                      : 'Complete all requirements above'}
                  </p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="mb-15 p-4">
              <button
                type="submit"
                disabled={isLoading || !allRequirementsMet}
                className={`flex h-14 w-full items-center justify-center rounded-xl px-6 text-base font-bold text-white shadow-lg transition-transform hover:bg-primary/90 active:scale-[0.98] disabled:cursor-not-allowed md:mx-auto md:h-16 md:max-w-[400px] md:text-lg ${
                  isLoading || !allRequirementsMet
                    ? 'bg-primary shadow-primary/20'
                    : 'bg-primary shadow-primary/20'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-5 w-5 animate-spin md:h-6 md:w-6"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ChangePassword;
