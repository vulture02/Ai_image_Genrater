import React from 'react';

const FormField = ({
  labelName,
  type = "text",
  name,
  placeholder,
  value,
  handleChange,
  isSurpriseMe = false,
  handleSurpriseMe,
  required = true
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {labelName}
        </label>
        {isSurpriseMe && (
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="font-semibold text-xs bg-indigo-500 text-white py-1 px-2 rounded-md shadow-sm hover:bg-indigo-600 transition-colors"
          >
            Surprise Me
          </button>
        )}
      </div>

      <input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required={required}
        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg
                  focus:ring-indigo-500 focus:border-indigo-500 shadow-sm
                  outline-none block w-full p-3 transition-all duration-200"
      />
    </div>
  );
};

export default FormField;