import React, {useState, useEffect} from 'react';
import {useForm, FormProvider} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';

import {useAuthContext} from '@/context/AuthContext';
import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from '@/lib/api/employeeApi';

import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import GenericButton from '@/components/Forms/Buttons/GenericButton';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phoneNumber: z.string().min(1, 'Phone Number is required'),
  address: z.string().min(1, 'Address is required'),
  password: z.string().optional(),
  banquetIds: z.array(z.string()).min(1, 'Select at least one Tithi'),
});

type FormValues = z.infer<typeof formSchema>;

// Shape for GenericTable rows
type EmployeeRow = {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
};

const columns: Column<EmployeeRow>[] = [
  {header: 'Name', accessor: 'name', sortable: true},
  {header: 'Phone Number', accessor: 'phoneNumber', sortable: true},
  {header: 'Address', accessor: 'address', sortable: true},
];

const ManageEmployee: React.FC = () => {
  const {user} = useAuthContext();
  const methods = useForm<FormValues>({resolver: zodResolver(formSchema)});

  const {data: rawEmployees = [], isLoading} = useEmployees(user?.roleId || '');
  console.log('allempp', rawEmployees);
  const {mutateAsync: createEmployee, isPending: isAdding} = useCreateEmployee(
    user?.roleId || '',
  );
  const {mutateAsync: updateEmployee, isPending: isUpdating} =
    useUpdateEmployee(user?.roleId || '');
  const {mutateAsync: deleteEmployee} = useDeleteEmployee(user?.roleId || '');

  // UI state
  const [showForm, setShowForm] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(
    null,
  );

  // Map API data for table rows
  const employeeData: EmployeeRow[] = rawEmployees.map((emp) => ({
    id: emp.id,
    name: emp.user.fullname,
    phoneNumber: emp?.user?.phoneNumber,
    address: emp?.user?.address,
  }));

  useEffect(() => {
    if (editingEmployeeId) {
      const toEdit = rawEmployees.find((e) => e.id === editingEmployeeId);
      if (toEdit) {
        methods.reset({
          name: toEdit.user.fullname,
          phoneNumber: toEdit.user.phoneNumber,
          address: toEdit.user.address,
          password: '',
        });
      }
    }
  }, [editingEmployeeId, rawEmployees, methods]);

  // Submit handler for create/update
  const onSubmit = async (data: FormValues) => {
    try {
      if (editingEmployeeId) {
        const password = data.password === '' ? 'empty' : data.password;
        await updateEmployee({
          id: editingEmployeeId,
          data: {
            ...data,
            password,
          },
        });
      } else {
        await createEmployee({
          ...data,
        });
      }
      methods.reset();
      setEditingEmployeeId(null);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  // Delete handler
  const handleDelete = async (employeeId: string) => {
    const confirmed = confirm('Are you sure you want to delete this employee?');
    if (confirmed) {
      try {
        await deleteEmployee(employeeId);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // Edit handler
  const handleEdit = (row: EmployeeRow) => {
    setEditingEmployeeId(row.id);
    setShowForm(true);
  };

  // Cancel/back handler
  const handleBack = () => {
    setEditingEmployeeId(null);
    methods.reset();
    setShowForm(false);
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
            onSubmit={methods.handleSubmit(onSubmit)}
            className="space-y-8 bg-white p-8 dark:bg-black"
          >
            <div className="mb-6 flex items-center gap-2">
              <button onClick={handleBack} className="font-bold">
                ←
              </button>
              <h2 className="text-lg font-semibold">
                {editingEmployeeId ? 'Edit Employee' : 'Add Employee'}
              </h2>
              <div /> {/* placeholder for spacing */}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="name"
                  label="Name"
                  placeholder="Enter full name"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="address"
                  label="Address"
                  placeholder="Enter address"
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <GenericInputField
                  name="password"
                  label="Password"
                  placeholder="Enter password"
                  type="password"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <GenericButton type="submit" disabled={isAdding || isUpdating}>
                {editingEmployeeId
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
        /* TABLE VIEW */
        <GenericTable
          title="Employees"
          data={employeeData}
          columns={columns}
          itemsPerPage={10}
          searchAble
          action
          onDelete={(row) => handleDelete(row?.id)}
          onEdit={(row) => handleEdit(row)}
        />
      )}
    </div>
  );
};

export default ManageEmployee;
