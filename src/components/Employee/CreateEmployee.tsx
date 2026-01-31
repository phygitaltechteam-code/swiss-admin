import React, {useEffect, useState} from 'react';
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
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import {useAppContext} from '../common/PopUp';
import GenericDropdown from '../Forms/DropDown/GenericDropDown';
import {useGetDepartmentPositions} from '@/lib/react-query/departmentPositions';
import {useGetCompanyDepartment} from '@/lib/react-query/companyDepartment';
import {useNavigate, useRouterState} from '@tanstack/react-router';
import GenericTable, {Column} from '../Forms/Table/GenericTable';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {FiPlus, FiMinus} from 'react-icons/fi';

import {strict} from 'assert';
import GenericInputField from '../Forms/Input/GenericInputField';

const formSchema = z.object({
  address: z.string().optional(),
  positionId: z.string().min(1, {message: 'Position Id is required.'}),
  departmentId: z.string().min(1, {message: 'Department Id is required.'}),
  birthday: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    return new Date(val);
  }, z.date().optional()),
  anniversary: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    return new Date(val);
  }, z.date().optional()),

  salary: z.coerce.number().optional(),
  advance: z.coerce.number().optional(),

  documents: z
    .array(
      z.object({
        name: z.string().optional(),
        url: z.string(),
      }),
    )
    .optional(),

  user: z.object({
    fullname: z.string().min(1, 'Full name is required'),
    email: z
      .string()
      .email('Invalid email address')
      .min(3, 'email is required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),

    phoneNumber: z
      .string()
      .length(10, 'Phone number must be 10 digits')
      .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
    secondaryPhoneNumber: z
      .string()
      .optional()
      .refine((val) => !val || /^[0-9]{10}$/.test(String(val)), {
        message: 'Secondary phone number must be 10 digits',
      }),
    secondaryContactName: z.string().optional(),
  }),
});
const editSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  positionId: z.string().min(1, {message: 'Position Id is required.'}),
  departmentId: z.string().min(1, {message: 'Department Id is required.'}),
  birthday: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    return new Date(val);
  }, z.date().optional()),
  anniversary: z.preprocess((val) => {
    if (val === '' || val === null || val === undefined) return undefined;
    return new Date(val);
  }, z.date().optional()),

  salary: z.coerce.number().optional(),
  advance: z.coerce.number().optional(),

  documents: z
    .array(
      z.object({
        name: z.string().optional(),
        url: z.string(),
      }),
    )
    .optional(),

  user: z.object({
    fullname: z.string().min(1, 'Full name is required'),
    email: z
      .string()
      .email('Invalid email address')
      .min(3, 'email is required'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().optional(),

    phoneNumber: z
      .string()
      .length(10, 'Phone number must be 10 digits')
      .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
    secondaryPhoneNumber: z
      .string()
      .optional()
      .refine((val) => !val || /^[0-9]{10}$/.test(String(val)), {
        message: 'Secondary phone number must be 10 digits',
      }),
    secondaryContactName: z.string().optional(),
  }),
});

type FormValues = z.infer<typeof formSchema>;

type EmpRow = {
  id: string;
  name: string;
  phoneNumber: string;
  address: string;
  email: string;
  department: string;
  position: string;
  senioity: number;
};

const CreateEmployee: React.FC = () => {
  const {user} = useAuthContext();
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);
  const methods = useForm<FormValues>({
    resolver: zodResolver(editingEmpId ? editSchema : formSchema),
  });
  const {data: rawEmployees = []} = useEmployees();
  console.log('raw emp', rawEmployees);
  const {mutateAsync: createEmployee, isPending: isAdding} = useCreateEmployee(
    user?.roleId || '',
  );
  const [documents, setDocuments] = useState<{type: string; url: string}[]>([]);
  const [selectedDocType, setSelectedDocType] = useState('');
  const [filterDeptId, setFilterDeptId] = useState('');
  const [showMore, setShowMore] = useState(false);

  const {mutateAsync: deleteEmp} = useDeleteEmployee();
  const [showForm, setShowForm] = useState(false);

  console.log('edit id', editingEmpId);
  const {
    mutateAsync: updateEmployee,
    isPending: isUpdating,
    isSuccess,
  } = useUpdateEmployee(user?.roleId || '');
  const {data: allDepartment} = useGetCompanyDepartment();
  const {data: allPositions} = useGetDepartmentPositions();
  const navigate = useNavigate();
  const routerState = useRouterState();

  const filteredEmployees = filterDeptId
    ? rawEmployees.filter(
        (each) => String(each.departmentId) === String(filterDeptId),
      )
    : rawEmployees;

  const formatedData = filteredEmployees.map((each: any) => ({
    id: each.id,
    name: (
      <span
        className="cursor-pointer text-[#0284C7] hover:underline"
        onClick={() =>
          navigate({
            to: '/employee/emptask/$id',
            params: {id: each.id},
          })
        }
      >
        {each?.user?.fullname}
      </span>
    ),
    phoneNumber: each?.user?.phoneNumber,
    address: each?.address,
    email: each?.user?.email,
    department: each?.department?.name,
    position: each?.position?.name,
    senioity: each?.position?.seniority,
  }));

  const columns: Column<EmpRow>[] = [
    {header: 'Name', accessor: 'name', sortable: true},
    {header: 'Phone Number', accessor: 'phoneNumber', sortable: true},
    {header: 'Email', accessor: 'email'},
    {header: 'Address', accessor: 'address'},
    {header: 'Department', accessor: 'department'},
    {header: 'Position', accessor: 'position'},
    {header: 'Senioity', accessor: 'senioity'},
  ];
  const onSubmit = async (data: FormValues) => {
    try {
      // Prepare user object
      const userPayload: any = {
        fullname: data.user.fullname,
        email: data.user.email,
        username: data.user.username,
        phoneNumber: data.user.phoneNumber,
      };

      // Add secondary fields only if they have values
      if (data.user.secondaryContactName) {
        userPayload.secondaryContactName = data.user.secondaryContactName;
      }
      if (data.user.secondaryPhoneNumber) {
        userPayload.secondaryPhoneNumber = data.user.secondaryPhoneNumber;
      }

      // Handle password based on edit/create
      if (editingEmpId) {
        if (data.user.password) {
          userPayload.password = data.user.password;
        }
      } else {
        userPayload.password = data.user.password;
      }

      const payload = {
        ...data,
        user: userPayload,
        documents: documents,
        anniversary: data.anniversary
          ? new Date(data.anniversary).toISOString()
          : null,
        birthday: data.birthday ? new Date(data.birthday).toISOString() : null,
      };

      if (editingEmpId) {
        await updateEmployee({
          id: editingEmpId,
          data: payload,
        });
        setShowForm(false);
      } else {
        await createEmployee(payload);
      }

      // RESET and cleanup...
      // ...
    } catch (e) {
      // Handle error
    }
  };

  const handleEdit = (row: EmpRow) => {
    console.log('idd', row.id);
    setEditingEmpId(row.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm(
      '⚠️ This employee has assigned works.\n\nAre you sure you want to delete this employee?',
    );
    if (confirmed) await deleteEmp(id);
  };

  useEffect(() => {
    if (!editingEmpId) return;

    const toEdit = rawEmployees.find((e) => e.id === editingEmpId);
    console.log('to edit', toEdit);
    if (!toEdit) return;

    const docs =
      toEdit.documents?.map((doc: any) => ({
        type: doc.documentType,
        url: doc.document,
      })) || [];

    setDocuments(docs);
    methods.reset({
      user: {
        fullname: toEdit.user?.fullname || '',
        email: toEdit.user?.email || '',
        username: toEdit.user?.username || '',
        // password: toEdit?.user?.password || '',
        phoneNumber: toEdit.user?.phoneNumber || '',
        secondaryContactName: toEdit.user?.secondaryContactName || '',
        secondaryPhoneNumber: toEdit.user?.secondaryPhoneNumber || '',
      },

      address: toEdit.address || '',
      anniversary: toEdit.anniversary
        ? new Date(toEdit.anniversary).toISOString().split('T')[0]
        : '',
      birthday: toEdit.birthday
        ? new Date(toEdit.birthday).toISOString().split('T')[0]
        : '',
      departmentId: toEdit.departmentId || '',
      positionId: toEdit.positionId || '',
      advance: toEdit.advance || 0,
      joiningDate: toEdit.joiningDate
        ? new Date(toEdit.joiningDate).toISOString().split('T')[0]
        : '',
      salary: toEdit.salary || 0,

      documents: docs, // Zod + RHF will accept this
    });
  }, [editingEmpId, rawEmployees, methods]);

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedDocType) {
      alert('Please add a document type first');
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result as string;

      const updatedDocs = [...documents, {type: selectedDocType, url}];
      setDocuments(updatedDocs);
      methods.setValue('documents', updatedDocs);
    };
    reader.readAsDataURL(file);
  };

  const removeDocument = (index: number) => {
    const updated = documents.filter((_, i) => i !== index);
    setDocuments(updated);
    methods.setValue('documents', updated);
  };

  const handleBack = () => {
    setShowForm(false);
    setEditingEmpId(null);

    methods.reset({
      address: '',
      anniversary: '',
      birthday: '',
      departmentId: '',
      positionId: '',
      user: {
        fullname: '',
        email: '',
        username: '',
        password: '',
        phoneNumber: '',
        secondaryPhoneNumber: '',
      },
    });
  };

  const error = (error: any) => {
    console.log('form error', error);
  };
  const availableDocTypes = Object.values(DocumentType).filter(
    (d) => !documents.some((doc) => doc.type === d),
  );

  return (
    <div className="mx-auto w-full p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-end">
        {!showForm && (
          <>
            <select
              value={filterDeptId}
              onChange={(e) => setFilterDeptId(e.target.value)}
              className="border-gray-300 text-gray-700 rounded-md border border-stroke bg-white px-3 py-1.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Departments</option>
              {allDepartment?.map((each) => (
                <option key={each.id} value={each.id}>
                  {each.name}
                </option>
              ))}
            </select>
            <GenericButton onClick={() => setShowForm(true)}>
              + Add New
            </GenericButton>
          </>
        )}
      </div>
      {showForm ? (
        <div className="w-full overflow-y-auto bg-white shadow-sm">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 dark:border-slate-700 sm:px-6">
            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="font-bold" type="button">
                ←
              </button>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white sm:text-xl">
                {editingEmpId ? 'Edit Employee' : 'Create Employee'}
              </h2>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit, error)}
                className="space-y-6"
              >
                <h3 className="text-base font-semibold text-slate-800 dark:text-white sm:text-lg">
                  User Details
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <GenericInputField
                    name="user.fullname"
                    label="Full Name"
                    required
                    placeholder="Enter Full Name"
                  />
                  <GenericInputField
                    name="user.email"
                    label="Email"
                    required
                    placeholder="Enter Email"
                    type="email"
                  />
                  <GenericInputField
                    name="user.username"
                    label="Username"
                    required
                    placeholder="Enter Username"
                    disabled={!!editingEmpId}
                  />
                  <GenericInputField
                    name="user.password"
                    label="Password"
                    required
                    placeholder="Enter Password"
                    type="password"
                  />
                  <GenericInputField
                    name="user.phoneNumber"
                    label="Phone Number"
                    required
                    placeholder="Enter Phone Number"
                    type="number"
                  />
                  <GenericInputField
                    name="address"
                    label="Address"
                    placeholder="Enter Address"
                  />

                  <GenericDropdown
                    name="departmentId"
                    label="Department"
                    required
                    options={
                      allDepartment?.map((each) => ({
                        label: each.name,
                        value: each.id,
                      })) || []
                    }
                  />
                  <GenericDropdown
                    name="positionId"
                    label="Position"
                    required
                    options={
                      allPositions?.map((each) => ({
                        label: each.name,
                        value: each.id,
                      })) || []
                    }
                  />

                  {/* <div className="col-span-2">
                    <div className="flex flex-row items-start gap-4">
                      <div className="w-1/2">
                        <GenericInputField
                          name="documentName"
                          label="Document Type"
                          placeholder="Enter Document Type"
                          customOnChange={(e) =>
                            setSelectedDocType(e.target.value)
                          }
                        />
                      </div>

                   
                      <div className="w-1/2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Upload File
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleDocumentUpload(e)}
                          className="mt-2 block w-full border border-stroke file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Preview
                      </label>

                      <div className="mt-2 flex flex-wrap gap-2">
                        {documents.map((doc, index) => (
                          <div
                            key={index}
                            className="relative flex flex-col items-center"
                          >
                            <img
                              src={doc.url}
                              className="h-16 w-16 rounded border object-cover"
                            />

                            <span className="mt-1 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                              {doc.type}
                            </span>

                            <button
                              type="button"
                              onClick={() => removeDocument(index)}
                              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div> */}
                </div>

                {/* Toggle button */}
                <div
                  className="mt-2 flex cursor-pointer items-center gap-2"
                  onClick={() => setShowMore(!showMore)}
                >
                  {showMore ? (
                    <FiMinus className="h-3 w-3" size={20} />
                  ) : (
                    <FiPlus className="h-3 w-3" size={20} />
                  )}
                  <span className="flex items-center rounded-lg border border-blue-500 bg-blue-50 px-2 text-sm text-blue-600 transition-colors hover:bg-blue-100 dark:border-blue-400 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30">
                    {showMore ? 'Hide More' : 'Show More'}
                  </span>
                </div>
                {showMore && (
                  <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <GenericInputField
                        name="user.secondaryContactName"
                        label="Emergency Contact Name"
                        placeholder="Enter Emergency Contact Name"
                      />

                      <GenericInputField
                        name="user.secondaryPhoneNumber"
                        label="Emergency Contact Number"
                        placeholder="Enter Secondary Phone Number"
                      />

                      <GenericInputField
                        name="salary"
                        label="Salary"
                        placeholder="Enter Salary"
                      />
                      <GenericInputField
                        name="advance"
                        label="Advance"
                        placeholder="Enter Advance"
                      />
                      <GenericInputField
                        name="joiningDate"
                        label="Joining Date"
                        type="date"
                      />
                      <GenericInputField
                        name="birthday"
                        label="Birthday"
                        type="date"
                      />
                      <GenericInputField
                        name="anniversary"
                        label="Anniversary"
                        type="date"
                      />
                    </div>
                  </>
                )}

                {/* Buttons */}
                <div className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-slate-100 pt-6 dark:border-slate-700 sm:flex-row sm:gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white sm:w-auto"
                  >
                    Cancel
                  </button>
                  <GenericButton
                    type="submit"
                    disabled={isAdding || isUpdating}
                    className="w-full min-w-[120px] sm:w-auto"
                  >
                    {editingEmpId
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
          </div>
        </div>
      ) : (
        <div className="bg-white px-4 pt-2 dark:bg-meta-4">
          {' '}
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Employee List
          </h2>
          <GenericNewTable
            data={formatedData}
            columns={columns}
            onDelete={(row) => handleDelete(row.id)}
            onEdit={(row) => handleEdit(row)}
          />
        </div>
      )}
    </div>
  );
};

export default CreateEmployee;
