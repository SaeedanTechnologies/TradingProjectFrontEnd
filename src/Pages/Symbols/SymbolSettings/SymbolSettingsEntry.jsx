import { theme } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import ARROW_BACK_CDN from '../../../assets/images/arrow-back.svg';
import CustomTextField from '../../../components/CustomTextField';
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import { AutocompleteDummyData, SymbolAutocompleteDummyData } from '../../../utils/constants';
import CustomButton from '../../../components/CustomButton';
import { SymbolSettingPost, Symbol_Group_List } from '../../../utils/_SymbolSettingAPICalls';
import { useSelector } from 'react-redux';



const SymbolSettingsEntry = () => {
  const [formValues, setFormValues] = useState({
    SymbolGroup: '',
    feed_name: '',
    feed_name_fetch: '',
    leverage: '',
    swap: '',
    lot_size: '',
    lot_step: '',
    vol_min: '',
    vol_max: '',
    commission: '',
    enabled: null,
  });
  const fieldFlow = {
    display: 'flex',
    gap: "20px"
  }
  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, Gray2, colorPrimary },
  } = theme.useToken();
  const navigate = useNavigate()
  const [SymbolList, setSymbolList] = useState([])
  const [groupList, setGroupList] = useState(AutocompleteDummyData)
  const [SelectedSymbol, setSelectedSymbol] = useState(null)
  const [errors, setErrors] = useState({});
  const [EnabledList, setEnabledList] = useState([
    { id: 1, title: 'Yes' },
    { id: 2, title: 'No' },
  ])
  const [Selectedenable, setSelectedEnable] = useState(null)
  const validationSchema = Yup.object().shape({
    SymbolGroupName: Yup.string().required('Symbol Group Name is required'),
    SymbolGroup: Yup.string().required('Symbol Group is required'),
    SymbolFeedName: Yup.string().required('Symbol Feed Name is required'),
    SymbolFeedNameFetch: Yup.string().required('Symbol Feed Name Fetch is required'),
    SymbolLaverage: Yup.string().required('Symbol Laverage is required'),
    SymbolSwap: Yup.string().required('Symbol Swap is required'),
    LotSize: Yup.string().required('Lot Size is required'),
    LotSteps: Yup.string().required('Lot Steps is required'),
    ValueMinimum: Yup.string().required('Value Minimum is required'),
    ValueMaximum: Yup.string().required('Value Maximum is required'),
    Commision: Yup.string().required('Commision is required'),
    Enabled: Yup.string().required('Enabled is required'),
  });
  const handleInputChange = (fieldName, value) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      [fieldName]: undefined,
    }));

    setFormValues({
      ...formValues,
      [fieldName]: value,
    });
  };
  const fetchSymbolGroups = async () => {
    try {
      const res = await Symbol_Group_List(token);
      const { data: { message, success, payload } } = res
      setSymbolList(payload.data);
    } catch (error) {
      console.error('Error fetching symbol groups:', error);
    }
  };
  useEffect(() => {
    fetchSymbolGroups();
  }, []);

  const handleSubmit = async () => {
    try {
      await validationSchema.validate(formValues, { abortEarly: false });

      setIsLoading(true);
      const res = await SymbolSettingPost(formValues);
      setIsLoading(false);

      const { data: { message, success } } = res;

      if (success) {
        notifySuccess(message);
      } else {
        notifyError(message);
      }
    } catch (error) {
      const validationErrors = {};
      error.inner.forEach(err => {
        validationErrors[err.path] = err.message;
      });
      setErrors(validationErrors);
    }
  };



  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <div className='flex gap-3'>
        <img
          src={ARROW_BACK_CDN}
          alt='back icon'
          className='cursor-pointer'
          onClick={() => navigate(-1)}
        />
        <h1 className='text-2xl font-semibold'>Symbol Group</h1>
      </div>
      <div className='border rounded-lg p-4'>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
          <div>
            <CustomAutocomplete
              name="SymbolGroup"
              label="Symbol Group"
              variant="standard"
              options={SymbolList}
              value={SelectedSymbol}
              getOptionLabel={(option) => option.name ? option.name : ""}
              onChange={(event, value) => {
                if (value) {
                  setSelectedSymbol(value);
                } else {
                  setSelectedSymbol(null);
                }
              }}
            />


            {errors.SymbolGroup && <span style={{ color: 'red' }}>{errors.SymbolGroup}</span>}
          </div>
          <div>
            <CustomAutocomplete
              key={2}
              name="SymbolGroupName"
              label="Symbol Group Name"
              variant="standard"
              options={groupList}
              getOptionLabel={(option) => option.title ? option.title : ""}
              onChange={(event, value) => {
                if (value) {
                  setGroupList(value);
                } else {
                  setGroupList(null);
                }
              }}
            />

            {errors.SymbolGroupName && <span style={{ color: 'red' }}>{errors.SymbolGroupName}</span>}

          </div>



          <div>
            <CustomTextField
              key={3}
              label="Symbol Feed Name"
              varient="standard"
              onChange={(e) => handleInputChange("SymbolFeedName", e.target.value)}
            />

            {errors.SymbolFeedName && <span style={{ color: 'red' }}>{errors.SymbolFeedName}</span>}

          </div>
          <div>

            <CustomTextField
              key={4}
              label="Symbol Feed Name Fetch"
              varient="standard"
              onChange={(e) => handleInputChange("SymbolFeedNameFetch", e.target.value)}
            />
            {errors.SymbolFeedNameFetch && <span style={{ color: 'red' }}>{errors.SymbolFeedNameFetch}</span>}
          </div>
          <div>
            <CustomTextField
              key={5}
              label="Symbol Laverage"
              varient="standard"
              onChange={(e) => handleInputChange("SymbolLaverage", e.target.value)}
            />
            {errors.SymbolLaverage && <span style={{ color: 'red' }}>{errors.SymbolLaverage}</span>}
          </div>
          <div>
            <CustomTextField
              key={6}
              label="Symbol Swap"
              varient="standard"
              onChange={(e) => handleInputChange("SymbolSwap", e.target.value)}
            />
            {errors.SymbolSwap && <span style={{ color: 'red' }}>{errors.SymbolSwap}</span>}
          </div>

          <div>
            <CustomTextField
              key={7}
              label="Lot Size"
              varient="standard"
              onChange={(e) => handleInputChange("LotSize", e.target.value)}
            />
            {errors.LotSize && <span style={{ color: 'red' }}>{errors.LotSize}</span>}
          </div>
          <div>
            <CustomTextField
              key={8}
              label="Lot Steps"
              varient="standard"
              onChange={(e) => handleInputChange("LotSteps", e.target.value)}
            />
            {errors.LotSteps && <span style={{ color: 'red' }}>{errors.LotSteps}</span>}
          </div>

          <div>
            <CustomTextField
              key={9}
              label="Value Minimum"
              varient="standard"
              onChange={(e) => handleInputChange("ValueMinimum", e.target.value)}
            />
            {errors.ValueMinimum && <span style={{ color: 'red' }}>{errors.ValueMinimum}</span>}
          </div>
          <div>
            <CustomTextField
              key={10}
              label="Value Maximum"
              varient="standard"
              onChange={(e) => handleInputChange("ValueMaximum", e.target.value)}
            />
            {errors.ValueMaximum && <span style={{ color: 'red' }}>{errors.ValueMaximum}</span>}
          </div>

          <div>
            <CustomTextField

              label="Commision"
              varient="standard"
              onChange={(e) => handleInputChange("Commision", e.target.value)}
            />
            {errors.Commision && <span style={{ color: 'red' }}>{errors.Commision}</span>}
          </div>
          <div>
            <CustomAutocomplete

              label="Enabled"
              variant="standard"
              options={EnabledList}
              getOptionLabel={(option) => option.title ? option.title : ""}
              onChange={(e, value) => setSelectedEnable(value)}
            />
            {errors.Enabled && <span style={{ color: 'red' }}>{errors.Enabled}</span>}
          </div>


        </div>
        <div className='flex justify-center items-center sm:justify-end flex-wrap gap-4 mt-6'>
          <CustomButton
            Text='Cancel'
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',
              backgroundColor: '#c5c5c5',
              borderColor: '#c5c5c5',
              color: '#fff'
            }}
            onClick={() => navigate(-1)}
          />
          <CustomButton
            Text='Update'
            style={{
              padding: '16px',
              height: '48px',
              width: '200px',
              borderRadius: '8px',
            }}
            onClickHandler={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}

export default SymbolSettingsEntry
