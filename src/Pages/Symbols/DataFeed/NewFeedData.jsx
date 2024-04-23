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
import { SelectFeedDataById, UpdateDataFeed, feedDataPost, getFeedServer } from '../../../utils/_DataFeedAPI'
import CustomNotification from '../../../components/CustomNotification';


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
    const [fields, setFields] = useState([])
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [selectedFeed, setSelectedFeed] = useState(null)


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

    const fetchFeedDataWRTID = async () => {
        try {
            setIsLoading(true)
            const res = await SelectFeedDataById(id, token)
            const { data: { success, message, payload } } = res
            setIsLoading(false)
            if (success) {
                setName(payload.name)
                if (payload.feed_login !== null) {
                    const currentField = [
                        {
                            feed_login: payload.feed_login
                        }
                    ]
                    debugger
                    setFields(currentField)
                }

            } else {
                CustomNotification({
                    type: 'error',
                    title: 'Oppssss....',
                    description: message,
                    key: 3
                });
            }
        } catch (err) {
            alert(err.message)
        }

    }

    useEffect(() => {
        fetchServerData()
        if (parseInt(id) !== 0) {
            fetchFeedDataWRTID()

        }
    }, [])
    const handleSubmit = async () => {
        try {
            const allFeedData = {
                name: name,
                module: selectedFeed && selectedFeed.module ? selectedFeed.module : null,
                feed_server: selectedFeed && selectedFeed.feed_server ? selectedFeed.feed_server : null,
            };
            if (parseInt(id) === 0) {
                if (!feed_login) {
                    setErrors(prevErrors => ({ ...prevErrors, feed_login: 'Feed login is required' }));
                    return;
                }
                if (feed_login.length > 0) {
                    allFeedData.feed_login = feed_login;
                }
                if (password) {
                    allFeedData.password = password;
                }
                setIsLoading(true);

                const res = await feedDataPost(allFeedData, token);
                const { data: { message, success, } } = res;
                setIsLoading(false);
                if (success) {
                    clearFields();
                    navigate('/data-feed')
                    CustomNotification({
                        type: 'success',
                        title: 'Success',
                        description: message,
                        key: 1
                    });
                } else {
                    CustomNotification({
                        type: 'error',
                        title: 'Oppssss....',
                        description: message,
                        key: 2
                    });
                }
            } else {
                setIsLoading(true)
                // debugger
                const res = await UpdateDataFeed(id, allFeedData, token);

                const { data: { message, success, payload } } = res;
                setIsLoading(false)
                if (success) {
                    clearFields();
                    navigate('/data-feed')
                } else {
                    setIsLoading(false)
                    alert(message);
                }
            }

        } catch (err) {
            const validationErrors = {};
            err.inner?.forEach(error => {
                validationErrors[error.path] = error.message;
            });
            setErrors(validationErrors);
        }
    };

    const clearFields = () => {
        setName('');
        setFeedName([]);
        setFeedLogin('');
        setPassword('');
    };

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


                        {parseInt(id) === 0 && (
                            <CustomAutocomplete
                                name="FeedName"
                                label="Select Feed Name"
                                variant="standard"
                                options={feed_name}
                                value={selectedFeed}
                                getOptionLabel={(option) => option.name ? option.name : ""}
                                onChange={(event, value) => {
                                    if (value) {
                                        setSelectedFeed(value);
                                        setFields(value.fields);
                                        setErrors(prevErrors => ({ ...prevErrors, feed_name: "" }))
                                    } else {
                                        setSelectedFeed(null);
                                        setErrors(prevErrors => ({ ...prevErrors, feed_name: "Symbol Group is Requried" }))
                                    }
                                }}
                            />
                        )}
                        <div>

                            {fields && fields.map((item, index) => (
                                <div key={index}>
                                    <CustomTextField
                                        name={item.name}
                                        label={item.label}
                                        varient="standard"
                                        onChange={(e) => handleInputChange(item.name, e.target.value)}
                                    />
                                    {errors[item.name] && <span style={{ color: 'red' }}>{errors[item.name]}</span>}
                                </div>
                            ))}
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
                            onClickHandler={handleSubmit}
                        // loading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </Spin>
    )
}

export default NewFeedDaata;
