import GenericInputField from '@/components/Forms/Input/GenericInputField';
import {useAuthContext} from '@/context/AuthContext';
import {
  useGetAdminProfile,
  useUpdateAdminProfile,
  useUpdateLogo,
} from '@/lib/api/adminApi';
import {zodResolver} from '@hookform/resolvers/zod';
import React, {useEffect} from 'react';
import {Form, FormProvider, useFieldArray, useForm} from 'react-hook-form';
import {FaRegStickyNote} from 'react-icons/fa';
import {IoPersonCircleSharp} from 'react-icons/io5';
import {MdOutlineEmail} from 'react-icons/md';
import {z} from 'zod';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, {
    message: 'Phone Number must be a valid 10-digit Indian mobile number',
  }),
  email: z.string().email('Invalid email'),
  address: z.string().min(1, 'Address is required'),
  godNames: z.array(
    z.object({
      name: z.string().min(1, 'God Name is required'),
    }),
  ),
  terms: z.array(
    z.object({
      term: z.string().min(1, 'Term is required'),
    }),
  ),
  accountName: z.string().optional(),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
  ifsc: z.string().optional(),
  upiId: z.string().optional(),
  gstNo: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(val),
      {
        message: 'Invalid GST number format',
      },
    ),
});

type FormValues = {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  godNames: {name: string}[];
  terms: {term: string}[];
  accountName?: string;
  bankName?: string;
  bankAccount?: string;
  ifsc?: string;
  upiId?: string;
  gstNo: string;
};
const ProfilePage = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
  });

  const {reset} = methods;

  const {user} = useAuthContext();
  const adminId = user?.roleId;

  const {fields, append, remove, replace} = useFieldArray({
    control: methods.control,
    name: 'terms',
  });

  const {data: adminInfo, refetch} = useGetAdminProfile(adminId as string);

  console.log(adminInfo);

  const {mutate: updateAdminProfile} = useUpdateAdminProfile(adminId as string);
  const {mutate: updateLogo, isPending: isUploading} = useUpdateLogo(
    adminId as string,
  );

  useEffect(() => {
    if (adminInfo) {
      const resetData = {
        fullName: adminInfo.user.fullname,
        phoneNumber: adminInfo.user.phoneNumber,
        email: adminInfo.user.email,
        address: adminInfo.user.address,
        godNames: adminInfo.godName.map((g) => ({name: g.name})),
        accountName: adminInfo.accountName,
        bankName: adminInfo.bankName,
        bankAccount: adminInfo.accountNumber,
        ifsc: adminInfo.ifscCode,
        upiId: adminInfo.upiId,
        gstNo: adminInfo.gstNo,
      };

      reset(resetData);
      replace(adminInfo.TermsAndConditions.map((t) => ({term: t.terms})));
    }
  }, [adminInfo, reset, replace]);

  const onSubmit = async (data: FormValues) => {
    console.log('Submitting data:', data);
    updateAdminProfile({
      fullname: data.fullName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: data.address,
      godNames: data.godNames.map((g) => g.name),
      terms: data.terms.map((t) => t.term),
      ...(data.accountName
        ? {accountName: data.accountName}
        : {accountName: ' '}),
      ...(data.bankName ? {bankName: data.bankName} : {bankName: ' '}),
      ...(data.bankAccount
        ? {accountNumber: data.bankAccount}
        : {accountNumber: ' '}),
      ...(data.ifsc ? {ifscCode: data.ifsc} : {ifscCode: ' '}),
      ...(data.upiId ? {upiId: data.upiId} : {upiId: ' '}),
      ...(data.gstNo ? {gstNo: data.gstNo} : {gstNo: ' '}),
    });
    console.log('Form submitted:', data);
  };

  return (
    <FormProvider {...methods}>
      <div className="mb-8 flex flex-col items-center justify-center">
        <div className="relative inline-block">
          <div className="bg-gray-200 group relative h-24 w-24 overflow-hidden rounded-full dark:bg-meta-4">
            {/* Show loader if uploading */}
            {isUploading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
                <svg
                  className="h-8 w-8 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
            )}

            {/* Profile Image */}
            <img
              src={adminInfo?.image || ''}
              alt="Profile"
              className={`h-full w-full object-cover ${isUploading ? 'opacity-50' : ''}`}
            />

            {/* Hover overlay */}
            {!isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="cursor-pointer text-sm font-medium text-white">
                  Change
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Label and Input */}
        <label
          htmlFor="profile-upload"
          className="mt-2 cursor-pointer text-sm text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Upload Image
        </label>
        <input
          id="profile-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              updateLogo({
                imageFile: file,
              });
            }
          }}
        />
      </div>
      <div className="grid grid-cols-5 gap-8 p-4">
        <div className="col-span-5">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Personal Information
              </h3>
            </div>
            <div className="p-7">
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-8 bg-white p-8 dark:bg-black"
              >
                {/* Full Name & Phone */}
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="fullname"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <IoPersonCircleSharp />
                      </span>
                      <input
                        type="text"
                        id="fullname"
                        placeholder="Full Name"
                        // defaultValue="Devid Jhon"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        {...methods.register('fullName')}
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="mob"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="Mobile"
                      id="mob"
                      // defaultValue="+990 3343 7865"
                      {...methods.register('phoneNumber')}
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-5.5">
                  <label
                    htmlFor="emailAddress"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <MdOutlineEmail />
                    </span>
                    <input
                      type="email"
                      id="emailAddress"
                      placeholder="Email"
                      // defaultValue="devidjond45@gmail.com"
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      {...methods.register('email')}
                    />
                  </div>
                </div>

                {/* Username */}
                <div className="mb-5.5">
                  <label
                    htmlFor="Username"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    address
                  </label>
                  <input
                    type="text"
                    id="address"
                    placeholder="sangli"
                    // defaultValue="sangli"
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    {...methods.register('address')}
                  />
                </div>

                <div className="col-span-12 mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  {adminInfo?.godName.map((god, index) => (
                    <div key={index} className="w-full sm:w-1/3">
                      <label
                        htmlFor={`god${index + 1}`}
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                      >
                        God Name
                      </label>
                      <input
                        type="text"
                        id={`god${index + 1}`}
                        placeholder={god}
                        className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        defaultValue={god.name}
                        {...methods.register(`godNames.${index}.name` as const)}
                      />
                    </div>
                  ))}
                </div>

                {/* Terms */}
                <div className="mb-5.5">
                  <label
                    htmlFor="terms"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    Terms
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <FaRegStickyNote />
                    </span>
                    {fields.map((field, index) => (
                      <div key={field.id} className="relative mb-2">
                        <span className="absolute left-4.5 top-4">
                          <FaRegStickyNote />
                        </span>
                        <input
                          type="text"
                          {...methods.register(`terms.${index}.term`)}
                          placeholder={`Term ${index + 1}`}
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      onClick={() => {
                        // Add terms functionality
                        append({term: ''});
                      }}
                    >
                      Add Term
                    </button>
                    <button
                      type="button"
                      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                      onClick={() => {
                        // Remove terms functionality
                        if (fields.length > 0) {
                          remove(fields.length - 1);
                        }
                      }}
                    >
                      Remove Term
                    </button>
                  </div>
                </div>

                {/* Payment Details */}
                <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Payment Details
                </h2>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="fullname"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Account Holder Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <IoPersonCircleSharp />
                      </span>
                      <input
                        type="text"
                        id="fullname"
                        placeholder="Full Name"
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        {...methods.register('accountName')}
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="bank"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Bank Name
                    </label>
                    <input
                      type="text"
                      placeholder="Bank Name"
                      id="bank"
                      {...methods.register('bankName')}
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="bankAcc"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      Bank Account Number
                    </label>
                    <div className="">
                      <input
                        type="text"
                        id="bankAcc"
                        placeholder="Bank Account Number"
                        className="w-full rounded border border-stroke bg-gray px-4 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        {...methods.register('bankAccount')}
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="ifscs"
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                    >
                      IFSC Code
                    </label>
                    <input
                      type="text"
                      placeholder="IFSC Code"
                      id="ifscs"
                      {...methods.register('ifsc')}
                      className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    />
                  </div>
                </div>

                <div className="mb-5.5">
                  <label
                    htmlFor="upi"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    UPI ID (Optional)
                  </label>
                  <input
                    type="text"
                    id="upi"
                    placeholder="UPI ID"
                    className="w-full rounded border border-stroke bg-gray px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    {...methods.register('upiId')}
                  />
                </div>

                <div className="mb-5.5">
                  <label
                    htmlFor="gstNo"
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                  >
                    GST No
                  </label>
                  <input
                    type="text"
                    id="gstNo"
                    placeholder="Gst No"
                    className={`w-full rounded border px-4.5 py-3 text-black focus:border-primary focus-visible:outline-none ${methods.formState.errors.gstNo ? 'border-red-500' : 'border-stroke'} dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                    {...methods.register('gstNo')}
                  />
                  {methods.formState.errors.gstNo && (
                    <p className="mt-1 text-xs text-red-500">
                      {methods.formState.errors.gstNo.message}
                    </p>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4.5">
                  <button
                    type="button"
                    className="flex justify-center rounded border border-stroke px-6 py-2 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default ProfilePage;
