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
  value?: string; // Controlled value
  onChange?: (value: string) => void; // Controlled onChange
}

const GenericTextSearchDropdown: React.FC<GenericSearchDropdownProps> = ({
  name,
  label,
  options,
  defaultOption = '',
  value: controlledValue,
  onChange: controlledOnChange,
}) => {
  const {control, getValues} = useFormContext();

  const isControlled =
    controlledValue !== undefined && typeof controlledOnChange === 'function';

  const [searchTerm, setSearchTerm] = useState<string>(defaultOption);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] =
    useState<string>(searchTerm);

  // Debounce the search term
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

  // Sync search term with selected value
  useEffect(() => {
    const currentValue = isControlled ? controlledValue : getValues(name);
    const selectedOption = options.find(
      (option) => option.value === currentValue,
    );

    if (selectedOption) {
      setSearchTerm(selectedOption.label);
    } else if (typeof currentValue === 'string') {
      setSearchTerm(currentValue);
    } else {
      setSearchTerm('');
    }
  }, [name, options, getValues, controlledValue, isControlled]);

  const handleInputClick = (onChange: (value: string) => void) => {
    setSearchTerm('');
    onChange('');
    setIsOpen(true);
  };

  const handleBlur = (onChange: (value: string) => void) => {
    setTimeout(() => {
      setIsOpen(false);
      const matchedOption = options.find(
        (option) => option.label.toLowerCase() === searchTerm.toLowerCase(),
      );
      if (!matchedOption) {
        onChange(searchTerm);
      }
    }, 200);
  };

  const handleSelect = (option: Option, onChange: (value: string) => void) => {
    onChange(option.value);
    setSearchTerm(option.label);
    setIsOpen(false);
  };

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultOption}
      render={({field}) => {
        const currentValue = isControlled ? controlledValue : field.value;
        const onChange = isControlled ? controlledOnChange! : field.onChange;

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
                onClick={() => handleInputClick(onChange)}
                onFocus={() => setIsOpen(true)}
                onBlur={() => handleBlur(onChange)}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-12 py-3 outline-none transition focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
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
                        onMouseDown={() => handleSelect(option, onChange)}
                        className="hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer p-2"
                        role="option"
                        aria-selected={currentValue === option.value}
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
          </div>
        );
      }}
    />
  );
};

export default GenericTextSearchDropdown;
