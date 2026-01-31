import React, {useState, useRef, useEffect} from 'react';

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  name: string;
  label: string;
  options: Option[];
  value: string[];
  onChange: (selected: string[]) => void;
  required?: boolean;
  error?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  name,
  label,
  options,
  value = [], // Default to empty array
  onChange,
  required = false,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ✅ Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    const currentValue = Array.isArray(value) ? value : [];
    if (currentValue.includes(val)) {
      onChange(currentValue.filter((v) => v !== val));
    } else {
      onChange([...currentValue, val]);
    }
  };

  const handleRemove = (val: string) => {
    const currentValue = Array.isArray(value) ? value : [];
    onChange(currentValue.filter((v) => v !== val));
  };

  // Ensure value is always an array
  const selectedValues = Array.isArray(value) ? value : [];

  return (
    <div className="mb-4" ref={dropdownRef}>
      <label className="mb-3 block text-black dark:text-white">
        {label}
        <span className="text-lg font-bold text-red-600">
          &nbsp;{required && '*'}
        </span>
      </label>

      <div className="relative">
        <div
          className={`relative flex w-full cursor-pointer flex-wrap items-center gap-1 rounded border px-4 py-1.5 outline-none transition ${error ? 'border-red-500' : 'border-stroke'} bg-white focus:border-primary dark:border-form-strokedark dark:bg-form-input`}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {selectedValues.length > 0 ? (
            selectedValues
              .map((val) => {
                const selectedOption = options.find((opt) => opt.value === val);
                // Safe check for option existence
                if (!selectedOption) return null;

                return (
                  <span
                    key={val}
                    className="bg-gray-100 dark:bg-gray-800 flex items-center gap-1 rounded bg-neutral-200 px-2 text-sm text-black dark:text-white"
                  >
                    {selectedOption.label}
                    <button
                      type="button"
                      className="text-gray-500 dark:text-gray-400 hover:text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(val);
                      }}
                    >
                      ✕
                    </button>
                  </span>
                );
              })
              .filter(Boolean) // Remove null values
          ) : (
            <span className="text-gray-400 dark:text-gray-500 text-sm">
              Select...
            </span>
          )}
        </div>

        <span className="absolute right-4 top-1/2 -translate-y-1/2 transform">
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g opacity="0.8">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                fill="#637381"
              ></path>
            </g>
          </svg>
        </span>

        {isOpen && (
          <div className="absolute z-40 mt-1 max-h-48 w-full overflow-auto rounded border border-stroke bg-white shadow-lg dark:border-form-strokedark dark:bg-form-input">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer px-4 py-3 text-sm ${
                  selectedValues.includes(opt.value)
                    ? 'bg-blue-50 font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                    : 'text-black dark:text-white'
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default MultiSelect;
