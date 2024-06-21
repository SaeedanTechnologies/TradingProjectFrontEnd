import { Box,Typography,Stack } from "@mui/material"


const TradingHours = () => {

          const descriptions  = [{day:'Sunday',time:'00 : 00 24100'},{day:'Monday',time:'0.00 : 00 24100'},{day:'Tuesday',time:'00 : 00 24100'},{day:'Wednesday',time:'00 : 00 24100'},{day:'Thursday',time:'00 : 00 24100'},{day:'Friday:',time:'00 : 00 24100'},{day:'Saturday',time:'00 : 00 24100'}]

  return (
    <Box sx={{display:"flex",flexDirection:"column",  flexGrow:1,gap:2}}>

        <Typography sx={{fontSize:'20px',fontWeight:600}}>Trading Hours</Typography>
           
                {descriptions.map((description,index)=>(
                <Stack key={index} direction="row" justifyContent={"space-between"} sx={{width:'60%',borderBottom:"1px solid #00000026", pb:0.5}}>
                    <Typography sx={{fontSize:"16px",color:"#848E9C"}}>{description.day}</Typography>
                    <Typography sx={{fontSize:"16px",fontWeight:600}}>{description.time}</Typography>
                </Stack>
                ))}
                
              
        </Box>
  )
}

export default TradingHours