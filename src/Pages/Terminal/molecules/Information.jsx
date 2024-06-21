import React,{useState} from 'react'
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import CustomTextField from '../../../components/CustomTextField';
import { Autocomplete, Box, Stack, TextField, Typography } from '@mui/material';


const Information = () => {


    const [errors, setErrors] = useState({});



    const handleInputChange = (fieldName, value) => {
        setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
        switch (fieldName) {
          case 'symbolName':
            setSymbolName(value);
            break;
          case 'swap':
            setSwap(value);
            break;
          case 'lotSize':
            setLotSize(value);
            break;
          case 'lotSteps':
            setLotSteps(value);
            break;
          case 'volMin':
            setVolMin(value);
            break;
          case 'volMax':
            setVolMax(value);
            break;
          case 'commission':
            setCommission(value);
            break;
          default:
            break;
        }
      };

      const descriptions  = [{day:'Sunday',time:'00 : 00 24100'},{day:'Monday',time:'0.00 : 00 24100'},{day:'Tuesday',time:'00 : 00 24100'},{day:'Wednesday',time:'00 : 00 24100'},{day:'Thursday',time:'00 : 00 24100'},{day:'Friday:',time:'00 : 00 24100'},{day:'Saturday',time:'00 : 00 24100'}]


  return (
    <Stack gap={5}>
        
    <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
    <div>
      <CustomAutocomplete
        name="SymbolGroup"
        label="Select Group"
        variant="standard"
        options={[]}
        getOptionLabel={(option) => option?.name ? option?.name : ""}
       
      />


      {errors.SymbolGroup && <span style={{ color: 'red' }}>{errors.SymbolGroup}</span>}
    </div>
    <div>
      <CustomTextField
        key={4}
        name={"symbolName"}
        label="Name"
        varient="standard"
        onChange={(e) => handleInputChange("symbolName", e.target.value)}
      />
      {errors.symbolName && <span style={{ color: 'red' }}>{errors.symbolName}</span>}

    </div>
    <div>
      <CustomAutocomplete
        key={3}
        name={'feed_name'}
        label="Select Feed Name"
        variant="standard"
        options={[]}
        getOptionLabel={(option) => option.name ? option.name : ""}
      

      />

      {errors.feed_name && <span style={{ color: 'red' }}>{errors.feed_name}</span>}
    </div>


    

    <div>
      <CustomAutocomplete
        name='Leverage'
        variant='standard'
        label='Select Leverage'
        options={[]}
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
        varient="standard"
        s_value={true}
      />
      {errors.commission && <span style={{ color: 'red' }}>{errors.commission}</span>}
    </div>
    <div>
      <CustomAutocomplete
        label="Enabled"
        variant="standard"
        options={[]}
        getOptionLabel={(option) => option.title ? option.title : ""}
     

      />
      {errors.enabled && <span style={{ color: 'red' }}>{errors.enabled}</span>}
    </div>

      <div>
      <CustomAutocomplete
        label="Pips"
        variant="standard"
        options={[]}
        getOptionLabel={(option) => option.label ? option.label : ""}
        required
        

      />
      {errors.enabled && <span style={{ color: 'red' }}>{errors.enabled}</span>}
    </div>   



     </div>

     <Box sx={{display:"flex",flexDirection:"column", flexGrow:1,gap:2}}>

        <Typography sx={{fontSize:'20px',fontWeight:600}}>Trading Hours</Typography>
           
                {descriptions.map((description,index)=>(
                <Stack key={index} direction="row" justifyContent={"space-between"} sx={{width:'100%',borderBottom:"1px solid #00000026",pb:0.5}}>
                    <Typography sx={{fontSize:"16px",color:"#848E9C"}}>{description.day}</Typography>
                    <Typography sx={{fontSize:"16px",fontWeight:600}}>{description.time}</Typography>
                </Stack>
                ))}
                
              
        </Box>

        
  </Stack>
  )
}

export default Information