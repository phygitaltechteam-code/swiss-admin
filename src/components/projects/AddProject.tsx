// export default AddProject;
import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
  useForm,
  FormProvider,
  useFieldArray,
  useFormContext,
} from 'react-hook-form';
import {z} from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {useAuthContext} from '@/context/AuthContext';
import {useNavigate, useRouterState} from '@tanstack/react-router';
import {useAppContext} from '../common/PopUp';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import GenericDropdown from '../Forms/DropDown/GenericDropDown';
import {useGetCompanyDepartment} from '@/lib/react-query/companyDepartment';
import {useEmployees} from '@/lib/api/employeeApi';
import {
  useDeleteProject,
  useGetProject,
  useGetProjectById,
  useSaveProject,
  useUpdateProject,
} from '@/lib/react-query/project';
import GenericMultiselectDropdown from '../Forms/SearchDropDown/GenericMultiselectDropdown';
import {getAllCompanyDepartmentById} from '@/lib/api/companyDepartment';
import GenericTable, {Column} from '../Forms/Table/GenericTable';
import GenericNewTable from '../Forms/Table/GenericNewTable';
import MultiSelect from '../Forms/DropDown/NewMultiSelect';
import {
  useGetProjectWorkById,
  useSaveProjectWorkInBulk,
} from '@/lib/react-query/projectWork';
import CopySopSection from '../work/CopySopSection';
import CopySopModal from '../work/CopySopSection';

type ProjectRow = {
  id: string;
  name: string;
  priority: string;
  startDate: string;
  endDate: string;
};

export const ProjectSchema = z
  .object({
    name: z.string().min(1, {message: 'Name is required.'}),
    description: z.string().optional(),
    priority: z.string().min(1, {message: 'Priority is required.'}),
    startTime: z.string().min(1, {message: 'Start time is required.'}),
    endTime: z.string().min(1, {message: 'End time is required.'}),
    startDate: z.preprocess(
      (val) => (typeof val === 'string' ? new Date(val) : val),
      z.date({required_error: 'Start date is required.'}),
    ),
    endDate: z.preprocess(
      (val) => (typeof val === 'string' ? new Date(val) : val),
      z.date({required_error: 'End date is required.'}),
    ),
    projectHeads: z
      .array(z.string().min(1))
      .min(1, {message: 'Select at least one project head.'}),
    departmentsAndEmployees: z
      .array(
        z.object({
          departmentId: z.string().min(1, {message: 'Department is required.'}),
          employeeIds: z
            .array(z.string().min(1))
            .min(1, {message: 'Select at least one employee.'}),
        }),
      )
      .optional(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: 'Start date must be before end date.',
    path: ['endDate'],
  });
type FormValues = z.infer<typeof ProjectSchema>;

const AddProject: React.FC = () => {
  const {user} = useAuthContext();
  const now = new Date();

  const methods = useForm<FormValues>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      startDate: now.toISOString().split('T')[0],
      startTime: now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      departmentsAndEmployees: [],
      projectHeads: [],
    },
  });
  const [showCopyModal, setShowCopyModal] = useState(false);
  const {setSelectedProjectId} = useAppContext();
  const {data: allProject, isLoading: isLoadingProjects} = useGetProject();
  const [sortedProjects, setSortedProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [projectFilter, setProjectFilter] = useState('');
  const navigate = useNavigate();
  const routerState = useRouterState();
  const {data: allDepartment = []} = useGetCompanyDepartment();
  const {data: allEmployees = []} = useEmployees();
  const {mutateAsync: addProject} = useSaveProject();
  const {mutateAsync: updateProject} = useUpdateProject();
  const [showForm, setShowForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const {data: projectData, isLoading: isLoadingProject} = useGetProjectById(
    editingProjectId,
    {
      enabled: !!editingProjectId && showForm,
    },
  );
  const [dropdownProjectId, setCopyProjectId] = useState('');
  const {refetch} = useGetProjectWorkById(dropdownProjectId, {enabled: false});
  const [localWorkData, setLocalWorkData] = useState<any[]>([]);
  const {mutateAsync: saveProjectWorkInBulk} = useSaveProjectWorkInBulk();

  console.log('edit workkkkk workkkk/////', projectData);
  const {mutateAsync: deleteProject} = useDeleteProject();
  const [employeesByDept, setEmployeesByDept] = useState<Record<number, any[]>>(
    {},
  );

  const {control, watch, setValue, reset} = methods;
  const {fields, append, remove} = useFieldArray({
    control,
    name: 'departmentsAndEmployees',
  });

  // Memoized formated data to prevent recalculation on every render
  const formatedData = useMemo(() => {
    return (
      allProject?.map((each: any) => {
        const formattedStart = new Date(each?.startDate).toLocaleDateString(
          'en-GB',
          {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          },
        );

        const formattedEnd = new Date(each?.endDate).toLocaleDateString(
          'en-GB',
          {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          },
        );

        return {
          id: each.id,
          name: each?.name,
          priority: each?.priority,
          status: each.status,
          createdAt: each.createdAt,
          rawStartDate: each?.startDate,
          rawEndDate: each?.endDate,
          startDate: formattedStart,
          endDate: formattedEnd,
          headsNames:
            each?.heads?.map((h: any) => h.fullname).join(', ') || '-',
          duration: `${formattedStart} - ${formattedEnd}`,
        };
      }) || []
    );
  }, [allProject]);

  // Memoized sorting to prevent recalculation
  const sortedFormatedData = useMemo(() => {
    if (!formatedData.length) return [];

    const priorityOrder: Record<string, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    return [...formatedData].sort((a, b) => {
      const endDateDiff =
        new Date(a.rawEndDate).getTime() - new Date(b.rawEndDate).getTime();

      if (endDateDiff === 0) {
        const aPriority = a.priority?.trim().toLowerCase();
        const bPriority = b.priority?.trim().toLowerCase();
        return (
          (priorityOrder[bPriority] || 0) - (priorityOrder[aPriority] || 0)
        );
      }

      return endDateDiff;
    });
  }, [formatedData]);

  useEffect(() => {
    if (dropdownProjectId) {
      refetch().then((res) => {
        setLocalWorkData(res.data || []);
      });
    } else {
      setLocalWorkData([]);
    }
  }, [dropdownProjectId]);
  // Set sorted projects only when sortedFormatedData changes
  useEffect(() => {
    if (sortedFormatedData.length) {
      setSortedProjects(sortedFormatedData);
    }
  }, [sortedFormatedData]);

  // Optimized department change handler with useCallback
  const handleDepartmentChange = useCallback(
    async (deptId: string, index: number) => {
      if (!deptId) {
        setEmployeesByDept((prev) => ({
          ...prev,
          [index]: [],
        }));
        return;
      }

      try {
        const response = await getAllCompanyDepartmentById(deptId);
        const employees = response?.employee || [];

        setEmployeesByDept((prev) => ({
          ...prev,
          [index]: employees.map((e: any) => ({
            label: e.user?.fullname,
            value: e.id,
          })),
        }));
      } catch (error) {
        console.error('Error fetching department employees:', error);
        setEmployeesByDept((prev) => ({
          ...prev,
          [index]: [],
        }));
      }
    },
    [],
  );

  // Optimized remove row handler
  const handleRemoveRow = useCallback(
    (index: number) => {
      remove(index);

      setEmployeesByDept((prev) => {
        const updated: Record<number, any[]> = {};
        Object.keys(prev).forEach((key) => {
          const oldIndex = Number(key);
          if (oldIndex < index) {
            updated[oldIndex] = prev[oldIndex];
          } else if (oldIndex > index) {
            updated[oldIndex - 1] = prev[oldIndex];
          }
        });
        return updated;
      });
    },
    [remove],
  );
  const onSubmitCopyData = () => {
    const data = localWorkData?.map((each: any) => ({
      srNo: each?.srNo,
      name: each?.name,
      description: each?.description,
      status: 'PENDING',
      projectId: dropdownProjectId,
      minutes: each?.minutes,
    }));

    saveProjectWorkInBulk(data || []);
  };

  const columns: Column<ProjectRow>[] = useMemo(
    () => [
      {
        header: 'Name',
        accessor: 'name',
        sortable: true,
        render: (row) => (
          <span
            onClick={() => {
              navigate({to: `/project/projectdetails/${row.id}`});
              setSelectedProjectId(row.id);
            }}
            className="cursor-pointer text-[#0284C7] hover:underline"
          >
            {row.name}
          </span>
        ),
      },
      {header: 'Priority', accessor: 'priority'},
      {header: 'Duration', accessor: 'duration'},
      {
        header: 'Heads',
        accessor: 'headsNames',
      },
      {header: 'Created At', accessor: 'createdAt'},
      {header: 'Status', accessor: 'status'},
    ],
    [navigate, setSelectedProjectId],
  );

  const getLocalTime = useCallback((value: string) => {
    if (!value) return '';

    const date = new Date(value);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }, []);

  useEffect(() => {
    const fetchEmployeesForDepartments = async () => {
      if (editingProjectId && projectData && !isLoadingProject) {
        const groupedDepartments: Record<string, string[]> = {};

        projectData.employees?.forEach((emp: any) => {
          if (!groupedDepartments[emp.departmentId]) {
            groupedDepartments[emp.departmentId] = [];
          }
          groupedDepartments[emp.departmentId].push(emp.id);
        });

        console.log("groupeddd departmentss",groupedDepartments)
        const departmentsAndEmployees = Object.keys(groupedDepartments).map(
          (departmentId) => ({
            departmentId,
            employeeIds: groupedDepartments[departmentId],
          }),
        );

        // Fetch all employees for each department
        const prefilledEmployeesByDept: Record<number, any[]> = {};
        const departmentPromises = Object.keys(groupedDepartments).map(
          async (deptId, index) => {
            try {
              const response = await getAllCompanyDepartmentById(deptId);
              const allEmployees = response?.employee || [];

              prefilledEmployeesByDept[index] = allEmployees.map((e: any) => ({
                label: e.user?.fullname,
                value: e.id,
              }));
            } catch (error) {
              console.error(
                `Error fetching department ${deptId} employees:`,
                error,
              );
              prefilledEmployeesByDept[index] = [];
            }
          },
        );

        await Promise.all(departmentPromises);
        setEmployeesByDept(prefilledEmployeesByDept);

        reset({
          name: projectData.name || '',
          description: projectData.description || '',
          priority: projectData.priority || '',
          startDate: projectData.startDate
            ? new Date(projectData.startDate).toISOString().split('T')[0]
            : '',
          endDate: projectData.endDate
            ? new Date(projectData.endDate).toISOString().split('T')[0]
            : '',
          startTime: projectData.startDate
            ? getLocalTime(projectData.startDate)
            : '',
          endTime: projectData.endDate ? getLocalTime(projectData.endDate) : '',
          projectHeads: projectData.heads?.map((e: any) => e.id) || [],
          departmentsAndEmployees,
        });
      }
    };

    fetchEmployeesForDepartments();
  }, [editingProjectId, projectData, isLoadingProject, reset, getLocalTime]);

  const onSubmit = async (data: FormValues) => {
    console.log('Project data:', data);
    try {
      const formatDateTime = (date: Date | string, time: string) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
          d.getDate(),
        ).padStart(2, '0')}T${time}:00`;
      };

      const startDateTime = formatDateTime(data.startDate, data.startTime);
      const endDateTime = formatDateTime(data.endDate, data.endTime);

      const departmentIds = data?.departmentsAndEmployees?.map(
        (item) => item.departmentId,
      );

      const employeeIds = data?.departmentsAndEmployees?.flatMap(
        (item) => item.employeeIds,
      );

      const payload = {
        name: data.name,
        description: data.description || '',
        priority: data.priority,
        startDate: startDateTime,
        endDate: endDateTime,
        departmentIds,
        employeeIds,
        projectHeads: data.projectHeads,
      };

      console.log('🧾 Final project payload:', payload);

      if (editingProjectId) {
        await updateProject({id: editingProjectId, data: payload});
        toast.success('Project updated successfully');
      } else {
        await addProject(payload);
        toast.success('Project created successfully');
      }

      reset();
      setShowForm(false);
      setEditingProjectId(null);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    }
  };

  // Fix: Memoized filtered projects
  const filteredProjects = useMemo(() => {
    return sortedProjects.filter((project: any) => {
      const statusMatch = statusFilter ? project.status === statusFilter : true;
      const priorityMatch = priorityFilter
        ? project.priority === priorityFilter
        : true;
      const projectMatch = projectFilter ? project.id === projectFilter : true;

      return statusMatch && priorityMatch && projectMatch;
    });
  }, [sortedProjects, statusFilter, priorityFilter, projectFilter]);

  // Fix: Memoized getAvailableDepartments
  const getAvailableDepartments = useCallback(
    (currentIndex: number) => {
      const selectedDepartments =
        watch('departmentsAndEmployees')
          ?.map((item) => item?.departmentId)
          .filter(Boolean) || [];

      const currentDept = selectedDepartments[currentIndex];
      return allDepartment.filter(
        (dept: any) =>
          dept.id === currentDept || !selectedDepartments.includes(dept.id),
      );
    },
    [watch, allDepartment],
  );

  const handleEdit = useCallback((row: ProjectRow) => {
    setEditingProjectId(row.id);
    setShowForm(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmed = window.confirm(
        'Are you sure you want to delete this project?',
      );
      if (confirmed) {
        try {
          await deleteProject(id);
          toast.success('Project deleted successfully');
        } catch (error) {
          toast.error('Failed to delete project');
        }
      }
    },
    [deleteProject],
  );

  const selectedProjectHeads = watch('projectHeads');

  // Fix: Optimized useEffect for selected project heads
  useEffect(() => {
    if (!selectedProjectHeads?.length) {
      setValue('departmentsAndEmployees', []);
      setEmployeesByDept({});
      return;
    }

    const headsByDepartment: Record<string, string[]> = {};

    selectedProjectHeads.forEach((headId: string) => {
      const employee = allEmployees.find((e: any) => e.id === headId);
      if (!employee) return;

      if (!headsByDepartment[employee.departmentId]) {
        headsByDepartment[employee.departmentId] = [];
      }

      headsByDepartment[employee.departmentId].push(employee.id);
    });

    const departmentRows = Object.keys(headsByDepartment).map(
      (departmentId) => ({
        departmentId,
        employeeIds: headsByDepartment[departmentId],
      }),
    );

    setValue('departmentsAndEmployees', departmentRows);

    // Load employees for each department
    const loadEmployees = async () => {
      const deptEmployeesMap: Record<number, any[]> = {};

      const loadPromises = departmentRows.map(async (row, index) => {
        try {
          const response = await getAllCompanyDepartmentById(row.departmentId);
          const employees = response?.employee || [];

          deptEmployeesMap[index] = employees.map((e: any) => ({
            label: e.user?.fullname,
            value: e.id,
          }));
        } catch (error) {
          console.error(
            `Error fetching employees for department ${row.departmentId}:`,
            error,
          );
          deptEmployeesMap[index] = [];
        }
      });

      await Promise.all(loadPromises);
      setEmployeesByDept(deptEmployeesMap);
    };

    loadEmployees();
  }, [selectedProjectHeads, allEmployees, setValue]);

  const handleBack = useCallback(() => {
    setShowForm(false);
    setEditingProjectId(null);
    reset({
      departmentsAndEmployees: [],
      description: '',
      endDate: '',
      endTime: '',
      name: '',
      priority: '',
      projectHeads: [],
      startDate: '',
      startTime: '',
    });
    setEmployeesByDept({});
  }, [reset]);

  if (isLoadingProjects && !showForm) {
    return <div>Loading projects...</div>;
  }

  return (
    <div className="mx-auto w-full p-4 sm:p-6">
      <div className="flex items-center justify-end">
        {!showForm && (
          <div className="mb-3 flex items-center justify-between gap-2">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border-gray-300 text-gray-700 rounded-md border border-stroke bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Priority</option>
              <option value="High">HIGH</option>
              <option value="Medium">MEDIUM</option>
              <option value="Low">LOW</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border-gray-300 text-gray-700 rounded-md border border-stroke bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Status</option>
              <option value="PENDING">PENDING</option>
              <option value="STARTED">STARTED</option>
              <option value="WORKING">WORKING</option>
              <option value="DONE">DONE</option>
              <option value="DELAYED">DELAYED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="border-gray-300 text-gray-700 rounded-md border border-stroke bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Project</option>
              {sortedProjects.map((project: any) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>

            <GenericButton onClick={() => setShowForm(true)}>
              + Add New
            </GenericButton>
          </div>
        )}
      </div>
      {showForm ? (
        <div className="w-full overflow-y-auto bg-white shadow-sm dark:bg-boxdark">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
            <div className="flex items-center gap-2">
              {' '}
              <button onClick={handleBack} className="font-bold" type="button">
                ←
              </button>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white sm:text-xl">
                {editingProjectId ? 'Edit Project' : 'Create Project'}
              </h2>
            </div>

            {editingProjectId && (
              <div>
                <label className="text-sm font-medium">Copy Sop: </label>
                <select
                  value={dropdownProjectId}
                  onChange={(e) => setCopyProjectId(e.target.value)}
                  className="relative z-20 w-44 appearance-none rounded-md border border-stroke px-4 py-2 outline-none transition dark:border-form-strokedark dark:bg-form-input"
                >
                  <option value="">Select Project</option>
                  {allProject?.map((project: any) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="p-6">
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-3"
              >
                {/* 🔹 Project Info */}
                <div className="">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <GenericInputField
                      name="name"
                      required
                      label="Project Name"
                      placeholder="Enter Project Name"
                    />

                    <GenericInputField
                      name="description"
                      label="Description"
                      placeholder="Enter Project Description"
                    />

                    <GenericDropdown
                      name="priority"
                      required
                      label="Priority"
                      options={[
                        {label: 'High', value: 'High'},
                        {label: 'Medium', value: 'Medium'},
                        {label: 'Low', value: 'Low'},
                      ]}
                    />

                    <GenericInputField
                      name="startDate"
                      required
                      label="Start Date"
                      type="date"
                    />

                    <GenericInputField
                      name="endDate"
                      required
                      label="End Date"
                      type="date"
                    />
                    <GenericInputField
                      name="startTime"
                      required
                      label="Start Time"
                      type="time"
                    />
                    <GenericInputField
                      name="endTime"
                      required
                      label="End time"
                      type="time"
                    />

                    <GenericMultiselectDropdown
                      name="projectHeads"
                      required
                      label="Project Heads"
                      options={allEmployees.map((e: any) => ({
                        label: e.user?.fullname,
                        value: e.id,
                      }))}
                    />
                  </div>
                </div>

                <div className="rounded-md border border-stroke p-2">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                      Departments & Employees
                    </h3>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() =>
                          append({
                            departmentId: '',
                            employeeIds: [],
                          })
                        }
                        className="rounded-lg bg-[#0284C7] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0270a7]"
                      >
                        + Add Row
                      </button>
                    </div>
                  </div>

                  {/* Table header */}
                  <div className="text-gray-600 mt-2 grid grid-cols-12 gap-4 px-4 text-sm font-medium">
                    <div className="col-span-5">Department</div>
                    <div className="col-span-5">Employees</div>
                    <div className="col-span-2"></div>
                  </div>

                  {/* Rows */}
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="bg-gray-50 grid grid-cols-12 items-center gap-4 rounded-lg border-b border-stroke px-4 py-3 dark:bg-slate-800/30"
                    >
                      <div className="col-span-5">
                        <GenericDropdown
                          name={`departmentsAndEmployees.${index}.departmentId`}
                          label=""
                          options={getAvailableDepartments(index).map(
                            (d: any) => ({
                              label: d.name,
                              value: d.id,
                            }),
                          )}
                          onChange={(selectedValue: string) =>
                            handleDepartmentChange(selectedValue, index)
                          }
                        />
                      </div>

                      <div className="col-span-5 dark:bg-slate-800">
                        <MultiSelect
                          options={employeesByDept[index] || []}
                          value={
                            Array.isArray(
                              watch(
                                `departmentsAndEmployees.${index}.employeeIds`,
                              ),
                            )
                              ? watch(
                                  `departmentsAndEmployees.${index}.employeeIds`,
                                )
                              : []
                          }
                          onChange={(selected) =>
                            setValue(
                              `departmentsAndEmployees.${index}.employeeIds`,
                              selected,
                            )
                          }
                          disabled={
                            !watch(
                              `departmentsAndEmployees.${index}.departmentId`,
                            )
                          }
                        />
                      </div>

                      <div className="col-span-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(index)}
                          className="font-medium text-red-500 hover:text-red-700"
                          aria-label="Remove row"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end border-slate-100 pt-4 dark:border-slate-700">
                  <GenericButton type="submit" className="min-w-[120px]">
                    {editingProjectId ? 'Update' : 'Save'}
                  </GenericButton>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      ) : (
        <div className="bg-white px-4 pt-2 dark:bg-boxdark">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Project List
          </h2>
          {isLoadingProjects ? (
            <div>Loading projects...</div>
          ) : (
            <GenericNewTable
              data={filteredProjects}
              columns={columns}
              onDelete={(row) => handleDelete(row.id)}
              onEdit={(row) => handleEdit(row)}
            />
          )}
        </div>
      )}
      <CopySopModal
        dropdownProjectId={dropdownProjectId}
        setSelectedProjectId={setCopyProjectId}
        allProject={allProject}
        localWorkData={localWorkData}
        setLocalWorkData={setLocalWorkData}
        onSubmitCopyData={onSubmitCopyData}
      />
    </div>
  );
};

export default AddProject;
