import {useQuery} from '@tanstack/react-query';
import {
  fetchProDeptWorkListByEmp,
  getProjectDepartmentEmpByHead,
  getProjectInfoByEmpById,
  getProjectLowerEmpWork,
} from '../api/empProject';

export const useGetProjectInfoByEmpById = (id: string) =>
  useQuery({
    queryKey: ['project_info_emp', id],
    queryFn: () => getProjectInfoByEmpById(id),
  });

export const useGetProjectLowerEmpWork = (id: string) =>
  useQuery({
    queryKey: ['project_work_emp', id],
    queryFn: () => getProjectLowerEmpWork(id),
  });

export const useGetProjectDepartEmpByHead = (proId: string, deptId: string) =>
  useQuery({
    queryKey: ['project_dept_empBy_head'],
    queryFn: () => getProjectDepartmentEmpByHead(proId, deptId),
  });

export const useProDepartmentWorkByEmp = (projectId: string, deptId: string) =>
  useQuery({
    queryKey: ['emp_pro_dept', deptId],
    queryFn: () => fetchProDeptWorkListByEmp(projectId, deptId),
    enabled: !!deptId,
  });
