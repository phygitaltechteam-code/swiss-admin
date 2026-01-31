import React, {useState, useEffect} from 'react';
import {useFormContext, Controller} from 'react-hook-form';
import {DownIcon, GlobeIcon} from '../../../icons';

interface Option {
  value: string;
  label: string;
}

interface GenericSearchDropdownProps {
  name: string;
  label?: string;
  options: Option[];
  defaultOption?: string;
  error?: string; // 👈 Add error prop
}

const GenericSearchDropdown: React.FC<GenericSearchDropdownProps> = ({
  name,
  label,
  options,
  defaultOption = '',
  error, // 👈 Accept error
}) => {
  const {control} = useFormContext();
  const [searchTerm, setSearchTerm] = useState<string>(defaultOption);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(searchTerm);

  // Debounce search input
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
      render={({field: {onChange, value}}) => {
        useEffect(() => {
          const selectedOption = options.find(
            (option) => option.value === value,
          );
          setSearchTerm(selectedOption ? selectedOption.label : '');
        }, [value, options]);

        const handleInputClick = () => {
          setSearchTerm('');
          onChange('');
          setIsOpen(true);
        };

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
                onClick={handleInputClick}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className={`w-full rounded border-[1.5px] px-12 py-3 outline-none transition ${error ? 'border-red-500' : 'border-stroke'} focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white`}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-controls={`${name}-dropdown`}
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2">
                <DownIcon />
              </span>

              {isOpen && (
                <div
                  id={`${name}-dropdown`}
                  className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded border border-stroke bg-white shadow-lg dark:bg-form-input"
                  role="listbox"
                >
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <div
                        key={option.value}
                        onMouseDown={() => {
                          onChange(option.value);
                          setSearchTerm(option.label);
                          setIsOpen(false);
                        }}
                        className="hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer p-2"
                        role="option"
                        aria-selected={value === option.value}
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

            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>
        );
      }}
    />
  );
};

export default GenericSearchDropdown;
