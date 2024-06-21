
import { IconButton, Stack,Typography } from '@mui/material'
import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import PlusIcon from '../../../assets/images/plus-icon.svg'
import QuestionIcon from '../../../assets/images/question-icon.svg'
import { GetTerminalSymbolsList } from '../../../utils/_Terminal';
import { useSelector } from 'react-redux';


const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));


const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : '#00000012',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
    border:'none'
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  // borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const WatchMarket = () => {

   const [expanded, setExpanded] = React.useState('panel1');
   const [terminalSymbols,setTerminalSymbols] =  React.useState([])
     const token = useSelector(({ terminal }) => terminal?.user?.token)


  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };


  const fetchTerminalSymbols = async () => {
    try {
      // debugger
      const res = await GetTerminalSymbolsList(token);
      const { data: { message, success, payload } } = res
        setTerminalSymbols(payload)
      
   
    } catch (error) {
      console.error('Error fetching terminal symbol groups:', error);
    }
  }

  React.useEffect(() => {
    fetchTerminalSymbols()
  }, [])


  return (
    <Stack sx={{width:"100%",boxSizing:"border-box",gap:4}}>
    <Typography sx={{fontWeight:600,fontSize:"18px" ,p:3}}>Market Watch</Typography>

    <Stack sx={{px:1.5}}>
        {terminalSymbols?.map((terminal)=>(

          <Accordion key={terminal.id} expanded={expanded === 'panel1'} onChange={handleChange('panel1')} >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" >
          <Stack direction="row" sx={{width:"100%",justifyContent:"space-between"}}>
            <Typography>{terminal?.name} </Typography>
            <Typography pr={1}>{terminal?.lot_size}</Typography>

          </Stack>
          
        </AccordionSummary>
        <AccordionDetails sx={{px:0}}>
          <Stack alignItems={'center'} justifyContent="center" gap={2}>
          {terminal?.settings?.map((setting)=>(
            <Stack key={setting.id} direction="row" alignItems={'center'} justifyContent="center" gap={0.8}>
               <Typography  sx={{p:0,color:"#6E7499",fontSize:"10px"}}>
                {setting?.name}
              </Typography>
              <Typography  sx={{p:0,color:"#0ECB81",fontSize:"10px"}}>
                0.7623
              </Typography>
              <Typography  sx={{p:0,color:"#D52B1E",fontSize:"10px"}}>
                -0.04%
              </Typography>

              <Stack direction="row" gap={0.5}>
                <IconButton sx={{p:0}}>
                <img src={QuestionIcon} alt="details"  styles={{height:"13px",weight:"13px",objectFit:"cover"}}/>

              </IconButton>
              <IconButton sx={{p:0}}>
                <img src={PlusIcon} alt="details"  styles={{height:"13px",weight:"13px",objectFit:"cover"}}/>

              </IconButton>
              </Stack>
              
            </Stack>
          ))}
        </Stack>
            
         
        </AccordionDetails>
      </Accordion>
        ))}
      
      
    </Stack>

    </Stack>
  )
}

export default WatchMarket



