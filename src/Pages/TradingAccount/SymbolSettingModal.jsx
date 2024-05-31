import React,{useState,useEffect,useMemo} from 'react'
import { Typography ,Stack,Box,Autocomplete,TextField,Input, InputAdornment,  } from '@mui/material';
import { Spin } from 'antd';
import { footerStyle, submitStyle } from './style';
import CustomButton from '../../components/CustomButton';
import { AllSymbelSettingList } from '../../utils/_SymbolSettingAPICalls';
import { useSelector } from 'react-redux';
import { LeverageList } from '../../utils/constants';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import SearchIcon from '@mui/icons-material/Search';
import {useDispatch} from 'react-redux'
import { setTradingAccountGroupData } from '../../store/tradingAccountGroupSlice';

const SymbolSettingModal = ({setIsModalOpen}) => {

      const token = useSelector(({ user }) => user?.user?.token)
      const tradingAccountSymbolLeverages = useSelector(({ tradingAccountGroup }) => tradingAccountGroup?.tradingAccountGroupData?.symbols_leverage)
      const tradingAccountData = useSelector(({ tradingAccountGroup }) => tradingAccountGroup?.tradingAccountGroupData)
      const [isLoading,setIsLoading] = useState(false)
      const [symbolsList, setSymbolsList] = useState([])
      const [leverageSettings, setLeverageSettings] = useState([]);
      const dispatch = useDispatch()


    const fetchSingleTradeOrder = async () => {
        setIsLoading(true)
        const { data: {  payload:SymbolsList } } = await AllSymbelSettingList(token);
        setSymbolsList(SymbolsList)
        setIsLoading(false)
    }

    const handleLeverageChange = (index, value) => {

      
      const selectedLeverage = LeverageList.find(x => x.title === value.title)
      const selectedSymbol ={ ...symbolsList[index],selectedLeverage:selectedLeverage }

      setLeverageSettings((prevSettings) => {
        // debugger
      const existingIndex = prevSettings.findIndex(item => item.name === selectedSymbol.name);
      if (existingIndex !== -1) {
        // Update existing object
        const updatedSettings = [...prevSettings];
        updatedSettings[existingIndex] = selectedSymbol;
        return updatedSettings;
      } else {
        // Add new object
        return [...prevSettings, selectedSymbol];
      }
    });

    };
    
    const handleSearch = (value)=>{
       if (value.trim() === '') {
      fetchSingleTradeOrder();  
    } else {
         const filteredSymbols = symbolsList.filter((symbol) =>
        symbol.name.toLowerCase().includes(value.toLowerCase())
      );
      setSymbolsList(filteredSymbols);
    }
  }
    // console.log(leverageSettings)
    
  const handleSelectLeverages = async () => {
      const payload = {...tradingAccountData, symbols_leverage:leverageSettings}
      dispatch(setTradingAccountGroupData((payload)))
      setIsModalOpen(false)
       
  };


useEffect(()=>{
    fetchSingleTradeOrder()
},[])



  return (
    <Spin spinning={isLoading} size="large">
        <div className='flex flex-col gap-6'>

              <Typography sx={{fontSize:"20px",fontWeight:600}}>Select Leverage For Symbol Settings</Typography>
               
                 <Input
                  startAdornment={
                            <InputAdornment position="start">
                               <SearchIcon />
                            </InputAdornment>
                            }
                 
                 id="input-with-sx" placeholder={'Search ...'} variant="standard" sx={{ width: 300 }}  
                        onChange={(e)=>handleSearch(e.target.value)}
                   
                   />
               
                <Box sx={{height:"50vh",overflowY:"scroll"}}>
                    <Stack direction={'column'}>
                    {symbolsList?.map((symbol,index)=>(
                            <Stack key={index} direction="row" alignItems='center' justifyContent="space-between" sx={{py:2, transition: 'primary 300ms, font-size 300ms',
                                      '&:hover': {
                                   
                                      fontSize: '1.1rem',
                                      fontWeight:600 
                                      } }}>
                              <Typography sx={{p:0,m:0,pl:2,fontSize:'18px'}}>
                                    {symbol.name}
                              </Typography>

                             <Autocomplete
                                  label="Select Leverage"
                                  name='Leverage'
                                  options={LeverageList}
                                  value={tradingAccountSymbolLeverages?.find(symbolLeverage=> symbolLeverage.id===symbol.id)?.selectedLeverage}
                                  renderInput={(params) => <TextField {...params} label="Leverage"  sx={{
                                    '& legend': { display: 'none' },
                                    '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                  }} variant="standard" />}
                                  sx={{ width: 300,pr:6,m:0, mt:-2.9 }}
                                  getOptionLabel={(option) => option.title ? option.title : ""}
                                  onChange={(e, value) => handleLeverageChange(index,value)}
                              />

                            </Stack>  
                        ))
                    }
                    </Stack>
                </Box>
          
              

             

          

              <div style={footerStyle}>
                <CustomButton
                  Text={'Select'}
                  style={submitStyle}
                   onClickHandler={handleSelectLeverages}
                />
                
              </div> 

        </div>
      </Spin>
  )
}

export default SymbolSettingModal