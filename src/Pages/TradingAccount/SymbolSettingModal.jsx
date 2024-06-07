import React,{useState,useEffect,useMemo} from 'react'
import { Typography ,Stack,Box,Autocomplete,TextField,Input, InputAdornment,  } from '@mui/material';
import { Spin } from 'antd';
import { footerStyle, submitStyle } from './style';
import CustomButton from '../../components/CustomButton';
import { useSelector } from 'react-redux';
import { LeverageList } from '../../utils/constants';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import SearchIcon from '@mui/icons-material/Search';
import {useDispatch} from 'react-redux'
import { setTradingAccountGroupData } from '../../store/tradingAccountGroupSlice';
import {DownOutlined} from '@ant-design/icons'
// import {Accordion} from '@mui/material/Accordion';
// import {AccordionDetails} from '@mui/material/AccordionDetails';
import { Accordion,AccordionDetails,AccordionSummary } from '@mui/material';
// import {ExpandMoreIcon} from '@mui/icons-material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ALL_Symbol_Group_List } from '../../utils/_SymbolSettingAPICalls';


const SymbolSettingModal = ({setIsModalOpen}) => {

      const token = useSelector(({ user }) => user?.user?.token)
      const tradingAccountSymbolLeverages = useSelector(({ tradingAccountGroup }) => tradingAccountGroup?.tradingAccountGroupData?.symbols_leverage)
      const tradingAccountData = useSelector(({ tradingAccountGroup }) => tradingAccountGroup?.tradingAccountGroupData)
      const [isLoading,setIsLoading] = useState(false)
      const [symbolsList, setSymbolsList] = useState([])
      const [symbolGroupsList,setSymbolGroupsList] = useState([])
      const [leverageSettings, setLeverageSettings] = useState([]);
      const dispatch = useDispatch()

        const [expanded, setExpanded] = React.useState(false);


        const handleChange = (panel) => async(event, isExpanded) => {
            // debugger;
            setExpanded(isExpanded ? panel : false);
         
        
          };


    const 
    handleSymbolGroupLeverage = (index,leverage)=>{
      setSymbolGroupsList(prevList=>{
      
        const updatedList = [...prevList];
        updatedList[index] = {
          ...updatedList[index],
          selectedLeverage: leverage
        }

        return updatedList
      })
    }


    const handleSettingChange = (symbolGroupIndex, settingIndex, newLeverage) => {
    setSymbolGroupsList(prevList => {
      // debugger
      const updatedList = [...prevList];
    
      const settings =  [...updatedList[symbolGroupIndex].settings]
       settings[settingIndex] = {
        ...settings[settingIndex],
        selectedLeverage:newLeverage
       }

      updatedList[symbolGroupIndex] = {
        ...updatedList[symbolGroupIndex],
        settings
      };
      return updatedList;
    });
  };

    const fetchSingleTradeOrder = async () => {
        setIsLoading(true)
        // debugger
        const { data:{ payload:SymbolGroupsList } } = await ALL_Symbol_Group_List(token);
        setSymbolGroupsList(SymbolGroupsList)
         
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

    
  //   const handleSearch = (value)=>{
  //      if (value.trim() === '') {
  //     fetchSingleTradeOrder();  
  //   } else {
  //        const filteredSymbols = symbolsList.filter((symbol) =>
  //       symbol.name.toLowerCase().includes(value.toLowerCase())
  //     );
  //     setSymbolsList(filteredSymbols);
  //   }
  // }
    // console.log(leverageSettings)
    
  const handleSelectLeverages = async () => {
    // debugger
      const payload = {...tradingAccountData, symbols_leverage:symbolGroupsList}
      dispatch(setTradingAccountGroupData((payload)))
      setIsModalOpen(false)
       
  };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
    if ( !event.target.closest('.MuiAutocomplete-root') &&
      !event.target.closest('.MuiAutocomplete-popupIndicator')) {
      handleChange(panel)(event, isExpanded);
    }
  }


useEffect(()=>{
    fetchSingleTradeOrder()
},[])




  return (
    <Spin spinning={isLoading} size="large">
        <div className='flex flex-col gap-6'>

              <Typography sx={{fontSize:"20px",fontWeight:600}}>Select Leverage For Symbol Settings</Typography>
               
                 {/* <Input
                  startAdornment={
                            <InputAdornment position="start">
                               <SearchIcon />
                            </InputAdornment>
                            }
                 
                 id="input-with-sx" placeholder={'Search ...'} variant="standard" sx={{ width: 300 }}  
                 onChange={(e)=>handleSearch(e.target.value)}
                /> */}

                {symbolGroupsList?.map((symbolGroup,index)=>(
                  <Accordion key={symbolGroup.id} expanded={expanded === `panel${index}`} onChange={handleAccordionChange(`panel${index}`)}>
                    <AccordionSummary
                      expandIcon={<DownOutlined />}
                      aria-controls={`panel${index}bh-content`}
                      id={`panel${index}bh-header`}
                    >
                    <Stack direction="row" justifyContent="space-between" sx={{width:"100%"}}>
                        <Typography sx={{  flexShrink: 0 }}>
                          {symbolGroup?.name}
                        </Typography>

                        <Autocomplete
                            label="Symbol Group Leverage"
                              name='Symbol Group'
                              options={LeverageList}
                              value={tradingAccountSymbolLeverages?.find((x)=>x.id=== symbolGroup.id)?.selectedLeverage||symbolGroup?.selectedLeverage||null}
                              renderInput={(params) => <TextField {...params} label="Select Symbol Group"  sx={{
                                '& legend': { display: 'none' },
                                '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                }} variant="standard" />}
                                sx={{ width: 300,pr:6,m:0, mt:-2.9 }}
                                getOptionLabel={(option) => option.title ? option.title : ""}
                                onChange={(e, value) => {

                                  handleSymbolGroupLeverage(index,value)
                                   e.stopPropagation();
                            }}
                                  onClick={(e) => {
                                     e.stopPropagation();
                                  }}
                                  onFocus={(e) => {
                                    e.stopPropagation();
                                  }}
                        />
                    </Stack>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Box sx={{height:"50vh",overflowY:"scroll"}}>
                          <Stack direction={'column'}>
                          {symbolGroup?.settings?.map((setting,settingKey)=>(
                                  <Stack key={setting?.id} direction="row" alignItems='center' justifyContent="space-between" sx={{py:2, transition: 'primary 300ms, font-size 300ms',
                                            '&:hover': {
                                        
                                            fontSize: '1.1rem',
                                            fontWeight:600 
                                            } }}>
                                    <Typography sx={{p:0,m:0,pl:2,fontSize:'18px'}}>
                                          {setting.name}
                                    </Typography>

                                  <Autocomplete
                                        label="Select Leverage"
                                        name='Leverage'
                                        options={LeverageList}
                                        value={tradingAccountSymbolLeverages?.find((x)=>x.id=== symbolGroup.id)?.settings?.find((x)=>x.id===setting?.id)?.selectedLeverage||setting?.selectedLeverage||null}
                                        renderInput={(params) => <TextField {...params} label="Leverage"  sx={{
                                          '& legend': { display: 'none' },
                                          '& .MuiInputLabel-shrink': { opacity: 0, transition: "all 0.2s ease-in" }
                                        }} variant="standard" />}
                                        sx={{ width: 300,pr:6,m:0, mt:-2.9 }}
                                        getOptionLabel={(option) => option.title ? option.title : ""}
                                        onChange={(e, value) => handleSettingChange(index,settingKey,value)}
                                    />

                                  </Stack>  
                              ))
                          }
                          </Stack>
                        </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
                   
                 
                  
                   
               
            
          
              

             

          

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