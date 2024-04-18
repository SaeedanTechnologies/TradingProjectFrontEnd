import React from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

const CustomAutocomplete = ({ name, id, defaultValue, options, getOptionLabel, onChange, variant, label, multiple }) => {
  return (
    <Autocomplete
      multiple={multiple}
      name={name}
      id={id}
      variant= {variant}
      defaultValue={defaultValue && defaultValue}
      options={options}
      getOptionLabel={getOptionLabel}
      onChange={onChange}
      renderInput={(params) => <TextField {...params} label={label} name={name} variant={variant} />}
      fullWidth
    />
  );
};

export default CustomAutocomplete;
