import React, {useEffect, useState} from 'react';
import {useAuthContext} from '@/context/AuthContext';
import {Route} from '@/routes/_app/employee/emptask.$id';
import DailyTask from './DailyTask';
import ProjectTask from './ProjectTask';
import TimeSheet from '../Company/TimeSheet';
import {useSearch} from '@tanstack/react-router';

const EmployeeTask = () => {
  const {id} = Route.useParams();
  const {date} = useSearch({
    from: '/_app/employee/emptask/$id',
  });

  const [activeComponent, setActiveComponent] = useState<
    'Daily' | 'Project' | 'TimeSheet'
  >('Daily');

  useEffect(() => {
    if (date) {
      setActiveComponent('TimeSheet');
    }
  });

  return (
    <div className="mt-10 border-b border-[#eee] bg-white dark:border-strokedark dark:bg-boxdark">
      <div className="flex gap-3 border-b border-neutral-300 md:mx-3">
        <button
          className={`border-b-2 px-2 py-4 ${
            activeComponent === 'Daily'
              ? 'border-[#0284C7] text-[#0284C7]'
              : 'text-gray-500 border-transparent'
          }`}
          onClick={() => setActiveComponent('Daily')}
        >
          Daily
        </button>

        <button
          className={`border-b-2 px-2 py-4 ${
            activeComponent === 'Project'
              ? 'border-[#0284C7] text-[#0284C7]'
              : 'text-gray-500 border-transparent'
          }`}
          onClick={() => setActiveComponent('Project')}
        >
          Project
        </button>

        <button
          className={`border-b-2 px-2 py-4 ${
            activeComponent === 'TimeSheet'
              ? 'border-[#0284C7] text-[#0284C7]'
              : 'text-gray-500 border-transparent'
          }`}
          onClick={() => setActiveComponent('TimeSheet')}
        >
          TimeSheet
        </button>
      </div>

      <div>
        {activeComponent === 'Daily' && <DailyTask id={id} />}
        {activeComponent === 'Project' && <ProjectTask id={id} />}
        {activeComponent === 'TimeSheet' && <TimeSheet id={id} date={date} />}
      </div>
    </div>
  );
};

export default EmployeeTask;
