import React, {useEffect, useState} from 'react';
import {useForm, FormProvider} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericDropdown from '@/components/Forms/DropDown/GenericDropDown';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import {useAppContext} from '../common/PopUp';
import {useAuthContext} from '@/context/AuthContext';
import {useGetDeptEmp} from '@/lib/api/employeeApi';
import {
  useGetDepartmentWork,
  useGetWorkById,
  useSaveProjectWork,
  useSaveProjectWorkInBulk,
  useUpdateProjectWork,
} from '@/lib/react-query/projectWork';
import {useGetProject, useGetProjectDeptEmp} from '@/lib/react-query/project';
import CopySopSection from './CopySopSection';
import toast from 'react-hot-toast';

export const formSchema = z
  .object({
    name: z.string().min(1, {message: 'Name is required.'}),
    description: z.string().optional(),
    assignedTo: z.string().min(1, {message: 'Assigned To is required.'}),
    reviewBy: z.string().optional(),
    priority: z.string().min(1, {message: 'Priority is required.'}),
    // dueDate: z.coerce.date().optional(),
    dueDate: z.preprocess(
      (val) => (typeof val === 'string' ? new Date(val) : val),
      z.date({required_error: 'Due date is required.'}),
    ),
    dueTime: z
      .string({
        required_error: 'End time is required.',
      })
      .min(1, 'End time is required.'),

    hours: z.string().regex(/^\d*$/, {message: 'Invalid hours'}).optional(),
    minutes: z
      .string()
      .regex(/^[0-5]?\d?$/, {message: 'Minutes must be 0–59'})
      .optional(),
    isAttachment: z.boolean().default(false),
    documentNote: z.string().optional(),
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
  });

type FormValues = z.infer<typeof formSchema>;

const CreateProjectWork: React.FC = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      srNo: 0,
      name: '',
      description: '',
      assignedTo: '',
      reviewBy: '',
      priority: '',
      dueDate: undefined,
      hours: '0',
      minutes: '0',
      isAttachment: false,
      documentNote: '',
    },
  });

  const {
    setProjectWork,
    projectWork,
    selectedProjectId,
    selectedDepartmentId,
    projectHeads,
    selectedProjectWorkId,
    setSelectedProjectWorkId,
  } = useAppContext();

  const {user} = useAuthContext();
  const {mutateAsync: addProjectWork} = useSaveProjectWork();
  const {mutateAsync: updateProjectWork} = useUpdateProjectWork();
  const [selectedEmp, setSelectedEmp] = useState('');
  const {data: allProject} = useGetProject();
  const [selectedOption, setSelectedOption] = useState('add-new');
  const [higherSeniorityEmployees, setHigherSeniorityEmployees] = useState<
    any[]
  >([]);
  const work_id = selectedProjectWorkId;
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<File[]>([]);
  const {data: workData} = useGetWorkById(work_id);
  const [dropdownProjectId, setSelectedProjectId] = useState('');
  const [localWorkData, setLocalWorkData] = useState<any[]>([]);
  const {mutateAsync: saveProjectWork} = useSaveProjectWorkInBulk();
  const [uploadError, setUploadError] = useState('');
  const {refetch} = useGetDepartmentWork(
    selectedDepartmentId,
    dropdownProjectId,
    {enabled: false},
  );
  const [deptEmployees, setDeptEmployees] = useState<any[]>([]);
  const {data: deptEmp} = useGetProjectDeptEmp(
    selectedProjectId,
    selectedDepartmentId!,
  );

  useEffect(() => {
    if (work_id) setSelectedOption('add-new');
  }, [work_id]);

  useEffect(() => {
    if (deptEmp) {
      const normalizedFilteredEmps = (deptEmp || []).map((emp: any) => ({
        id: emp.id,
        fullname: emp?.user?.fullname || 'Unknown',
        seniority: emp?.position?.seniority || 0,
      }));

      const merged = [...projectHeads, ...normalizedFilteredEmps];
      const unique = merged.filter(
        (emp, index, self) => index === self.findIndex((e) => e.id === emp.id),
      );

      setDeptEmployees(unique);
    }
  }, [deptEmp, projectHeads]);

  useEffect(() => {
    if (!selectedDepartmentId) {
      setDeptEmployees(projectHeads || []);
      return;
    }

    const fetchDeptEmployees = async () => {
      const res = await useGetDeptEmp(selectedDepartmentId);
      const apiDeptEmp = res?.data || [];

      const normalizedFilteredEmps = (apiDeptEmp || []).map((emp: any) => ({
        id: emp.id,
        fullname: emp?.user?.fullname || 'Unknown',
        seniority: emp?.position?.seniority || 0,
      }));
      const merged = [...projectHeads, ...normalizedFilteredEmps];
      setDeptEmployees(merged);
    };

    fetchDeptEmployees();
  }, [selectedDepartmentId, projectHeads]);

  useEffect(() => {
    if (dropdownProjectId) {
      refetch().then((res) => {
        setLocalWorkData(res.data || []);
      });
    } else {
      setLocalWorkData([]);
    }
  }, [dropdownProjectId]);
  const convertMinutesToHoursMinutes = (totalMinutes?: number) => {
    if (totalMinutes == null) return {hours: '', minutes: ''};

    const hours = Math.floor(totalMinutes / 60).toString();
    const minutes = (totalMinutes % 60).toString();

    return {hours, minutes};
  };

  useEffect(() => {
    if (workData) {
      const attachmentImages =
        workData?.assignedDocuments?.map((doc: any) => doc?.document) || [];
      const {hours, minutes} = convertMinutesToHoursMinutes(workData.minutes);
      setExistingFiles(attachmentImages);
      methods.reset({
        assignedTo: workData?.assignedTo,
        description: workData?.description,
        dueDate: workData?.dueDate?.split('T')[0],
        dueTime: new Date(workData.dueDate).toTimeString().slice(0, 5),
        isAttachment: workData?.isAttachment,
        name: workData?.name,
        priority: workData?.priority,
        reviewBy: workData?.reviewBy,
        srNo: workData?.srNo,
        documentNote: workData?.documentNote,
        hours,
        minutes,
      });
      setSelectedEmp(workData?.assignedTo);
    }
  }, [workData]);

  useEffect(() => {
    if (selectedEmp) {
      const selectedEmployee = deptEmp?.find(
        (emp: any) => emp.id === selectedEmp,
      );
      const filteredEmployees = selectedEmployee
        ? deptEmp.filter(
            (emp: any) =>
              emp?.position?.seniority < selectedEmployee?.position?.seniority,
          )
        : [];

      const normalizedFilteredEmps = (filteredEmployees || []).map(
        (emp: any) => ({
          id: emp.id,
          fullname: emp?.user?.fullname || 'Unknown',
          seniority: emp?.position?.seniority || 0,
        }),
      );
      const combinedEmployees = [
        ...(normalizedFilteredEmps || []),
        ...(projectHeads || []),
      ];

      const uniqueCombined = combinedEmployees.filter(
        (emp, index, self) => index === self.findIndex((e) => e.id === emp.id),
      );

      setHigherSeniorityEmployees(uniqueCombined);
    }
  }, [selectedEmp, deptEmp, projectHeads]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    setUploadError('');
  };

  const onSubmit = async (data: FormValues) => {
    const formatDateTime = (date: Date | string, time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      const d = new Date(date);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    console.log('hoursssss', data.minutes);
    const dateTime = formatDateTime(data?.dueDate, data?.dueTime);
    const totalMinutes =
      Number(data.hours || 0) * 60 + Number(data.minutes || 0);
    console.log('total minusss', totalMinutes);
    try {
      if (work_id) {
        await updateProjectWork({
          id: work_id,
          data: {
            assignedTo: data.assignedTo,
            companyId: user?.companyId,
            description: data.description,
            name: data.name,
            priority: data.priority,
            projectId: selectedProjectId,
            srNo: data.srNo,
            status: data.status,
            dueDate: dateTime,
            minutes: totalMinutes,
            reviewBy: data.reviewBy,
            isAttachment: data.isAttachment,
            document: uploadedFiles,
            departmentId: selectedDepartmentId,
            attachments: existingFiles,
            documentNote: data?.documentNote,
          },
        });

        console.log('existing docs', uploadedFiles);
      } else {
        await addProjectWork({
          assignedTo: data.assignedTo,
          companyId: user?.companyId,
          description: data.description,
          name: data.name,
          priority: data.priority,
          projectId: selectedProjectId,
          srNo: 0,
          status: 'PENDING',
          dueDate: dateTime,
          minutes: totalMinutes,
          reviewBy: data.reviewBy,
          reviewComment: '',
          departmentId: selectedDepartmentId,
          isAttachment: data?.isAttachment,
          document: uploadedFiles,
          documentNote: data?.documentNote,
        });
      }

      // methods.reset();
      setProjectWork(false);
    } catch (error) {
      console.error(error);
      toast.error('Fill all required feilds!');
    }
  };

  const errror = (error: any) => {
    console.log('form error', error);
  };
  const onSubmitCopyData = () => {
    const data = localWorkData?.map((each: any) => ({
      srNo: each?.srNo,
      name: each?.name,
      description: each?.description,
      status: 'PENDING',
      projectId: selectedProjectId,
      departmentId: selectedDepartmentId,
      minutes: each?.minutes,
    }));

    // Send the array directly (no "works" wrapper)
    saveProjectWork(data || []);
  };

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
    <div className="mx-auto w-full max-w-6xl">
      {projectWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 bg-[#E0F2FE] px-6 py-4 dark:border-slate-700">
              <div className="flex items-center gap-5">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {work_id ? 'Edit Work' : 'Create Work'}
                </h2>

                {!work_id && (
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="relative z-20 w-32 appearance-none rounded-md border border-stroke px-4 py-1.5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
                    >
                      <option>Select Type</option>
                      <option value="copy-sop">Copy Sop</option>
                      <option value="add-new">Add New</option>
                    </select>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  uploadedFiles.forEach((file) => {});
                  setSelectedProjectWorkId('');
                  setProjectWork(false);
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-5">
              {selectedOption === '' && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                  <p className="text-lg font-medium">
                    Please select an option to continue
                  </p>
                </div>
              )}

              {selectedOption === 'add-new' && (
                <FormProvider {...methods}>
                  <form
                    onSubmit={methods.handleSubmit(onSubmit, errror)}
                    className="space-y-6 rounded-xl bg-white shadow-sm"
                  >
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      {work_id && (
                        <GenericInputField
                          name="srNo"
                          label="Serial No"
                          type="number"
                          placeholder="Enter Serial No"
                        />
                      )}

                      <GenericInputField
                        name="name"
                        label="Work Name"
                        required
                        placeholder="Enter Work Name"
                      />
                      <GenericInputField
                        name="description"
                        label="Description"
                        placeholder="Enter Description"
                      />
                      <GenericDropdown
                        name="assignedTo"
                        label="Assigned To"
                        required
                        options={
                          deptEmployees?.map((emp) => ({
                            label: emp?.fullname || 'Unknown',
                            value: emp.id,
                          })) || []
                        }
                        onChange={(value) => setSelectedEmp(value)}
                      />
                      <GenericDropdown
                        name="reviewBy"
                        label="Review By"
                        options={
                          higherSeniorityEmployees?.map((emp) => ({
                            label: emp?.fullname || 'Unknown',
                            value: emp.id,
                          })) || []
                        }
                      />
                      <GenericDropdown
                        name="priority"
                        label="Priority"
                        required
                        options={[
                          {label: 'Low', value: 'Low'},
                          {label: 'Medium', value: 'Medium'},
                          {label: 'High', value: 'High'},
                        ]}
                      />
                      <GenericInputField
                        name="dueDate"
                        label="Due Date"
                        type="date"
                        required
                      />
                      <GenericInputField
                        name="dueTime"
                        label="Due Time"
                        type="time"
                        required
                      />
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

                      <div className="flex items-center space-x-3 md:mt-6">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          Attachment Required?
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            methods.setValue(
                              'isAttachment',
                              !methods.getValues('isAttachment'),
                            )
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            methods.watch('isAttachment')
                              ? 'bg-[#0284C7]'
                              : 'bg-neutral-600 dark:bg-slate-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              methods.watch('isAttachment')
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {methods.watch('isAttachment') && (
                        <GenericInputField
                          name="documentNote"
                          label="Document Type"
                        />
                      )}

                      <div className="col-span-2 rounded border border-stroke p-2">
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
                                    onClick={() =>
                                      window.open(fileURL, '_blank')
                                    }
                                  />
                                )}

                                {/* PDF */}
                                {isPDF && (
                                  <div
                                    onClick={() =>
                                      window.open(fileURL, '_blank')
                                    }
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

                        {uploadError && (
                          <p className="mt-2 text-sm text-red-500">
                            {uploadError}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4 border-t border-slate-100 dark:border-slate-700">
                      <button
                        type="button"
                        onClick={() => {
                          uploadedFiles.forEach((file) => {
                            // if (!file.isExisting) {
                            //   URL.revokeObjectURL(file.url);
                            // }
                          });
                          setSelectedProjectWorkId('');
                          setProjectWork(false);
                        }}
                        className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                      >
                        Cancel
                      </button>
                      <GenericButton type="submit" className="min-w-[120px]">
                        {work_id ? 'Update' : 'Save'}
                      </GenericButton>
                    </div>
                  </form>
                </FormProvider>
              )}

              {selectedOption === 'copy-sop' && (
                <CopySopSection
                  dropdownProjectId={dropdownProjectId}
                  setSelectedProjectId={setSelectedProjectId}
                  allProject={allProject || []}
                  localWorkData={localWorkData}
                  onSubmitCopyData={onSubmitCopyData}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateProjectWork;
