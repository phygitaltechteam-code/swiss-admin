import {useGetProject} from '@/lib/react-query/project';
import React, {useState} from 'react';
import AdminDashDaily from './AdminDashDaily';
import AdminDashProject from './AdminDashProject';
import {useNavigate} from '@tanstack/react-router';
import {useAppContext} from '@/components/common/PopUp';

const StatsCard = ({title, value, icon, onClick}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-lg bg-white p-6 transition-all hover:shadow-sm active:scale-[.98] dark:bg-meta-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 mb-1 text-sm font-medium">{title}</p>
          <p className="text-gray-900 text-2xl font-semibold">{value}</p>
        </div>
        <div className="bg-gray-50 text-gray-600 rounded-full p-3">{icon}</div>
      </div>
    </div>
  );
};

const Home = () => {
  const [activeTab, setActiveTab] = useState<'project' | 'daily'>('daily');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('ALL');
  const getWeekRange = () => {
    const today = new Date();
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return {
      start: startOfWeek.toISOString().split('T')[0],
      end: endOfWeek.toISOString().split('T')[0],
    };
  };

  const {start, end} = getWeekRange();
  const [selectedDate, setSelectedDate] = useState(start);
  const [selectedToDate, setSelectedToDate] = useState(end);

  const navigate = useNavigate();
  const {data: allProject} = useGetProject();
  const {setDisplayDepartment} = useAppContext();

  const durationOptions = [
    {label: 'All', value: 'ALL'},
    {label: 'Daily', value: 'DAILY'},
    {label: 'Weekly', value: 'WEEKLY'},
    {label: 'Monthly', value: 'MONTHLY'},
    {label: 'Quarterly', value: 'QUARTERLY'},
    {label: 'Half_yearly', value: 'HALF_YEARLY'},
    {label: 'Yarly', value: 'YEARLY'},
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Projects"
          value="3"
          icon="💼"
          onClick={() => navigate({to: '/project/createproject'})}
        />
        <StatsCard
          title="Total Employees"
          value="10"
          icon="👥"
          onClick={() => navigate({to: '/employee/CreateEmp'})}
        />
        <StatsCard
          title="Departments"
          value="5"
          icon="🏢"
          onClick={() => setDisplayDepartment(true)}
        />
        {/* <StatsCard
          title="Tasks"
          value="15"
          icon="📊"
          onClick={() => navigate({to: '/'})}
        /> */}
      </div>

      <div className="bg-gray-50">
        <div className="px-6 pb-6">
          <div className="bg-white dark:bg-boxdark">
            <div className="border-b border-stroke dark:border-neutral-500">
              <div className="flex flex-col gap-4 px-6 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex space-x-4">
                  <button
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'daily'
                        ? 'bg-neutral-100 text-neutral-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => {
                      setActiveTab('daily');
                      setSelectedProject('');
                    }}
                  >
                    Daily
                  </button>

                  <button
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === 'project'
                        ? 'bg-neutral-100 text-neutral-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => {
                      setActiveTab('project');
                      setSelectedDuration('');
                    }}
                  >
                    Project
                  </button>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  {activeTab === 'project' && (
                    <select
                      value={selectedProject}
                      onChange={(e) => setSelectedProject(e.target.value)}
                      className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-1.5 text-black outline-none transition focus:border-primary dark:border-neutral-500 dark:text-white"
                    >
                      {' '}
                      <option>Select Project</option>
                      {allProject?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {activeTab === 'daily' && (
                    <select
                      value={selectedDuration}
                      onChange={(e) => setSelectedDuration(e.target.value)}
                      className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-1.5 text-black outline-none transition focus:border-primary dark:border-neutral-500 dark:text-white"
                    >
                      <option>Select Type</option>
                      {durationOptions.map((d) => (
                        <option key={d.value} value={d.value}>
                          {d.label}
                        </option>
                      ))}
                    </select>
                  )}

                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-1 text-black outline-none transition focus:border-primary dark:border-neutral-500 dark:text-white"
                  />

                  <input
                    type="date"
                    value={selectedToDate}
                    onChange={(e) => setSelectedToDate(e.target.value)}
                    className="w-full rounded border-[1.7px] border-stroke bg-transparent px-3 py-1 text-black outline-none transition focus:border-primary dark:border-neutral-500 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="px-6">
              {activeTab === 'daily' && (
                <AdminDashDaily
                  type={selectedDuration}
                  filterDate={selectedDate}
                  endDate={selectedToDate}
                />
              )}
            </div>
            <div className="px-6">
              {activeTab === 'project' && (
                <AdminDashProject
                  projectId={selectedProject}
                  startDate={selectedDate}
                  endDate={selectedToDate}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
