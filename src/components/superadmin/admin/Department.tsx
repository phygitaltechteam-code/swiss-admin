import GenericButton from '@/components/Forms/Buttons/GenericButton';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {useAuthContext} from '@/context/AuthContext';
import {
  useDeleteDepartment,
  useGetDepartment,
  useSaveDepartment,
  useUpdateDepartment,
} from '@/lib/react-query/department';

import {zodResolver} from '@hookform/resolvers/zod';
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

const columns: Column<roomCategory>[] = [{header: 'Name', accessor: 'name'}];

const categorySchema = z.object({
  name: z.string().min(3, 'Name is required'),
});

type FormValues = z.infer<typeof categorySchema>;

const Department = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
    },
  });

  const {user} = useAuthContext();
  const adminId = user?.roleId ?? '';
  const {data: allIndustry} = useGetDepartment();
  const {mutateAsync: addIndustry} = useSaveDepartment();
  const {mutateAsync: updateIndustry} = useUpdateDepartment();
  const {mutateAsync: deleteIndustry} = useDeleteDepartment();
  const [isEdit, setIsEdit] = useState<string | null>(null);
  const [departmentInput, setDepartmentInput] = useState<string>('');

  const onSubmit = async (data: FormValues) => {
    try {
      if (isEdit) {
        await updateIndustry({id: isEdit, data});
        setIsEdit(null);
      } else {
        await addIndustry(data);
      }
      methods.reset({name: ''});
    } catch (error) {}
  };

  useEffect(() => {
    if (isEdit) {
      const editIndustry = allIndustry?.find((e) => e.id === isEdit);
      if (editIndustry) {
        methods.reset({
          name: editIndustry.name,
        });
      }
    }
  }, [allIndustry, isEdit, methods]);

  const onEdit = (row: rowData) => {
    setIsEdit(row.id);
  };

  const onDelete = (row: rowData) => {
    deleteIndustry(row.id);
  };

  return (
    <div className="space-y-4 p-1 md:p-6">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="space-y-8 bg-white p-8 dark:bg-black"
        >
          <h2 className="text-lg font-semibold">Department</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <GenericInputField
                name="name"
                required
                label="Department Name"
                placeholder="Enter Department"
              />
            </div>

            <div className="col-span-6 flex items-end p-1">
              <GenericButton type="submit">
                {isEdit ? 'Update' : 'Save'}
              </GenericButton>
            </div>
          </div>
        </form>
      </FormProvider>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold text-neutral-800 dark:text-neutral-100">
          Existing Department
        </h2>
        <GenericTable
          columns={columns}
          data={allIndustry || []}
          action
          itemsPerPage={100}
          onEdit={(row) => onEdit(row)}
          onDelete={(row) => onDelete(row)}
        />
      </div>
    </div>
  );
};

export default Department;
