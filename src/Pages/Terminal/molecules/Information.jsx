import React,{useEffect, useState} from 'react'
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import CustomTextField from '../../../components/CustomTextField';
import { Autocomplete, Box, Stack, TextField, Typography } from '@mui/material';
import { LeverageList,PipsValues } from '../../../utils/constants';
import { useSelector } from 'react-redux';
import { ALL_Symbol_Group_List } from '../../../utils/_SymbolSettingAPICalls';

const Information = () => {

    const token = useSelector(({ terminal }) => terminal?.user?.token)
    const [errors, setErrors] = useState({});
    const [selectedLeverage,setSelectedLeverage] = useState(null)
    const selectedWatchMarket = useSelector((state)=> state?.terminal?.selectedWatchMarket)
    const [SymbolList, setSymbolList] = useState([])
    const [SelectedSymbol, setSelectedSymbol] = useState(null)
    const [name,setName] = useState('')
    const [lot_size,setLot_size] =  useState('')
    const [lot_step,setLot_step] =  useState('')
    const [vol_min,setVol_min] =  useState('')
    const [vol_max,setVol_max] =  useState('')
    const [commission,setCommission] = useState('')
    const [Selectedenable, setSelectedEnable] = useState()
    const [selectedPip,setSelectedPip] = useState(null)
    const [feedNameFetchList, setFeedNameFetchList] = useState([])
    const [selectedFeedNameFetch, setSelectedFeedNameFetch] = useState(null)
    const [isDisabled, setIsDisabled] = useState(true)
    const [EnabledList,SetEnabledList] = useState([
    { id: 1, title: 'Yes', },
    { id: 2, title: 'No' },
  ])


  const handleSubmit = (typeReceive, skip) => {
    //From here
    setrcvdType(typeReceive)
    // const tradePrice = (`connected` && typeReceive ==='buy') ? pricing.openPrice : (connected && typeReceive ==='sell') ? pricing.askPrice : open_price;
    if(trade_type === "single") {
      const res = (parseFloat(parseFloat(volume) * parseFloat(symbol?.lot_size) * open_price).toFixed(2));
        const margin = calculateMargin(res, conditionalLeverage(trading_account,symbol));
        if(margin > equity) {
          CustomNotification({ 
            type: "error", 
            title: "Validation", 
            description: 'Margin must be lesser than equity and greater than brand stop out', 
            key: 1 
          })
        }
        else{
            balance > 0 ? (stopLoss !== "" || takeProfit !== "") ?  typeReceive === 'sell' ? (stopLoss > (connected ? pricing.askPrice : open_price ) && takeProfit < (connected ? pricing.askPrice : open_price )) ?
            createOrder(typeReceive) : CustomNotification({ type: "error", title: "Live Order (Sell)", description: 'Stop Loss should be greater and Take Profit should be less than Price', key: 1 }) :
            typeReceive === 'buy' ? 
            (stopLoss < (connected ? pricing.askPrice : open_price ) && takeProfit > (connected ? pricing.askPrice : open_price )) ?
            createOrder(typeReceive) : CustomNotification({ type: "error", title: "Live Order (Buy)", description: 'Take Profit should be greater and Stop Loss should be less than Price', key: 1 }) :
            createOrder(typeReceive)
            :
            createOrder(typeReceive)
            :
            CustomNotification({ type: "error", title: "Live Order", description: `Insufficient Balance. You balance should be greater than $${calculatedMargin.toFixed(2)} but you have $${balance}`, key: 1 })
          }
      }
      else 
      {
        createOrder(typeReceive, skip)
      }
      
      // if(margin > balance || balance === 0 ){
      // CustomNotification({ 
      //   type: "error", 
      //   title: "Validation", 
      //   description: 'Margin must be less than your balance', 
      //   key: 1 
      // })
      // }
      // else{
      //   balance > 0 ? (stopLoss !== "" || takeProfit !== "") ?  typeReceive === 'sell' ? (stopLoss > (connected ? pricing.askPrice : open_price ) && takeProfit < (connected ? pricing.askPrice : open_price )) ?
      //   createOrder(typeReceive) : CustomNotification({ type: "error", title: "Live Order (Sell)", description: 'Stop Loss should be greater and Take Profit should be less than Price', key: 1 }) :
      //   typeReceive === 'buy' ? 
      //   (stopLoss < (connected ? pricing.askPrice : open_price ) && takeProfit > (connected ? pricing.askPrice : open_price )) ?
      //   createOrder(typeReceive) : CustomNotification({ type: "error", title: "Live Order (Buy)", description: 'Take Profit should be greater and Stop Loss should be less than Price', key: 1 }) :
      //   createOrder(typeReceive)
      //   :
      //   createOrder(typeReceive)
      //   :
      //   CustomNotification({ type: "error", title: "Live Order", description: `Insufficient Balance. You balance should be greater than $${calculatedMargin.toFixed(2)} but you have $${balance}`, key: 1 })
      //
  }
    
    const handleInputChange = (fieldName, value) => {
        setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
        switch (fieldName) {
          case 'name':
            setName(value);
            break;
          case 'lot_size':
            setLot_size(value);
            break;
          case 'lot_step':
            setLot_step(value);
            break;
          case 'vol_min':
            setVol_min(value);
            break;
          case 'vol_max':
            setVol_max(value);
            break;
            case 'commission':
              setCommission(value)
            break;
          default:
            break;
            case 'selectedFeedNameFetch':
              setSelectedFeedNameFetch(value)
              break;
        }
      };


    const setSelectedFields=async()=>{
      try {
      const res = await ALL_Symbol_Group_List(token);
      const { data: { message, success, payload } } = res
      setSymbolList(payload);
      const selectedGroup = payload?.find(x => x?.id === selectedWatchMarket.symbel_group_id)
      setSelectedSymbol(selectedGroup)


    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }


      const leverage =   LeverageList.find(leverage=>leverage.title === selectedWatchMarket?.leverage)
        setSelectedLeverage(leverage)
       
          setName(selectedWatchMarket?.name)
          setLot_size(selectedWatchMarket?.lot_size)
          setLot_step(selectedWatchMarket?.lot_step)
          setVol_min(selectedWatchMarket?.vol_min)
          setVol_max(selectedWatchMarket?.vol_max)
          setCommission(selectedWatchMarket?.commission)
          const selectedEnab = EnabledList.find(item => item.id === (parseFloat(selectedWatchMarket?.enabled) ? 1 : 2));
          setSelectedEnable(selectedEnab)
         const selectedPip = PipsValues.find(pip => pip.value === (parseFloat(selectedWatchMarket?.pip)));
        setSelectedPip(selectedPip)

        //  setFeedNameFetchList(updatedData)
        //   const selectedSymb = updatedData.find(x => x.symbol === selectedWatchMarket?.feed_fetch_name)
          setSelectedFeedNameFetch(selectedWatchMarket?.feed_fetch_name)
    }

    useEffect(()=>{
        setSelectedFields()   
    },[selectedWatchMarket])


  return (
           
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
    <div>
      <CustomAutocomplete
        name="SymbolGroup"
        label="Select Group"
        variant="standard"
        options={SymbolList}
        value={SelectedSymbol}
        disabled={isDisabled}

        getOptionLabel={(option) => option?.name ? option?.name : ""}
         onChange={(event, value) => {
                  if (value) {
                    setSelectedSymbol(value);
                     setErrors(prevErrors => ({ ...prevErrors, SymbolGroup: "" }))
                  } else {
                    setSelectedSymbol(null);
                    setErrors(prevErrors => ({ ...prevErrors, SymbolGroup: "Symbol Group is Requried" }))
                  }
                }}
       
      />


      {errors.SymbolGroup && <span style={{ color: 'red' }}>{errors.SymbolGroup}</span>}
    </div>
    <div>
      <CustomTextField
        key={4}
        name={"name"}
        label="Name"
        varient="standard"
        value={name}
        disabled={isDisabled}

        onChange={(e) => handleInputChange("name", e.target.value)}
      />
      {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}

    </div>
    <div>
      <TextField
        key={3}
        name={'feed_name'}
        label="Select Feed Name"
        variant="standard"
        fullWidth
        value={selectedFeedNameFetch}
        onChange={(e) => handleInputChange("selectedFeedNameFetch", e.target.value)}
        disabled={isDisabled}

      />

      {errors.feed_name && <span style={{ color: 'red' }}>{errors.feed_name}</span>}
    </div>


    

    <div>
      <CustomAutocomplete
        name='Leverage'
        variant='standard'
        value = {selectedLeverage}
        disabled={isDisabled}
        onChange={(e, value) => {
              if (value) {
                setSelectedLeverage(value);
                setErrors(prevErrors => ({ ...prevErrors, Leverage: '' }));
              } else {
                setSelectedLeverage(null);
                setErrors(prevErrors => ({ ...prevErrors, Leverage: 'Leverage is Requried' }));
              }
            }}

        label='Select Leverage'
        options={LeverageList}
        getOptionLabel={(option) => option.title ? option.title : ""}
     
      />
      {errors.Leverage && <span style={{ color: 'red' }}>{errors.Leverage}</span>}
    </div>
  

    <div>
      <CustomTextField
        name={'lotSize'}
        key={7}
        label="Lot Size"
        type={'number'}
        varient="standard"
        value={lot_size}
        onChange={(e) => handleInputChange("lot_size", e.target.value)}
        disabled={isDisabled}

        s_value={true}
      />
      {errors.lot_size && <span style={{ color: 'red' }}>{errors.lot_size}</span>}
    </div>
    <div>
      <CustomTextField
        name={'lotSteps'}
        key={8}
        label="Lot Steps"
        type={'number'}
        value={lot_step}
        onChange={(e) => handleInputChange("lot_step", e.target.value)}
        disabled={isDisabled}

        varient="standard"
        s_value={true}
      />
      {errors.lot_step && <span style={{ color: 'red' }}>{errors.lot_step}</span>}
    </div>

    <div>
      <CustomTextField
        name={'volMin'}
        key={9}
        label="Vol Minimum"
        value={vol_min}
        onChange={(e) => handleInputChange("vol_min", e.target.value)}
        disabled={isDisabled}

        
        InputProps={{
          inputProps: { min: 0, max: 100 },
        }}
        type={'number'}
        varient="standard"
        s_value={true}
      />
      {errors.vol_min && <span style={{ color: 'red' }}>{errors.vol_min}</span>}
    </div>
    <div>
      <CustomTextField
        name={'volMax'}
        key={10}
        label="Vol Maximum"
        value={vol_max}
        onChange={(e) => handleInputChange("vol_max", e.target.value)}
        disabled={isDisabled}

        InputProps={{
          inputProps: { min: 0, max: 100 },
        }}
        s_value={true}
        type={'number'}
        varient="standard"
      />
      {errors.vol_max && <span style={{ color: 'red' }}>{errors.vol_max}</span>}
    </div>

    <div>
      <CustomTextField
        name={'commission'}
        label="Commision"
        type={'number'}
        value={commission}
        onChange={(e) => handleInputChange("commission", e.target.value)}
        varient="standard"
        s_value={true}
       disabled={isDisabled}

      />
      {errors.commission && <span style={{ color: 'red' }}>{errors.commission}</span>}
    </div>
    <div>
      <CustomAutocomplete
        label="Enabled"
        variant="standard"
        options={EnabledList}
        value={Selectedenable}
         disabled={isDisabled}

        getOptionLabel={(option) => option.title ? option.title : ""}
         onChange={(event, value) => {
                  if (value) {
                  setSelectedEnable(value);
                  setErrors(prevErrors => ({ ...prevErrors, Selectedenable: "" }))
                  }
                  else{
                    setSelectedEnable(null);
                  }
                }}
     

      />
      {errors.enabled && <span style={{ color: 'red' }}>{errors.enabled}</span>}
    </div>

      <div>
      <CustomAutocomplete
        label="Pips"
        variant="standard"
        options={PipsValues}
        getOptionLabel={(option) => option.label ? option.label : ""}
        required
        disabled={isDisabled}

        value={selectedPip}
        onChange={(event, value) => {
          setSelectedPip(value);
          setErrors(prevErrors => ({ ...prevErrors, enabled: "" }))
        }}
        

      />
      {errors.enabled && <span style={{ color: 'red' }}>{errors.enabled}</span>}
    </div>   



     </div>     
  )
}

export default Information