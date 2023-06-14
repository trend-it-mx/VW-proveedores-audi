import { Field, ErrorMessage } from 'formik';

const ParametrosField = ({ name, label, type, required }) => {
  return (
    <div className="mb-6">
      <div className="group relative z-0 w-full">
        <Field
          id={name}
          name={name}
          className="peer block w-full appearance-none border-0 border-b-2 border-gray-600 bg-transparent pt-4 px-0 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
          type={type}
          required={required}
        />
        <label
          htmlFor={name}
          className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-gray-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 "
        >
          {label}:
        </label>
      </div>

      <div className="text-red-500 text-sm">
        <ErrorMessage name={name} />
      </div>
    </div>
  );
};

export default ParametrosField;
