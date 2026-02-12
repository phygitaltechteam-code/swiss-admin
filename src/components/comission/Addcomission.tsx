import React, {useMemo} from 'react';
import {useForm, FormProvider, Controller} from 'react-hook-form';
import {useLocation, useNavigate, useSearch} from '@tanstack/react-router';
import {MdArrowBack, MdCheck, MdPercent} from 'react-icons/md';
import GenericDropdown from '../Forms/DropDown/GenericDropDown';
import GenericInputField from '../Forms/Input/GenericInputField';
import toast from 'react-hot-toast';
import {useAddComission} from '@/lib/react-query/commission';
import {Commission} from './CommissionTable';

interface CommissionFormData {
  name: string;
  percentage: number;
  type: 'TOP_UP' | 'WITHDRAWAL' | 'TRANSFER';
  amount: number | null;
  description: string;
}
type LocationState = {
  commissionData?: Commission;
  isEditing?: boolean;
} | null;
const AddCommission: React.FC = () => {
  const navigate = useNavigate();
  const search = useSearch({from: '/_app/client/addcommision'}) as {
    editData?: string;
  };

  // Parse edit data from search params
  const state = useMemo(() => {
    if (search?.editData) {
      try {
        return JSON.parse(search.editData) as LocationState;
      } catch {
        return null;
      }
    }
    return null;
  }, [search]);

  // Prepare default values – pre‑fill if editing
  const defaultValues: CommissionFormData = useMemo(() => {
    if (state?.isEditing && state.commissionData) {
      const data = state.commissionData;
      return {
        name: data.name,
        percentage: data.percentage,
        type: data.type,
        amount: data.amount ?? null,
        description: data.description,
      };
    }

    return {
      name: '',
      percentage: 0,
      type: 'TRANSFER',
      amount: null,
      description: '',
    };
  }, [state]);

  const methods = useForm<CommissionFormData>({
    defaultValues,
  });
  const {mutate: addCommission, isPending} = useAddComission();

  const transactionTypeOptions = [
    {value: 'TRANSFER', label: 'Transfer'},
    {value: 'WITHDRAWAL', label: 'Withdrawal'},
    {value: 'TOP_UP', label: 'Top-Up'},
  ];

  const onSubmit = (data: CommissionFormData) => {
    const payload = {
      ...data,
      percentage: Number(data.percentage),
      amount: data.amount !== null ? Number(data.amount) : null,
    };

    addCommission(payload, {
      onSuccess: () => {
        navigate({to: '/client/comission'});
      },
    });
  };

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
          <form onSubmit={(e) => methods.handleSubmit(onSubmit)(e)}>
            <div className="border-gray-200 dark:border-gray-700 dark:bg-gray-800 overflow-hidden rounded-xl bg-white shadow-sm">
              <div className="space-y-6 p-6">
                {/* Commission Name */}
                <div>
                  <div className="mb-2">
                    <span className="text-gray-900 text-sm font-semibold dark:text-white">
                      Commission Name *
                    </span>
                  </div>
                  <Controller
                    name="name"
                    rules={{required: 'Commission name is required'}}
                    render={({field}) => (
                      <GenericInputField
                        {...field}
                        type="text"
                        placeholder="e.g., International Wire Transfer"
                        onChange={(e) => {
                          // Limit to 50 characters
                          const value = e.target.value.slice(0, 50);
                          field.onChange(value);
                        }}
                      />
                    )}
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
                    <Controller
                      name="type"
                      rules={{required: 'Transaction type is required'}}
                      render={({field}) => (
                        <GenericDropdown
                          {...field}
                          options={transactionTypeOptions}
                          defaultOption="Select transaction type"
                          onChange={(value) => field.onChange(value)}
                        />
                      )}
                    />
                  </div>

                  <div>
                    <div className="mb-2">
                      <span className="text-gray-900 text-sm font-semibold dark:text-white">
                        Percentage (%) *
                      </span>
                    </div>
                    <div className="relative">
                      <Controller
                        name="percentage"
                        rules={{
                          required: 'Percentage is required',
                          min: {value: 0, message: 'Minimum 0%'},
                          max: {value: 100, message: 'Maximum 100%'},
                        }}
                        render={({field}) => (
                          <GenericInputField
                            {...field}
                            type="number"
                            placeholder="0.00"
                            step="0.01"
                            onChange={(e) => {
                              let value = parseFloat(e.target.value);
                              if (isNaN(value)) value = 0;
                              if (value > 100) value = 100;
                              if (value < 0) value = 0;
                              field.onChange(value);
                            }}
                          />
                        )}
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
                    <Controller
                      name="amount"
                      render={({field}) => (
                        <GenericInputField
                          {...field}
                          type="number"
                          placeholder="0.00"
                          step="0.01"
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const value = e.target.value
                              ? parseFloat(e.target.value)
                              : null;
                            if (value !== null && value < 0) {
                              field.onChange(0);
                            } else {
                              field.onChange(value);
                            }
                          }}
                        />
                      )}
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
                  />
                </div>
              </div>

              {/* Form Footer */}
              <div className="bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 px-6 py-4">
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-3">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="hover:bg-primary-dark inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isPending ? (
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
