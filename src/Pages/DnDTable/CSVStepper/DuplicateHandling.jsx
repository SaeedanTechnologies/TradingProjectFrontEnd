import { IconButton, Stack, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { DuplicateRecords } from '../../../utils/constants';
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import CustomCheckbox from '../../../components/CustomCheckbox';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useLocation } from 'react-router-dom';

const DuplicateHandling = ({ setSelectedValues, setSkip }) => {
    const skipOption = { label: 'Skip', value: 'skip' };
    const [selectDuplicateRecord, setSelectedDuplicateRecord] = useState(skipOption);
    const headers = localStorage.getItem("headers");
    const formatted = headers.split(",");
    const headersObjects = formatted.map((header, index) => ({
        id: index,
        label: header,
        value: false,
    }));

    const [chkBoxesControlLeft, setChkBoxesControlLeft] = useState(headersObjects);
    const [chkBoxesControlRight, setChkBoxesControlRight] = useState([]);

    // Helper function to update the selected values in the parent component
    const updateSelectedValues = () => {
        const selectedLeftValues = chkBoxesControlLeft.filter(item => item.value).map(item => item.label);
        const selectedRightValues = chkBoxesControlRight.filter(item => item.value).map(item => item.label);
        // setSelectedValues({ left: selectedLeftValues, right: selectedRightValues });
    };

    const handleInputChange = (key, checked, source) => {
        if (source === 'left') {
            const updatedLeftBoxes = chkBoxesControlLeft.map(item =>
                item.id === key ? { ...item, value: checked } : item
            );
            setChkBoxesControlLeft(updatedLeftBoxes);
        } else if (source === 'right') {
            const updatedRightBoxes = chkBoxesControlRight.map(item =>
                item.id === key ? { ...item, value: checked } : item
            );
            setChkBoxesControlRight(updatedRightBoxes);
        }
        // Update selected values after any change
        updateSelectedValues();
    };

    const handleForward = () => {
        const checkedLeftItems = chkBoxesControlLeft.filter(item => item.value);
        const updatedLeftArray = chkBoxesControlLeft.filter(item => !item.value);
        const updatedRightArray = [...chkBoxesControlRight, ...checkedLeftItems];
        setSelectedValues(updatedRightArray)
        setChkBoxesControlLeft(updatedLeftArray);
        setChkBoxesControlRight(updatedRightArray);
        // Update selected values after moving items forward
        updateSelectedValues();
    };

    const handleBack = () => {
        const checkedRightItems = chkBoxesControlRight.filter(item => item.value);
        const updatedRightArray = chkBoxesControlRight.filter(item => !item.value);
        const updatedLeftArray = [...chkBoxesControlLeft, ...checkedRightItems];
        setSelectedValues(updatedRightArray)
        setChkBoxesControlLeft(updatedLeftArray);
        setChkBoxesControlRight(updatedRightArray);
        // Update selected values after moving items back
        updateSelectedValues();
    };

    // Initial update of selected values
    useEffect(() => {
        updateSelectedValues();
    }, []);

    return (
        <Stack sx={{ py: 3 }}>
            <Typography sx={{ fontWeight: "500", fontSize: "24px", fontFamily: "poppins", color: "#616365", borderBottom: "2px solid #b2b4b3", pb: 0.5 }}>
                Duplicating Record Handling
            </Typography>

            <Stack direction={'column'} sx={{ gap: 8, py: 4 }}>
                <CustomAutocomplete
                    name="duplicate_record"
                    label="Select how duplicate records should be handled"
                    variant="standard"
                    options={DuplicateRecords}
                    value={selectDuplicateRecord}
                    getOptionLabel={(option) => option.label ? option.label : ""}
                    onChange={(event, value) => {
                        if (value) {
                            setSelectedDuplicateRecord(value);
                            setSkip(value.value)
                        } else {
                            setSelectedDuplicateRecord(null);
                        }
                    }}
                />
                <Stack sx={{ gap: 4 }}>
                    <Typography sx={{ fontSize: "18px", fontFamily: "poppins", color: "#616365" }}>
                        Select the matching fields to find duplicate records
                    </Typography>

                    <Stack direction="row" justifyContent={"space-between"} sx={{ width: "70%" }}>
                        <div className='bg-white shadow-md w-[300px] py-6 px-4'>
                            {chkBoxesControlLeft.map(item => (
                                <CustomCheckbox
                                    key={item.id}
                                    label={item.label}
                                    checked={item.value}
                                    onChange={(event) => handleInputChange(item.id, event.target.checked, 'left')}
                                />
                            ))}
                        </div>

                        <Stack alignItems={'center'} justifyContent='center'>
                            <IconButton onClick={handleForward}>
                                <ArrowForwardIcon />
                            </IconButton>
                            <IconButton onClick={handleBack}>
                                <ArrowBackIcon />
                            </IconButton>
                        </Stack>

                        <div className='bg-white shadow-md w-[300px] py-6 px-4'>
                            {chkBoxesControlRight.map(item => (
                                <CustomCheckbox
                                    key={item.id}
                                    label={item.label}
                                    checked={item.value}
                                    onChange={(event) => handleInputChange(item.id, event.target.checked, 'right')}
                                />
                            ))}
                        </div>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default DuplicateHandling;
