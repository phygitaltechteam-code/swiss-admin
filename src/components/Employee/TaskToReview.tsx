import React, {useState} from 'react';
import {useAuthContext} from '@/context/AuthContext';
import toast from 'react-hot-toast';
import {useDailyWorkReview} from '@/lib/react-query/WorkAssignByEmp';
import DailyTaskReview from './DailyTaskReview';
import ProjectTaskReview from './ProjectTaskReview';

const TaskToReview = () => {
  const {user} = useAuthContext();

  const [activeComponent, setActiveComponent] = useState('Daily');
  console.log('active tab', activeComponent);

  return (
    <div className="mt-10 border-b border-[#eee] bg-white dark:border-strokedark dark:bg-boxdark">
      <div className="dark:border-gray-700 flex gap-3 border-b border-neutral-300 md:mx-3">
        <button
          className={`border-b-2 px-2 py-4 text-center text-sm font-medium sm:text-base ${
            activeComponent === 'Daily'
              ? 'border-[#0284C7] text-[#0284C7] dark:border-[#0284C7] dark:text-[#0284C7]'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 border-transparent'
          }`}
          onClick={() => setActiveComponent('Daily')}
        >
          Daily
        </button>
        <button
          className={`border-b-2 px-2 py-4 text-center text-sm font-medium sm:text-base ${
            activeComponent === 'Project'
              ? 'border-[#0284C7] text-[#0284C7] dark:border-[#0284C7] dark:text-[#0284C7]'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 border-transparent'
          }`}
          onClick={() => setActiveComponent('Project')}
        >
          Project
        </button>
      </div>

      <div className="">
        {activeComponent === 'Daily' && <DailyTaskReview />}
        {activeComponent === 'Project' && <ProjectTaskReview />}
      </div>
    </div>
  );
};

export default TaskToReview;
