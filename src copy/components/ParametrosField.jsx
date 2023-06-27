import { Field, ErrorMessage } from 'formik';

const ParametrosField = ({ name, label, type, required }) => {
  return (
    <div className="mb-6">
      <div className="group relative z-0 w-full">
        <label
          htmlFor={name}
          // className="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 text-gray-600 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 "
          className="mb-2 ml-1 text-xs font-bold text-slate-700 dark:text-white/80">
          {label}:
        </label>
        <Field
          id={name}
          name={name}
          className="focus:shadow-primary-outline dark:bg-slate-900 dark:placeholder:text-white/80 dark:text-white/80 text-sm leading-5.6 ease block w-full appearance-none rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-2 font-normal text-gray-700 outline-none transition-all placeholder:text-gray-500 focus:border-black focus:outline-none"
          type={type}
          required={required}
        />        
      </div>

      <div className="text-red-500 text-sm">
        <ErrorMessage name={name} />
      </div>
    </div>
  );
};

export default ParametrosField;
