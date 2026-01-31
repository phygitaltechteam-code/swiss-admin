import {useAppContext} from '@/components/common/PopUp';
import GenericButton from '@/components/Forms/Buttons/GenericButton';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import {
  useGetCompanyDepartment,
  useSaveCompanyDepartment,
  useUpdateCompanyDepartment,
} from '@/lib/react-query/companyDepartment';

import {useUpdateDepartment} from '@/lib/react-query/department';

import {zodResolver} from '@hookform/resolvers/zod';
import {useNavigate, useRouterState} from '@tanstack/react-router';
import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {z} from 'zod';

export type roomCategory = {
  id: string;
  name: string;
};

export type rowData = {
  id: string;
  name: string;
};

const categorySchema = z.object({
  name: z.string().min(3, 'Name is required'),
});

type FormValues = z.infer<typeof categorySchema>;

const CreateDepartment = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
    },
  });
  const {data: allDepartment, isLoading} = useGetCompanyDepartment();
  const {mutateAsync: addDepartment} = useSaveCompanyDepartment();
  const {mutateAsync: updateDepartment} = useUpdateCompanyDepartment();
  const [isEdit, setIsEdit] = useState<string | null>(null);
  const {createDepartment, setCreateDepartment} = useAppContext();
  const routerState = useRouterState();
  const editId = routerState.location.state?.dept_id;
  const navigate = useNavigate();
  const onSubmit = async (data: FormValues) => {
    try {
      if (editId) {
        await updateDepartment({id: editId, data});
        setIsEdit(null);
        navigate({to: '/company/department/createdepartment', state: {}}); // clears route state
        setCreateDepartment(false);
      } else {
        await addDepartment(data);
      }
      methods.reset({name: ''});
      setCreateDepartment(false);
    } catch (error) {}
  };

  console.log('editId', editId);
  useEffect(() => {
    if (editId) {
      const editIndustry = allDepartment?.find((e) => e.id === editId);
      if (editIndustry) {
        methods.reset({
          name: editIndustry.name,
        });
      }
    }
  }, [allDepartment, isEdit, methods]);

  return (
    <div className="mx-auto w-full max-w-6xl">
      {createDepartment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Popup Content */}
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            {/* Header */}
            <div className="flex items-center justify-between rounded-2xl border-b border-slate-100 bg-[#E0F2FE] px-6 py-4 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {editId ? 'Edit Department' : 'Create Department'}
              </h2>
              <button
                onClick={() => {
                  setCreateDepartment(false);
                  navigate({
                    to: location.pathname,
                    replace: true,
                    state: {},
                  });
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
                  <div>
                    <GenericInputField
                      name="name"
                      label="Department Name"
                      placeholder="Enter department name"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setCreateDepartment(false)}
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

export default CreateDepartment;
