import React, {useEffect, useState} from 'react';
import {useForm, FormProvider} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {z} from 'zod';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericDropdown from '@/components/Forms/DropDown/GenericDropDown';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import {useAppContext} from '../common/PopUp';
import {useAuthContext} from '@/context/AuthContext';
import {
  useGetEmpProject,
  useGetLowerEmpByEmpToProject,
} from '@/lib/api/employeeApi';
import {useNavigate, useRouterState} from '@tanstack/react-router';

import {
  useGetDepartmentWorkByEmp,
  useGetProjectWorkByIdByEmp,
  useSaveProjectWorkByEmp,
  useSaveProjectWorkInBulkByEmp,
  useUpdateProjectWorkByEmp,
} from '@/lib/react-query/WorkAssignByEmp';
import {useGetProjectDepartEmpByHead} from '@/lib/react-query/empProject';
import {hoursToMinutes, minutesToHours} from '../work/utils';
export const formSchema = z.object({
  srNo: z.coerce.number({
    invalid_type_error: 'Serial number must be a number.',
  }),
  documentNote: z.string().optional(),
  name: z.string().min(1, {message: 'Name is required.'}),
  description: z.string().min(1, {message: 'Description is required.'}),
  assignedTo: z.string().min(1, {message: 'Assigned To is required.'}),
  reviewBy: z.string().optional(),
  priority: z.string().min(1, {message: 'Priority is required.'}),
  dueDate: z.coerce.date().optional(),
  dueTime: z.string().min(1, {message: ' time is required.'}),
  isAttachment: z.boolean().default(false),
  minutes: z
    .string()
    .min(1, {message: 'Hours is required.'})
    .regex(/^(\d{1,2}(:[0-5]\d)?)$/, {
      message: 'Enter valid hours (e.g. 4 or 4:30)',
    }),
});

type FormValues = z.infer<typeof formSchema>;

const EmpProjectWorkAssign: React.FC = () => {
  const navigate = useNavigate();
  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      srNo: 0,
      name: '',
      description: '',
      assignedTo: '',
      reviewBy: '',
      status: '',
      priority: '',
      dueDate: undefined,
    },
  });

  const {
    empProjectWork,
    setEmpProjectWork,
    selectedProjectId,
    selectedDepartmentId,
    projectHeads,
    setSelectedDepartmentId,
  } = useAppContext();

  const {user} = useAuthContext();
  const {mutateAsync: addProjectWork} = useSaveProjectWorkByEmp();
  const {mutateAsync: updateProjectWork} = useUpdateProjectWorkByEmp();
  const [selectedEmp, setSelectedEmp] = useState('');
  const {data: allProject} = useGetEmpProject();
  const [selectedOption, setSelectedOption] = useState('add-new');
  const [isHeader, setIsHeader] = useState(false);
  const [higherSeniorityEmployees, setHigherSeniorityEmployees] = useState();
  const routerState = useRouterState();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<File[]>([]);
  const emp_work_id = routerState?.location?.state?.emp_work_id;
  const {data: workData} = useGetProjectWorkByIdByEmp(emp_work_id);
  const [dropdownProjectId, setSelectedProjectId] = useState('');
  const [localWorkData, setLocalWorkData] = useState<any[]>([]);
  const {mutateAsync: saveProjectWork} = useSaveProjectWorkInBulkByEmp();
  const [uploadError, setUploadError] = useState('');
  const {refetch} = useGetDepartmentWorkByEmp(
    selectedDepartmentId,
    dropdownProjectId,
    {enabled: false},
  );
  const [deptEmployees, setDeptEmployees] = useState<any[]>([]);
  const {data: deptEmp} = useGetProjectDepartEmpByHead(
    selectedProjectId,
    selectedDepartmentId,
  );
  const {data: lowerEmp} = useGetLowerEmpByEmpToProject(selectedProjectId!);

  useEffect(() => {
    if (projectHeads) {
      const isHead = projectHeads?.some(
        (each: any) => each.id === user?.employeeId,
      );

      setIsHeader(isHead);
    }
  }, [projectHeads, user]);
  useEffect(() => {
    if (emp_work_id) setSelectedOption('add-new');
  }, [emp_work_id]);

  useEffect(() => {
    if (isHeader) {
      const normalizedFilteredEmps = (deptEmp || []).map((emp: any) => ({
        id: emp.id,
        fullname: emp?.user?.fullname || 'Unknown',
        seniority: emp?.position?.seniority || 0,
      }));
      const merged = [...projectHeads, ...normalizedFilteredEmps];
      setDeptEmployees(merged);
    } else {
      if (lowerEmp) {
        const normalizedFilteredEmps = (lowerEmp || []).map((emp: any) => ({
          id: emp.id,
          fullname: emp?.user?.fullname || 'Unknown',
          seniority: emp?.position?.seniority || 0,
        }));
        setDeptEmployees(normalizedFilteredEmps);
      }
    }
  }, [deptEmp, lowerEmp, isHeader]);

  useEffect(() => {
    if (selectedDepartmentId && isHeader) {
      const fetchDeptEmployees = async () => {
        const res = await useGetProjectDepartEmpByHead(
          selectedProjectId,
          selectedDepartmentId,
        );
        const apiDeptEmp = res?.data || [];
        const normalizedFilteredEmps = (apiDeptEmp || []).map((emp: any) => ({
          id: emp.id,
          fullname: emp?.user?.fullname || 'Unknown',
          seniority: emp?.position?.seniority || 0,
        }));
        // Merge projectHeads + newly fetched employees
        const merged = [...projectHeads, ...normalizedFilteredEmps];
        setDeptEmployees(merged);
      };
      fetchDeptEmployees();
    }
  }, [selectedDepartmentId, isHeader]);

  useEffect(() => {
    if (dropdownProjectId) {
      refetch().then((res) => {
        setLocalWorkData(res.data || []);
      });
    } else {
      setLocalWorkData([]);
    }
  }, [dropdownProjectId]);

  console.log('emp pro workkkkk', workData);
  useEffect(() => {
    if (workData) {
      const attachmentImages =
        workData?.assignedDocuments?.map((doc: any) => doc?.document) || [];
      setExistingFiles(attachmentImages);
      methods.reset({
        assignedTo: workData?.assignedTo,
        description: workData?.description,
        dueDate: workData?.dueDate?.split('T')[0],
        dueTime: new Date(workData.dueDate).toTimeString().slice(0, 5),
        isAttachment: workData?.isAttachment,
        documentNote: workData?.documentNote,
        name: workData?.name,
        priority: workData?.priority,
        reviewBy: workData?.reviewBy,
        srNo: workData?.srNo,
        minutes: minutesToHours(workData?.minutes),
      });
      setSelectedDepartmentId(workData?.departmentId);
      setSelectedEmp(workData?.assignedTo);
    }
  }, [workData]);

  useEffect(() => {
    if (selectedEmp) {
      const selectedEmployee = deptEmp?.find((emp) => emp.id === selectedEmp);

      const filteredEmployees = selectedEmployee
        ? deptEmp.filter(
            (emp) =>
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

      setHigherSeniorityEmployees(combinedEmployees);
    }
  }, [selectedEmp, deptEmp, projectHeads]);

  const onSubmit = async (data: FormValues) => {
    const formatDateTime = (date: Date | string, time: string) => {
      const [hours, minutes] = time.split(':').map(Number);
      const d = new Date(date);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };
    const dateTime = formatDateTime(data?.dueDate, data.dueTime);
    try {
      if (emp_work_id) {
        await updateProjectWork({
          id: emp_work_id,
          data: {
            assignedTo: data.assignedTo,
            companyId: user?.companyId,
            description: data.description,
            name: data.name,
            priority: data.priority,
            projectId: selectedProjectId,
            minutes: hoursToMinutes(data.minutes),
            srNo: data.srNo,
            status: data.status,
            dueDate: dateTime,
            departmentId: isHeader ? selectedDepartmentId : user?.departmentId,
            reviewBy: data.reviewBy,
            isAttachment: data.isAttachment,
            documentNote: data?.documentNote,
            document: uploadedFiles,
            attachments: existingFiles,
          },
        });
      } else {
        await addProjectWork({
          assignedTo: data.assignedTo,
          companyId: user?.companyId,
          description: data.description,
          name: data.name,
          priority: data.priority,
          projectId: selectedProjectId,
          srNo: data.srNo,
          status: 'PENDING',
          dueDate: dateTime,
          reviewBy: data.reviewBy,
          reviewComment: '',
          departmentId: isHeader ? selectedDepartmentId : user?.departmentId,
          isAttachment: data?.isAttachment,
          documentNote: data?.documentNote,
          document: uploadedFiles,
          minutes: hoursToMinutes(data.minutes),
        });
      }

      methods.reset();
      setEmpProjectWork(false);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    setUploadError('');
  };

  const onSubmitCopyData = () => {
    const data = localWorkData?.map((each: any) => ({
      srNo: each?.srNo,
      name: each?.name,
      description: each?.description,
      status: 'PENDING',
      projectId: selectedProjectId,

      departmentId: selectedDepartmentId,
    }));

    // Send the array directly (no "works" wrapper)
    saveProjectWork(data || []);
    setEmpProjectWork(false);
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
      {empProjectWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-[#E0F2FE] px-6 py-4 dark:border-slate-700">
              {/* Title */}
              <div className="flex items-center gap-5">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                  {emp_work_id ? 'Edit Work' : 'Create Work'}
                </h2>

                {/* First Dropdown */}
                {!emp_work_id && (
                  <div className="flex items-center gap-3">
                    <select
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="relative z-20 w-32 appearance-none rounded-md border border-stroke px-4 py-1.5 outline-none transition dark:border-form-strokedark dark:bg-form-input"
                    >
                      <option>Select Type</option>
                      {isHeader && <option value="copy-sop">Copy Sop</option>}
                      <option value="add-new">Add New</option>
                    </select>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  setEmpProjectWork(false);
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="p-3">
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
                    onSubmit={methods.handleSubmit(onSubmit)}
                    className="space-y-6 rounded-xl bg-white shadow-sm"
                  >
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                      {emp_work_id && (
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
                      />
                      <GenericInputField
                        name="dueTime"
                        label="Due Time"
                        type="time"
                      />

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
                          label="Document Name"
                          placeholder="Enter Document Name"
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
                        onClick={() => setEmpProjectWork(false)}
                        className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                      >
                        Cancel
                      </button>
                      <GenericButton type="submit" className="min-w-[120px]">
                        Save
                      </GenericButton>
                    </div>
                  </form>
                </FormProvider>
              )}

              {/* 🔸 When 'Cop Sop' is selected → Show dropdown + list */}
              {selectedOption === 'cop-sop' && (
                <div className="space-y-3">
                  {/* Project dropdown */}
                  <select
                    value={dropdownProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="relative z-20 w-44 appearance-none rounded-md border border-stroke px-4 py-2 outline-none transition dark:border-form-strokedark dark:bg-form-input"
                  >
                    <option value="">Select Project</option>
                    {allProject?.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>

                  {/* Show list only if project selected */}
                  {dropdownProjectId ? (
                    <div className="border-t border-slate-200">
                      {/* Your table or work list here */}
                      {localWorkData?.length > 0 ? (
                        <table className="w-full border-collapse border border-slate-200 dark:border-slate-700">
                          <thead>
                            <tr className="bg-slate-100 text-left dark:bg-slate-700">
                              <th className="border px-4 py-2">#</th>
                              <th className="border px-4 py-2">Work Name</th>
                              <th className="border px-4 py-2">Description</th>
                              <th className="border px-4 py-2">Serial No</th>
                            </tr>
                          </thead>
                          <tbody>
                            {localWorkData.map((work: any, index: number) => (
                              <tr
                                key={work.id}
                                className="hover:bg-slate-50 dark:hover:bg-slate-700"
                              >
                                <td className="border px-4 py-2">
                                  {index + 1}
                                </td>
                                <td className="border px-4 py-2">
                                  {work.name}
                                </td>
                                <td className="border px-4 py-2">
                                  {work.description || '-'}
                                </td>
                                <td className="border px-4 py-2">
                                  {work.srNo || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p className="text-center text-slate-500">
                          No work data found for this project.
                        </p>
                      )}
                      <div className="flex justify-end pt-4">
                        <GenericButton onClick={onSubmitCopyData}>
                          Copy Works
                        </GenericButton>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-500">
                      Please select a project to view works.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpProjectWorkAssign;
