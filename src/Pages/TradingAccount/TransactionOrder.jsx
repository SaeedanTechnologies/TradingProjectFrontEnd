import { Space, Tag, theme } from 'antd';
import React, { useState,useEffect } from 'react'
import {DeleteOutlined} from '@ant-design/icons';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomMUISelect from '../../components/CustomMUISelect';
import CustomTextField from '../../components/CustomTextField';
import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';
import { Link } from 'react-router-dom';

const TransactionOrder = () => {
  const {
    token: { colorBG, TableHeaderColor, colorPrimary  },
  } = theme.useToken();
  const [OperationsList, setOperationList] = useState([
    {  id: 1,title: 'Balance Comission' },
    {  id: 2,title: 'Tax' },
    {  id: 3,title: 'Credit Bonus' }
  ])
  const [SelectedOperation, setSelectedOperation] = useState(null)

  const columns = [
    {
      title: 'Time',
      dataIndex: 'Time',
      key: 'Time',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Deal',
      dataIndex: 'Deal',
      key: 'Deal',
    },
    {
      title: 'Type',
      dataIndex: 'Type',
      key: 'Type',
    },
    {
      title: 'Amount',
      dataIndex: 'Amount',
      key: 'Amount',
    },
   
  ];
  const data = [
    {
      key: '1',
      Time: '10:00 AM',
      Deal: 'Deal 1',
      Type: 'Type 1',
      Amount: '$1000',
    },
    {
      key: '2',
      Time: '11:30 AM',
      Deal: 'Deal 2',
      Type: 'Type 2',
      Amount: '$2000',
    },
    {
      key: '3',
      Time: '1:45 PM',
      Deal: 'Deal 3',
      Type: 'Type 3',
      Amount: '$1500',
    },
  ];
  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };


      useEffect(()=>{
    console.log('in transaction order by default')
  },[])
  return (
    <div className='p-8 border border-gray-300 rounded-lg' style={{ backgroundColor: colorBG }}>
       <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
       <CustomAutocomplete
            name={'Operations'} 
            varient={'standard'} 
            label={'Operations'}
            options={OperationsList}
            getOptionLabel={(option) => option.title ? option.title : ""}
            onChange={(e,value) =>{
                if(value){
                    setSelectedOperation(value)
                }
                else{
                    setSelectedOperation(null)
                } 
            }} 
            />
            <CustomMUISelect />
         
       </div>
       <div className="grid grid-cols-1 gap-8 mt-4">
          <CustomTextField label={'Comments'}
            multiline = {true}
            rows={4}
          />
       </div>
       <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <CustomButton
           Text={"Widthdraw"} 
           style={{height:"48px", backgroundColor:"#D52B1E", borderColor: "#D52B1E", borderRadius: "8px"}}
           />
          <CustomButton Text={"Deposit"}
           style={{height:"48px", borderRadius: "8px" }}
          />
        </div>
        <div className="mb-4 grid grid-cols-1  gap-4 mt-4">
        <CustomTable columns={columns} data={data} headerStyle={headerStyle} />
        </div>

    </div>
  )
}

export default TransactionOrder