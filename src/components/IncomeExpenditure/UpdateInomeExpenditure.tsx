// import React, {useEffect} from 'react';
// import {useForm, FormProvider} from 'react-hook-form';
// import {z} from 'zod';
// import {zodResolver} from '@hookform/resolvers/zod';
// import GenericSearchDropdown from '../Forms/SearchDropDown/GenericSearchDropdown';
// import GenericInputField from '../Forms/Input/GenericInputField';
// import GenericButton from '../Forms/Buttons/GenericButton';
// import {useNavigate, useRouter} from '@tanstack/react-router';
// import {Route} from '@/routes/_app/_edit/update.$name.$id';
// import {IncomeExpense} from '@/types';
// import {useLocation} from '@tanstack/react-router';
// import {useUpdateIncomeExpense} from '@/lib/react-query/adminQuery';
// import {update} from 'lodash';

// const updateIncomeSchema = z.object({
//   particular: z.string().min(1, 'Particular is required'),
//   amount: z.string().min(1, 'Amount is required'),
//   date: z.string().min(1, 'Date is required'),
//   status: z.string().min(1, 'Status is required'),
// });
// const FormValues = z.infer<typeof updateIncomeSchema>;
// interface props {
//   id: string;
// }

// const UpdateInomeExpenditure: React.FC<props> = () => {
//   const {id} = Route.useParams();
//   const router = useRouter();

//   const methods = useForm<FormValues>({
//     resolver: zodResolver(updateIncomeSchema),
//   });

//   const {reset} = methods;

//   const location = useLocation();
//   const items = location.state?.items;
//   console.log('items', items);

//   const {mutate: updateIncomeExpense} = useUpdateIncomeExpense(
//     items.id as string,
//   );

//   useEffect(() => {
//     if (items) {
//       const formattedDate = new Date(items.date)
//         .toLocaleDateString('en-GB', {
//           year: 'numeric',
//           month: '2-digit',
//           day: '2-digit',
//         })
//         .split('/')
//         .reverse()
//         .join('-');

//       reset({
//         amount: items.amount.toString(),
//         date: formattedDate,
//         particular: items.particular,
//         status: items.status,
//         // items.status === IncomeExpense.Payable
//         //   ? IncomeExpense.Expense
//         //   : IncomeExpense.Income,
//       });
//     }
//   }, [id, reset]);

//   // const onSubmit = async (data: FormValues) => {
//   //   updateIncomeExpense({
//   //     amount: Number(data.amount),
//   //     particular: data.particular,
//   //     date: new Date(data.date).toISOString(),
//   //     status: data.status,
//   //   });
//   //   // {isSuccess && router.navigate({to: '/manager/income-expenditure'});};
//   //   {
//   //     isSuccess && reset();
//   //     // router.history.back();
//   //   }
//   //   {
//   //     isError && console.log('Error updating income/expense:', isError);
//   //   }

//   //   // console.log('Static submission:', {
//   //   //   ...data,
//   //   //   id: id,
//   //   //   date: new Date(data.date).toISOString(),
//   //   //   amount: Number(data.amount),
//   //   // });
//   // };

//   const onSubmit = async (data: FormValues) => {
//     updateIncomeExpense(
//       {
//         amount: Number(data.amount),
//         particular: data.particular,
//         date: new Date(data.date).toISOString(),
//         status: data.status,
//       },
//       {
//         onSuccess: () => {
//           reset();
//           router.history.back(); // or router.navigate({to: '/your-target-route'})
//         },
//         onError: (error) => {
//           console.error('Error updating income/expense:', error);
//         },
//       },
//     );
//   };

//   return (
//     <FormProvider {...methods}>
//       <form
//         onSubmit={methods.handleSubmit(onSubmit)}
//         className="space-y-8 bg-white p-8 dark:bg-black"
//       >
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
//           <h1 className="col-span-12 mb-4 text-lg font-semibold">
//             Update Income/Expenditure
//           </h1>

//           <div className="col-span-12 md:col-span-6">
//             <GenericSearchDropdown
//               name="status"
//               label="Income/Expenditure"
//               options={[
//                 {label: 'Income', value: 'INCOME'},
//                 {label: 'Expense', value: 'EXPENDITURE'},
//                 {label: 'Recievable', value: 'RECEIVABLE'},
//                 {label: 'Payable', value: 'PAYABLE'},
//               ]}
//             />
//           </div>

//           <div className="col-span-12 md:col-span-6">
//             <GenericInputField
//               name="particular"
//               label="Particular"
//               placeholder="Enter the Particular"
//             />
//           </div>

//           <div className="col-span-12 md:col-span-6">
//             <GenericInputField
//               name="amount"
//               label="Amount"
//               placeholder="Enter the Amount"
//             />
//           </div>

//           <div className="col-span-12 md:col-span-6">
//             <GenericInputField
//               type="date"
//               name="date"
//               label="Date"
//               placeholder="Enter the Date"
//             />
//           </div>
//         </div>

//         {/* Form Buttons */}
//         <div className="flex justify-end space-x-4">
//           <GenericButton
//             type="button"
//             // onClick={() => navigate({to: `/incomeexpenditure`})}
//           >
//             Cancel
//           </GenericButton>
//           <GenericButton type="submit">Update</GenericButton>
//         </div>
//       </form>
//     </FormProvider>
//   );
// };

// export default UpdateInomeExpenditure;
