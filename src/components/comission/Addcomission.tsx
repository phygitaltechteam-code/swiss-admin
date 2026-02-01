import React, {useState} from 'react';
import {useForm, FormProvider} from 'react-hook-form';
import {useNavigate} from '@tanstack/react-router';
import {MdArrowBack, MdCheck, MdExpandMore, MdPercent} from 'react-icons/md';
import GenericDropdown from '../Forms/DropDown/GenericDropDown';
import GenericInputField from '../Forms/Input/GenericInputField';

interface CommissionFormData {
  name: string;
  appliedOn: string;
  percentage: number;
  fixedAmount?: number;
  description: string;
  active: boolean;
}

const AddCommission: React.FC = () => {
  const navigate = useNavigate();
  const methods = useForm<CommissionFormData>({
    defaultValues: {
      name: '',
      appliedOn: '',
      percentage: 0,
      fixedAmount: undefined,
      description: '',
      active: true,
    },
  });

  const {handleSubmit, watch, setValue} = methods;
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Watch form values
  const percentageValue = watch('percentage');
  const fixedAmountValue = watch('fixedAmount');

  const onSubmit = async (data: CommissionFormData) => {
    setIsSubmitting(true);
    try {
      console.log('Form submitted:', data);
      // Here you would typically make an API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      navigate({to: '/client/comission'});
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const transactionTypeOptions = [
    {value: '', label: 'Select transaction type'},
    {value: 'transfer', label: 'Transfer'},
    {value: 'conversion', label: 'Conversion'},
    {value: 'deposit', label: 'Deposit'},
    {value: 'withdrawal', label: 'Withdrawal'},
    {value: 'service_fee', label: 'Service Fee'},
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate({to: '/client/comission'})}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 mb-4 inline-flex items-center gap-2 text-sm font-medium dark:hover:text-white"
          >
            <MdArrowBack className="h-5 w-5" />
            Back to Commissions
          </button>

          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white sm:text-3xl">
                Add New Commission
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                Define a new rule for transaction fees.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden rounded-xl bg-white shadow-sm">
              {/* Form Fields */}
              <div className="space-y-6 p-6">
                {/* Commission Name */}
                <div>
                  <div className="mb-2">
                    <span className="text-gray-900 text-sm font-semibold dark:text-white">
                      Commission Name *
                    </span>
                  </div>
                  <GenericInputField
                    name="name"
                    type="text"
                    placeholder="e.g., International Wire Transfer"
                    required
                    customOnChange={(e) => {
                      // Custom validation or formatting can go here
                      const value = e.target.value;
                      if (value.length > 50) {
                        setValue('name', value.slice(0, 50));
                      }
                    }}
                  />
                </div>

                {/* Applied On and Percentage */}
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="mb-2">
                      <span className="text-gray-900 text-sm font-semibold dark:text-white">
                        Applied On *
                      </span>
                    </div>
                    <GenericDropdown
                      name="appliedOn"
                      label=""
                      options={transactionTypeOptions.slice(1)} // Remove the first empty option
                      defaultOption="Select transaction type"
                      required
                      onChange={(value) => {
                        console.log('Selected transaction type:', value);
                      }}
                    />
                  </div>

                  <div>
                    <div className="mb-2">
                      <span className="text-gray-900 text-sm font-semibold dark:text-white">
                        Percentage (%) *
                      </span>
                    </div>
                    <div className="relative">
                      <GenericInputField
                        name="percentage"
                        type="number"
                        placeholder="0.00"
                        required
                        customOnChange={(e) => {
                          const value = parseFloat(e.target.value);
                          if (value > 100) {
                            setValue('percentage', 100);
                          }
                        }}
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <MdPercent className="text-gray-400 h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed Amount */}
                <div>
                  <div className="mb-2">
                    <span className="text-gray-900 text-sm font-semibold dark:text-white">
                      Fixed Amount (Optional)
                    </span>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                      <span className="text-gray-500 text-sm"></span>
                    </div>
                    <GenericInputField
                      name="fixedAmount"
                      type="number"
                      placeholder="0.00"
                      customOnChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value < 0) {
                          setValue('fixedAmount', 0);
                        }
                      }}
                    />
                  </div>
                  <p className="text-gray-500 mt-1 text-xs">
                    Leave empty if commission is percentage-based only
                  </p>
                </div>

                {/* Description */}
                <div>
                  <div className="mb-2">
                    <span className="text-gray-900 text-sm font-semibold dark:text-white">
                      Description (Optional)
                    </span>
                  </div>
                  <textarea
                    {...methods.register('description')}
                    rows={3}
                    className="text-gray-900 placeholder-gray-500 block w-full rounded-lg border border-stroke bg-transparent px-4 py-2.5 text-sm focus:border-primary focus:outline-none dark:border-form-strokedark dark:bg-form-input dark:text-white"
                    placeholder="Add a description for this commission rule..."
                    onChange={(e) =>
                      methods.setValue('description', e.target.value)
                    }
                  />
                </div>

                {/* Active Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...methods.register('active')}
                    id="active"
                    className="border-gray-300 dark:border-gray-600 dark:bg-gray-700 h-4 w-4 rounded text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor="active"
                    className="text-gray-900 ml-2 text-sm dark:text-white"
                  >
                    Active immediately after creation
                  </label>
                </div>
              </div>

              {/* Form Footer */}
              <div className="bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 px-6 py-4">
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="hover:bg-primary-dark inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="h-4 w-4 animate-spin text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <MdCheck className="h-4 w-4" />
                        Save Commission
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default AddCommission;
