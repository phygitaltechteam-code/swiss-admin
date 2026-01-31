import React, {useEffect, useState} from 'react';
import {useForm, FormProvider} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {useAuthContext} from '@/context/AuthContext';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import GenericDropdown from '../Forms/DropDown/GenericDropDown';
import {useGetEmpOfEmpSide} from '@/lib/react-query/companyDepartment';
import {useLowerseniorityEmp} from '@/lib/api/employeeApi';
import GenericMultiselectDropdown from '../Forms/SearchDropDown/GenericMultiselectDropdown';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {
  useDeleteDailyWorkByEmp,
  useGetDailyWorkByEmp,
  useGetDailyWorkByEmpById,
  useSaveDailyWorkByEmp,
  useUpdateDailyWorkByEmp,
} from '@/lib/react-query/WorkAssignByEmp';
import {hoursToMinutes, minutesToHours} from '../work/utils';

type ProjectRow = {
  id: string;
  name: string;
  priority: string;
  startDate: string;
  endDate: string;
};

export const ProjectSchema = z
  .object({
    srNo: z.coerce.number().optional(),
    name: z.string().min(1, {message: 'Name is required.'}),
    description: z.string().min(1, {message: 'Description is required.'}),
    review: z.string().min(1, {message: 'Review By is required.'}),
    priority: z.string().min(1, {message: 'Priority is required.'}),
    isAttachment: z.boolean().optional(),
    startDate: z.string().optional(),
    isRecurring: z.boolean().optional(),
    recurringType: z.string().optional(),
    dueDate: z.preprocess((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      return new Date(val);
    }, z.date().optional()),

    dueTime: z.string().optional(),
    minutes: z
      .string()
      .min(1, {message: 'Hours is required.'})
      .regex(/^(\d{1,2}(:[0-5]\d)?)$/, {
        message: 'Enter valid hours (e.g. 4 or 4:30)',
      }),
    recurringDate: z.string().optional(),
    documentNote: z.string().optional(),
    recurringTime: z.string().optional(),
    recurringDay: z.string().optional(),
    departmentsAndEmployees: z.object({
      departmentId: z.string().optional(),
      employeeIds: z
        .array(z.string().min(1))
        .min(1, {message: 'Select at least one employee.'}),
    }),
  })
  .refine(
    (data) => {
      if (!data.isRecurring) {
        return !!data.dueDate;
      }
      return true;
    },
    {
      message: 'Due date is required when not recurring.',
      path: ['dueDate'],
    },
  );

const columns = [
  {header: 'Name', accessor: 'name', sortable: true},
  {header: 'Description', accessor: 'description', sortable: true},
  {header: 'Assigned To', accessor: 'assign'},
  {header: 'Assigned By', accessor: 'assignedBy'},
  {header: 'Review', accessor: 'review'},
  {header: 'Priority', accessor: 'priority', sortable: true},
  // {header: 'Review By', accessor: 'review', sortable: true},

  {header: 'Recurring Type', accessor: 'recurringType'},
  {header: 'Recurring Date', accessor: 'recurringDate'},
  {header: 'Due Date', accessor: 'dueDate', sortable: true},
  {header: 'Status', accessor: 'status', sortable: true},
];
type FormValues = z.infer<typeof ProjectSchema>;

const EmpDailyWork: React.FC = () => {
  const {user} = useAuthContext();
  const methods = useForm<FormValues>({resolver: zodResolver(ProjectSchema)});
  const [statusFilter, setStatusFilter] = useState('');
  const {mutateAsync: addDailyWork} = useSaveDailyWorkByEmp();
  const {mutateAsync: updateDailyWork} = useUpdateDailyWorkByEmp();
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<File[]>([]);
  const {data: eachDailyWork} = useGetDailyWorkByEmpById(editingWorkId || '');
  const [showForm, setShowForm] = useState(false);
  const {data: dailyWork} = useGetDailyWorkByEmp();
  const {data: allEmp} = useGetEmpOfEmpSide();
  const {data: lowerEmp} = useLowerseniorityEmp();
  const [uploadError, setUploadError] = useState('');
  const {mutateAsync: deleteWork} = useDeleteDailyWorkByEmp();
  const [employeesByDept, setEmployeesByDept] = useState<Record<number, any[]>>(
    {},
  );
  console.log('each dailyyy//// ....', eachDailyWork);

  console.log('existingggg.....', existingFiles);
  useEffect(() => {
    const fetchEmployeesForDepartments = async () => {
      if (editingWorkId && eachDailyWork) {
        const deptId = user?.department;
        const attachmentImages =
          eachDailyWork?.assignedDocuments?.map((doc: any) => doc?.document) ||
          [];
        setExistingFiles(attachmentImages);
        const employeeId = eachDailyWork?.assignedTo;

        const getLocalTime = (value: string) => {
          if (!value) return '';
          const date = new Date(value);
          return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
        };

        const resetData: any = {
          name: eachDailyWork?.name || '',
          description: eachDailyWork?.description || '',
          priority: eachDailyWork?.priority || '',
          dueDate: eachDailyWork?.dueDate
            ? new Date(eachDailyWork?.dueDate).toISOString().split('T')[0]
            : undefined,
          dueTime: eachDailyWork?.dueDate
            ? getLocalTime(eachDailyWork?.dueDate)
            : undefined,
          review: eachDailyWork?.review?.id,
          isAttachment: eachDailyWork?.isAttachment,
          documentNote: eachDailyWork?.documentNote,
          minutes: minutesToHours(eachDailyWork?.minutes),
          isRecurring: eachDailyWork?.isRecurring,
          srNo: eachDailyWork?.srNo,
          departmentsAndEmployees: {
            departmentId: deptId,
            employeeIds: [employeeId],
          },
        };

        if (eachDailyWork?.recurringType) {
          resetData.recurringType = eachDailyWork.recurringType;
        }

        if (eachDailyWork?.recurringDate) {
          resetData.recurringDate = new Date(eachDailyWork.recurringDate)
            .toISOString()
            .split('T')[0];
        }

        if (eachDailyWork?.recurringTime) {
          resetData.recurringTime = eachDailyWork.recurringTime;
        }

        if (eachDailyWork?.recurringDay) {
          resetData.recurringDay = eachDailyWork.recurringDay;
        }
        methods.reset(resetData);
      }
    };

    fetchEmployeesForDepartments();
  }, [editingWorkId, eachDailyWork, methods]);

  const watchIsRecurring = methods.watch('isRecurring');
  const watchDuration = methods.watch('recurringType');

  const onSubmit = async (data: FormValues) => {
    console.log('Project data:', data);
    try {
      const formatDateTime = (
        date: Date | string | undefined,
        time: string | undefined,
      ) => {
        if (!date || !time) return null;
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) return null;

        const dateStr = parsedDate.toISOString().split('T')[0];
        return new Date(`${dateStr}T${time}`);
      };

      const dueDateTime = formatDateTime(data?.dueDate, data?.dueTime);
      const departmentId = user?.departmentId;
      const employeeIds = data.departmentsAndEmployees.employeeIds;

      const payload: any = {
        srNo: data?.srNo || 0,
        name: data.name,
        description: data.description,
        priority: data.priority,
        reviewBy: data?.review,
        isAttachment: data?.isAttachment,
        documentNote: data?.documentNote,
        minutes: hoursToMinutes(data.minutes),
        isRecurring: data?.isRecurring,
        recurringType: data?.recurringType,
        status: 'PENDING',
        departmentId,
        document: uploadedFiles,
      };

      if (!data.isRecurring) {
        payload.dueDate = dueDateTime;
      }
      if (data.recurringType == 'DAILY') {
        payload.recurringTime = data?.recurringTime;
      }
      if (data.recurringType == 'WEEKLY') {
        payload.recurringDay = data?.recurringDay;
      }

      if (
        data.recurringType !== 'WEEKLY' &&
        data.recurringType !== 'DAILY' &&
        data.isRecurring
      ) {
        payload.recurringDate = new Date(
          `${data?.recurringDate}T00:00:00.000Z`,
        );
      }
      console.log('emp id', employeeIds);
      if (editingWorkId) {
        payload.assignedTo = employeeIds[0];
      } else {
        payload.employeeIds = employeeIds;
      }

      console.log('🧾 Final project payload:', payload);

      if (editingWorkId) {
        const newPayload = {
          ...payload,
          attachments: existingFiles,
        };
        updateDailyWork({id: editingWorkId, data: newPayload});
      } else {
        await addDailyWork(payload);
      }

      methods.reset();
      setUploadedFiles([]);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  const error = (error: any) => {
    console.log('forrm error', error);
  };

  const handleEdit = (row: ProjectRow) => {
    console.log('idd', row.id);
    setEditingWorkId(row.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    console.log('delete id', id);
    const confirmed = confirm('Are you sure you want to delete this work?');
    if (confirmed) await deleteWork(id);
  };

  const handleBack = () => {
    setShowForm(false);
    setUploadedFiles([]);
    setEditingWorkId(null);
    methods.reset({
      departmentsAndEmployees: undefined,
      description: '',
      name: '',
      priority: '',
      startDate: '',
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    setUploadError('');
  };

  const formatedData =
    dailyWork?.map((each: any) => ({
      id: each.id,
      name: each?.name,
      description: each?.description,
      assign: each?.assign?.user?.fullname,
      review: each?.review?.user?.fullname,
      assignedBy: each?.assignedByEmployee?.user?.fullname || 'COMPANY',
      recurringType: each?.recurringType,
      recurringDate: each?.recurringDate,
      recurringDay: each?.recurringDay,
      recurringTime: each?.recurringTime,
      createdAt: each?.createdAt,
      department: each?.department?.name,
      dueDate: each?.dueDate,
      priority: each?.priority,
      status: each.status,
    })) || [];

  const combinedFiles = [
    ...existingFiles.map((url) => ({
      type: 'existing',
      url,
    })),
    ...uploadedFiles.map((file) => ({
      type: 'new',
      file,
    })),
  ];
  return (
    <div className="mx-auto w-full p-4 sm:p-6">
      <div className="flex items-center justify-end">
        {!showForm && (
          <div className="mb-3 flex items-center justify-between gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-gray-300 text-gray-700 rounded-md border border-stroke bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All</option>
              <option value="PENDING">PENDING</option>
              <option value="STARTED">STARTED</option>
              <option value="WORKING">WORKING</option>
              <option value="DONE">DONE</option>
              <option value="DELAYED">DELAYED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <GenericButton onClick={() => setShowForm(true)}>
              + Add New
            </GenericButton>
          </div>
        )}
      </div>
      {showForm ? (
        <div className="w-full overflow-y-auto bg-white shadow-sm dark:bg-strokedark">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="font-bold" type="button">
                ←
              </button>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white sm:text-xl">
                {editingWorkId ? 'Edit Daily Work' : 'Create Daily Work'}
              </h2>
            </div>
          </div>

          <div className="p-6">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit, error)}
                className="space-y-8"
              >
                {/* 🔹 Project Info */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <GenericInputField
                      name="name"
                      label="Work Name"
                      placeholder="Enter work Name"
                    />
                    {editingWorkId && (
                      <GenericInputField
                        name="srNo"
                        label="Serial No"
                        type="number"
                        placeholder="Enter Serial No"
                      />
                    )}

                    <GenericInputField
                      name="description"
                      label="Description"
                      placeholder="Enter Project Description"
                    />

                    <GenericDropdown
                      name="priority"
                      label="Priority"
                      options={[
                        {label: 'High', value: 'High'},
                        {label: 'Medium', value: 'Medium'},
                        {label: 'Low', value: 'Low'},
                      ]}
                    />

                    <GenericInputField
                      name="departmentsAndEmployees.departmentId"
                      label="Department"
                      defaultValue={user?.department}
                      disabled
                    />

                    <GenericMultiselectDropdown
                      name="departmentsAndEmployees.employeeIds"
                      label="Employees"
                      options={lowerEmp?.map((emp) => ({
                        label: emp?.user?.fullname,
                        value: emp.id,
                      }))}
                    />

                    <GenericDropdown
                      label="Review By"
                      name="review"
                      options={allEmp?.map((each: any) => ({
                        label: each?.user?.fullname,
                        value: each.id,
                      }))}
                    />

                    <div className="col-span-1 flex items-center gap-10">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          {...methods.register('isAttachment')}
                          className="h-4 w-4"
                        />
                        <span>Attachment Required?</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          {...methods.register('isRecurring')}
                          className="h-4 w-4"
                        />
                        <span>Recurring Work?</span>
                      </label>
                    </div>

                    <div className="mt-3">
                      <label className="mb-1 block">Hours</label>
                      <input
                        type="text"
                        placeholder="e.g 2:30"
                        {...methods.register('minutes')}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(
                            /[^0-9:]/g,
                            '',
                          );
                          methods.setValue('minutes', e.target.value);
                        }}
                        className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-1 text-black outline-none transition focus:border-primary"
                      />
                    </div>
                    {methods.watch('isAttachment') && (
                      <GenericInputField
                        name="documentNote"
                        label="Document Name"
                        placeholder="Enter Document Name"
                      />
                    )}

                    {!watchIsRecurring && (
                      <>
                        <GenericInputField
                          name="dueDate"
                          label="Due Date"
                          type="date"
                        />
                        <GenericInputField
                          name="dueTime"
                          label="Due Time"
                          type="time"
                        />
                      </>
                    )}

                    {watchIsRecurring && (
                      <GenericDropdown
                        name="recurringType"
                        label="duration"
                        options={[
                          {label: 'DAILY', value: 'DAILY'},
                          {label: 'WEEKLY', value: 'WEEKLY'},
                          {label: 'MONTHLY', value: 'MONTHLY'},
                          {label: 'QUARTERLY', value: 'QUARTERLY'},
                          {label: 'HALF_YEARLY', value: 'HALF_YEARLY'},
                          {label: 'YEARLY', value: 'YEARLY'},
                        ]}
                      />
                    )}

                    {watchDuration === 'DAILY' && (
                      <GenericInputField
                        name="recurringTime"
                        label="Duration Time"
                        type="time"
                      />
                    )}

                    {watchDuration === 'WEEKLY' && (
                      <GenericDropdown
                        name="recurringDay"
                        label="Day of Week"
                        options={[
                          {label: 'Monday', value: 'Monday'},
                          {label: 'Tuesday', value: 'Tuesday'},
                          {label: 'Wednesday', value: 'Wednesday'},
                          {label: 'Thursday', value: 'Thursday'},
                          {label: 'Friday', value: 'Friday'},
                          {label: 'Saturday', value: 'Saturday'},
                          {label: 'Sunday', value: 'Sunday'},
                        ]}
                      />
                    )}

                    {/* Show durationDate only for non-daily, non-weekly durations */}
                    {methods.watch('recurringType') !== 'DAILY' &&
                      methods.watch('recurringType') !== 'WEEKLY' &&
                      watchIsRecurring && (
                        <GenericInputField
                          name="recurringDate"
                          label="Duration Date"
                          type="date"
                        />
                      )}

                    <div className="col-span-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Upload Images
                      </label>
                      <input
                        type="file"
                        multiple
                        accept="*/*"
                        onChange={handleImageUpload}
                        className="text-gray-700 mt-3 block w-full rounded-md border border-stroke text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
                      />

                      <div className="mt-3 flex flex-wrap gap-3">
                        {combinedFiles.map((item, index) => {
                          const isExisting = item.type === 'existing';

                          const fileURL = isExisting
                            ? item.url
                            : URL.createObjectURL(item.file);

                          const isImage = isExisting
                            ? /\.(jpg|jpeg|png|gif|webp)$/i.test(fileURL)
                            : item.file.type.startsWith('image/');

                          const isPDF = isExisting
                            ? /\.pdf$/i.test(fileURL)
                            : item.file.type === 'application/pdf';

                          return (
                            <div key={index} className="relative">
                              {isImage && (
                                <img
                                  src={fileURL}
                                  className="h-16 w-16 cursor-pointer rounded border object-cover shadow"
                                  onClick={() => window.open(fileURL, '_blank')}
                                />
                              )}

                              {isPDF && (
                                <div
                                  onClick={() => window.open(fileURL, '_blank')}
                                  className="bg-gray-100 flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded border shadow"
                                >
                                  <span className="text-xs font-bold text-red-600">
                                    PDF
                                  </span>
                                  <span className="text-gray-600 text-[10px]">
                                    Open
                                  </span>
                                </div>
                              )}

                              {/* DELETE */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (isExisting) {
                                    setExistingFiles((prev) =>
                                      prev.filter((_, i) => i !== index),
                                    );
                                  } else {
                                    const newIndex =
                                      index - existingFiles.length;
                                    setUploadedFiles((prev) =>
                                      prev.filter((_, i) => i !== newIndex),
                                    );
                                  }
                                }}
                                className="absolute -right-2 -top-2 rounded-full bg-white p-1 text-xs text-red-600 shadow"
                              >
                                ✖
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 border-t border-slate-100 pt-3 dark:border-slate-700">
                  <GenericButton type="submit" className="min-w-[120px]">
                    {editingWorkId ? 'Update' : 'Save'}
                  </GenericButton>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      ) : (
        <div className="bg-white px-4 pt-2 dark:bg-boxdark">
          {' '}
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Daily Work List
          </h2>
          <GenericNewTable
            data={
              statusFilter
                ? formatedData?.filter(
                    (work: any) => work.status === statusFilter,
                  )
                : formatedData
            }
            columns={columns}
            onDelete={(row) => handleDelete(row.id)}
            onEdit={(row) => handleEdit(row)}
          />
        </div>
      )}
    </div>
  );
};

export default EmpDailyWork;
