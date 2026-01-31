// components/Manager/FunctionWorks.tsx
import React from 'react';
import GenericDropdown from '../Forms/DropDown/GenericDropDown';
import GenericInputField from '../Forms/Input/GenericInputField';
import EventWorks from '../Manager/EventWorks';

interface Props {
  addonFields: any[];
  appendAddon: () => void;
  removeAddon: (index: number) => void;
  extraProductFields: any[];
  appendExtraProduct: () => void;
  removeExtraProduct: (index: number) => void;
  workOptions: any[];
  itemOptions: any[];
}

const FunctionWorks: React.FC<Props> = ({
  addonFields,
  appendAddon,
  removeAddon,
  extraProductFields,
  appendExtraProduct,
  removeExtraProduct,
  workOptions,
  itemOptions,
}) => {
  return (
    <>
      <EventWorks />

      {/* Addons */}
      <div className="col-span-12 space-y-2">
        <h1 className="text-lg font-semibold text-blue-500">Addons</h1>
        {addonFields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-wrap items-end gap-4 md:flex-nowrap"
          >
            <div className="w-full md:w-1/4">
              <GenericDropdown
                label="Work"
                name={`addons.${index}.work`}
                options={workOptions}
              />
            </div>
            <div className="w-full md:w-1/4">
              <GenericInputField
                type="date"
                name={`addons.${index}.date`}
                label="Date"
              />
            </div>
            <div className="w-full md:w-1/4">
              <GenericInputField
                type="time"
                name={`addons.${index}.time`}
                label="Time"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => appendAddon()}
                className="rounded bg-green-500 px-4 py-2 text-white"
              >
                Add
              </button>
              {addonFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAddon(index)}
                  className="rounded bg-red-500 px-4 py-2 text-white"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Extra Products */}
      <div className="col-span-12 space-y-2">
        <h1 className="text-lg font-semibold text-blue-500">Extra Products</h1>
        {extraProductFields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-wrap items-end gap-4 md:flex-nowrap"
          >
            <div className="w-full md:w-1/5">
              <GenericDropdown
                label="Product"
                name={`extraProducts.${index}.product`}
                options={itemOptions}
              />
            </div>
            <div className="w-full md:w-1/5">
              <GenericInputField
                name={`extraProducts.${index}.quantity`}
                placeholder="Quantity"
                label="Qty"
              />
            </div>
            <div className="w-full md:w-1/5">
              <GenericInputField
                type="date"
                name={`extraProducts.${index}.date`}
                label="Date"
              />
            </div>
            <div className="w-full md:w-1/5">
              <GenericInputField
                type="time"
                name={`extraProducts.${index}.time`}
                label="Time"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => appendExtraProduct()}
                className="rounded bg-green-500 px-4 py-2 text-white"
              >
                Add
              </button>
              {extraProductFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExtraProduct(index)}
                  className="rounded bg-red-500 px-4 py-2 text-white"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default FunctionWorks;
