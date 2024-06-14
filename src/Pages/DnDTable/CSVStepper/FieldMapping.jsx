
import { Stack,Table,TableContainer,TableCell ,TableHead,TableRow,TableBody,Typography,Paper  } from '@mui/material'
import CustomAutocomplete from '../../../components/CustomAutocomplete'
import { useState } from 'react'
import { CRMFields } from '../../../utils/constants'

const FieldMapping = () => {

const [selectedCRMFields,setSelectedCRMFields] = useState([])

  return (
     <Stack sx={{py:3}}>
           <Typography sx={{fontWeight:"500",fontSize:"24px",fontFamily:"poppins", color:"#616365",borderBottom:"2px solid #b2b4b3",pb:0.5}}>Map the columns to CRM fields</Typography>

        <Stack sx={{py:4}}>
          <TableContainer >
            <Table sx={{ minWidth: 650,'.MuiTableCell-head':{backgroundColor: '#1CAC70',color:"#fff",fontWeight:500} }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell >Header</TableCell>
                  <TableCell align="left">
                    CRM Fields
                  </TableCell>
                  <TableCell align="left"> Default Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Group</TableCell>
                  <TableCell align="left">
                    <CustomAutocomplete
                      name="crm_fields"
                      label="Select an option"
                      variant="standard"
                      options={CRMFields}
                      value={selectedCRMFields}
                      getOptionLabel={(option) => option.label ? option.label : ""}
                      onChange={(event, value) => {
                        if(value)
                            {
                              setSelectedCRMFields(value)
                            }
                          else
                            setSelectedCRMFields(null)                                                        
                      }}
                    /> 

                  </TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

        </Stack>
             


        </Stack> 
  )
}

export default FieldMapping