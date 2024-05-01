import React, { useState, useRef } from 'react';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';

const CustomNumberTextField1 = ({
  value,
  initialFromState,
  checkFirst,
  onChange,
  label,
  fullWidth,
  min,
  max,
  step,
  ...rest
}) => {
  const [currentValue, setCurrentValue] = useState(value);
  const isFirstClick = useRef(true);

  function incrementNumber(num) {
    if (Number.isInteger(num)) {
    return num + 1;
    } else {
    let numStr = num.toString();
    let [integerPart, decimalPart] = numStr.split('.');
    if (!decimalPart) {
    decimalPart = '0';
    }
    decimalPart = (parseInt(decimalPart) + 1).toString().padStart(decimalPart.length, '0');
    return parseFloat(integerPart + '.' + decimalPart);
    }
    }
    

    function decrementNumber(num) {
      if (Number.isInteger(num)) {
      return num - 1;
      } else {
      let numStr = num.toString();
      let [integerPart, decimalPart] = numStr.split('.');
      if (!decimalPart) {
      decimalPart = '0';
      }
      decimalPart = (parseInt(decimalPart) - 1).toString().padStart(decimalPart.length, '0');
      return parseFloat(integerPart + '.' + decimalPart);
      }
      }

  const handleChange = (event) => {
    const newValue = event.target.value;
    if (isFirstClick.current && checkFirst) {
      if (!isNaN(initialFromState) && initialFromState >= min && initialFromState <= max) {
        setCurrentValue(initialFromState);
        isFirstClick.current = false;
        onChange(initialFromState);
      }
    } else {
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        setCurrentValue(newValue);
        onChange(newValue);
      }
    }
  };

  const handleIncrement = () => {
    // const newValue = parseFloat(event.target.value);
    if (isFirstClick.current && checkFirst) {
      if (!isNaN(initialFromState) && initialFromState >= min && initialFromState <= max) {
        setCurrentValue(initialFromState);
        isFirstClick.current = false;
        onChange(initialFromState);
      }
    } else {
      const newValue = incrementNumber (currentValue)
      // const newValue = currentValue + step;
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        setCurrentValue(newValue)
        onChange(newValue);
      }
    }
  }

  const handleDecrement = () => {
    // const newValue = parseFloat(event.target.value);
    // const newValue = currentValue - step;
    const newValue = decrementNumber(currentValue)
    if (isFirstClick.current && checkFirst) {
      if (!isNaN(initialFromState) && initialFromState >= min && initialFromState <= max) {
        setCurrentValue(initialFromState);
        isFirstClick.current = false;
        onChange(initialFromState);
      }
    } else {
      // setCurrentValue((prevValue) => {
      if (!isNaN(newValue) && newValue >= min && newValue <= max) {
        onChange(newValue);
        setCurrentValue(newValue)
        // return newValue;
      }
      // else {
      //   return prevValue;
      // }
      // });
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        type="text"
        label={label}
        value={currentValue}
        inputProps={{ step, min, max }}
        onChange={handleChange}
        variant="standard"
        fullWidth={fullWidth}
        {...rest}
      />
      <div style={{
        marginLeft: '8px',
        fontSize: '24px',
        cursor:'pointer',
      }}>
        <button onClick={handleIncrement}>+</button>
        <button onClick={handleDecrement}>-</button>
      </div>
    </div>
  );
};

CustomNumberTextField1.propTypes = {
  value: PropTypes.number,
  initialFromState: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  fullWidth: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
};

CustomNumberTextField1.defaultProps = {
  value: 0,
  label: 'Number',
  fullWidth: false,
  min: Number.NEGATIVE_INFINITY,
  max: Number.POSITIVE_INFINITY,
  step: 0.1
};

export default CustomNumberTextField1;
