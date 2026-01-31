import React, {useEffect, useState} from 'react';
import {Users, Flag, Target, Clock, ArrowLeft} from 'lucide-react';
import {useAppContext} from '../common/PopUp';
import {useNavigate} from '@tanstack/react-router';
import {Route} from '@/routes/_app/employee/empprojectdetails.$id';
import EmpAllProjectDetails from './EmpAllProjectDetails';
import {useGetProjectInfoByEmpById} from '@/lib/react-query/empProject';
import AllEmpWork from './AllEmpWork';
import {useAuthContext} from '@/context/AuthContext';
import AllLowerEmpWorkInProject from './AllLowerEmpWorkInProject';
import AllDepartmentWorkByEmp from './AllDepartmentWorkByEmp';

const EmpProjectDetails = () => {
  const {setSelectedProjectId} = useAppContext();
  const {user} = useAuthContext();
  const [isHeader, setIsHeader] = useState(false);
  const navigate = useNavigate();
  const {id} = Route.useParams();
  const {setDeptEmp, setProjectHeads, setSelectedDepartmentId} =
    useAppContext();
  const {data: projectInfo} = useGetProjectInfoByEmpById(id);
  console.log('project info', projectInfo);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (projectInfo && projectInfo.heads) {
      const isHead = projectInfo?.heads?.some(
        (each: any) => each.id === user?.employeeId,
      );

      setIsHeader(isHead);
    }
  }, [projectInfo, user]);

  useEffect(() => {
    if (id) {
      setSelectedProjectId(id);
    }
  }, [id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (projectInfo?.employees?.length) {
      const groupedByDepartment = projectInfo?.employees.reduce((acc, emp) => {
        if (!acc[emp.departmentId]) {
          acc[emp.departmentId] = [];
        }
        acc[emp.departmentId].push({
          id: emp.id,
          fullname: emp.fullname,
          seniority: emp.position?.seniority || 0,
        });
        return acc;
      }, {});
      setDeptEmp(groupedByDepartment);
    }
  }, [projectInfo]);

  useEffect(() => {
    if (projectInfo?.heads?.length) {
      const formatedd = projectInfo?.heads.map((each) => ({
        id: each.id,
        fullname: each.fullname,
        seniority: each.position?.seniority || 0,
      }));
      setProjectHeads(formatedd);
    }
  }, [projectInfo]);

  const [filterType, setFilterType] = useState('all');
  const [selectedEmp, setSelectedEmp] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDeptToEditEmpWork, setSelectedDeptToEditEmpWork] =
    useState('');

  return (
    <div className="dark:from-gray-900 min-h-screen bg-white dark:via-blue-950/20 dark:to-indigo-950/10">
      <div className="mx-auto p-4 sm:p-6">
        {/* Header with Glass Effect */}
        <div className="">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
          >
            <div className="dark:bg-gray-800/80 dark:group-hover:bg-gray-800 flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 backdrop-blur-xl transition-all group-hover:bg-white group-hover:shadow-xl sm:h-10 sm:w-10 sm:rounded-2xl">
              <ArrowLeft className="text-gray-600 dark:text-gray-300 h-4 w-4 transition-transform group-hover:-translate-x-1 sm:h-5 sm:w-5" />
            </div>
            <span className="text-gray-700 dark:text-gray-200 text-sm font-semibold sm:text-base">
              Back to Projects
            </span>
          </button>

          {/* Project Header */}
          <div
            className="relative min-h-[140px] overflow-hidden p-4 shadow-2xl sm:min-h-[180px] sm:rounded-t-xl sm:p-8"
            style={{background: '#0284C7'}}
          >
            {/* Project Leads - Mobile: moved below, Desktop: top right */}
            <div className="absolute right-4 top-4 hidden items-start gap-4 sm:flex">
              <div className="scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent hover:scrollbar-thumb-white/50 max-h-[150px] overflow-y-auto rounded-2xl bg-white/10 p-4 shadow-2xl backdrop-blur-xl">
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-200" />
                  <h3 className="text-sm font-semibold text-white">
                    Project Leads
                  </h3>
                </div>

                <div className="flex flex-col gap-1.5">
                  {projectInfo?.heads?.length > 0 ? (
                    projectInfo.heads.map((head) => (
                      <div
                        key={head.id}
                        className="flex items-center gap-2 rounded-lg px-2 py-1 transition-all hover:bg-white/30"
                      >
                        <span className="text-xs font-medium text-white">
                          {head.fullname}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="py-1 text-center text-xs italic text-blue-200">
                      No project heads assigned
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Main Header Content */}
            <div className="relative z-10 pt-2 sm:pt-6">
              <div className="flex items-start gap-4 sm:gap-6">
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-xl sm:h-16 sm:w-16 sm:rounded-2xl">
                  <Target className="h-6 w-6 text-white sm:h-8 sm:w-8" />
                </div>

                {/* Text Content */}
                <div className="flex-1 text-white">
                  <h1 className="mb-2 text-2xl font-bold sm:mb-3 sm:text-3xl lg:text-4xl">
                    {projectInfo?.name}
                  </h1>

                  {/* Description + Time + Priority (all inline) */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-blue-100 sm:text-base lg:text-lg">
                    <p className="max-w-2xl">
                      {projectInfo?.description ||
                        'Strategic project implementation with cross-functional team collaboration'}
                    </p>

                    {/* Time */}
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-100" />
                      <span>
                        {projectInfo?.startDate?.split('T')[0] || '2 Weeks'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 capitalize">
                      <Flag className="h-4 w-4 text-blue-100" />
                      <span>{projectInfo?.priority || 'High'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Leads - Mobile Version */}
            <div className="mt-4 sm:hidden">
              <div className="rounded-xl bg-white/10 p-3 shadow-2xl backdrop-blur-xl">
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-200" />
                  <h3 className="text-sm font-semibold text-white">
                    Project Leads
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {projectInfo?.heads?.length > 0 ? (
                    projectInfo.heads.map((head) => (
                      <span
                        key={head.id}
                        className="rounded-lg bg-white/20 px-2 py-1 text-xs font-medium text-white"
                      >
                        {head.fullname}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs italic text-blue-200">
                      No project heads assigned
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isHeader ? (
          <>
            <div className="dark:bg-gray-800 mt-4 flex items-center justify-between bg-white px-6">
              <h3 className="text-gray-900 flex items-center gap-2 text-xl font-bold dark:text-white sm:gap-3 sm:text-2xl">
                Departments Progress
              </h3>

              <div className="flex items-center gap-3">
                <label className="text-black dark:text-white">Filter</label>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="rounded border border-stroke px-2 py-1.5 outline-none transition dark:border-form-strokedark dark:bg-form-input dark:text-white"
                >
                  <option value="all">All</option>
                  <option value="department">Department</option>
                  <option value="employee">Employee</option>
                </select>

                {filterType === 'department' && (
                  <select
                    value={selectedDepartment}
                    onChange={(e) => {
                      setSelectedDepartment(e.target.value);
                      setSelectedDepartmentId(e.target.value);
                    }}
                    className="rounded border border-stroke px-2 py-1.5 outline-none transition dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  >
                    <option value="">Select Department</option>
                    {projectInfo?.departments?.map((dept) => (
                      <option key={dept.departmentId} value={dept.departmentId}>
                        {dept.department}
                      </option>
                    ))}
                  </select>
                )}

                {filterType === 'employee' && (
                  <select
                    value={selectedEmp}
                    onChange={(e) => {
                      const empId = e.target.value;
                      setSelectedEmp(empId);

                      const selectedEmployee = projectInfo?.employees?.find(
                        (emp: any) => emp.id === empId,
                      );

                      setSelectedDepartmentId(
                        selectedEmployee?.departmentId || '',
                      );
                    }}
                    className="rounded border border-stroke px-2 py-1.5 outline-none transition dark:border-form-strokedark dark:bg-form-input dark:text-white"
                  >
                    <option value="">Select Employee</option>
                    {projectInfo?.employees?.map((emp: any) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullname}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Conditional Components */}
            {filterType === 'all' && (
              <EmpAllProjectDetails departments={projectInfo?.departments} />
            )}
            {filterType === 'employee' && (
              <AllEmpWork projectId={id} empid={selectedEmp} />
            )}

            {filterType === 'department' && (
              <AllDepartmentWorkByEmp
                projectId={id}
                departmentId={selectedDepartment}
              />
            )}
          </>
        ) : (
          <AllLowerEmpWorkInProject />
        )}
      </div>
    </div>
  );
};

export default EmpProjectDetails;
