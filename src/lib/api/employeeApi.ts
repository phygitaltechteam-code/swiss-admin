import {api} from '@/utils/axios';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Types
export type EmployeePayload = {
  name: string;
  phoneNumber: string;
  address: string;
  password?: string;
  role?: 'EMPLOYEE';
};

export type Employee = {
  id: string;
  userId: string;
  address: string;
  positionId: string;
  departmentId: string;
  salary: number;
  advance: number;
  birthday: Date;
  anniversary: Date;
  joiningDate: Date;
  user: {
    id: string;
    fullname: string;
    phoneNumber: string;
    email: string;
    username: string;
    password: string;
    emergencyContactName: string;
    secondaryPhoneNumber: string;
  };
};

//get list display
export const getEmployeeProject = async (id: string) => {
  const response = await api.get(`company/work/project/employee/${id}`);
  console.log('getdatataa', response);
  return response.data;
};
//get daily display
export const getEmployeeDailyWork = async (id: string) => {
  const response = await api.get(`company/dailyWork/employee/${id}`);
  console.log('data', response);
  return response.data;
};
// GET
export const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await api.get(`/company/employee`);
  console.log(response.data);
  return response.data;
};

export const fetchLowerSenorityEmp = async () => {
  const response = await api.get(`/employee/employee/all`);
  console.log(response.data);
  return response.data;
};

export const getProjectWiseEmployees = async (
  deptId: string,
  proId: string,
): Promise<Employee[]> => {
  const response = await api.get(`/company/work/project/${deptId}/${proId}`);
  console.log(response.data);
  return response.data;
};

export const getEmpProjects = async () => {
  const response = await api.get(`/employee/project`);
  console.log(response.data);
  return response.data;
};

export const getAllProjectWorkByEmp = async (projectId: string) => {
  const response = await api.get(`employee/work/byproject/${projectId}`);
  console.log(response.data);
  return response.data;
};

export const getAllProjectWorkEmpDash = async (projectId: string) => {
  const response = await api.get(`employee/work/dashboard/${projectId}`);
  console.log(response.data);
  return response.data;
};

export const useAllProjectWorkEmpDash = (
  projectId: string,
  options: any = {},
) =>
  useQuery({
    queryKey: ['pro_work_emp_dash'],
    queryFn: () => getAllProjectWorkEmpDash(projectId),
    ...options,
  });
export const useAllProjectWorkByEmp = (projectId: string, options: any = {}) =>
  useQuery({
    queryKey: ['pro_work_emp'],
    queryFn: () => getAllProjectWorkByEmp(projectId),
    ...options,
  });

export const useLowerseniorityEmp = () =>
  useQuery({
    queryKey: ['lower_emp'],
    queryFn: () => fetchLowerSenorityEmp(),
  });

export const useEmployees = () =>
  useQuery({
    queryKey: ['employees'],
    queryFn: () => fetchEmployees(),
  });
export const useGetEmpProject = () =>
  useQuery({
    queryKey: ['emp_project'],
    queryFn: () => getEmpProjects(),
  });

export const useProjectWiseEmployees = (deptId: string, proId: string) =>
  useQuery({
    queryKey: ['pro_employees'],
    queryFn: () => getProjectWiseEmployees(deptId, proId),
  });

// CREATE
export const useCreateEmployee = (roleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EmployeePayload) =>
      api.post(`/company/employee`, {...data, role: 'EMPLOYEE'}),

    onSuccess: () => {
      toast.success('Employee created successfully');
      queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
    },
    onError: () => {
      toast.error('Failed to create employee');
    },
  });
};

// DELETE
export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/company/employee/${id}`),
    onSuccess: () => {
      toast.success('Employee deleted');
      queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
    },

    onError: () => {
      toast.error('Failed to delete employee');
    },
  });
};

// UPDATE
export const useUpdateEmployee = (roleId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, data}: {id: string; data: EmployeePayload}) =>
      api.put(`/company/employee/${id}`, data),
    onSuccess: () => {
      toast.success('Employee updated successfully');
      queryClient.invalidateQueries({
        queryKey: ['employees'],
      });
    },
    onError: () => {
      toast.error('Failed to update employee');
    },
  });
};

//Get Employee Work List by Employee ID
export const fetchEmployeeWorkList = async (
  projectId: string,
  employeeId: string,
) => {
  const response = await api.get(
    `/company/work/emp/${projectId}/${employeeId}`,
  );
  return response.data;
};

export const getEmpAllProjectWork = async () => {
  const response = await api.get(`employee/work/project/employee`);
  return response.data;
};

export const fetchEmployeeDailyWorkList = async () => {
  const response = await api.get(`/employee/dailywork`);
  console.log('FULL API RESPONSE:', response.data);

  return response.data;
};

export const fetchDeptWorkList = async (
  projectId: string,
  employeeId: string,
) => {
  const response = await api.get(
    `/company/work/dept/${projectId}/${employeeId}`,
  );
  return response.data;
};
//get list display
export const useEmployeeProject = (id: string) =>
  useQuery({
    queryKey: ['employeeproject', id],
    queryFn: () => getEmployeeProject(id),
  });
export const useEmployeeDailyWork = (id: string) =>
  useQuery({
    queryKey: ['employeedailywork', id],
    queryFn: () => getEmployeeDailyWork(id),
  });
export const useEmployeeAllProWork = () =>
  useQuery({
    queryKey: ['employeeWorkList_pro'],
    queryFn: () => getEmpAllProjectWork(),
  });
export const useEmployeeWorkList = (projectId: string, employeeId: string) =>
  useQuery({
    queryKey: ['employeeWorkList', employeeId],
    queryFn: () => fetchEmployeeWorkList(projectId, employeeId),
    enabled: !!employeeId,
  });
export const useEmployeeDailyWorkList = () =>
  useQuery({
    queryKey: ['employeDailyList'],
    queryFn: () => fetchEmployeeDailyWorkList(),
  });

export const useDepartmentWorkList = (projectId: string, employeeId: string) =>
  useQuery({
    queryKey: ['deptWorkList', employeeId],
    queryFn: () => fetchDeptWorkList(projectId, employeeId),
    enabled: !!employeeId,
  });

//Work Complete
export const completeWork = async (
  workId: string,
  data: {status: string; completedOn: string},
) => {
  const response = await api.put(`/employee/work/${workId}`, data);
  return response.data;
};

export const useCompleteWork = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      workId,
      data,
    }: {
      workId: string;
      data: {status: string; completedOn: string};
    }) => completeWork(workId, data),
    onSuccess: () => {
      toast.success('Work completed successfully');
      queryClient.invalidateQueries({
        queryKey: ['employeeWorkList'],
      });
    },
    onError: () => {
      toast.error('Failed to complete work');
    },
  });
};

//Get Function by Employee ID
export const fetchEmployeeFunctions = async (employeeId: string) => {
  const response = await api.get(`/employee/dashboard/${employeeId}`);
  return response.data;
};

export const useEmployeeFunctions = (employeeId: string) =>
  useQuery({
    queryKey: ['employeeFunctions', employeeId],
    queryFn: () => fetchEmployeeFunctions(employeeId),
    enabled: !!employeeId,
  });

export const useGetDeptEmp = (deptId: string, options?: {enabled?: boolean}) =>
  useQuery({
    queryKey: ['employeeFunctions', deptId],
    queryFn: () => fetchDepartmentEmp(deptId),
    enabled: options?.enabled ?? !!deptId,
  });

export const useGetDeptEmpByHead = (
  deptId: string,
  options?: {enabled?: boolean},
) =>
  useQuery({
    queryKey: ['employeeFunctions', deptId],
    queryFn: () => getDeptEmpByHead(deptId),
    enabled: options?.enabled ?? !!deptId,
  });

export const fetchDepartmentEmp = async (dept: string) => {
  console.log('dept id in api', dept);
  const response = await api.get(`/company/employee/department/${dept}`);
  return response.data;
};

export const getDeptEmpByHead = async (dept: string) => {
  console.log('dept id in api', dept);
  const response = await api.get(`/employee/employee/department`);
  return response.data;
};

export const useGetLowerEmpByEmpToProject = (
  proId: string,
  options?: {enabled?: boolean},
) =>
  useQuery({
    queryKey: ['lower_Emp_pro', proId],
    queryFn: () => getLowerEmpByEmpToProject(proId),
    enabled: options?.enabled ?? !!proId,
  });

export const getLowerEmpByEmpToProject = async (proId: string) => {
  const response = await api.get(`/employee/employee/project/${proId}`);
  return response.data;
};
