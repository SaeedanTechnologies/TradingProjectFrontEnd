import { theme, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

import ARROW_BACK_CDN from '../../../assets/images/arrow-back.svg';
import CustomTextField from '../../../components/CustomTextField';
import CustomAutocomplete from '../../../components/CustomAutocomplete';
import { AutocompleteDummyData, LeverageList } from '../../../utils/constants';
import CustomButton from '../../../components/CustomButton';
import { Feed_Data_List, SelectSymbolSettingsWRTID, SymbolSettingPost, Symbol_Group_List, UpdateSymbolSettings } from '../../../utils/_SymbolSettingAPICalls';
import { GetAskBidData, GetCryptoData } from '../../../utils/_ExchangeAPI'
import { useSelector } from 'react-redux';
import { getFeedServer } from '../../../utils/_DataFeedAPI'


const NewFeedDaata = () => {
    const token = useSelector(({ user }) => user?.user?.token)
    const { id } = useParams()
    const {
        token: { colorBG, TableHeaderColor, Gray2, colorPrimary },
    } = theme.useToken();
    const navigate = useNavigate()

    const [selectedFeedNameFetch, setSelectedFeedNameFetch] = useState(null)

    const [name, setName] = useState('')
    const [feed_name, setFeedName] = useState([])
    const [feed_login, setFeedLogin] = useState([])
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [SelectedSymbol, setSelectedSymbol] = useState(null)
    const validationSchema = Yup.object().shape({
        name: Yup.array().required('Name is required'),
        feed_name: Yup.string().required('Feed Name is required'),
        feed_login: Yup.string().required('Feed Login is required'),
        password: Yup.string().required('password is required'),

    });

    const clearFields = () => {
        setName('');
        setFeedName([]);
        feed_login('')
        password('')

    };

    const handleInputChange = (fieldName, value) => {
        setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
        switch (fieldName) {
            case 'name':
                setName(value);
                break;
            case 'feed_name':
                setFeedName(value);
                break;
            case 'feed_login':
                setFeedLogin(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                break;
        }
    };

    const fetchServerData = async () => {
        setIsLoading(true)

        const res = await getFeedServer(token)
        const { data: { message, payload, success } } = res

        console.log(res)
        setIsLoading(false)
        if (success) {
            setFeedName(payload)
        }
    }
    useEffect(() => {
        fetchServerData()
    }, [])
    // const fetchFeedData = async () => {
    //     try {
    //         const res = await Feed_Data_List(token);
    //         const { data: { message, success, payload } } = res
    //         setFeedNameList(payload.data);
    //         if (parseInt(id) !== 0) {
    //             fetchSymbolSettingsWRTID(SymbolList, payload.data)

    //         }

    //     } catch (error) {
    //         console.error('Error fetching symbol groups:', error);
    //     }
    // }
    // const fetchSymbolSettingsWRTID = async (SymbList, feedlist) => {
    //     if (id !== 0) {
    //         setIsLoading(true)
    //         const res = await SelectSymbolSettingsWRTID(id, token)
    //         const { data: { message, payload, success } } = res
    //         setIsLoading(false)
    //         if (success) {
    //             setSymbolName(payload.name)
    //             const selectedGroup = SymbList.find(x => x.id === payload.symbel_group_id)
    //             setSelectedSymbol(selectedGroup)
    //             const SelectedFeedNameOption = feedlist.find(x => x.name === payload.feed_name)
    //             if (payload.feed_name === 'binance') {
    //                 const res = await GetCryptoData()
    //                 const mData = res?.data?.symbols
    //                 setFeedNameFetchList(mData)
    //                 const selectedSymb = mData.find(x => x.symbol === payload.feed_fetch_name)
    //                 setSelectedFeedNameFetch(selectedSymb)
    //             }
    //             const selectedLeverageOpt = LeverageList.find(x => x.title === payload.leverage)
    //             setSelectedLeverage(selectedLeverageOpt)
    //             setSelectedFeedName(SelectedFeedNameOption)
    //             const selectedEnab = EnabledList.find(item => item.id === (parseFloat(payload.enabled) ? 1 : 2));
    //             setSelectedEnable(selectedEnab)
    //             setLeverage(parseFloat(payload.leverage))
    //             setLotSize(payload.lot_size);
    //             setLotSteps(payload.lot_step);
    //             setVolMin(payload.vol_min);
    //             setVolMax(payload.vol_max);
    //             setSwap(payload.swap);
    //             setCommission(payload.commission);
    //         }

    //     }
    // }

    // const handleSubmit = async () => {
    //     try {
    //         await validationSchema.validate({
    //             name: name,
    //             feed_name: selectedFeedName,

    //         }, { abortEarly: false });

    //         setErrors({});
    //         const SymbolGroupData = {
    //             name: symbolName,
    //             symbel_group_id: SelectedSymbol.id,
    //             feed_fetch_name: selectedFeedNameFetch.symbol,
    //             speed_max: 'abc',
    //             lot_size: lotSize,
    //             lot_step: lotSteps,
    //             commission: commission,
    //             enabled: Selectedenable.title = 'Yes' ? 1 : 0,
    //             leverage: SelectedLeverage.value,
    //             feed_name: selectedFeedName ? selectedFeedName.name : '',
    //             feed_server: selectedFeedName ? selectedFeedName.feed_server : '',
    //             swap: swap,
    //             vol_min: volMin,
    //             vol_max: volMax

    //         };
    //         if (parseInt(id) === 0) {
    //             setIsLoading(true)
    //             const res = await SymbolSettingPost(SymbolGroupData, token);

    //             const { data: { message, success, payload } } = res;
    //             setIsLoading(false)
    //             if (success) {
    //                 clearFields();
    //                 navigate('/symbol-settings')
    //             } else {
    //                 setIsLoading(false)
    //                 alert(message);
    //             }

    //         } else {
    //             setIsLoading(true)
    //             const res = await UpdateSymbolSettings(id, SymbolGroupData, token);

    //             const { data: { message, success, payload } } = res;
    //             setIsLoading(false)
    //             if (success) {
    //                 clearFields();
    //                 navigate('/symbol-settings')
    //             } else {
    //                 setIsLoading(false)
    //                 alert(message);
    //             }

    //         }

    //     } catch (err) {
    //         const validationErrors = {};
    //         err.inner?.forEach(error => {
    //             validationErrors[error.path] = error.message;
    //         });
    //         setErrors(validationErrors);
    //     }
    // };

    return (
        <Spin spinning={isLoading} size="large">``
            <div className='p-8' style={{ backgroundColor: colorBG }}>
                <div className='flex gap-3 items-center'>
                    <img
                        src={ARROW_BACK_CDN}
                        alt='back icon'
                        className='cursor-pointer'
                        onClick={() => navigate(-1)}
                    />
                    <h1 className='text-2xl font-semibold'>{parseInt(id) === 0 ? 'Add New Data Feed' : 'Edit Data Feed'}</h1>
                </div>
                <div className='border rounded-lg p-4'>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                        <div>
                            <CustomTextField
                                key={4}
                                name={"name"}
                                label="Name"
                                varient="standard"
                                value={name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                            />
                            {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                        </div>
                        <div>

                            <CustomAutocomplete
                                name="FeedName"
                                label="Select Feed Name"
                                variant="standard"
                                options={feed_name}
                                value={SelectedSymbol}
                                getOptionLabel={(option) => option.name ? option.name : ""}
                                onChange={(event, value) => {
                                    if (value) {
                                        debugger
                                        setSelectedSymbol(value);
                                        setErrors(prevErrors => ({ ...prevErrors, SymbolGroup: "" }))
                                    } else {
                                        setSelectedSymbol(null);
                                        setErrors(prevErrors => ({ ...prevErrors, SymbolGroup: "Symbol Group is Requried" }))
                                    }
                                }}
                            />
                            {errors.feed_name && <span style={{ color: 'red' }}>{errors.feed_name}</span>}
                        </div>
                        <div>
                            <CustomTextField
                                key={4}
                                name={"feed_login"}
                                label="Feed Login"
                                varient="standard"
                                value={name}
                                onChange={(e) => handleInputChange("feed_login", e.target.value)}
                            />
                            {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
                        </div>
                        <div>
                            <CustomTextField
                                key={4}
                                name={"password"}
                                label="Password"
                                varient="standard"
                                value={name}
                                onChange={(e) => handleInputChange("Password", e.target.value)}
                            />
                            {errors.Password && <span style={{ color: 'red' }}>{errors.Password}</span>}
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
                            Text={parseInt(id) === 0 ? 'Submit' : 'Update'}
                            style={{
                                padding: '16px',
                                height: '48px',
                                width: '200px',
                                borderRadius: '8px',
                                zIndex: '100'
                            }}
                        // onClickHandler={handleSubmit}
                        />
                    </div>
                </div>
            </div>
        </Spin>
    )
}

export default NewFeedDaata;
