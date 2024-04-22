import { Space, Tag, theme,Spin } from 'antd';
import React, { useState,useEffect } from 'react'
import {DeleteOutlined} from '@ant-design/icons';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import CustomMUISelect from '../../components/CustomMUISelect';
import CustomTextField from '../../components/CustomTextField';
import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';

import { Link } from 'react-router-dom';
import { numberInputStyle } from './style';
import { Save_Transaction_Order,Get_Transaction_Orders } from '../../utils/_TransactionOrderAPI';
import { useSelector } from 'react-redux';
import { TransactionOrderValidationSchema } from '../../utils/validations';
import moment from 'moment'
import CustomNotification from '../../components/CustomNotification';



const TransactionOrder = () => {
  
  const token = useSelector(({user})=> user?.user?.token )
  const {
    token: { colorBG, TableHeaderColor, colorPrimary  },
  } = theme.useToken();

const trading_account_id = useSelector((state)=> state?.trade?.trading_account_id )  
const [transactionOrders,setTransactionOrders] = useState([]) 
const [method,setMethod] = useState(null)
const [amount,setAmount] = useState('')
const [comment,setComment] = useState('')
const [OperationsList, setOperationList] = useState([
  {"label": "balance", "value": "balance"},
  {"label": "commissiontax", "value": "commissiontax"},
  {"label": "Credit", "value": "Credit"},
  {"label": "bonus", "value": "bonus"}
   ])
const [errors,setErrors] = useState({})   

  const [isLoading,setIsLoading] = useState(false) 

  const [SelectedOperation, setSelectedOperation] = useState(null)

  const columns = [
    {
      title: 'Time',
      dataIndex: 'Time',
      key: 'Time',
      render: (text) => <a>{moment(text).format("YYYY-MM-DD HH:mm")}</a>,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
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

  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      
      case 'amount':
        setAmount(value);
        break;
      case 'comment':
        setComment(value);
        break;
         
    }
  };


  const fetchTransactionOrder= async () => {
    try {
      setIsLoading(true)
      const res = await Get_Transaction_Orders(trading_account_id, token);
      const { data: { message, success, payload } } = res
      setTransactionOrders(payload.data)
      
      setIsLoading(false)

    } catch (error) {
      console.error('Error fetching transactions Order', error);
    }
  };


    const clearFields = () =>{
      setMethod(null)
      setAmount('')
      setComment('')
    }

    const handleSubmit = async(type)=> {
    try{
      await TransactionOrderValidationSchema.validate({
        trading_account_id,
        method,
        amount,
        }, { abortEarly: false });

      setErrors({});
      const TransactionOrderData = {
        trading_account_id,
        method:method.value,
        amount,
        comment,
        currency:null,
        name:null,
        group:null,
        type,
        status:"requested"
        
      }
      
      setIsLoading(true)
       const res = await Save_Transaction_Order(TransactionOrderData, token)
       const {data: {message, payload, success}} = res
       if(success)
    {
      setIsLoading(false)
       CustomNotification({ type:"success", title:"Transaction Order", description:message, key:1 })
       fetchTransactionOrder()
       clearFields()  
    }   
    else{
      setIsLoading(false)
      CustomNotification({ type:"error", title:"Transaction Order", description:message, key:1 }) 
    }    
    
    }catch(err){
      CustomNotification({ type:"error", title:"Transaction Order", description:err.message, key:1 })
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  }

  

  useEffect(()=>{
   fetchTransactionOrder()
  },[])

   
  return (
     <Spin spinning={isLoading} size="large">
      <div className='p-8 border border-gray-300 rounded-lg' style={{ backgroundColor: colorBG }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
          <div>
            <CustomAutocomplete
              name={'Operations'} 
              variant={'standard'} 
              label={'Operations'}
              value={method}
              options={OperationsList}
              getOptionLabel={(option) => option.label ? option.label : ""}
              onChange={(e,value) =>{
                  if(value){

                     setErrors(prevErrors => ({ ...prevErrors, method: {} }))
                     setMethod(value)
                  }
                  else{
                      setMethod(null)
                  } 
              }} 
              />
            {errors.method?.value && <span style={{ color: 'red' }}>{errors.method?.value}</span>}
          </div>
        
          <div>
            <CustomTextField  label={'Amount'} varient={'standard'} type="number" sx={numberInputStyle} value={amount}  onChange={e => handleInputChange('amount', e.target.value)} />    
            {errors.amount && <span style={{ color: 'red' }}>{errors.amount}</span>}
          </div>  

        </div>

        <div className="grid grid-cols-1 gap-8 mt-4">
            <CustomTextField label={'Comments'}
              multiline = {true}
              rows={4}
              value={comment}
              onChange={e => handleInputChange('comment', e.target.value)}
            />
        </div>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <CustomButton
            Text={"With Draw"} 
            style={{height:"48px", backgroundColor:"#D52B1E", borderColor: "#D52B1E", borderRadius: "8px"}}
              onClickHandler={()=>handleSubmit('withdraw')}
            />
            <CustomButton Text={"Deposit"}
            style={{height:"48px", borderRadius: "8px" }}
              onClickHandler={()=>handleSubmit('deposit')}
            />
          </div>
          <div className="mb-4 grid grid-cols-1  gap-4 mt-4">
          <CustomTable columns={columns} data={transactionOrders} headerStyle={headerStyle} />
          </div>

      </div>
    </Spin>
  )
}

export default TransactionOrder