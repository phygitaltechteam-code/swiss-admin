import {
  useCompanyStatusChangePro,
  useGetDailyWorkById,
  useGetProjectWorkById,
  useGetProjectWorkByWorkId,
} from '@/lib/react-query/projectWork';
import React, {useEffect, useState} from 'react';
import {
  Calendar,
  Clock,
  Download,
  Flag,
  CheckCircle,
  ArrowLeft,
  ChevronDown,
} from 'lucide-react';
import {useAuthContext} from '@/context/AuthContext';
import {
  useGetProjectWorkByIdByEmp,
  useProjectWorkStatusChange,
  useStatusChange,
} from '@/lib/react-query/WorkAssignByEmp';
import {Route} from '@/routes/_app/company/proworkdetails.$id';
import EmpProjectWorkHistory from '../Employee/EmpProjectWorkHistory';
import {
  FaCheckCircle,
  FaPaperPlane,
  FaPlayCircle,
  FaRedoAlt,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const AdminDashProWorkDetails = () => {
  const {id} = Route.useParams();
  const {user} = useAuthContext();
  const {data: eachWork} = useGetProjectWorkByWorkId(id!);
  console.log('each work//////', eachWork);
  const [attachedDocs, setAttachedDocs] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState('');
  const [note, setNote] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const {mutateAsync: changeStatus} = useCompanyStatusChangePro();
  const [openPopup, setOpenPopup] = useState(false);
  const [actionType, setActionType] = useState<'done' | 'reopen' | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  console.log('each pro work', eachWork);
  const [previewImg, setPreviewImg] = React.useState<string | null>(null);

  useEffect(() => {
    if (eachWork) {
      const attachmentDocs =
        eachWork?.assignedDocuments?.map((doc: any) => doc?.document) || [];
      setAttachedDocs(attachmentDocs);
    }
  }, [eachWork]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadedFiles((prev) => [...prev, ...Array.from(files)]);
    setUploadError('');
  };
  const doneTask = () => {
    changeStatus({id: id, status: 'DONE'});
  };

  const reopenTask = () => {
    if (reviewComment === '') {
      toast.error('Please enter review comment');
      return;
    }
    changeStatus({
      id: id,
      status: 'REOPEN',
      reviewComment: reviewComment,
      document: uploadedFiles,
    });
  };

  const handleOpen = (type: 'done' | 'reopen') => {
    setActionType(type);
    setOpenPopup(true);
  };

  const handleConfirm = () => {
    if (actionType === 'done') {
      doneTask();
    }

    if (actionType === 'reopen') {
      reopenTask();
    }

    setOpenPopup(false);
  };

  if (!eachWork) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <span className="text-gray-600 ml-3">Loading work details...</span>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColors = (status: string) => {
    const s = status?.toLowerCase();

    return s === 'done'
      ? 'bg-green-100 text-green-700'
      : s === 'pending'
        ? 'bg-yellow-100 text-yellow-700'
        : s === 'working'
          ? 'bg-blue-100 text-blue-700'
          : s === 'review'
            ? 'bg-orange-100 text-orange-700'
            : s === 'delayed'
              ? 'bg-red-100 text-red-700'
              : s === 'canceled'
                ? 'bg-gray-100 text-gray-700'
                : s === 'reopen'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-700';
  };

  return (
    <div>
      <div className="mx-auto md:py-3">
        <button
          onClick={() => window.history.back()}
          className="group flex items-center gap-3 transition-all duration-300 hover:scale-105"
        >
          <div className="dark:bg-gray-800/80 dark:group-hover:bg-gray-800 flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 backdrop-blur-xl transition-all group-hover:bg-white group-hover:shadow-xl sm:h-10 sm:w-10 sm:rounded-2xl">
            <ArrowLeft className="text-gray-600 dark:text-gray-300 h-4 w-4 transition-transform group-hover:-translate-x-1 sm:h-5 sm:w-5" />
          </div>
          <span className="text-gray-700 dark:text-gray-200 text-sm font-semibold sm:text-base">
            Back to Work
          </span>
        </button>

        <div className="bg-white p-4 shadow-sm dark:bg-boxdark">
          <h2 className="mb-1 text-lg font-semibold text-slate-800 dark:text-white">
            Work Info
          </h2>
          <div className="mb-2 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Work Name
              </label>
              <div className="flex items-center gap-3 rounded bg-neutral-50 px-3 py-1 shadow-sm dark:bg-meta-4">
                <span className="text-gray-700">{eachWork?.name || 'N/A'}</span>
              </div>
            </div>

            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Description
              </label>
              <div className="flex items-center gap-3 rounded bg-neutral-50 px-3 py-1 shadow-sm dark:bg-meta-4">
                <span className="text-gray-700">
                  {' '}
                  {eachWork.description || 'N/A'}
                </span>
              </div>
            </div>

            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Priority
              </label>
              <div
                className={`flex items-center gap-3 rounded bg-neutral-50 px-3 py-1 shadow-sm dark:bg-meta-4 ${getPriorityColor(eachWork.priority)}`}
              >
                <Flag className="text-gray-500" />
                <span>{eachWork.priority}</span>
              </div>
            </div>
            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Department
              </label>
              <div className="flex items-center gap-2 rounded bg-neutral-50 px-3 py-1 shadow-sm dark:bg-meta-4">
                <span>{eachWork?.department?.name || 'N/A'}</span>
              </div>
            </div>
            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Project
              </label>
              <div className="flex items-center gap-2 rounded bg-neutral-50 px-3 py-1 shadow-sm dark:bg-meta-4">
                <span>{eachWork?.project?.name || 'N/A'}</span>
              </div>
            </div>
            {eachWork.dueDate && (
              <>
                <div>
                  <label className="text-gray-700 mb-2 block text-sm font-medium">
                    Due Date
                  </label>
                  <div className="flex items-center gap-2 rounded bg-neutral-50 px-3 py-1 shadow-sm dark:bg-meta-4">
                    <Calendar className="text-gray-500 h-4 w-4" />
                    <span>{formatDate(eachWork?.dueDate)}</span>
                  </div>
                </div>

                <div>
                  <label className="text-gray-700 mb-2 block text-sm font-medium">
                    Due Time
                  </label>
                  <div className="flex items-center gap-2 rounded bg-neutral-50 px-3 py-1 shadow-sm dark:bg-meta-4">
                    <Clock className="text-gray-500 h-4 w-4" />
                    <span>
                      {new Date(eachWork.dueDate).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Assigned To
              </label>
              <div className="flex items-center gap-3 rounded bg-neutral-50 px-3 py-1 shadow-sm dark:bg-meta-4">
                <span className="text-gray-700">
                  {eachWork?.assign?.user?.fullname}
                </span>
              </div>
            </div>

            {/* Assigned By */}
            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Assigned By
              </label>
              <div className="flex items-center gap-2 rounded bg-neutral-50 px-3 py-1 shadow-sm dark:bg-meta-4">
                <span>
                  {eachWork?.assignedByEmployee?.user?.fullname || 'COMPANY'}
                </span>
              </div>
            </div>

            {/* Review By */}
            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Review By
              </label>
              <div className="flex items-center gap-2 rounded bg-neutral-50 px-3 py-1 shadow-sm dark:bg-meta-4">
                <span>{eachWork?.review?.user?.fullname || 'N/A'}</span>
              </div>
            </div>

            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Status
              </label>
              <div
                className={`flex items-center gap-2 rounded px-3 py-1 shadow-sm ${getStatusColors(
                  eachWork.status,
                )}`}
              >
                <CheckCircle className="h-4 w-4" />
                <span>{eachWork.status}</span>
              </div>
            </div>

            <div>
              <label className="text-gray-700 mb-2 block text-sm font-medium">
                Attachment Required?
              </label>

              <div className="bg-gray-50 flex items-center gap-2 rounded px-3 py-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={eachWork.isAttachment === true}
                    readOnly
                  />
                  <span>Attachment</span>
                </label>
              </div>
            </div>
            {eachWork?.isAttachment === true && (
              <div>
                <label className="text-gray-700 mb-2 block text-sm font-medium">
                  Document Type
                </label>

                <div className="flex items-center gap-2 rounded bg-neutral-50 px-3 py-1 shadow-sm dark:bg-meta-4">
                  <span>{eachWork.documentNote || 'N/A'}</span>
                </div>
              </div>
            )}
            <div className="rounded-lg border border-stroke bg-white p-2 shadow-sm">
              <label className="text-gray-700 block text-sm font-semibold">
                Attached Files
              </label>

              <div className="flex max-w-[260px] gap-3 overflow-x-auto">
                {attachedDocs?.map((file, index) => {
                  const url = file;
                  const ext = url.split('.').pop().toLowerCase();

                  const isImage = ['jpg', 'jpeg', 'png', 'webp'].includes(ext);
                  const isPdf = ext === 'pdf';
                  const isExcel = ['xlsx', 'xls', 'csv'].includes(ext);

                  return (
                    <div key={index} className="flex flex-col items-center">
                      {/* Image Thumbnail */}
                      {isImage && (
                        <img
                          src={url}
                          className="h-12 w-12 cursor-pointer rounded-md border object-cover"
                          onClick={() => window.open(url, '_blank')}
                        />
                      )}

                      {/* PDF Thumbnail */}
                      {isPdf && (
                        <div
                          className="flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-md border border-stroke text-red-600 shadow"
                          onClick={() => window.open(url, '_blank')}
                        >
                          <span className="text-[10px] font-semibold">PDF</span>
                          <span className="text-[8px] underline">open</span>
                        </div>
                      )}

                      {/* Excel Thumbnail */}
                      {isExcel && (
                        <div
                          className="flex h-12 w-12 cursor-pointer flex-col items-center justify-center rounded-md border bg-green-100 text-green-700 shadow"
                          onClick={() => window.open(url, '_blank')}
                        >
                          <span className="text-[10px] font-semibold">
                            Excel
                          </span>
                          <span className="text-[8px] underline">open</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {eachWork?.status !== 'DONE' && (
          <div className="mt-3 bg-white px-4 py-6 shadow-sm dark:bg-boxdark">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                Remark Section
              </h2>
              <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="bg-gray-50 rounded border border-stroke p-1">
                  <input
                    type="text"
                    placeholder="Add note"
                    className="text-gray-700 w-full bg-transparent text-sm outline-none dark:text-white"
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                </div>

                {/* Upload Button with error and preview positioned relative to it */}
                {eachWork.isAttachment === true && (
                  <div className="relative">
                    <div className="w-full rounded-lg border border-stroke bg-white shadow-sm">
                      <div className="p-1">
                        <label
                          htmlFor="uploadImage"
                          className="inline-block cursor-pointer rounded bg-[#0284C7] px-4 py-1 text-sm font-medium text-white"
                        >
                          Upload Attachment
                        </label>

                        <input
                          id="uploadImage"
                          type="file"
                          accept="*/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Error message positioned absolutely below upload button */}
                    {uploadError && (
                      <div className="absolute left-0 right-0 top-full mt-1">
                        <p className="text-sm text-red-500">{uploadError}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => handleOpen('reopen')}
                    className="hover:bg-primary-dark mx-1 flex items-center gap-2 rounded bg-[#66c9fa] px-2 py-1 text-white"
                  >
                    <FaRedoAlt size={16} />
                    Reopen
                  </button>
                  <button
                    onClick={() => handleOpen('done')}
                    className="hover:bg-primary-dark mx-1 flex items-center gap-2 rounded bg-[#0284C7] px-2 py-1 text-white"
                  >
                    <FaCheckCircle size={16} />
                    Done
                  </button>
                </div>
              </div>

              {/* Preview Section - Positioned relative to upload section */}
              {eachWork.isAttachment === true && uploadedFiles.length > 0 && (
                <div className="ml-0 mt-3 md:ml-[calc(33.333%+1.5rem)]">
                  <div className="flex flex-wrap gap-3">
                    {uploadedFiles.map((file, index) => {
                      const fileURL = URL.createObjectURL(file);
                      const isImage = file.type.startsWith('image/');
                      const isPDF = file.type === 'application/pdf';

                      return (
                        <div key={index} className="relative">
                          {/* IMAGE PREVIEW */}
                          {isImage && (
                            <img
                              src={fileURL}
                              className="h-16 w-16 cursor-pointer rounded border border-stroke object-cover shadow"
                              onClick={() => window.open(fileURL, '_blank')}
                              alt={`Uploaded ${index + 1}`}
                            />
                          )}

                          {/* PDF PREVIEW */}
                          {isPDF && (
                            <div
                              onClick={() => window.open(fileURL, '_blank')}
                              className="bg-gray-100 flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded border border-stroke shadow"
                            >
                              <span className="text-xs font-bold text-red-600">
                                PDF
                              </span>
                              <span className="text-gray-600 text-[10px]">
                                Open
                              </span>
                            </div>
                          )}

                          {/* DELETE */}
                          <button
                            onClick={() =>
                              setUploadedFiles(
                                uploadedFiles.filter((_, i) => i !== index),
                              )
                            }
                            className="absolute -right-2 -top-2 rounded-full bg-white p-1 text-xs text-red-600 shadow"
                          >
                            ✖
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {openPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-lg bg-white p-4 shadow-lg">
            <h2 className="mb-3 text-lg font-semibold">
              {actionType === 'done' ? 'Done Task' : 'Reopen Task'}
            </h2>

            <p className="text-gray-600 mb-4 text-sm">
              Are you sure you want to {actionType} this task?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpenPopup(false)}
                className="rounded border px-3 py-1 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className="rounded bg-[#0284C7] px-3 py-1 text-sm text-white"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <EmpProjectWorkHistory data={eachWork?.employeeProjectWorkHistory} />
    </div>
  );
};

export default AdminDashProWorkDetails;
