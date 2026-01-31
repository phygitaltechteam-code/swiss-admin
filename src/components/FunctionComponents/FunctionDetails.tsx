// components/Manager/FunctionDetails.tsx
import React from 'react';
import GenericInputField from '@/components/Forms/Input/GenericInputField';
import GenericDropdown from '@/components/Forms/DropDown/GenericDropDown';
import GenericTable from '../Forms/Table/GenericTable';

interface Props {
  gstchecked: string;
  onGstChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  packageOptions: {label: string; value: string}[];
  onPackageChange: (selected: string) => void;
  FunctionData: {
    id: string;
    name: string;
    startDate: string;
    endDate: string | null;
    gst: string;
    eventId: string;
    totalAmount: number;
    oscassionId: string;
    createdAt: string;
    updatedAt: string;
    weddingFunction: null;
  }[];
}

const FunctionDetails: React.FC<Props> = ({
  gstchecked,
  onGstChange,
  packageOptions,
  onPackageChange,
  FunctionData,
}) => {
  return (
    <>
      <>
        <h1 className="col-span-12 text-lg font-semibold">Function Name</h1>

        <div className="col-span-12 md:col-span-6">
          <GenericInputField
            name="name"
            label="Function Name"
            placeholder="Family Marriage"
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <GenericInputField name="functionDate" label="Date" type="date" />
        </div>

        <div className="col-span-12 md:col-span-6">
          <GenericInputField name="functionTime" label="Time" type="time" />
        </div>

        <div className="col-span-12 md:col-span-6">
          <GenericDropdown
            label="Select Package"
            name="event"
            options={packageOptions}
            onChange={(selected) => onPackageChange(selected)}
          />
        </div>

        <div className="col-span-12 md:col-span-6">
          <GenericInputField name="price" label="Price" placeholder="18,000" />
        </div>

        <div className="col-span-12 md:col-span-6">
          <h1 className="mb-4 text-lg text-black dark:text-white">GST</h1>
          <label>
            <input
              type="radio"
              value="yes"
              checked={gstchecked === 'yes'}
              onChange={onGstChange}
              className="mr-2 h-4 w-4"
            />
            Yes
          </label>

          <label className="ml-4">
            <input
              type="radio"
              value="no"
              checked={gstchecked === 'no'}
              onChange={onGstChange}
              className="mr-2 h-4 w-4"
            />
            No
          </label>
        </div>

        {gstchecked === 'yes' && (
          <>
            <div className="col-span-12 md:col-span-6">
              <GenericInputField
                name="gst"
                label="GST Percentage"
                placeholder="5%"
                type="number"
              />
            </div>
            <div className="col-span-12 md:col-span-6">
              <GenericInputField
                name="totalPrice"
                label="Total Price"
                placeholder="20,000"
                disabled
              />
            </div>
          </>
        )}
      </>
    </>
  );
};

export default FunctionDetails;
