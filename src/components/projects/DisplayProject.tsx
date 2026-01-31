import {useAppContext} from '@/components/common/PopUp';
import {useDeleteEmployee, useEmployees} from '@/lib/api/employeeApi';
import {useDeleteProject, useGetProject} from '@/lib/react-query/project';
import {useNavigate} from '@tanstack/react-router';
import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

export type roomCategory = {
  id: string;
  name: string;
};

export type rowData = {
  id: string;
  name: string;
};

// Animation variants
const backdropVariants = {
  hidden: {opacity: 0},
  visible: {opacity: 1},
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: -50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: 0.2,
    },
  },
};

const rowVariants = {
  hidden: {opacity: 0, y: 20},
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
};

const DisplayProject = () => {
  const {data: allProject, isLoading} = useGetProject();
  console.log('all project', allProject);
  const {mutateAsync: deleteProject} = useDeleteProject();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 8;
  const {setSelectedProjectId} = useAppContext();
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredProjects = allProject
    ?.filter((project) =>
      project?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    ?.filter((project) =>
      statusFilter === 'All' ? true : project?.status === statusFilter,
    );

  const navigate = useNavigate();
  const totalPages = Math.ceil((filteredProjects?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredProjects?.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  console.log('current data', currentData);

  const onEdit = (row: rowData) => {
    navigate({to: '/project/createproject', state: {id: row.id}});
  };

  const onDelete = (row: rowData) => {
    if (window.confirm(`Are you sure you want to delete "${row?.name}"?`)) {
      deleteProject(row.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-96 flex-col items-center justify-center">
        <div className="relative">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-200"></div>
          <div className="absolute left-0 top-0 h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-blue-600"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">
          Loading projects...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-6">
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div className="absolute inset-0 bg-opacity-50" />

          <motion.div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="dark:bg-slate-750 flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700"
              initial={{opacity: 0, y: -20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.1}}
            >
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Project List
              </h2>
              <motion.button
                className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
              >
                ✕
              </motion.button>
            </motion.div>

            <motion.div
              className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800 md:flex-row md:items-center md:justify-between"
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              transition={{delay: 0.2}}
            >
              {/* Search Input */}
              <div className="relative max-w-md flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <motion.input
                  type="text"
                  placeholder="Search Project..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-slate-900 placeholder-slate-500 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                  whileFocus={{scale: 1.02}}
                />
              </div>

              {/* Status Filter */}
              <motion.div whileHover={{scale: 1.05}}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-1 text-slate-900 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                >
                  <option value="All">All</option>
                  <option value="PENDING">PENDING</option>
                  <option value="STARTED">STARTED</option>
                  <option value="WORKING">WORKING</option>
                  <option value="DONE">DONE</option>
                  <option value="DELAYED">DELAYED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </motion.div>
            </motion.div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="dark:from-slate-750 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 dark:border-slate-600 dark:to-slate-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Project
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Start Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      End Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {currentData?.map((project, index) => (
                    <motion.tr
                      key={project.id}
                      className="dark:hover:bg-slate-750 group transform transition-all duration-200 hover:bg-slate-50"
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      whileHover={{
                        scale: 1.002,
                        backgroundColor: 'rgba(0,0,0,0.02)',
                      }}
                    >
                      <td
                        className="cursor-pointer whitespace-nowrap px-6 py-5 transition hover:text-blue-600"
                        onClick={() => {
                          navigate({
                            to: `/project/projectdetails/${project?.id}`,
                          });
                          // setSelectedProjectId(project?.id);
                          // setProjectList(false);
                        }}
                      >
                        <div className="text-base font-semibold text-blue-700 underline dark:text-blue-700">
                          {project?.name}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="text-base font-semibold text-slate-900 dark:text-white">
                          {new Date(project?.startDate).toLocaleDateString(
                            'en-GB',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            },
                          )}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="text-base font-semibold text-slate-900 dark:text-white">
                          {new Date(project?.endDate).toLocaleDateString(
                            'en-GB',
                            {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            },
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-5">
                        <div className="text-base font-semibold text-slate-900 dark:text-white">
                          {project?.status}
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-6 py-5 text-right">
                        <div className="flex justify-end space-x-2">
                          <motion.button
                            onClick={() => onEdit(project)}
                            className="inline-flex items-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-all duration-200 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                          >
                            Edit
                          </motion.button>
                          <motion.button
                            onClick={() => onDelete(project)}
                            className="inline-flex items-center rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-all duration-200 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300"
                            whileHover={{scale: 1.05}}
                            whileTap={{scale: 0.95}}
                          >
                            Delete
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {(!currentData || currentData.length === 0) && (
                <motion.div
                  className="px-6 py-16 text-center"
                  initial={{opacity: 0, scale: 0.9}}
                  animate={{opacity: 1, scale: 1}}
                  transition={{delay: 0.3}}
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600">
                    <svg
                      className="h-16 w-16 text-slate-400 dark:text-slate-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
                    {searchTerm ? 'No projects found' : 'No projects yet'}
                  </h3>
                </motion.div>
              )}
            </div>

            {/* Pagination */}
            {currentData && currentData.length > 0 && (
              <motion.div
                className="dark:bg-slate-750 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.4}}
              >
                {/* ... your existing pagination code here ... */}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DisplayProject;
