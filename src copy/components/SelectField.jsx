import React from 'react';
import Select from 'react-select';

const SelectField = ({ options, field, form, ...props }) => (
  <Select
    options={options}
    id={field.name}
    name={field.name}
    inputId={field.name}
    {...props}
    value={
      options ? options.filter((option) => option.value === field.value) : ''
    }
    onChange={(option) => form.setFieldValue(field.name, option.value)}
    onBlur={field.onBlur}
  />
);

export default SelectField;
