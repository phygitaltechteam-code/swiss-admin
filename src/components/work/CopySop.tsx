import {
  useGetDepartmentWork,
  useSaveProjectWorkInBulk,
} from '@/lib/react-query/projectWork';
import React, {useState, useEffect} from 'react';
import {useAppContext} from '../common/PopUp';
import {useGetProject} from '@/lib/react-query/project';
import {useAuthContext} from '@/context/AuthContext';

const CopySop = () => {
  const {user} = useAuthContext();
  const {selectedDepartmentId, copySop, setCopySop, selectedProjectId} =
    useAppContext();
  const [dropdownProjectId, setSelectedProjectId] = useState('');
  const [localWorkData, setLocalWorkData] = useState<any[]>([]);
  const {mutateAsync: saveProjectWork} = useSaveProjectWorkInBulk();
  const {data: allProject} = useGetProject();
  console.log('local work', localWorkData);
  const {refetch} = useGetDepartmentWork(
    selectedDepartmentId,
    dropdownProjectId,
    {enabled: false},
  );

  const onSubmit = () => {
    const data = localWorkData?.map((each: any) => ({
      srNo: each?.srNo,
      name: each?.name,
      description: each?.description,
      status: 'PENDING',
      projectId: selectedProjectId,
      companyId: user?.companyId,
      departmentId: selectedDepartmentId,
    }));

    // Send the array directly (no "works" wrapper)
    saveProjectWork(data || []);
  };

  useEffect(() => {
    if (dropdownProjectId) {
      refetch().then((res) => {
        setLocalWorkData(res.data || []);
      });
    } else {
      setLocalWorkData([]);
    }
  }, [dropdownProjectId]);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-700">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Work List
            </h2>
            <div className="flex items-center gap-4">
              {/* Project Dropdown */}
              <select
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm focus:border-slate-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                value={dropdownProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
              >
                <option value="">Select Project</option>
                {allProject?.map((project: any) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              {/* Close button */}
              <button
                onClick={() => {
                  setCopySop(false);
                  setSelectedProjectId('');
                }}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Table Section */}
          <div className="p-6">
            {localWorkData?.length > 0 ? (
              <table className="w-full border-collapse border border-slate-200 dark:border-slate-700">
                <thead>
                  <tr className="bg-slate-100 text-left dark:bg-slate-700">
                    <th className="border border-slate-200 px-4 py-2 dark:border-slate-700">
                      #
                    </th>
                    <th className="border border-slate-200 px-4 py-2 dark:border-slate-700">
                      Work Name
                    </th>
                    <th className="border border-slate-200 px-4 py-2 dark:border-slate-700">
                      Description
                    </th>
                    <th className="border border-slate-200 px-4 py-2 dark:border-slate-700">
                      Serial No
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {localWorkData.map((work: any, index: number) => (
                    <tr
                      key={work.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      <td className="border border-slate-200 px-4 py-2 dark:border-slate-700">
                        {index + 1}
                      </td>
                      <td className="border border-slate-200 px-4 py-2 dark:border-slate-700">
                        {work.name}
                      </td>
                      <td className="border border-slate-200 px-4 py-2 dark:border-slate-700">
                        {work.description || '-'}
                      </td>
                      <td className="border border-slate-200 px-4 py-2 dark:border-slate-700">
                        {work.srNo || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-slate-600 dark:text-slate-300">
                No work data found.
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 px-6 pb-4">
            <button
              className="rounded-md px-4 py-2 text-white"
              onClick={() => onSubmit()}
              style={{background: '#0284C7'}}
            >
              OK
            </button>
            <button
              className="bg-gray-200 rounded-md border border-stroke px-4 py-2 text-black dark:bg-slate-700 dark:text-white"
              onClick={() => {
                setCopySop(false);
                setSelectedProjectId('');
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopySop;
