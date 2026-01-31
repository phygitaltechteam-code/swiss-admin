// src/components/ProjectWork/AttachmentUpload.tsx
import React from 'react';
import {useFormContext} from 'react-hook-form';
import {getFileIcon} from './utils';
import {UploadedFile} from './types';

interface Props {
  uploadedFiles: UploadedFile[]; // New files only
  existingDocs: UploadedFile[]; // Existing from server
  onFilesChange: (files: UploadedFile[]) => void;
  uploadError: string;
}

const AttachmentUpload: React.FC<Props> = ({
  uploadedFiles,
  existingDocs,
  onFilesChange,
  uploadError,
}) => {
  const {watch} = useFormContext();
  const isAttachment = watch('isAttachment');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file), // ← Fixed: was ObjectObjectURL (typo!)
      file,
      type: file.type || 'application/octet-stream',
      name: file.name,
      isExisting: false,
    }));

    onFilesChange([...uploadedFiles, ...newFiles]);
  };

  const removeNewFile = (index: number) => {
    const fileToRemove = uploadedFiles[index];
    if (fileToRemove?.url) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    onFilesChange(uploadedFiles.filter((_, i) => i !== index));
  };

  const allFiles = [...existingDocs, ...uploadedFiles];

  if (!isAttachment) return null;

  return (
    <div className="col-span-2 rounded border border-stroke p-2">
      <label
        htmlFor="uploadImage"
        className="inline-block cursor-pointer rounded bg-[#0284C7] px-4 py-1.5 text-sm font-medium text-white"
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

      <div className="mt-3 flex flex-wrap gap-2">
        {allFiles.map((file, index) => {
          const isImage = file.type.startsWith('image/');
          const fileIcon = getFileIcon(file.type);
          const isNewFile = index >= existingDocs.length;

          return (
            <div key={index} className="relative">
              {isImage ? (
                <div className="relative">
                  <img
                    src={file.url}
                    alt={file.name}
                    className="h-16 w-16 cursor-pointer rounded border border-stroke object-cover shadow"
                    onClick={() => window.open(file.url, '_blank')}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-1">
                    <p className="truncate text-xs text-white">{file.name}</p>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => window.open(file.url, '_blank')}
                  className="bg-gray-50 relative flex h-16 w-16 cursor-pointer flex-col items-center justify-center gap-1 rounded border border-stroke shadow"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded ${fileIcon.color}`}
                  >
                    <span className="text-sm font-bold">{fileIcon.text}</span>
                  </div>
                  <span className="absolute bottom-0 left-0 right-0 truncate bg-black bg-opacity-50 px-1 text-[10px] text-white">
                    {file.name}
                  </span>
                </div>
              )}

              {isNewFile && (
                <button
                  onClick={() => removeNewFile(index - existingDocs.length)}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow hover:bg-red-600"
                >
                  ✖
                </button>
              )}
            </div>
          );
        })}
      </div>

      {uploadError && (
        <p className="mt-2 text-sm text-red-500">{uploadError}</p>
      )}
    </div>
  );
};

export default AttachmentUpload;
