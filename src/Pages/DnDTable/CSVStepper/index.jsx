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

const steps = ['Upload CSV', 'Duplicate Handling', 'Field Mapping'];
export default function CSVStepper() {
  const { state } = useLocation()
  const [csv_file, setCsvFile] = React.useState("")
  const [csvData, setCSVdata] = React.useState("")
  const [selected_values, setSelectedValues] = React.useState("")
  const [skip, setSkip] = React.useState("skip")
  const [data_array, setDataArray] = React.useState([])
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const token = useSelector(({ user }) => user?.user?.token)
  const [loading, setIsLoading] = React.useState(false)
  const steps = ['Upload CSV', 'Duplicate Handling', 'Field Mapping'];
  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };
  const handleNext = () => {
    if (!csv_file) {
      CustomNotification({ type: "error", title: "Opps", description: `Please upload csv file first`, key: 1 })

    }
    else
      if (activeStep === steps.length - 1 && !allStepsCompleted()) {
        return;
      }
      else {
        const newActiveStep = activeStep + 1;
        setActiveStep(newActiveStep);
      }

  };

  const handleBack = () => {
    if (activeStep === 0) {
      // If active step is already the first step, don't move back
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = async () => {
    const merge = []
    const merge_cols = merge
    const params = {
      table_name: state?.tableName,
      rows: data_array,
      marge_col: merge_cols,
      skip: skip
    }
    const res = await massImport(params, token)
    console.log(res, "THIS IS REPSONSE")
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return <UploadCSV setCsv={setCsvFile} setCSVdata={setCSVdata} />;
      case 1:
        return <DuplicateHandling setSelectedValues={setSelectedValues} setSkip={setSkip} />;
      case 2:
        return <FieldMapping setDataArray={setDataArray} csvData={csvData} />;
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
            // Set background color to green for the active step
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
                  disabled={activeStep === 0}
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

