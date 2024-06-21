import { useState, useRef } from 'react';
import { Button, FormControlLabel, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import Papa from 'papaparse';
import Computer_Icon from '../../../assets/images/computer.svg';

const UploadCSV = ({setCsv}) => {
  const [csvFile, setCsvFile] = useState(null);
  const [delimiter, setDelimiter] = useState(',');
  const [csvHeaders, setCsvHeaders] = useState([]); // State to store CSV headers
  const csvRef = useRef(null);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      setCsv(file)
      // Parse CSV headers using Papaparse
      Papa.parse(file, {
        complete: (results) => {
          if (results.data.length) {
            setCsvHeaders(results.data[0]);
            localStorage.setItem("headers", results.data[0])
          } else {
            alert('CSV file is empty.');
            setCsvFile(null);
            setCsvHeaders([]);
          }
        },
        header: false, // Don't treat the first row as headers
        delimiter: delimiter,
      });
    } else {
      alert('Please upload a valid CSV file.');
      setCsvFile(null); // Clear the file if it's not valid
      setCsvHeaders([]);
    }
  };

  const handleButtonClick = () => {
    csvRef.current.click();
  };

  const handleDelimiterChange = (event) => {
    setDelimiter(event.target.value);
  };

  return (
    <Stack sx={{ py: 3 }}>
      <Typography sx={{ fontWeight: "500", fontSize: "24px", fontFamily: "poppins", color: "#616365", borderBottom: "2px solid #b2b4b3", pb: 0.5 }}>Import from CSV File</Typography>
      <Stack sx={{ width: "50%" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 5 }}>
          <Typography sx={{ fontSize: "18px", fontFamily: "poppins", color: "#616365" }}>Select CSV File</Typography>
          <input
            type="file"
            ref={csvRef}
            style={{ display: 'none' }}
            onChange={handleFileUpload}
            accept=".csv"
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1CAC70",
              "&:hover": {
                backgroundColor: "#0fb600"
              }
            }}
            onClick={handleButtonClick}
          >
            Select from Computer
          </Button>
        </Stack>
        <Typography sx={{ml:"75%", fontSize: "16px", fontFamily: "poppins", 
            color: "#616365", mt: -3, fontWeight:'bold' }}>
          {csvFile ? csvFile.name : 'No file selected'}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 5 }}>
          <Typography sx={{ fontSize: "18px", fontFamily: "poppins", color: "#616365" }}>Delimiter</Typography>
          <RadioGroup
            row
            aria-labelledby="delimiter-radio-buttons-group-label"
            name="delimiter-radio-buttons-group"
            value={delimiter}
            onChange={handleDelimiterChange}
          >
            <FormControlLabel value="," control={<Radio />} label="comma" />
            <FormControlLabel value=";" control={<Radio />} label="semicolon" />
            <FormControlLabel value="|" control={<Radio />} label="pipe" />
            <FormControlLabel value="^" control={<Radio />} label="caret" />
          </RadioGroup>
        </Stack>
        {/* {csvHeaders.length > 0 && (
          <Typography sx={{ fontSize: "18px", fontFamily: "poppins", color: "#616365", pt: 3 }}>
            CSV Headers: {csvHeaders.join(', ')}
          </Typography>
        )} */}
      </Stack>
    </Stack>
  );
}

export default UploadCSV;
