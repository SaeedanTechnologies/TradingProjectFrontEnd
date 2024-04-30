import React, { useState, useRef } from 'react';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

const CustomNumberTextField = ({
  value,
  initialFromState,
  checkFirst,
  onChange,
  label,
  fullWidth,
  step,
  min,
  max,
  ...rest
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const isFirstClick = useRef(true);

  const handleChange = (event) => {
    const newValue = parseFloat(event.target.value);
    if (isFirstClick.current && checkFirst) {
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        setCurrentValue(initialFromState);
        isFirstClick.current = false;
        onChange(initialFromState);
      }
    } else {
      const adjustedValue = newValue
    //   parseFloat((currentValue + step * Math.sign(newValue - currentValue)).toFixed(1));
      if (!isNaN(adjustedValue) && adjustedValue >= min && adjustedValue <= max) {
        setCurrentValue(adjustedValue);
        onChange(adjustedValue);
      }
    }
  };

  return (
    <TextField
      type="number"
      label={label}
      value={currentValue}
      InputProps={{ inputProps: { step, min, max }, style: { border: 'none' } }}
      onChange={handleChange}
      variant="standard"
      fullWidth={fullWidth}
      {...rest}
    />
  );
};

CustomNumberTextField.propTypes = {
  value: PropTypes.number,
  initialFromState: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  fullWidth: PropTypes.bool,
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
};

CustomNumberTextField.defaultProps = {
  value: 0,
  label: 'Number',
  fullWidth: false,
  step: 1,
  min: Number.NEGATIVE_INFINITY,
  max: Number.POSITIVE_INFINITY,
};

export default CustomNumberTextField;
