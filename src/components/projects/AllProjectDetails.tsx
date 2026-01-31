import {useNavigate} from '@tanstack/react-router';
import {
  AlertTriangle,
  CalendarCheck2,
  CheckCircle2,
  Edit,
  Hourglass,
  Plus,
  Trash,
} from 'lucide-react';
import React from 'react';
import {useAppContext} from '../common/PopUp';
import {Route} from '@/routes/_app/project/projectdetails.$id';
import {minutesToHours} from '@/lib/Methods';

interface Assign {
  id: string;
  position: {id: string; name: string};
  user: {
    fullname: string;
    id: string;
    name: string;
  };
}

interface Work {
  createdAt: string | number | Date;
  review: any;
  id: string;
  srNo: number;
  name: string;
  description: string;
  assignedTo: string;
  assign: Assign;
  dueDate: string;
  status: string;
  priority: string;
  minutes?: number;
}

interface Department {
  id: string;
  department: string;
  departmentId: string;
  works: Work[];
}

type EmpRow = {
  id: string;
  name: string;
  employee: string;
  dueDate: string;
  priority: string;
  status: string;
};

interface AllProjectDetailsProps {
  departments: Department[];
  totalWork: number;
  inTimeCount: number;
  delayCount: number;
  inCompleteCount: number;
}

const AllProjectDetails: React.FC<AllProjectDetailsProps> = ({
  departments,
  totalWork,
  inTimeCount,
  delayCount,
  inCompleteCount,
}) => {
  const {
    setSelectedDepartmentId,
    setSelectedProjectId,
    setProjectWork,
    setSelectedProjectWorkId,
  } = useAppContext();
  const navigate = useNavigate();

  const {id} = Route.useParams();

  const onEdit = (row: EmpRow) => {
    setSelectedProjectWorkId(row.id);
    setProjectWork(true);
  };
  return (
    <div className="">
      <div className="dark:bg-gray-800/80 bg-white/80 p-4 backdrop-blur-xl sm:p-6">
        <div className="from-gray-50 to-gray-100 mb-6 bg-gradient-to-br">
          <div className="">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="min-w-[200px] flex-1 rounded-lg bg-white px-4 py-2 shadow-md">
                <div className="flex items-center space-x-3">
                  <div className={`rounded-lg bg-blue-500 bg-opacity-10 p-2`}>
                    <span className="text-xl">
                      <CheckCircle2 />{' '}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Total Work</h3>
                    <p className="text-gray-800 text-2xl font-bold">
                      {totalWork}
                    </p>
                  </div>
                </div>
              </div>

              <div className="min-w-[200px] flex-1 rounded-lg bg-white px-4 py-2 shadow-md">
                <div className="flex items-center space-x-3">
                  <div className={`rounded-lg bg-green-500 bg-opacity-10 p-2`}>
                    <span className="text-xl">
                      <CalendarCheck2 />{' '}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">In Time</h3>
                    <p className="text-gray-800 text-2xl font-bold">
                      {inTimeCount}
                    </p>
                  </div>
                </div>
              </div>
              <div className="min-w-[200px] flex-1 rounded-lg bg-white px-4 py-2 shadow-md">
                <div className="flex items-center space-x-3">
                  <div className={`rounded-lg bg-yellow-500 bg-opacity-10 p-2`}>
                    <span className="text-xl">
                      <AlertTriangle />{' '}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Delay</h3>
                    <p className="text-gray-800 text-2xl font-bold">
                      {delayCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="min-w-[200px] flex-1 rounded-lg bg-white px-4 py-2 shadow-md">
                <div className="flex items-center space-x-3">
                  <div className={`rounded-lg bg-red-500 bg-opacity-10 p-2`}>
                    <span className="text-xl">
                      <Hourglass />{' '}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-gray-500 text-sm">Not Completed</h3>
                    <p className="text-gray-800 text-2xl font-bold">
                      {inCompleteCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {departments?.map((dept) => (
            <div
              key={dept.id}
              className="dark:border-gray-700 dark:bg-gray-800 rounded-sm bg-white px-4 shadow-lg"
            >
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                    {dept.department}
                  </h2>
                </div>

                <button
                  onClick={() => {
                    setProjectWork(true);
                    setSelectedDepartmentId(dept.departmentId);
                    setSelectedProjectId(id);
                  }}
                  className="boder-[#0284C7] flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium text-white shadow-md transition-all"
                  style={{color: '#0284C7'}}
                >
                  <Plus className="h-4 w-4" />
                  Add New Work
                </button>
              </div>

              {/* Table Section */}
              <div className="overflow-x-auto rounded-md">
                <table className="min-w-full">
                  <thead className="dark:bg-gray-700/50 bg-neutral-100 py-2">
                    <tr>
                      <th className="dark:text-gray-300 text-md px-4 py-5 text-left font-semibold text-black">
                        Task Name
                      </th>

                      <th className="dark:text-gray-300 text-md px-4 py-5 text-left font-semibold text-black">
                        Description
                      </th>
                      <th className="dark:text-gray-300 text-md px-4 py-3 text-left font-semibold text-black">
                        Assigned To
                      </th>
                      <th className="dark:text-gray-300 text-md px-4 py-3 text-left font-semibold text-black">
                        Review By
                      </th>
                      <th className="dark:text-gray-300 text-md px-4 py-3 text-left font-semibold text-black">
                        Status
                      </th>
                      <th className="dark:text-gray-300 text-md px-4 py-3 text-left font-semibold text-black">
                        Priority
                      </th>
                      <th className="dark:text-gray-300 text-md px-4 py-3 text-left font-semibold text-black">
                        Due Date
                      </th>

                      <th className="dark:text-gray-300 text-md px-4 py-3 text-left font-semibold text-black">
                        Created Time
                      </th>
                      <th className="dark:text-gray-300 text-md px-4 py-3 text-left font-semibold text-black">
                        Allotted Hours
                      </th>
                      <th className="dark:text-gray-300 text-md px-4 py-3 text-left font-semibold text-black">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="dark:divide-gray-700 divide-y divide-stroke">
                    {dept.works && dept.works.length > 0 ? (
                      dept.works.slice(0, 3).map((work) => (
                        <tr
                          key={work.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/40"
                        >
                          <td className="text-gray-900 px-4 py-4 text-sm font-medium dark:text-white">
                            <span
                              onClick={() => {
                                navigate({
                                  to: `/company/proworkdetails/${work?.id}`,
                                });
                                setSelectedProjectId(work?.id);
                              }}
                              className="cursor-pointer text-[#0284C7] hover:underline"
                            >
                              {work?.name}
                            </span>
                          </td>
                          <td className="text-gray-900 px-4 py-4 text-sm font-medium dark:text-white">
                            {work?.description || '-'}
                          </td>
                          <td className="text-gray-700 dark:text-gray-300 px-4 py-4 text-sm">
                            {work.assign?.user?.fullname || 'Unassigned'}
                          </td>
                          <td className="text-gray-700 dark:text-gray-300 px-4 py-4 text-sm">
                            {work?.review?.user?.fullname}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`rounded-full px-2 py-1 text-xs font-semibold ${
                                work.status === 'WORKING'
                                  ? 'border border-amber-700 bg-amber-100 text-amber-700'
                                  : work.status === 'COMPLETED'
                                    ? 'border border-green-700 bg-green-100 text-green-700'
                                    : work.status === 'PENDING'
                                      ? 'border border-[#0284C7] bg-blue-100 text-[#0284C7]'
                                      : work.status === 'REVIEW'
                                        ? 'border border-purple-700 bg-purple-100 text-purple-700'
                                        : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {work?.status}
                            </span>
                          </td>

                          <td className="text-gray-700 dark:text-gray-300 px-4 py-3 text-sm">
                            {work?.priority}
                          </td>
                          <td className="text-gray-700 dark:text-gray-300 px-4 py-3 text-sm">
                            {new Date(work?.dueDate).getFullYear() === 1970
                              ? '-'
                              : new Date(work?.dueDate).toLocaleString()}
                          </td>

                          <td className="text-gray-700 dark:text-gray-300 px-4 py-3 text-sm">
                            {new Date(work?.createdAt).toLocaleString()}
                          </td>
                          <td className="text-gray-700 dark:text-gray-300 px-4 py-3 text-sm">
                            {work?.minutes
                              ? minutesToHours(work?.minutes)
                              : '0'}
                          </td>
                          <td className="text-gray-700 dark:text-gray-300 px-4 py-3 text-sm">
                            <div className="flex items-center gap-3">
                              <button
                                className="flex items-center gap-1 rounded-lg text-[#0284C7] transition"
                                onClick={() => {
                                  onEdit(work);
                                  setSelectedDepartmentId(dept?.departmentId);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </button>

                              <button className="flex items-center gap-1 rounded-lg text-red-400 transition">
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-gray-500 dark:text-gray-400 px-6 py-8 text-center text-sm"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="bg-gray-100 dark:bg-gray-700 flex h-12 w-12 items-center justify-center rounded-full">
                              <span className="text-2xl">📝</span>
                            </div>
                            <p>No tasks available</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* View More Button */}
              {dept.works && dept.works.length >= 3 && (
                <div className="mt-2 text-right">
                  <button
                    onClick={() => {
                      setSelectedDepartmentId(dept.departmentId);
                      navigate({
                        to: '/project/departmentwork',
                        state: {
                          departmentId: dept.departmentId,
                          projectId: id,
                        },
                      });
                    }}
                    className="text-sm font-semibold"
                    style={{color: '#0284C7'}}
                  >
                    View More →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProjectDetails;
