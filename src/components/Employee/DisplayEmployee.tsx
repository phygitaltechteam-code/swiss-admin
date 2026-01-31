import {useAppContext} from '@/components/common/PopUp';
import {useDeleteEmployee, useEmployees} from '@/lib/api/employeeApi';
import {useNavigate} from '@tanstack/react-router';
import React, {useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';
import {Column} from '../Forms/Table/GenericTable';

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
  hidden: {opacity: 0, x: -20},
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
    },
  }),
};

const DisplayEmployee = () => {
  const {data: allEmp, isLoading} = useEmployees();
  console.log('all positions', allEmp);
  const {mutateAsync: deleteEmp} = useDeleteEmployee();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 8;
  const filteredDepartments = allEmp?.filter((emp) =>
    emp?.user?.fullname.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const navigate = useNavigate();
  const totalPages = Math.ceil(
    (filteredDepartments?.length || 0) / itemsPerPage,
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredDepartments?.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  console.log('current data', currentData);
  const onEdit = (row: rowData) => {
    navigate({to: '/employee/CreateEmp', state: {id: row.id}});
  };

  const onDelete = (row: rowData) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${row?.user?.fullname}"?`,
      )
    ) {
      deleteEmp(row.id);
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
          Loading positions...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full p-4 sm:p-6">
      <AnimatePresence>
        <motion.div
          className="w-full overflow-y-auto bg-white shadow-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div className="absolute inset-0 bg-opacity-50" />

          {/* Popup Content */}

          {/* Header */}
          <motion.div
            className="dark:bg-slate-750 flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700"
            initial={{opacity: 0, y: -20}}
            animate={{opacity: 1, y: 0}}
            transition={{delay: 0.1}}
          >
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              Employee List
            </h2>
            <motion.button
              onClick={() => setEmployeeList(false)}
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              whileHover={{scale: 1.1}}
              whileTap={{scale: 0.9}}
            >
              ✕
            </motion.button>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700 dark:bg-slate-800"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{delay: 0.2}}
          >
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
                placeholder="Search Employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-slate-900 placeholder-slate-500 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                whileFocus={{scale: 1.02}}
              />
            </div>
          </motion.div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <motion.tr
                  className="dark:from-slate-750 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 dark:border-slate-600 dark:to-slate-700"
                  initial={{opacity: 0, y: -10}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.3}}
                >
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Actions
                  </th>
                </motion.tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {currentData?.map((emp, index) => (
                  <motion.tr
                    key={emp.id}
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
                    <td className="whitespace-nowrap px-6 py-5">
                      <div className="text-base font-semibold text-slate-900 dark:text-white">
                        {emp?.user?.fullname}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-5 text-right">
                      <div className="flex justify-end space-x-2">
                        <motion.button
                          onClick={() => onEdit(emp)}
                          className="inline-flex items-center rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-all duration-200 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          whileHover={{scale: 1.05}}
                          whileTap={{scale: 0.95}}
                        >
                          Edit
                        </motion.button>
                        <motion.button
                          onClick={() => onDelete(emp)}
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
                transition={{delay: 0.4}}
              >
                <motion.div
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600"
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                >
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
                </motion.div>
                <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">
                  {searchTerm ? 'No employee found' : 'No employee yet'}
                </h3>
                <motion.p
                  className="text-slate-600 dark:text-slate-400"
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  transition={{delay: 0.6}}
                >
                  {searchTerm
                    ? 'Try a different search term'
                    : 'Add your first employee to get started'}
                </motion.p>
              </motion.div>
            )}
          </div>

          {/* Pagination */}
          {currentData && currentData.length > 0 && (
            <motion.div
              className="dark:bg-slate-750 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-700"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.5}}
            >
              {/* ... your existing pagination code here ... */}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default DisplayEmployee;
