import GenericButton from '@/components/Forms/Buttons/GenericButton';
import GenericInputField from '@/components/Forms/Input/GenericInputField';

import {zodResolver} from '@hookform/resolvers/zod';
import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {z} from 'zod';
import GenericDropdown from '../Forms/DropDown/GenericDropDown';

import {
  useGetDepartmentPositions,
  useSaveDepartmentPositions,
  useUpdateDepartmentPositions,
} from '@/lib/react-query/departmentPositions';
import {useAppContext} from '../common/PopUp';
import {useNavigate, useRouterState} from '@tanstack/react-router';

export type roomCategory = {
  id: string;
  name: string;
  description: string;
  defaultDepartments: string[];
};

export type rowData = {
  id: string;
  name: string;
  description: string;
  defaultDepartments: string[];
};

const columns: Column<roomCategory>[] = [
  {header: 'Name', accessor: 'name'},
  {header: 'Description', accessor: 'description'},
];

const categorySchema = z.object({
  name: z.string().min(3, 'Name is required'),
  seniority: z.coerce.number(),
});

type FormValues = z.infer<typeof categorySchema>;

const CreatePostion = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      seniority: 1,
    },
  });

  const {mutateAsync: addPosition} = useSaveDepartmentPositions();
  const {mutateAsync: updatePosition} = useUpdateDepartmentPositions();
  const [isEdit, setIsEdit] = useState<string | null>(null);
  const {position, setPosition, setPositionList} = useAppContext();
  const {data: allPositions} = useGetDepartmentPositions();
  const routerState = useRouterState();
  const editId = routerState.location.state?.pos_id;
  const navigate = useNavigate();
  const onSubmit = async (data: FormValues) => {
    try {
      if (editId) {
        await updatePosition({id: editId, data});
        navigate({to: '/company/createposition', state: {}});
        setPosition(false);
        setPositionList(true);
      } else {
        await addPosition(data);
        setPosition(false);
        setPositionList(true);
      }
      methods.reset({name: '', seniority: 1});
    } catch (error) {}
  };

  useEffect(() => {
    if (editId) {
      const editPosition = allPositions?.find((e) => e.id === editId);
      if (editPosition) {
        methods.reset({
          name: editPosition.name,
          seniority: editPosition.seniority,
        });
      }
    }
  }, [allPositions, editId, methods]);

  return (
    <div className="mx-auto w-full max-w-6xl">
      {position && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Popup Content */}
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between rounded-2xl border-b border-slate-100 bg-[#E0F2FE] px-6 py-4 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {editId ? 'Edit Position' : 'Create Position'}
              </h2>
              <button
                onClick={() => {
                  setPosition(false);
                  navigate({to: '/company/createposition', state: {}});
                }}
                className="rounded-lg p-2 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                aria-label="Close"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <FormProvider {...methods}>
                <form
                  onSubmit={methods.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <GenericInputField
                      name="name"
                      label="Position Name"
                      placeholder="Enter position name"
                    />

                    <GenericDropdown
                      name="seniority"
                      label="Seniority Level"
                      options={[
                        {label: 'Level 1', value: 1},
                        {label: 'Level 2', value: 2},
                        {label: 'Level 3', value: 3},
                        {label: 'Level 4', value: 4},
                        {label: 'Level 5', value: 5},
                      ]}
                      defaultValue={methods.getValues('seniority')}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setPosition(false)}
                      className="px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                    <GenericButton type="submit" className="min-w-[100px]">
                      {isEdit ? 'Update' : 'Save'}
                    </GenericButton>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePostion;
