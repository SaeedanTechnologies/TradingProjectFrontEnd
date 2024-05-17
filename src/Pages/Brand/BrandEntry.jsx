import React, { useEffect, useState } from 'react';
import CustomTextField from '../../components/CustomTextField';
import { footerStyle, submitStyle } from './style';
import CustomButton from '../../components/CustomButton';
import { LeftOutlined, RightOutlined, EllipsisOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { GenericDelete, GenericEdit, GetSingleBrand, SaveBrands, UpdateBrand } from '../../utils/_APICalls';
import { LeverageList, notifyError, notifySuccess } from '../../utils/constants';
import { ToastContainer } from 'react-toastify';
import { Dropdown, Spin, theme } from 'antd';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { useNavigate } from 'react-router-dom';
import { deleteBrandById, updateBrandsData } from '../../store/BrandsSlice';
import { CustomBulkDeleteHandler } from '../../utils/helpers';
import CustomNotification from '../../components/CustomNotification';
import { EditOutlined } from '@mui/icons-material';


const BrandEntry = () => {

    const BrandIds = useSelector(({ brands }) => brands?.selectedRowsIds)
    const BrandGroupData = useSelector(({brands})=> brands?.brandData)
   const ArrangedBrandData = BrandGroupData?.slice().sort((a, b) => a.id - b.id);

    const {token: { colorBG },} = theme.useToken()
    const navigate = useNavigate()
    const dispatch  = useDispatch()
  const token = useSelector(({ user }) => user?.user?.token)
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
// //   const [disabledDomain, setDisabledDomain] = useState(false);
  const [marginCall, setMarginCall] = useState('');
  const [leverage, setLeverage] = useState('');
  const [errors, setErrors] = useState({}); 
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    domain: Yup.string()
      .required('Domain is required')
      .matches(
        /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
        'Invalid domain'
      ),
    marginCall: Yup.number().required('Margin Call is required').positive('Margin Call must be a positive number'),
    leverage: Yup.object().required('Leverage is required'),
  });

  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'name':
        setName(value);
        break;
      case 'domain':
        setDomain(value);
        break;
      case 'marginCall':
        setMarginCall(value);
        break;
        case 'leverage':
          setLeverage(value);
        break;
      default:
        break;
    }
  };

  const clearFields = () => {
    setName('')
    setDomain('')
    setMarginCall('')
    setLeverage('')
  }

  const handleSubmit = async () => {
    try {
        if(BrandIds?.length < 2)
            {
      await validationSchema.validate({
        name,
        domain,
        marginCall,
        leverage
      }, { abortEarly: false });

      setErrors({});
    }
      const BrandData = {
        name: name,
        domain: domain,
        margin_call: marginCall,
        leverage: leverage.value
      }
    //   if (BrandID === 0) {
        if(BrandIds.length === 1 && parseInt(BrandIds[0]) === 0){
        setIsLoading(true)
        
        const res = await SaveBrands(BrandData, token)
        const { data: { message, payload, success } } = res
        setIsLoading(false)
        if (success) {
          notifySuccess(message)
        //   setIsModalOpen(false)
        //   fetchBrands()
          clearFields()
        } else {
          notifyError(message)
        }
      } 
      else if(BrandIds.length >= 2){
        setIsLoading(true)
        const Params = {
         table_name: 'brands',
         table_ids: BrandIds,
         ...BrandData
      }
      const res = await GenericEdit(Params, token)
        const { data: { message, success, payload } } = res;
        if (success)
        {
            // clearFields();
            CustomNotification({
              type: 'success',
              title: 'success',
              description: 'Brand Data Updated Successfully',
              key: 2
            })
            navigate('/brand')
        }
        else
        {
            setIsLoading(false)
            CustomNotification({
              type: 'error',
              title: 'error',
              description: message,
              key: `abc`
            })
        }
    }
      else {
        setIsLoading(true)
        const res = await UpdateBrand(BrandIds[0], BrandData, token)
        const { data: { message, payload, success } } = res
        setIsLoading(false)
        if (success) {
            dispatch(updateBrandsData(payload))
            notifySuccess(message)
        //   setIsModalOpen(false)
        //   fetchBrands()
          clearFields()
          setIsDisabled(true)
        } else {
          notifyError(message)
        }
      }

    } catch (err) {
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      const payload = ArrangedBrandData[currentIndex - 1];
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setStatesForEditMode(payload, true,LeverageList)
      }, 3000)
      
    }
  };

  const handleNext = () => {
    if (currentIndex < ArrangedBrandData.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      const payload = ArrangedBrandData[currentIndex + 1];
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setStatesForEditMode(payload, true,LeverageList)
      }, 3000)
    }else{
      alert(`no next record found`)
    }
  }; 

  const setStatesForEditMode = async (payload, success, LeverageList)=>{
    if (success) {
      const selectedOption = LeverageList.find(x=> x.title === payload.leverage)
      setLeverage(selectedOption)
      setName(payload?.name)
      setDomain(payload?.domain)
      setMarginCall(payload?.margin_call)
    }
  }

  const deleteHandler = async ()=>{
    const Params = {
      table_name:'brands',
      table_ids: [ArrangedBrandData[currentIndex].id]
    }
    
   await  CustomBulkDeleteHandler(Params,token,GenericDelete, setIsLoading )
    dispatch(deleteBrandById(ArrangedBrandData[currentIndex].id))
    if(ArrangedBrandData.length === 0 || ArrangedBrandData === undefined || ArrangedBrandData === null){
       navigate("/brand")
    }else{
      if(currentIndex < ArrangedBrandData.length)
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

  useEffect(() => {
    debugger
    clearFields()
    if(BrandIds?.length === 1 && parseInt(BrandIds[0]) === 0){ // update case
        setIsDisabled(false)
      }
      else if (BrandIds?.length === 1 && parseInt(BrandIds[0]) !== 0){
        const cIndex = ArrangedBrandData.findIndex(item => parseInt(item.id) === parseInt(BrandIds[0]))
        setCurrentIndex(cIndex)
        fetchDataWRTID()
        setIsDisabled(true)

      }
    // if (BrandID !== 0) { // update
    // //   setDisabledDomain(true)
    //   fetchDataWRTID()
    // } 
    else {
    //   setDisabledDomain(false)
      setIsDisabled(true)
    }
  }, [])

  const fetchDataWRTID = async () => {
    if(BrandIds.length === 1 && parseInt(BrandIds[0]) !== 0){
    setIsLoading(true)
    const res = await GetSingleBrand(BrandIds[0], token)
    const { data: { payload, message, success } } = res
    setIsLoading(false)
    if (success) {
        const selectedOption = LeverageList.find(x=> x?.title === payload?.leverage)
        setLeverage(selectedOption)
      setName(payload.name)
      setDomain(payload.domain)
      setMarginCall(payload.margin_call)
    //   setLeverage(payload.leverage)
    } else {
      notifyError(message)
    }
  }
  }

  return (
    <Spin spinning={isLoading} size="large">
      <div className='p-8' style={{ backgroundColor: colorBG }}>
      <div className='flex justify-between'>
          <div className='flex gap-3 items-center'>
            <img
              src={ARROW_BACK_CDN}
              alt='back icon'
              className='cursor-pointer'
              onClick={() => navigate("/brand")}
            />
            {
              isDisabled ? <h1 className='text-2xl font-semibold'>Preview Brands</h1> :
                <h1 className='text-2xl font-semibold'>{BrandIds.length === 1 && parseInt(BrandIds[0]) === 0 ? 'Add New Brand' : 'Edit Brand'}</h1>
            }
          </div>
          {/* toolbar */}
          {(isDisabled && BrandIds.length > 1) && <EditOutlined className='cursor-pointer' onClick={()=> setIsDisabled(false)} />}
          {(BrandIds.length === 1 && parseInt(BrandIds[0]) !== 0 && isDisabled)  &&
            <div className='flex gap-4 bg-gray-100 py-2 px-4 rounded-md mb-4' >
           <LeftOutlined className='text-[24px] cursor-pointer' onClick={handlePrevious} />
            <RightOutlined className='text-[24px] cursor-pointer' onClick={handleNext} />
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
      <div className='flex flex-col gap-6'>

        {/* <Typography></Typography> */}


        <CustomTextField
          label="Name"
          varient="standard"
          type="text"
          value={name}
          disabled={isDisabled}
          onChange={e => handleInputChange('name', e.target.value)}
        />
        {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}

        <CustomTextField
          label="Domain"
          varient="standard"
          type="text"
        //   disabled={disabledDomain}
          disabled={isDisabled}
          value={domain}
          onChange={e => handleInputChange('domain', e.target.value)}
        />
        {errors.domain && <span style={{ color: 'red' }}>{errors.domain}</span>}

        <CustomTextField
          label="Margin Call"
          varient="standard"
          type="number"
          InputProps={{
            inputProps: { min: 1, max: 100 },
          }}
          disabled={isDisabled}
          value={marginCall}
          onChange={e => {
            if(e.target.value >= 0 && e.target.value <= 100){
              handleInputChange('marginCall', e.target.value)
            }
            
          }}
          
        />
        {errors.marginCall && <span style={{ color: 'red' }}>{errors.marginCall}</span>}

        <CustomAutocomplete
          label="Select Leverage"
          name='Leverage'
          variant="standard"
          options={LeverageList}
          disabled={isDisabled}
          value={leverage}
          getOptionLabel={(option) => option.title ? option.title : ""}
          onChange={(e, value) => handleInputChange('leverage', value)}

              // name={val.name} 
              // variant={val.varient} 
              // label={val.label}
              // required={val.required}
              // options={val.options}
              // getOptionLabel={(option) => val.getOptionLabel(option)}
              // onChange={(e,value) => val.onChange(e,value)}
        />
        {errors.leverage && <span style={{ color: 'red' }}>{errors.leverage}</span>}
       
        {/* <div style={footerStyle}>
          <CustomButton
            Text={ BrandID === 0 ? 'Submit' :'Update'}
            style={submitStyle}
            onClickHandler={handleSubmit}
          />
          
        </div> */}
        {
            !isDisabled && 
  

        <div className='flex justify-center sm:justify-end flex-wrap items-center gap-4 mt-6'>
          
        <CustomButton
            Text={BrandIds?.length === 1 && parseInt(BrandIds[0]) === 0 ? 'Submit' : 'Update'}
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',
            }}
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

        <ToastContainer />
      </div>
      </div>
    </Spin>
  );
};

export default BrandEntry;