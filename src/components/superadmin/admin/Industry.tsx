import GenericButton from '@/components/Forms/Buttons/GenericButton';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericMultiselectDropdown from '@/components/Forms/SearchDropDown/GenericMultiselectDropdown';
import GenericTable, {Column} from '@/components/Forms/Table/GenericTable';
import {useAuthContext} from '@/context/AuthContext';
import {useGetDepartment} from '@/lib/react-query/department';
import {
  useDeleteIndustry,
  useGetIndustry,
  useSaveIndustry,
  useUpdateIndustry,
} from '@/lib/react-query/industry';
import {zodResolver} from '@hookform/resolvers/zod';
import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {z} from 'zod';

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
  description: z.string().min(3, 'Description is required'),
  defaultDepartments: z
    .array(z.string().min(1, 'Department name is required'))
    .min(1, 'At least one department is required'),
});

type FormValues = z.infer<typeof categorySchema>;

const Industry = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      defaultDepartments: [],
    },
  });

  const {user} = useAuthContext();
  const adminId = user?.roleId ?? '';
  const {data: allIndustry} = useGetIndustry();
  console.log('all industryy', allIndustry);
  const {mutateAsync: addIndustry} = useSaveIndustry();
  const {mutateAsync: updateIndustry} = useUpdateIndustry();
  const {data: AllDepartments} = useGetDepartment();
  const {mutateAsync: deleteIndustry} = useDeleteIndustry();
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
      methods.reset({defaultDepartments: [], description: '', name: ''});
    } catch (error) {}
  };

  useEffect(() => {
    if (isEdit) {
      const editIndustry = allIndustry?.find((e) => e.id === isEdit);
      console.log('edit industryyy', editIndustry);
      if (editIndustry) {
        methods.reset({
          name: editIndustry.name,
          description: editIndustry.description,
          defaultDepartments:
            editIndustry.defaultDepartments?.map(
              (dept: any) => dept.departmentId,
            ) || [],
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
          <h2 className="text-lg font-semibold">Industry</h2>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-6">
              <GenericInputField
                name="name"
                label="Industry Name"
                placeholder="Enter Industry"
              />
            </div>

            <div className="col-span-6">
              <GenericInputField
                name="description"
                label="Description"
                placeholder="Enter Description"
              />
            </div>

            {/* Department Input */}
            <div className="col-span-12 md:col-span-6">
              <GenericMultiselectDropdown
                name="defaultDepartments"
                label="Departments"
                options={
                  AllDepartments?.map((each) => ({
                    label: each.name,
                    value: each.id,
                  })) || []
                }
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
          Existing Industry
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

export default Industry;
