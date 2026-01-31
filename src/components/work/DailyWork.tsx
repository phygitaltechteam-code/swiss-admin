import React, {useEffect, useState} from 'react';
import {useForm, FormProvider} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {useAuthContext} from '@/context/AuthContext';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import GenericDropdown from '../Forms/DropDown/GenericDropDown';
import {useGetCompanyDepartment} from '@/lib/react-query/companyDepartment';
import {useEmployees, useGetDeptEmp} from '@/lib/api/employeeApi';
import {useGetProject, useUpdateProject} from '@/lib/react-query/project';
import GenericMultiselectDropdown from '../Forms/SearchDropDown/GenericMultiselectDropdown';
import {getAllCompanyDepartmentById} from '@/lib/api/companyDepartment';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import {
  useDeleteDailyWork,
  useGetDailyWork,
  useGetDailyWorkById,
  useSaveDailyWork,
  useUpdateDailyWork,
} from '@/lib/react-query/projectWork';
import {useNavigate} from '@tanstack/react-router';
import {minutesToHours} from '@/lib/Methods';

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
    description: z.string().optional(),
    review: z.string().min(1, {message: 'Review By is required.'}),
    priority: z.string().min(1, {message: 'Priority is required.'}),
    isAttachment: z.boolean().optional(),
    documentNote: z.string().optional(),
    isRecurring: z.boolean().optional(),
    recurringType: z.string().optional(),
    dueDate: z.preprocess((val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      return new Date(val);
    }, z.date().optional()),
    dueTime: z.string().optional(),
    hours: z.string().regex(/^\d*$/, {message: 'Invalid hours'}).optional(),
    minutes: z
      .string()
      .regex(/^[0-5]?\d?$/, {message: 'Minutes must be 0–59'})
      .optional(),

    recurringDate: z.string().optional(),
    recurringTime: z.string().optional(),
    recurringDay: z.string().optional(),
    departmentsAndEmployees: z.object({
      departmentId: z.string().min(1, {message: 'Department is required.'}),
      employeeIds: z
        .array(z.string().min(1))
        .min(1, {message: 'Select at least one employee.'}),
    }),
  })
  .superRefine((data, ctx) => {
    const hasHours = data.hours && Number(data.hours) > 0;
    const hasMinutes = data.minutes && Number(data.minutes) > 0;

    if (!hasHours && !hasMinutes) {
      ctx.addIssue({
        path: ['minutes'],
        message: 'Enter hours or minutes',
        code: z.ZodIssueCode.custom,
      });
    }
  })
  .superRefine((data, ctx) => {
    if (!data.isRecurring) {
      if (!data.dueDate) {
        ctx.addIssue({
          path: ['dueDate'],
          message: 'Due date is required when not recurring.',
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.dueTime) {
        ctx.addIssue({
          path: ['dueTime'],
          message: 'Due time is required when not recurring.',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

type FormValues = z.infer<typeof ProjectSchema>;
console.log('abccc');
const DailyWork: React.FC = () => {
  const methods = useForm<FormValues>({resolver: zodResolver(ProjectSchema)});
  const [statusFilter, setStatusFilter] = useState('');
  const [statusDeptFilter, setStatusDeptFilter] = useState('');
  const [recurringTypeFilter, setrecurringTypeFilter] = useState('');
  const {data: allDepartment = []} = useGetCompanyDepartment();
  const {data: allEmployees = []} = useEmployees();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState('');
  const {mutateAsync: addDailyWork} = useSaveDailyWork();
  const {mutateAsync: updateDailyWork} = useUpdateDailyWork();
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const {data: eachDailyWork} = useGetDailyWorkById(editingWorkId);
  const [showForm, setShowForm] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [deptEmployees, setDeptEmployees] = useState<any[]>([]);
  const {data: dailyWork} = useGetDailyWork();
  const navigate = useNavigate();

  console.log('dailyy workk', dailyWork);

  const {data: deptEmp} = useGetDeptEmp(selectedDept!, {
    enabled: !!selectedDept,
  });
  const {mutateAsync: deleteWork} = useDeleteDailyWork();
  const [employeesByDept, setEmployeesByDept] = useState<Record<number, any[]>>(
    {},
  );

  const columns = [
    {
      header: 'Work Name',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <span
          onClick={() => {
            navigate({to: `/company/dailyworkdetails/${row.id}`});
          }}
          className="cursor-pointer text-[#0284C7] hover:underline"
        >
          {row.name}
        </span>
      ),
    },
    {header: 'Description', accessor: 'description'},
    {header: 'Department', accessor: 'department'},
    {header: 'Assigned To', accessor: 'assign', sortable: true},
    {header: 'Assigned By', accessor: 'assignedBy'},
    {header: 'Review By', accessor: 'review'},
    {header: 'Priority', accessor: 'priority'},
    {header: 'Due Date', accessor: 'dueDate'},
    {header: 'Created At', accessor: 'createdAt'},
    {header: 'Allotted Hours', accessor: 'minutesToHours'},
    {header: 'Status', accessor: 'status'},
  ];

  const convertMinutesToHoursMinutes = (totalMinutes?: number) => {
    if (totalMinutes == null) return {hours: '', minutes: ''};

    const hours = Math.floor(totalMinutes / 60).toString();
    const minutes = (totalMinutes % 60).toString();

    return {hours, minutes};
  };

  useEffect(() => {
    const fetchEmployeesForDepartments = async () => {
      if (editingWorkId && eachDailyWork) {
        const deptId = eachDailyWork?.departmentId;
        setSelectedDept(deptId);
        const attachmentImages =
          eachDailyWork?.assignedDocuments?.map((doc: any) => doc?.document) ||
          [];
        const employeeId = eachDailyWork?.assignedTo;
        const response = await getAllCompanyDepartmentById(deptId);
        const allEmployees = response?.employee || [];
        const dropdownEmployees = allEmployees.map((e: any) => ({
          label: e.user?.fullname,
          value: e.id,
        }));

        setEmployeesByDept({0: dropdownEmployees});
        setExistingFiles(attachmentImages);

        const getLocalTime = (value: string) => {
          if (!value) return '';
          const date = new Date(value);
          return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
        };
        const {hours, minutes} = convertMinutesToHoursMinutes(
          eachDailyWork.minutes,
        );
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
          hours,
          minutes,
          review: eachDailyWork?.review?.id,
          isAttachment: eachDailyWork?.isAttachment,
          isRecurring: eachDailyWork?.isRecurring,
          srNo: eachDailyWork?.srNo,
          documentNote: eachDailyWork?.documentNote,
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

  useEffect(() => {
    if (deptEmp) setDeptEmployees(deptEmp);
  }, [deptEmp]);
  useEffect(() => {
    if (selectedDept) {
      const fetchDeptEmployees = async () => {
        const res = await useGetDeptEmp(selectedDept);
        setDeptEmployees(res?.data || []);
      };
      fetchDeptEmployees();
    } else {
      setDeptEmployees([]);
    }
  }, [selectedDept]);

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
      dueTime: each?.recurringTime,
      createdAt: each?.createdAt,
      minutesToHours: minutesToHours(each?.minutes),
      department: each?.department?.name,
      departmentId: each?.department?.id,
      dueDate: each?.dueDate || each?.recurringDay || each?.recurringDate,
      priority: each?.priority,
      status: each.status,
    })) || [];

  const watchIsRecurring = methods.watch('isRecurring');
  const watchDuration = methods.watch('recurringType');

  const onSubmit = async (data: FormValues) => {
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
      const departmentId = data.departmentsAndEmployees.departmentId;
      const employeeIds = data.departmentsAndEmployees.employeeIds;
      const totalMinutes =
        Number(data.hours || 0) * 60 + Number(data.minutes || 0);

      const payload: any = {
        srNo: data?.srNo || 0,
        name: data.name,
        description: data.description,
        priority: data.priority,
        reviewBy: data?.review,
        isAttachment: data?.isAttachment,
        minutes: totalMinutes,
        documentNote: data?.documentNote,
        isRecurring: data?.isRecurring,
        recurringType: data?.recurringType,
        status: 'PENDING',
        departmentId,
        employeeIds,
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
    setEditingWorkId(row.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this work?');
    if (confirmed) await deleteWork(id);
  };

  const handleBack = () => {
    setShowForm(false);
    setUploadedFiles([]);
    setEditingWorkId(null);
    methods.reset({
      departmentsAndEmployees: '',
      description: '',
      name: '',
      priority: '',
      projectHeads: [],
      startDate: '',
      startTime: '',
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    setUploadError('');
  };

  const filteredData = React.useMemo(() => {
    return formatedData.filter((work: any) => {
      if (statusFilter && work.status !== statusFilter) return false;
      if (statusDeptFilter && work.departmentId !== statusDeptFilter)
        return false;

      if (recurringTypeFilter) {
        if (
          recurringTypeFilter === 'ONE-TIME'
            ? work.recurringType !== null
            : work.recurringType !== recurringTypeFilter
        ) {
          return false;
        }
      }

      return true;
    });
  }, [formatedData, statusFilter, statusDeptFilter, recurringTypeFilter]);

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
              value={statusDeptFilter}
              onChange={(e) => setStatusDeptFilter(e.target.value)}
              className="border-gray-300 text-gray-700 rounded-md border border-stroke bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="DEPARTMENT">DEPARTMENT</option>
              {allDepartment?.map((each: any) => (
                <option key={each.id} value={each.id}>
                  {each.name}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-gray-300 text-gray-700 rounded-md border border-stroke bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="STATUS">STATUS</option>
              <option value="PENDING">PENDING</option>
              <option value="STARTED">STARTED</option>
              <option value="WORKING">WORKING</option>
              <option value="REVIEW">REVIEW</option>
              <option value="DONE">DONE</option>
              <option value="DELAYED">DELAYED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <select
              value={recurringTypeFilter}
              onChange={(e) => setrecurringTypeFilter(e.target.value)}
              className="border-gray-300 text-gray-700 rounded-md border border-stroke bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="RECCURING">RECCURING</option>
              <option value="ONE-TIME">ONE-TIME</option>
              <option value="DAILY">DAILY</option>
              <option value="WEEKLY">WEEKLY</option>
              <option value="MONTHLY">MONTHLY</option>
              <option value="QUARTERLY">QUARTERLY</option>
              <option value="HALF_YEARLY">HALF_YEARLY</option>
              <option value="YEARLY">YEARLY</option>
            </select>

            <GenericButton onClick={() => setShowForm(true)}>
              + Add New
            </GenericButton>
          </div>
        )}
      </div>
      {showForm ? (
        <div className="w-full overflow-y-auto bg-white shadow-sm">
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
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <GenericInputField
                      name="name"
                      label="Work Name"
                      placeholder="Enter work Name"
                      required
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
                      required
                    />

                    <GenericDropdown
                      name="departmentsAndEmployees.departmentId"
                      label="Department"
                      options={allDepartment.map((d: any) => ({
                        label: d.name,
                        value: d.id,
                      }))}
                      onChange={(selectedValue: string) =>
                        setSelectedDept(selectedValue)
                      }
                      required
                    />

                    <GenericMultiselectDropdown
                      name="departmentsAndEmployees.employeeIds"
                      label="Employees"
                      options={deptEmployees.map((emp) => ({
                        label: emp?.user?.fullname,
                        value: emp.id,
                      }))}
                      required
                    />

                    <GenericDropdown
                      label="Review By"
                      name="review"
                      options={allEmployees?.map((each: any) => ({
                        label: each?.user?.fullname,
                        value: each.id,
                      }))}
                      required
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

                    <div className="mt-3">
                      <label className="mb-1 block text-black">
                        Hours{' '}
                        <span className="text-lg font-bold text-red-600">
                          *
                        </span>
                      </label>

                      <div className="flex items-center gap-2">
                        {/* Hours */}
                        <input
                          type="number"
                          placeholder="HH"
                          min={0}
                          {...methods.register('hours')}
                          className="w-20 rounded border-[1.7px] border-stroke px-3 py-1 text-center outline-none focus:border-primary"
                        />

                        <span className="text-lg font-semibold">:</span>

                        {/* Minutes */}
                        <input
                          type="number"
                          placeholder="MM"
                          min={0}
                          max={59}
                          {...methods.register('minutes')}
                          className="w-20 rounded border-[1.7px] border-stroke px-3 py-1 text-center outline-none focus:border-primary"
                        />
                      </div>
                    </div>

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
                        className="text-gray-700 mt-2 block w-full rounded-md border border-stroke text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
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
                              {/* IMAGE */}
                              {isImage && (
                                <img
                                  src={fileURL}
                                  className="h-16 w-16 cursor-pointer rounded border object-cover shadow"
                                  onClick={() => window.open(fileURL, '_blank')}
                                />
                              )}

                              {/* PDF */}
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

                <div className="flex justify-end space-x-4 border-t border-slate-100 pt-6 dark:border-slate-700">
                  <GenericButton type="submit" className="min-w-[120px]">
                    {editingWorkId ? 'Update' : 'Save'}
                  </GenericButton>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      ) : (
        <div className="bg-white px-4 pt-2">
          {' '}
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Daily Work List
          </h2>
          <GenericNewTable
            data={filteredData}
            columns={columns}
            onDelete={(row) => handleDelete(row.id)}
            onEdit={(row) => handleEdit(row)}
          />
        </div>
      )}
    </div>
  );
};

export default DailyWork;
