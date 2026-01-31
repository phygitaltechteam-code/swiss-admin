// src/components/ProjectWork/FormSection.tsx
import React from 'react';
import {FormProvider} from 'react-hook-form';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericDropdown from '@/components/Forms/DropDown/GenericDropDown';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import AttachmentUpload from './AttachmentUpload';
import {FormValues, UploadedFile} from './types';

interface Props {
  methods: any;
  onSubmit: (data: FormValues) => void;
  deptEmployees: any[];
  higherSeniorityEmployees: any[];
  setSelectedEmp: (id: string) => void;
  uploadedFiles: UploadedFile[];
  setUploadedFiles: (files: UploadedFile[]) => void;
  existingDocs: UploadedFile[];
  uploadError: string;
  work_id?: string | number;
}

const FormSection: React.FC<Props> = ({
  methods,
  onSubmit,
  deptEmployees,
  higherSeniorityEmployees,
  setSelectedEmp,
  uploadedFiles,
  setUploadedFiles,
  existingDocs,
  uploadError,
  work_id,
}) => {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-6 rounded-xl bg-white shadow-sm"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {work_id && (
            <GenericInputField
              name="srNo"
              label="Serial No"
              type="number"
              placeholder="Enter Serial No"
            />
          )}

          <GenericInputField
            name="name"
            label="Work Name"
            placeholder="Enter Work Name"
          />
          <GenericInputField
            name="description"
            label="Description"
            placeholder="Enter Description"
          />

          <GenericDropdown
            name="assignedTo"
            label="Assigned To"
            options={deptEmployees.map((emp) => ({
              label: emp.fullname || 'Unknown',
              value: emp.id,
            }))}
            onChange={(value) => setSelectedEmp(value)}
          />

          <GenericDropdown
            name="reviewBy"
            label="Review By"
            options={higherSeniorityEmployees.map((emp) => ({
              label: emp.fullname || 'Unknown',
              value: emp.id,
            }))}
          />

          <GenericDropdown
            name="priority"
            label="Priority"
            options={[
              {label: 'Low', value: 'Low'},
              {label: 'Medium', value: 'Medium'},
              {label: 'High', value: 'High'},
            ]}
          />

          <GenericInputField name="dueDate" label="Due Date" type="date" />
          <GenericInputField name="dueTime" label="Due Time" type="time" />

          <div className="flex items-center space-x-3 md:mt-6">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Attachment Required?
            </label>
            <button
              type="button"
              onClick={() =>
                methods.setValue(
                  'isAttachment',
                  !methods.getValues('isAttachment'),
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                methods.watch('isAttachment')
                  ? 'bg-[#0284C7]'
                  : 'bg-neutral-600 dark:bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  methods.watch('isAttachment')
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {methods.watch('isAttachment') && (
            <GenericInputField name="documentNote" label="Document Type" />
          )}

          <AttachmentUpload
            uploadedFiles={uploadedFiles}
            existingDocs={existingDocs}
            onFilesChange={setUploadedFiles}
            uploadError={uploadError}
          />
        </div>

        <div className="flex justify-end space-x-4 border-t border-slate-100 pt-4 dark:border-slate-700">
          <button
            type="button"
            onClick={() => {
              uploadedFiles.forEach((file) => {
                if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
              });
            }}
            className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
          >
            Cancel
          </button>
          <GenericButton type="submit" className="min-w-[120px]">
            {work_id ? 'Update' : 'Save'}
          </GenericButton>
        </div>
      </form>
    </FormProvider>
  );
};

export default FormSection;
