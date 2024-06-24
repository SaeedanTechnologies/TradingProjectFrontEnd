import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import UploadCSV from './UploadCSV';
import FieldMapping from './FieldMapping';
import DuplicateHandling from './DuplicateHandling';
import { useLocation } from 'react-router-dom';
import CustomNotification from '../../../components/CustomNotification';
import { massImport } from '../../../utils/_MassImport';
import { useSelector } from 'react-redux';
import Papa from 'papaparse';
import { readCSVFile, validateDelimiter } from '../../../utils/helpers';

const steps = ['Upload CSV', 'Duplicate Handling', 'Field Mapping'];

export default function CSVStepper() {
  const { state } = useLocation();
  const [csv_file, setCsvFile] = React.useState(null);
  const [csvData, setCSVdata] = React.useState("");
  const [marge_col, setMarge_col] = React.useState([]);
  const [skip, setSkip] = React.useState("skip");
  const [rows, setRows] = React.useState([]);
  const [delimiter, setDelimiter] = React.useState(',');
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const token = useSelector(({ user }) => user?.user?.token);
  const [loading, setIsLoading] = React.useState(false);

  const totalSteps = () => steps.length;
  const completedSteps = () => Object.keys(completed).length;
  const isLastStep = () => activeStep === totalSteps() - 1;
  const allStepsCompleted = () => completedSteps() === totalSteps();

  const handleNext = () => {
    if (!csv_file && activeStep === 0) {
      CustomNotification({ type: "error", title: "Oops", description: "Please upload CSV file first", key: 1 });
      return;
    }
    if (csv_file && activeStep === 0) {
      readAndParseCSV(csv_file)
    } else {
      moveStepForward();
    }
  };

  const readAndParseCSV = (file) => {
    readCSVFile(file)
      .then((contents) => {

        if (validateDelimiter(contents, delimiter)) {
          Papa.parse(csv_file, {
            complete: (results) => {
              if (results.data.length > 1) {
                setCSVdata(results.data.slice(1));
                localStorage.setItem("headers", results.data[0]);
                moveStepForward();
              } else {
                CustomNotification({
                  type: "error",
                  title: "CSV Import",
                  description: `CSV file is empty.`,
                  key: 1
                });
                setCsvFile(null);
              }
            },
            header: false,
            delimiter: delimiter,
          });
        } else {
          CustomNotification({
            type: "error",
            title: "CSV Import",
            description: `The selected CSV file does not use '${delimiter}' as delimiter.`,
            key: 1
          });
        }
      })
      .catch((error) => {

        CustomNotification({
          type: "error",
          title: "CSV Import",
          description: "Error reading CSV file. Please try again.",
          key: 1
        });
      });
  };

  const moveStepForward = () => {
    if (activeStep === steps.length - 1 && !allStepsCompleted()) return;
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    if (activeStep === 0) return;
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => setActiveStep(step);

  const handleComplete = async () => {
    if (rows.length) {
      const params = {
        table_name: state?.tableName,
        rows,
        marge_col,
        skip,
      };
      console.log(marge_col, 'this is merge column')
      const res = await massImport(params, token);
      console.log(res, "THIS IS RESPONSE");
      const newCompleted = { ...completed, [activeStep]: true };
      setCompleted(newCompleted);
      handleNext();
    } else {
      CustomNotification({
        type: "error",
        title: "CSV Import",
        description: "Must be Select one off them.",
        key: 1
      });
    }

  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <UploadCSV setCsv={setCsvFile} setCSVdata={setCSVdata} delimiter={delimiter} setDelimiter={setDelimiter} />;
      case 1:
        return <DuplicateHandling setMarge_col={setMarge_col} setSkip={setSkip} />;
      case 2:
        return <FieldMapping setRows={setRows} csvData={csvData} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%', p: 6, backgroundColor: "#fff" }}>
      <Stepper nonLinear activeStep={activeStep} sx={{
        '.MuiStepIcon-root': {
          '&.Mui-active': {
            color: '#1CAC70',
          },
        },
      }} >
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {renderStepContent(activeStep)}
            <Box sx={{ display: 'flex', flexDirection: 'row', mb: 3 }}>
              {activeStep > 0 &&
                <Button
                  color="inherit"
                  onClick={handleBack}
                  sx={{ mr: 1, color: '#1CAC70', }}
                >
                  Back
                </Button>
              }
              <Box sx={{ flex: '1 1 auto' }} />
              {activeStep === steps.length - 1 ?
                <Button onClick={handleComplete} sx={{ color: '#fff', backgroundColor: "#1CAC70", '&:hover': { backgroundColor: '#0fb600' } }}>
                  Import
                </Button>
                :
                <Button onClick={handleNext} sx={{ color: '#fff', backgroundColor: "#1CAC70", '&:hover': { backgroundColor: '#0fb600' } }}>
                  Next
                </Button>
              }
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
