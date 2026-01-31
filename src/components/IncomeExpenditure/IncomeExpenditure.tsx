import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {useForm, FormProvider} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import GenericSearchDropdown from '../Forms/SearchDropDown/GenericSearchDropdown';
import GenericInputField from '../Forms/Input/GenericInputField';
import GenericButton from '../Forms/Buttons/GenericButton';
import {FiSave} from 'react-icons/fi';
import {useAuthContext} from '@/context/AuthContext';
import {
  useAddIncomeExpense,
  useUpdateIncomeExpense,
} from '@/lib/api/incomeExpenseApi';
import {Route} from '@/routes/_app/manager/occassion.$id';
import GenericDropdown from '../Forms/DropDown/GenericDropDown';
import Receipt from './../../pages/Manager/Receipt';

const incomeSchema = z.object({
  status: z.string().min(1, 'Status is required'),
  particular: z.string().min(1, 'Particular is required'),
  amount: z.preprocess(
    (val) => (typeof val === 'string' ? Number(val) : val),
    z.number().min(1, 'Amount is required'),
  ),
  date: z.string().min(1, 'Date is required'),
  transactionId: z.string().optional(),
  bankName: z.string().optional(),
});

type FormValues = z.infer<typeof incomeSchema>;

const IncomeExpense: React.FC<{
  editIncomeModal?: boolean;
  setEditIncomeModal?: Dispatch<SetStateAction<boolean>>;
  items?: any;
  setAddNewModal?: Dispatch<SetStateAction<boolean>>;
}> = ({
  editIncomeModal,
  setEditIncomeModal,
  items,
  setAddNewModal,
}: {
  editIncomeModal: boolean;
  setEditIncomeModal: Dispatch<SetStateAction<boolean>>;
  items?: any;
  setAddNewModal?: Dispatch<SetStateAction<boolean>>;
}) => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      // status: '',
      // particular: '',
      // amount: '',
      // date: new Date().toISOString().split('T')[0],
    },
  });

  const {user} = useAuthContext();
  const RoleId = user?.roleId;

  const {id} = Route.useParams();
  const occId = id as string;

  const {reset, watch} = methods;
  const status = watch('status');

  const [statusValue, setStatusValue] = useState<string>('');

  const {mutate: addIncomeExpense} = useAddIncomeExpense(RoleId as string);
  const {mutate: updateIncomeExpense} = useUpdateIncomeExpense();
  // const [originalReceivableAmount, setOriginalReceivableAmount] = useState<
  //   number | null
  // >(null);

  // useEffect(() => {
  //   if (editIncomeModal) {
  //     const formattedDate = new Date(items.date).toLocaleDateString('en-CA');
  //     reset({
  //       status: items.status,
  //       particular: items.particular,
  //       amount: items.amount.toString(),
  //       date: formattedDate,
  //       transactionId: items.transactionId,
  //       bankName: items.bankName,
  //     });
  //   } else {
  //     reset({
  //       status: '',
  //       particular: '',
  //       amount: 0,
  //       date: new Date().toISOString().split('T')[0],
  //       transactionId: '',
  //       bankName: '',
  //     });
  //   }
  // }, [editIncomeModal]);

  useEffect(() => {
    if (editIncomeModal && items) {
      const formattedDate = new Date(items.date).toLocaleDateString('en-CA');
      const commonFields = {
        particular: items.particular,
        amount: items.amount.toString(),
        date: formattedDate,
        transactionId: items.transactionId,
        bankName: items.bankName,
      };

      if (items.status === 'RECEIVABLE') {
        reset({status: 'INCOME', ...commonFields});
      } else if (items.status === 'PAYABLE') {
        reset({status: 'EXPENDITURE', ...commonFields});
      } else {
        reset({status: items.status, ...commonFields});
      }
    } else {
      reset({
        status: '',
        particular: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        transactionId: '',
        bankName: '',
      });
    }
  }, [editIncomeModal, items]);

  const onSubmit = async (data: FormValues) => {
    if (editIncomeModal) {
      // const formattedDate = new Date(items.date)
      //   .toLocaleDateString('en-GB', {
      //     year: 'numeric',
      //     month: '2-digit',
      //     day: '2-digit',
      //   })
      //   .split('/')
      //   .reverse()
      //   .join('-');
      updateIncomeExpense(
        {
          ItemId: items.id,
          data: {
            amount: Number(data.amount),
            particular: data.particular,
            date: data.date,
            status: data.status,
            oscassionId: occId,
            transactionId: data.transactionId,
            bankName: data.bankName,
          },
        },
        {
          onSuccess: () => {
            setEditIncomeModal(false);
          },
          onError: (error) => {
            console.error('Error updating income/expense:', error);
          },
        },
      );
    } else {
      addIncomeExpense(
        {
          amount: Number(data.amount),
          particular: data.particular,
          date: data.date,
          status: data.status,
          oscassionId: occId,
          transactionId: data.transactionId,
          bankName: data.bankName,
        },
        {
          onSuccess: () => {
            setAddNewModal && setAddNewModal(false);
            console.log(data);
          },
          onError: (error) => {
            console.error('Error adding income/expense:', error);
          },
        },
      );
    }

    reset();
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-4 rounded-md bg-white p-6 pb-10 shadow-md dark:bg-meta-3 md:grid-cols-12 md:gap-6">
          <h1 className="col-span-12 mb-4 bg-gray-2 p-4 text-lg font-semibold dark:bg-meta-4">
            Income Receipt
          </h1>

          <div className="col-span-12 md:col-span-6">
            <GenericDropdown
              name="status"
              label="Income/Recievable"
              options={[
                {label: 'Income', value: 'INCOME'},
                {label: 'Recievable', value: 'RECEIVABLE'},
              ]}
              onChange={(value) => {
                methods.setValue('status', value);
                // statusValue(value);
              }}
              // defaultOption=""
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <GenericInputField
              name="particular"
              label="Particular"
              placeholder="Enter the Particular"
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <GenericInputField
              name="amount"
              label="Amount"
              placeholder="Enter the Amount"
            />
          </div>

          <div className="col-span-12 md:col-span-6">
            <GenericInputField
              type="date"
              name="date"
              label="Date"
              placeholder="Enter the Date"
              // defaultValue={new Date().toISOString().split('T')[0]}
            />
          </div>
          {watch('status') === 'INCOME' && (
            <>
              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="bankName"
                  label="Bank Name"
                  placeholder="Enter the Bank Name"
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="transactionId"
                  label="Transaction ID"
                  placeholder="Enter the Transaction ID"
                />
              </div>
            </>
          )}
        </div>

        {/* Form Buttons */}
        <div className="flex items-center justify-end space-x-2">
          <GenericButton type="submit" className="flex items-center">
            <FiSave className="mr-2" />
            {editIncomeModal ? 'Update' : 'Save'}
          </GenericButton>
        </div>
      </form>
    </FormProvider>
  );
};

export default IncomeExpense;
