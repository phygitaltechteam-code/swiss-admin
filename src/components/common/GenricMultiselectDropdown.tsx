import {DownIcon, GlobeIcon, XIcon} from '@/icons';
import React, {useState, useEffect} from 'react';
import {useFormContext, Controller} from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface GenericMultiselectDropdownProps {
  name: string;
  label?: string;
  options: Option[];
  defaultOption?: string[];
  onChange?: (selected: string[]) => void;
}

const GenericMultiselectDropdown: React.FC<GenericMultiselectDropdownProps> = ({
  name,
  label,
  options,
  defaultOption = [],
  onChange,
}) => {
  const {
    control,
    formState: {errors},
  } = useFormContext(); // 👈 get errors
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] =
    useState<string[]>(defaultOption);

  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(searchTerm);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
  );

  const handleSelect = (option: Option) => {
    const isSelected = selectedOptions.includes(option.value);
    const newSelectedOptions = isSelected
      ? selectedOptions.filter((value) => value !== option.value)
      : [...selectedOptions, option.value];

    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleRemoveOption = (value: string) => {
    const newSelectedOptions = selectedOptions.filter(
      (option) => option !== value,
    );
    setSelectedOptions(newSelectedOptions);
    onChange?.(newSelectedOptions);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultOption}
      render={({field: {onChange: rhfOnChange, value}}) => {
        useEffect(() => {
          rhfOnChange(selectedOptions); // sync with react-hook-form
        }, [selectedOptions]);

        const errorMessage = errors[name]?.message as string | undefined; // 👈 error message

        return (
          <div className="relative">
            {label && (
              <label className="mb-2.5 block text-black dark:text-white">
                {label}
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
                className={`w-full rounded border-[1.5px] bg-transparent px-12 py-3 outline-none transition dark:border-form-strokedark dark:bg-form-input dark:text-white ${'border-stroke focus:border-primary'}`}
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2">
                <DownIcon />
              </span>

              {isOpen && (
                <div
                  className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded border border-stroke bg-white shadow-lg dark:bg-form-input"
                  role="listbox"
                >
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handleSelect(option)}
                        className={`cursor-pointer p-2 ${
                          selectedOptions.includes(option.value)
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
              {selectedOptions.map((value) => {
                const option = options.find((opt) => opt.value === value);
                return option ? (
                  <span
                    key={value}
                    className="flex items-center rounded-full bg-blue-200 px-3 py-1 text-sm text-blue-800 dark:bg-form-input dark:text-blue-300"
                  >
                    {option.label}
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(value)}
                      className="ml-2 text-lg text-black dark:text-gray"
                    >
                      <XIcon />
                    </button>
                  </span>
                ) : null;
              })}
            </div>

            {/* 🔴 Show validation error */}
            {errorMessage && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">
                {errorMessage}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

export default GenericMultiselectDropdown;
