import React, {useState} from 'react';
import {useFormContext} from 'react-hook-form';
import {Eye, EyeOff} from 'lucide-react';
import get from 'lodash.get';

interface InputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  defaultValue?: string;
  required?: boolean;
  customOnChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // ⭐ add this
}

const GenericInputField: React.FC<InputProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  disabled = false,
  defaultValue,
  required = false,
  customOnChange,
}) => {
  const {
    register,
    formState: {errors},
    setValue,
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;

    // number conversion
    if (type === 'number') {
      setValue(name, Number(value));
    }

    // ⭐ call user-defined customOnChange
    if (customOnChange) customOnChange(e);
  };

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const fieldError = get(errors, name);
  const isRequired = fieldError?.type === 'required';

  return (
    <div className="relative w-full">
      {label && (
        <label className="mb-2.5 block text-black dark:text-white">
          {label}
          <span className="text-lg font-bold text-red-600">
            &nbsp;{required && '*'}
          </span>
        </label>
      )}

      <input
        type={inputType}
        placeholder={placeholder}
        disabled={disabled}
        defaultValue={defaultValue}
        className={`w-full rounded border-[1.7px] bg-transparent px-3 py-1 text-black outline-none transition ${fieldError ? 'border-red-500' : 'border-stroke'} focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary`}
        // ⭐ use RHF register with custom onChange
        {...register(name, {
          onChange: handleInputChange,
        })}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-gray-500 hover:text-gray-700 absolute bottom-0 right-3 top-1/3"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}

      {fieldError && (
        <p className="mt-1 text-sm text-red-500">
          {fieldError.message as string}
        </p>
      )}
    </div>
  );
};
export default GenericInputField;
