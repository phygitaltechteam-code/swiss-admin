import React, {useState, useEffect} from 'react';
import {useFormContext, Controller} from 'react-hook-form';
import {DownIcon, GlobeIcon, XIcon} from '../../../icons';

interface Option {
  value: string;
  label: string;
}

interface GenericMultiselectDropdownProps {
  name: string;
  label?: string;
  options: Option[];
  defaultOption?: string[];
  required?: boolean;
}

const GenericMultiselectDropdown: React.FC<GenericMultiselectDropdownProps> = ({
  name,
  label,
  options,
  defaultOption = [],
  required = false,
}) => {
  const {control} = useFormContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  );

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultOption}
      render={({field: {value = [], onChange}, fieldState: {error}}) => {
        const handleSelect = (option: Option) => {
          const newSelected = value.includes(option.value)
            ? value.filter((v: string) => v !== option.value)
            : [...value, option.value];
          onChange(newSelected);
          setSearchTerm('');
          setIsOpen(false);
        };

        const handleRemoveOption = (val: string) => {
          const newSelected = value.filter((v: string) => v !== val);
          onChange(newSelected);
        };

        return (
          <div className="relative">
            {label && (
              <label className="mb-2.5 block text-black dark:text-white">
                {label}
                <span className="text-lg font-bold text-red-600">
                  &nbsp;{required && '*'}
                </span>
              </label>
            )}

            <div className="relative bg-white dark:bg-form-input">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <GlobeIcon />
              </span>

              <input
                type="text"
                placeholder={`Search ${label}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className={`w-full rounded border-[1.5px] px-12 py-1.5 outline-none transition ${
                  error
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-stroke focus:border-primary dark:border-form-strokedark'
                } dark:bg-form-input dark:text-white`}
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2">
                <DownIcon />
              </span>

              {isOpen && (
                <div className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded border border-stroke bg-white shadow-lg dark:bg-form-input">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <div
                        key={option.value}
                        onMouseDown={() => handleSelect(option)}
                        className={`cursor-pointer p-2 ${
                          value.includes(option.value)
                            ? 'bg-blue-100 dark:bg-blue-600'
                            : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {option.label}
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400 p-2">
                      No options found
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-2 flex flex-wrap gap-2">
              {value.map((val: string) => {
                const opt = options.find((o) => o.value === val);
                return opt ? (
                  <span
                    key={val}
                    className="flex items-center rounded-full bg-blue-200 px-3 py-1 text-sm text-blue-800 dark:bg-form-input dark:text-blue-300"
                  >
                    {opt.label}
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(val)}
                      className="ml-2 text-lg text-black dark:text-gray"
                    >
                      <XIcon />
                    </button>
                  </span>
                ) : null;
              })}
            </div>

            {/* ✅ Show error message here */}
            {error && (
              <p className="mt-1 text-sm text-red-500">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export default GenericMultiselectDropdown;
