import React, { useState } from 'react';
import {  Table, Checkbox, theme} from 'antd';

import CustomDropdownBtn from './CustomDropdownBtn';
import CustomButton from './CustomButton';
import styled, {css} from "styled-components";

const columns = [
  {
    title: 'Column 1',
    dataIndex: 'address',
    key: '1',
  },
  {
    title: 'Column 2',
    dataIndex: 'address',
    key: '2',
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    key: '3',
  },
  {
    title: 'Column 4',
    dataIndex: 'address',
    key: '4',
  },
  {
    title: 'Column 5',
    dataIndex: 'address',
    key: '5',
  },
  {
    title: 'Column 6',
    dataIndex: 'address',
    key: '6',
  },
  {
    title: 'Column 7',
    dataIndex: 'address',
    key: '7',
  },
  {
    title: 'Column 8',
    dataIndex: 'address',
    key: '8',
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 40,
    address: 'London Park',
  },
];
const defaultCheckedList = columns.map((item) => item.key);

const VerticalCheckboxGroup = styled(Checkbox.Group)`
  ${(props) =>
    props.backgroundColor &&
    css`
      &  .ant-checkbox-group-item {
        display: flex;
        align-items: center;
        height: 32px;
        margin-right: 0;
      }
      ,
      .ant-checkbox-checked .ant-checkbox-inner {
        background-color: ${props.backgroundColor};
        border-color: ${props.backgroundColor};
      }
    `}
`;
const CustomTable = ({ title, isHideColumns, isAddButton, BtnText, BtnIcon, BtnStyle }) => {
  const { token: { colorPrimary, TableHeaderColor } } = theme.useToken();
  const [checkedList, setCheckedList] = useState(defaultCheckedList);

  const newColumns = columns.map((item) => ({
    ...item,
    hidden: !checkedList.includes(item.key),
  }));

  const handleMenuClick = (e) => {};

  const columnMenuProps = {
    items: columns.map((column) => ({
      key: column.key,
      icon: (
        <VerticalCheckboxGroup
          value={checkedList}
          options={[{ label: column.title, value: column.key }]} // Use the column title as label and key
          onChange={(value) => {
            const newCheckedList = [...checkedList];
            if (value.includes(column.key)) {
              newCheckedList.push(column.key);
            } else {
              const index = newCheckedList.indexOf(column.key);
              if (index !== -1) {
                newCheckedList.splice(index, 1);
              }
            }
            setCheckedList(newCheckedList);
          }}
          backgroundColor={colorPrimary}
        />
      ),
    })),
    onClick: handleMenuClick,
  };

  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>{title}</h1>
        {isHideColumns && (
          <div>
            <CustomDropdownBtn Text='Manage Columns' menuProps={columnMenuProps} />
          </div>
        )}
        {isAddButton && <CustomButton Text={BtnText} style={BtnStyle} icon={BtnIcon} />}
      </div>
      <div style={{ overflowX: 'auto' }}> {/* Add overflow-x auto to enable horizontal scrolling */}
        <Table
          columns={newColumns}
          dataSource={data}
          style={{
            marginTop: 24,
          }}
          components={{
            header: {
              cell: (props) => <th {...props} style={headerStyle} />,
            },
          }}
        />
      </div>
    </>
  );
};

export default CustomTable;