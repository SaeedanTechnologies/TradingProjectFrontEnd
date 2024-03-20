import React from 'react';
import {Dropdown} from 'antd';


const CustomDropdownBtn = ({ Text, menuProps }) => (
  <Dropdown.Button menu={menuProps} >
    {Text}
  </Dropdown.Button>
);
export default CustomDropdownBtn;