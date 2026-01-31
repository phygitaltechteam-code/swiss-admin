import GenericButton from '@/components/Forms/Buttons/GenericButton';
import GenericDropdown from '@/components/Forms/DropDown/GenericDropDown';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {useGetIndustry} from '@/lib/react-query/industry';
import {
  useDeleteAdmin,
  useGetAdmin,
  useSaveAdmin,
  useUpdateAdmin,
} from '@/lib/react-query/superadmin/admin';
import {zodResolver} from '@hookform/resolvers/zod';
import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import toast from 'react-hot-toast';
import {z} from 'zod';

const formSchema = z
  .object({
    address: z.string().min(1, 'Address is required'),
    amount: z.coerce.number(),
    renewalAmount: z.coerce.number(),
    empSize: z.coerce.number(),
    dataLanguage: z.string().min(1, 'Data language is required'),
    state: z.string().min(1, 'State is required'),
    city: z.string().min(1, 'City is required'),
    plan: z.enum(['FREE', 'PREMIUM', 'PRO', 'BASIC', 'ULTRAPREMIUM'], {
      required_error: 'Plan type is required',
    }),
    industryId: z.string().min(1, 'industry is required'),

    user: z.object({
      fullname: z.string().min(1, 'Full name is required'),
      client: z.string().min(1, 'Full name is required'),
      email: z.string().email('Invalid email address'),
      username: z.string().min(3, 'Username must be at least 3 characters'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(
          /[@$!%*?&]/,
          'Password must contain at least one special character',
        ),
      phoneNumber: z
        .string()
        .length(10, 'Phone number must be 10 digits')
        .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
      secondaryPhoneNumber: z
        .string()
        .length(10, 'Secondary phone number must be 10 digits')
        .regex(/^[0-9]+$/, 'Secondary phone number must contain only digits'),
    }),
    startDate: z.preprocess(
      (val) => (typeof val === 'string' ? new Date(val) : val),
      z.date({required_error: 'Start date is required'}).refine(
        (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        {message: 'Start date cannot be in the past'},
      ),
    ),

    expiryDate: z.preprocess(
      (val) => (typeof val === 'string' ? new Date(val) : val),
      z.date({required_error: 'End date is required'}).refine(
        (date) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return date >= today;
        },
        {message: 'End date cannot be in the past'},
      ),
    ),
  })
  .refine((data) => data.startDate < data.expiryDate, {
    message: 'Start date must be before end date',
    path: ['endDate'],
  });

type adminRow = {
  id: string;
  fullname: string;
  email: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  address: string;
  plan: string;
  startDate: Date;
  endDate: Date;
  client: string;
};

type FormValues = z.infer<typeof formSchema>;

const CreateAdmin = () => {
  const methods = useForm<FormValues>({resolver: zodResolver(formSchema)});
  const [showForm, setShowForm] = useState(false);
  const {mutateAsync: saveAdmin, isPending: isAdding} = useSaveAdmin();
  const {data: adminData} = useGetAdmin();
  const {data: allIndustry} = useGetIndustry();
  console.log('admin data', adminData);

  const {mutateAsync: deleteAdmin} = useDeleteAdmin();
  const {mutateAsync: updateAdmin, isPending: isUpdating} = useUpdateAdmin();
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  console.log('edit id', editingAdminId);

  const formattedData = adminData?.map((item) => ({
    id: item.id,
    fullname: item.user.fullname,
    phoneNumber: item.user.phoneNumber,
    address: item.address,
    startDate: item.startDate.split('T')[0],
    expiryDate: item.expiryDate.split('T')[0],
  }));
  const columns: Column<any>[] = [
    {accessor: 'fullname', header: 'Name'},
    {accessor: 'phoneNumber', header: 'Phone Number'},
    {accessor: 'address', header: 'Address'},
    {accessor: 'startDate', header: 'Start Date'},
    {accessor: 'expiryDate', header: 'Expiry Date'},
  ];

  const handleBack = () => {
    setEditingAdminId(null);
    methods.reset();
    setShowForm(false);
  };
  const handleEdit = (row: adminRow) => {
    setEditingAdminId(row?.id);
    setShowForm(true);
  };
  useEffect(() => {
    if (editingAdminId && adminData) {
      const toEdit = adminData.find((e) => e.id === editingAdminId);
      if (toEdit) {
        methods.reset({
          address: toEdit.address || '',
          amount: Number(toEdit.amount) || 0,
          renewalAmount: Number(toEdit.renewalAmount) || 0,
          dataLanguage: toEdit.dataLanguage || '',
          state: toEdit.state || '',
          city: toEdit.city || '',
          industryId: toEdit.industryId,
          empSize: toEdit.empSize,
          plan:
            (toEdit.plan as
              | 'PREMIUM'
              | 'PRO'
              | 'BASIC'
              | 'FREE'
              | 'ULTRAPREMIUM') || 'BASIC',
          user: {
            fullname: toEdit.user?.fullname || '',
            client: toEdit.user?.client || '',
            email: toEdit.user?.email || '',
            username: toEdit.user?.username || '',
            password: '', // leave blank
            phoneNumber: toEdit.user?.phoneNumber || '',
            secondaryPhoneNumber: toEdit.user?.secondaryPhoneNumber || '',
          },
          startDate: toEdit.startDate
            ? new Date(toEdit.startDate).toISOString().split('T')[0]
            : '',
          expiryDate: toEdit.expiryDate
            ? new Date(toEdit.expiryDate).toISOString().split('T')[0]
            : '',
        });
      }
    }
  }, [editingAdminId, adminData]);

  const onSubmit = async (data: FormValues) => {
    try {
      const formattedData = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        expiryDate: new Date(data.expiryDate).toISOString(),
      };

      if (editingAdminId) {
        await updateAdmin({id: editingAdminId, data: formattedData});
      } else {
        await saveAdmin(formattedData);
      }

      methods.reset({});
      setEditingAdminId(null);
      setShowForm(false);
    } catch (error) {
      toast.error('Something went wrong');
      console.error(error);
    }
  };

  const error = (error: any) => {
    console.log('form error', error);
  };

  return (
    <div className="space-y-4 p-1 md:p-6">
      {/* HEADER ROW */}
      <div className="flex items-center justify-end">
        {!showForm && (
          <GenericButton onClick={() => setShowForm(true)}>
            + Add New
          </GenericButton>
        )}
      </div>

      {/* FORM VIEW */}
      {showForm ? (
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit, error)}
            className="space-y-8 bg-white p-8 dark:bg-black"
          >
            <div className="mb-6 flex items-center gap-2">
              <button type="button" onClick={handleBack} className="font-bold">
                ←
              </button>
              <h2 className="text-lg font-semibold">Save Admin</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
              {/* USER FIELDS */}
              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="user.fullname"
                  label="Company Name"
                  placeholder="Enter company name"
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <GenericDropdown
                  name="industryId"
                  label="Industry"
                  options={
                    allIndustry?.map((each) => ({
                      label: each.name,
                      value: each.id,
                    })) || []
                  }
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="empSize"
                  label="Employee Size"
                  placeholder="Enter employee Size"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="user.client"
                  label="Client Name"
                  placeholder="Enter full name"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="user.email"
                  label="Email"
                  placeholder="Enter email"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="user.username"
                  label="Username"
                  placeholder="Enter username"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="user.password"
                  label="Password"
                  placeholder="Enter password"
                  type="password"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="user.phoneNumber"
                  label="Phone Number"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="user.secondaryPhoneNumber"
                  label="Secondary Phone Number"
                  placeholder="Enter secondary phone number"
                />
              </div>

              {/* ADMIN DETAILS */}
              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="address"
                  label="Address"
                  placeholder="Enter address"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="amount"
                  label="Amount"
                  placeholder="Enter amount"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="renewalAmount"
                  label="Renewal Amount"
                  placeholder="Enter renewal amount"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="dataLanguage"
                  label="Data Language"
                  placeholder="Enter language"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="state"
                  label="State"
                  placeholder="Enter state"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="city"
                  label="City"
                  placeholder="Enter city"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericDropdown
                  name="plan"
                  label="Plan"
                  options={[
                    {label: 'FREE', value: 'FREE'},
                    {label: 'BASIC', value: 'BASIC'},
                    {label: 'PRO', value: 'PRO'},
                    {label: 'PREMIUM', value: 'PREMIUM'},
                    {label: 'ULTRAPREMIUM', value: 'ULTRAPREMIUM'},
                  ]}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="startDate"
                  label="Start Date"
                  type="date"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="expiryDate"
                  label="Expiry Date"
                  type="date"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <GenericButton type="submit" disabled={isAdding || isUpdating}>
                {editingAdminId
                  ? isUpdating
                    ? 'Updating...'
                    : 'Update'
                  : isAdding
                    ? 'Saving...'
                    : 'Save'}
              </GenericButton>
            </div>
          </form>
        </FormProvider>
      ) : (
        <GenericTable
          title="Admins"
          data={formattedData || []}
          columns={columns}
          itemsPerPage={10}
          searchAble
          action
          onDelete={(row) => deleteAdmin(row?.id)}
          onEdit={(row) => handleEdit(row)}
        />
      )}
    </div>
  );
};

export default CreateAdmin;
