import { Stack, Table, TableContainer, TableCell, TableHead, TableRow, TableBody, Typography, Paper, TextField } from '@mui/material';
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const FieldMapping = ({ setRows, csvData }) => {
  const { state } = useLocation();
  const headers = localStorage.getItem("headers");
  const formatted = headers ? headers.split(",") : [];
  const headersObjects = formatted.map(header => ({
    label: header,
    value: header.toLowerCase()
  }));

  const [selectedFields, setSelectedFields] = useState([]);
  console.log(selectedFields)
  const [modified, setmodified] = useState([]);

  const handleAutocompleteChange = (state, csvkey) => {
    const modifiedExercises = csvData.map((value, index) => {
      const modifiedExercise = {};
      modifiedExercise[state.value] = value[csvkey];
      return { ...modified[index], ...modifiedExercise };
    });
    setmodified(modifiedExercises);
    setSelectedFields({ ...selectedFields, [csvkey]: state })
  };


  const handleDefaultValueChange = (index, value) => {
    const updatedFields = [...selectedFields];
    const existingIndex = updatedFields.findIndex(item => item.header === headersObjects[index].label);

    if (existingIndex !== -1) {
      updatedFields[existingIndex] = {
        ...updatedFields[existingIndex],
        default_value: value
      };
    } else {
      updatedFields.push({
        header: headersObjects[index].label,
        crm_fields: null,
        default_value: value
      });
    }

    setSelectedFields(updatedFields);
    setRows(updatedFields);
  };

  useEffect(() => {
    setRows(modified)
  }, [modified])


  return (
    <Stack sx={{ py: 3 }}>
      <Typography sx={{ fontWeight: "500", fontSize: "24px", fontFamily: "poppins", color: "#616365", borderBottom: "2px solid #b2b4b3", pb: 0.5 }}>
        Map the columns to CRM fields
      </Typography>

      <Stack sx={{ py: 4 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650, '.MuiTableCell-head': { backgroundColor: '#1CAC70', color: "#fff", fontWeight: 500 } }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Header</TableCell>
                <TableCell align="left">CRM Fields</TableCell>
                <TableCell align="left">Default Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {headersObjects.map((val, index) => (
                <TableRow key={index}>
                  <TableCell>{val.label}</TableCell>
                  <TableCell align="left">
                    <CustomAutocomplete
                      name={`crm_fields_${index}`}
                      label="Select an option"
                      variant="standard"
                      options={state.backendColumns}
                      // value={selectedFields.find((item, key) => key === index) || null}
                      getOptionLabel={(option) => option.label ? option.label : ""}
                      onChange={(event, state) => handleAutocompleteChange(state, index)}
                    />
                  </TableCell>
                  <TableCell align="left">
                    <TextField
                      fullWidth
                      size="small"
                      placeholder='Provide Any default value (Optional)'
                      // value={
                      //   selectedFields.find(item => item.header === val.label)?.default_value || ""
                      // }
                      onChange={(event) => handleDefaultValueChange(index, event.target.value)}

                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
};

export default FieldMapping;
