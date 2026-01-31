import React, {useMemo, useState} from 'react';
import {createPortal} from 'react-dom';
import {Edit, Trash, X} from 'lucide-react';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import CopySingleWorkSave from './CopySingleWorkSave';
import {minutesToHours} from '@/lib/Methods';

interface Props {
  dropdownProjectId: string;
  setSelectedProjectId: (id: string) => void;
  allProject: any[];
  localWorkData: any[];
  setLocalWorkData: React.Dispatch<React.SetStateAction<any[]>>;
  onSubmitCopyData: () => void;
}
type workDetails = {
  workName: string;
  description: string;
  priority: string;
  minutes: number;
};
const CopySopModal: React.FC<Props> = ({
  dropdownProjectId,
  setSelectedProjectId,
  allProject,
  localWorkData,
  setLocalWorkData,
}) => {
  const [openDepartments, setOpenDepartments] = useState<
    Record<string, boolean>
  >({});
  const [workAddPopup, setWorkAddPopup] = useState(false);
  const [editWordDepartment, setDepartment] = useState('');
  const [selectedWork, setSelectedWork] = useState<workDetails | null>(null);

  const groupedByDepartment = useMemo(() => {
    return localWorkData.reduce((acc: any, item: any) => {
      const deptName = item.department?.name || 'Others';

      if (!acc[deptName]) {
        acc[deptName] = [];
      }

      acc[deptName].push(item);
      return acc;
    }, {});
  }, [localWorkData]);

  console.log('groupedddd', groupedByDepartment);
  const toggleDepartment = (dept: string) => {
    setOpenDepartments((prev) => ({
      ...prev,
      [dept]: !prev[dept],
    }));
  };

  console.log('localll work', localWorkData);
  if (!dropdownProjectId) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex max-h-[85vh] w-full max-w-5xl flex-col rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
        {/* Header – stays fixed */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Copy SOP Works</h2>
          <button onClick={() => setSelectedProjectId('')}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="space-y-3 overflow-y-auto pr-2">
          <select
            value={dropdownProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-60 rounded-md border px-4 py-2 dark:bg-form-input"
          >
            <option value="">Select Project</option>
            {allProject?.map((project: any) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          {dropdownProjectId ? (
            <div className="border-t pt-4">
              {Object.entries(groupedByDepartment).map(
                ([deptName, works]: any) => {
                  const isOpen = openDepartments[deptName];

                  return (
                    <div key={deptName} className="mb-4 rounded-lg border">
                      <button
                        onClick={() => toggleDepartment(deptName)}
                        className="flex w-full items-center justify-between bg-slate-100 px-4 py-3 font-semibold dark:bg-slate-700"
                      >
                        <span>{deptName}</span>
                        <span>{isOpen ? '−' : '+'}</span>
                      </button>

                      {isOpen && (
                        <div className="overflow-auto">
                          <table className="w-full border-collapse border-t">
                            <thead className="bg-slate-50 dark:bg-slate-800">
                              <tr>
                                <th className="border px-4 py-2">#</th>
                                <th className="border px-4 py-2">Work Name</th>
                                <th className="border px-4 py-2">
                                  Description
                                </th>
                                <th className="border px-4 py-2">
                                  Alloted Time
                                </th>
                                <th className="border px-4 py-2">Priority</th>
                                <th className="border px-4 py-2">Action</th>
                              </tr>
                            </thead>

                            <tbody>
                              {works.map((work: any, index: number) => (
                                <tr key={work.id}>
                                  <td className="border px-4 py-2">
                                    {index + 1}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {work.name}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {work.description || '-'}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {minutesToHours(work?.minutes)}
                                  </td>
                                  <td className="border px-4 py-2">
                                    {work.priority || '-'}
                                  </td>
                                  <td className="border px-4 py-2">
                                    <div className="flex justify-center gap-3">
                                      <button
                                        className="rounded-md p-2 text-blue-600 hover:bg-blue-50"
                                        onClick={() => {
                                          setWorkAddPopup(true);
                                          setDepartment(work.department?.id);
                                          setSelectedWork({
                                            workName: work.name,
                                            description: work.description || '',
                                            priority: work.priority || '',
                                            minutes: Number(work.minutes || 0),
                                          });
                                        }}
                                      >
                                        <Edit size={16} />
                                      </button>
                                      <button
                                        className="rounded-md p-2 text-red-600 hover:bg-red-50"
                                        onClick={() => {
                                          setLocalWorkData((prev) =>
                                            prev.filter(
                                              (item) => item.id !== work.id,
                                            ),
                                          );
                                        }}
                                      >
                                        <Trash size={16} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          ) : (
            <p className="text-slate-500">
              Please select a project to view works.
            </p>
          )}
        </div>
      </div>
      {workAddPopup && (
        <CopySingleWorkSave
          departmentId={editWordDepartment}
          projectId={dropdownProjectId}
          setShowPopUp={setWorkAddPopup}
          showPopUp={workAddPopup}
          workDetails={selectedWork}
        />
      )}
    </div>,

    document.body,
  );
};

export default CopySopModal;
