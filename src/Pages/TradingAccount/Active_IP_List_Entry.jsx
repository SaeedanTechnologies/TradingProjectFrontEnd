import { Spin, theme,Dropdown } from 'antd'
import React, { useEffect, useState } from 'react'
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg'
import { useNavigate } from 'react-router-dom'
import { Button, TextField } from '@mui/material'
import { useDispatch,useSelector } from 'react-redux'
import { addIp_To_List } from '../../utils/_IPAddress'
import CustomNotification from '../../components/CustomNotification'
import { GenericDelete, GenericEdit } from '../../utils/_APICalls'
import CustomButton from '../../components/CustomButton'
import { LeftOutlined, RightOutlined, CaretDownOutlined } from '@ant-design/icons';
import { deleteIpAddressData, setIPAddressSelectedIds, updateIpAddressData } from '../../store/IpAdressSlice'
import { CustomBulkDeleteHandler } from '../../utils/helpers'

const Active_IP_List_Entry = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [ip, setIp] = useState("")
  const token = useSelector(({ user }) => user?.user?.token)
  const IpAddressRowsIds = useSelector(({ ipAddress }) => ipAddress.selectedIpRowsIds)
  const IpAddressData = useSelector(({ ipAddress })=> ipAddress.ipAddressData)
  const ArrangedIpAddressData = IpAddressData;
  const isCompleteSelect = localStorage.getItem("isCompleteSelect")


  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)
  const dispatch = useDispatch()



const deleteHandler = ()=>{
    const Params = {
      table_name:'ip_list',
      table_ids: [ArrangedIpAddressData[currentIndex].id]
    }

    const onSuccessCallBack = (message)=>{
           CustomNotification({
            type: "success",
            title: "Deleted",
            description: message,
            key: "a4",
          })
          dispatch(deleteIpAddressData(ArrangedIpAddressData[currentIndex].id))
          if(ArrangedIpAddressData.length === 0 || ArrangedIpAddressData === undefined || ArrangedIpAddressData === null){
            navigate("/firewall/active-ip-list")
          }else{
            if(currentIndex < ArrangedIpAddressData.length-1){
              handleNext()

            }
            else{
              handlePrevious()
            }
          }
    }

    CustomBulkDeleteHandler(Params,token,GenericDelete, setIsLoading,onSuccessCallBack )
 
    

  }

    const items = [
    
    {
      key: '1',
      label: (
        <button className='w-full text-left' rel="noopener noreferrer" onClick={()=>{
          setIsDisabled(false)
        }}>   Edit </button>
      ),

    },
    {
      key: '2',
      label: (
        <button  className='w-full text-left' rel="noopener noreferrer" onClick={deleteHandler} >   Delete  </button>
      ),

    },
   
  ];


  const navigate = useNavigate()
  const {token: { colorBG },} = theme.useToken();
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    const params = {
        ip_address:ip
    }
   

    if (IpAddressRowsIds?.length === 1 && parseInt(IpAddressRowsIds[0]) === 0) { // save 
        setIsLoading(true)
        const res = await addIp_To_List(params, token);
        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        
        if (success) {
              
            CustomNotification({ type: "success", title: "Created", description: `${res.data.message}`, key: 1 })
            setIp("")
            navigate("/firewall/active-ip-list")
        }

      } else{
        setIsLoading(true)
        const Params = {
          table_name: 'ip_list',
          table_ids: isCompleteSelect === "true" ? [] : IpAddressRowsIds,
          ...params
        }
        const res = await GenericEdit(Params, token)
        const { data: { message, success, payload } } = res;
        setIsLoading(false)
        if (res !== undefined) {
          if (success) {
            dispatch(updateIpAddressData(payload))
            CustomNotification({
              type: 'success',
              title: 'success',
              description: 'IP Address Updated Successfully',
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
        }

      }



}


const cancelHandler= ()=>{
    if(isDisabled){
      navigate('/firewall/active-ip-list')

    }else{
      setIsDisabled(true)
    }
  }
 
  const handleNext = () => {
    if (currentIndex < IpAddressData.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      const payload = IpAddressData[currentIndex + 1];
      dispatch(setIPAddressSelectedIds([payload.id]))
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setIp(payload?.ip_address)
      }, 3000)
    }else{
       CustomNotification({
            type: 'warning',
            title: 'warning',
            description: 'No Next record found',
            key: 2
          })
    }
  };

    const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
      const payload = IpAddressData[currentIndex - 1];
      dispatch( setIPAddressSelectedIds([payload.id]))
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
         setIp(payload?.ip_address)
      }, 3000)
      
    }else{
       CustomNotification({
            type: 'warning',
            title: 'warning',
            description: 'No Previous record found',
            key: 2
          })
    }
  };


 useEffect(()=>{
    if (IpAddressRowsIds?.length === 1 && parseInt(IpAddressRowsIds[0]) !== 0) { // single edit
      const cIndex = IpAddressData.findIndex(item => parseInt(item.id) === parseInt(IpAddressRowsIds[0]))
      setCurrentIndex(cIndex)
      setIsDisabled(true)
       setIp(IpAddressData[0]?.ip_address)
    } 
 },[])


    return (
        <Spin spinning={isLoading} size="large">
        <div className='p-8' style={{ backgroundColor: colorBG }}>
            <div className='flex justify-between'>
                <div className='flex gap-3 items-center'>
                <img
                src={ARROW_BACK_CDN}
                alt='back icon'
                className='cursor-pointer'
                onClick={() => navigate("/firewall/active-ip-list")}
                />
                {
                isDisabled ? <h1 className='text-2xl font-semibold'>IP Address</h1> :
                    <h1 className='text-2xl font-semibold'>{IpAddressRowsIds?.length === 1 && parseInt(IpAddressRowsIds[0]) === 0 ? 'Add IP Address' : 'Edit IP Address'}</h1>
                }
                </div>
          {(isDisabled && IpAddressRowsIds?.length > 1) && <EditOutlined className='cursor-pointer' onClick={()=> setIsDisabled(false)} />}
          {(IpAddressRowsIds?.length === 1 && parseInt(IpAddressRowsIds[0]) !== 0 && isDisabled)  &&
            <div className='flex gap-4 bg-gray-100 py-2 px-4 rounded-md mb-4' >
           <LeftOutlined className='text-[24px] cursor-pointer' onClick={handlePrevious} />
            <RightOutlined className='text-[24px] cursor-pointer' onClick={handleNext} />
             <Dropdown
              menu={{
                items : items,
              }}
              placement="bottom"
              arrow
              trigger={['click']}
              
            >
              <div className='bg-gray-200 p-2 px-4 rounded-md cursor-pointer'> More <CaretDownOutlined /> </div>
          </Dropdown>
            </div>
          }
            </div>
            <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 sm:grid-cols-1 gap-8 mt-10'>
                <TextField size='small'
                label="Ip Address"
                name="ip"
                variant='standard'
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                disabled={isDisabled}
                required  
                />
            </div>
            <div>
                {/* <Button 
                type='submit'
                variant='contained' 
                sx={{mt:4, background:"#1cac70", '&:hover':{background:"#1cac70"}}}>
                    Add
                </Button> */}
            
                
          {
            !isDisabled &&  <div className='flex justify-center items-center sm:justify-end flex-wrap gap-4 mt-6'>
            <CustomButton
              Text={ IpAddressRowsIds?.length === 1 && parseInt(IpAddressRowsIds[0]) === 0 ? 'Submit' : 'Update'}
              style={{
                padding: '16px',
                height: '48px',
                width: '200px',
                borderRadius: '8px',
                zIndex: '100'
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
              onClickHandler={cancelHandler}
            />
          </div>
          }
            
            
            </div>
        </form>
        </div>
        </Spin>
  )
}

export default Active_IP_List_Entry
