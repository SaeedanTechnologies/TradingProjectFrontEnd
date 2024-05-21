import { theme, Spin, Dropdown } from 'antd';
import React, { useState,useEffect } from 'react'
import CustomTextField from '../../components/CustomTextField'
import CustomAutocomplete from '../../components/CustomAutocomplete'
import {  Countries, CurrenciesList, OperationsList, TransactionTypes } from '../../utils/constants';
import CustomPhoneNo from '../../components/CustomPhoneNo';
import CustomButton from '../../components/CustomButton';
import { useNavigate } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg'
import { Single_Transaction_Order, Trading_Transaction_Order, Update_Trading_Transaction_Order } from '../../utils/_SymbolSettingAPICalls';
import { LeftOutlined, RightOutlined, EllipsisOutlined,EditOutlined } from '@ant-design/icons';
import CustomNotification from '../../components/CustomNotification';
import { CustomBulkDeleteHandler } from '../../utils/helpers';
import { deleteTransactionOrderById } from '../../store/TradingAccountSlice';
import { GenericEdit, GenericDelete } from '../../utils/_APICalls';



const TradingAccountTransactionOrdersEntry = () => {

    const token = useSelector(({ user }) => user?.user?.token)
    const userRole = useSelector((state)=>state?.user?.user?.user?.roles[0]?.name);
    const userBrand = useSelector((state)=> state?.user?.user?.brand)
    const dispatch = useDispatch()

  const {
    token: { colorBG, TableHeaderColor, Gray2  },
  } = theme.useToken();



  const navigate = useNavigate()
  const [email ,setEmail] = useState('')
  const [SelectedCountry, setSelectedCountry] = useState(null)
  const [SelectedType,setSelectedType] = useState([])
  const [SelectedCurrency, setSelectedCurrency] = useState(null)
  const [SelectedMethod,setSelectedMethod] = useState(null)
  const [amount,setAmount] = useState('')
  const [comment,setComment] = useState('')
  const [phone,setPhone]= useState('')
  const [errors, setErrors] = useState({});

  const [isDisabled, setIsDisabled] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [transactionData,setTransactionData ] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [ CurrentPage,setCurrentPage] = useState(1)


   const TransactionOrdersIds = useSelector(({ tradingAccountList }) => tradingAccountList.selectedTransactionOrdersRowsIds)
  const TransactionOrdersData = useSelector(({tradingAccountList})=> tradingAccountList.TransactionOrdersData)
  const ArrangedTransactionOrdersData= TransactionOrdersData.slice().sort((a, b) => a.id - b.id);

  

  const Control = [
  
      {id: 7, control:'CustomTextField',  label:'Email', varient: 'standard',value :email  },
      {id: 6,  control:'CustomTextField',label:'Phone',varient:'standard', type:'number',value:phone}, 
     {
       id: 5, 
       control:'CustomAutocomplete',
       name:'Country',   
       label:'Country', 
       varient: 'standard',
       options:Countries,
       value:SelectedCountry,
       getOptionLabel:(option) => option.label ? option.label : "",
       onChange:(e,value) =>{
         if(value){
             setSelectedCountry(value)
         }
         else{
             setSelectedCountry(null)
         } 
         }   
     },  
     {
      id: 9, 
      control:'CustomAutocomplete',
      name:'Type',   
      label:'Type', 
      varient: 'standard',
      options:TransactionTypes,
      value:SelectedType,
      getOptionLabel:(option) => option.label ? option.label : "",
      onChange:(e,value) =>{
        if(value){
            setSelectedType(value)
        }
        else{
            setSelectedType(null)
        } 
        }   
    },
    {
      id: 10, 
      control:'CustomAutocomplete',
      name:'Method',   
      label:'Method', 
      varient: 'standard',
      options:OperationsList,
      value:SelectedMethod,
      getOptionLabel:(option) => option.label ? option.label : "",
      onChange:(e,value) =>{
        if(value){
            setSelectedMethod(value)
        }
        else{
            setSelectedMethod(null)
        } 
        }   
    },
    {id: 11, control:'CustomTextField',  label:'Amount', varient: 'standard',value: amount },
    {
      id: 12, 
      control:'CustomAutocomplete',
      name:'Curency',   
      label:'Curency', 
      varient: 'standard',
      options:CurrenciesList,
      value: SelectedCurrency,
      getOptionLabel:(option) => option.label ? option.label : "",
      onChange:(e,value) =>{
        if(value){
            setSelectedCurrency(value)
        }
        else{
            setSelectedCurrency(null)
        } 
        }   
    },
    {id: 13, control:'CustomTextField',  label:'Comment', varient: 'standard',value:comment  },
 ]
 const ComponentMap = {
  CustomTextField: CustomTextField,
  CustomAutocomplete: CustomAutocomplete,
  CustomPhoneNo: CustomPhoneNo,
};



const fetchTransactionOrder = async (page) => {
    setIsLoading(true)
    const res = await Single_Transaction_Order(token,TransactionOrdersIds[0],parseInt(page) )
    const { data: { message, payload, success } } = res
    setIsLoading(false)
    setStatesForEditMode(payload, success)
 
  }

 const setStatesForEditMode = async (payload, success)=>{
      if (success) {
        setIsLoading(true)
        const country = Countries.find((country)=>country.label === payload.country)
        const type= TransactionTypes.find((transaction)=>transaction.value === payload.type)
        const method = OperationsList.find((operation)=>operation.value === payload.method)
        const currency = CurrenciesList.find((currency)=>currency.value === payload.currency)

        setEmail(payload.email)
        setPhone(payload.phone)
        setSelectedCountry(country)
        setSelectedMethod(method)
        setAmount(payload.amount)
        setSelectedType(type)
        setSelectedCurrency(currency)
        setCurrentPage(payload.current_page)
        setComment(payload.comment)
   
        setIsLoading(false)
      }
   
  }

useEffect(() => {
    if (TransactionOrdersIds.length === 1 && parseInt(TransactionOrdersIds[0]) === 0) { // save
       setIsDisabled(false)
    } else if (TransactionOrdersIds.length === 1 && parseInt(TransactionOrdersIds[0]) !== 0) { // single edit
      const cIndex = ArrangedTransactionOrdersData.findIndex(item => parseInt(item.id) === parseInt(TransactionOrdersIds[0]))
      setCurrentIndex(cIndex)
      setIsDisabled(true)
        

      fetchTransactionOrder(1)
 
    
    } else { // mass edit
      setIsDisabled(true)
    }
  }, []);

  

  const handleNext = () => {
    if (currentIndex < ArrangedTransactionOrdersData.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      const payload = ArrangedTransactionOrdersData[currentIndex + 1];
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setStatesForEditMode(payload, true)
      }, 3000)
    }else{
      alert(`no next record found`)
    }
  };

 const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      const payload = ArrangedTransactionOrdersData[currentIndex - 1];
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setStatesForEditMode(payload, true)
      }, 3000)
      
    }
  };



   const deleteHandler = ()=>{
    const Params = {
      table_name:'transaction_orders',
      table_ids: [ArrangedTransactionOrdersData[currentIndex].id]
    }
    
    CustomBulkDeleteHandler(Params,token,GenericDelete, setIsLoading )
    dispatch(deleteTransactionOrderById(ArrangedTransactionOrdersData[currentIndex].id))
    if(ArrangedTransactionOrdersData.length === 0 || ArrangedTransactionOrdersData === undefined || ArrangedTransactionOrdersData === null){
       navigate("/single-trading-accounts/details/transaction-order")
    }else{
      if(currentIndex < ArrangedTransactionOrdersData.length)
      handleNext()
      else
      handlePrevious()
    }
    

  }

  const items = [
    
    {
      key: '1',
      label: (
        <button rel="noopener noreferrer" onClick={()=>{
          setIsDisabled(false)
        }}>   Edit </button>
      ),
    },
    {
      key: '2',
      label: (
        <button  rel="noopener noreferrer" onClick={deleteHandler} >   Delete  </button>
      ),
    },
   
  ];

 const handleSubmit = async () => {
  let brandId;
 
    try {
       
      if(userRole === 'brand' )
      {
        brandId = userBrand.public_key
      }
      else
      {
        brandId = null
      }
      
     const transactionOrderData = { 
        email,
        phone,
        country:SelectedCountry?.label,
        type:setSelectedType?.value,
        currency:SelectedCurrency?.value,
        method:setSelectedMethod?.value,
        amount,
        comment

      }
      
    
        setIsLoading(true)
                const Params = {
          table_name: 'transaction_orders',
          table_ids: TransactionOrdersIds,
          ...transactionOrderData
        }
        const res = await GenericEdit(Params, token)
        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        if (success) {
          CustomNotification({
            type: 'success',
            title: 'success',
            description: 'Transaction Order is Updated Successfully',
            key: 2
          })
           setIsDisabled(true)
        } else {
          setIsLoading(false)
          CustomNotification({
            type: 'error',
            title: 'error',
            description: message,
            key: `abc`
          })
        }

    

    } catch (err) {
      const validationErrors = {};
      err.inner?.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
  }
  };

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{backgroundColor: colorBG}}>
        
        <div className='flex justify-between'>
            <div className='flex gap-3 items-center'>
              <img
                src={ARROW_BACK_CDN}
                alt='back icon'
                className='cursor-pointer'
                onClick={() => navigate("/single-trading-accounts/details/transaction-order")}
              />
              {
                isDisabled ? <h1 className='text-2xl font-semibold'>Transaction Order</h1> :
                  <h1 className='text-2xl font-semibold'>{TransactionOrdersIds.length === 1 && parseInt(TransactionOrdersIds[0]) === 0 ? 'Add Transaction Order' : 'Edit Transaction Order'}</h1>
              }
            </div>
            {/* toolbar */}
            {(isDisabled && TransactionOrdersIds.length > 1) && <EditOutlined className='cursor-pointer' onClick={()=> setIsDisabled(false)} />}
            {(TransactionOrdersIds.length === 1 && parseInt(TransactionOrdersIds[0]) !== 0)  &&
              <div className='flex gap-4 bg-gray-100 py-2 px-4 rounded-md mb-4' >
            {isDisabled && <LeftOutlined className='text-[24px] cursor-pointer' onClick={handlePrevious} />}
              {isDisabled && <RightOutlined className='text-[24px] cursor-pointer' onClick={handleNext} />}
              <Dropdown
                menu={{
                  items,
                }}
                placement="bottom"
                arrow
                trigger={['click']}
                
              >
                <div className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer'> <EllipsisOutlined /> </div>
            </Dropdown>
            </div>
            }
          
          </div>


        <div className='bg-white border rounded-lg mt-6 p-4'>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {
              Control.map(val=> {
                const ComponentToRender = ComponentMap[val.control]
            return  val.control ===  'CustomAutocomplete' ?
                (
                  <ComponentToRender
                  name={val.name} 
                  variant={val.varient} 
                  label={val.label}
                  options={val.options}
                  value= {val.value}
                  disabled={isDisabled}
                  getOptionLabel={(option) => val.getOptionLabel(option)}
                  onChange={(e,value) => val.onChange(e,value)} 
                  />
                  ):(
                  <ComponentToRender
                  name={val.name} 
                  varient={val.varient} 
                  label={val.label}
                  disabled={isDisabled}
                  value= {val.value}
                  options={val.options}
                  getOptionLabel={(option) => val.getOptionLabel(option)}
                  onChange={(e,value) => val.onChange(e,value)} 
                  />
                  )
              })
            }
              
          </div>
        
          {
              !isDisabled && <div className='flex justify-center sm:justify-end flex-wrap items-center gap-4 mt-6'>
             <CustomButton
              Text={ TransactionOrdersIds.length === 1 && parseInt(TransactionOrdersIds[0]) === 0 ? 'Submit' : 'Update'}
              style={{
                padding: '16px',
                height: '48px',
                width: '200px',
                borderRadius: '8px',

              }}
              disabled={isDisabled}
              onClickHandler={handleSubmit}
            />
            
            <CustomButton
              Text='Cancel'
              style={{
                padding: '16px',
                height: '48px',
                width: '200px',
                borderRadius: '8px',
                backgroundColor: '#c5c5c5',
                borderColor: '#c5c5c5',
                color: '#fff'
              }}
              onClickHandler={()=> navigate(-1)}
            />
           
            </div>
          }
        
        </div>
      </div>
    </Spin>
  )
}

export default TradingAccountTransactionOrdersEntry