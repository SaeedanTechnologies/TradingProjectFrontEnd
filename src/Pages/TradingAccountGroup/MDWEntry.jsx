import { theme } from 'antd';
import React, { useState } from 'react';
import ARROW_BACK_CDN from '../../assets/images/arrow-back.svg';
import { useNavigate } from 'react-router-dom';
import CustomAutocomplete from '../../components/CustomAutocomplete';
import { AutocompleteDummyData } from '../../utils/constants';
import CustomTextField from '../../components/CustomTextField';
import CustomButton from '../../components/CustomButton';
import { Save_Group_Order } from '../../utils/_TradeOrderAPI';
import CustomNotification from '../../components/CustomNotification';
import { useSelector } from 'react-redux';

const MDWEntry = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const { id, name } = useSelector(({ group }) => group?.tradingGroupData)
  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();
  const [transactionOrders, setTransactionOrders] = useState([])
  const [method, setMethod] = useState(null)
  const [currency, setCurrency] = useState('')
  const [amount, setAmount] = useState('')
  const [comment, setComment] = useState('')
  const [errors, setErrors] = useState({})
  const [OperationsList, setOperationList] = useState([
    { "label": "balance", "value": "balance" },
    { "label": "commission", "value": "commission" },
    { "label": "tax", "value": "tax" },
    { "label": "Credit", "value": "Credit" },
    { "label": "bonus", "value": "bonus" }
  ])
  const [SelectedOperation, setSElectedOperation] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate();

  const clearFields = () => {
    setMethod(null)
    setAmount('')
    setComment('')
  }

  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {

      case 'amount':
        setAmount(value);
        break;
      case 'comment':
        setComment(value);
        break;

    }
  };

  const handleOperationChange = (e, value) => {
    if (value) {
      setSElectedOperation(value);
    } else {
      setSElectedOperation(null);
    }
  };

  const handleSubmit = async (type) => {
    debugger
    try {

      setErrors({});

      const TransactionOrderGroupData = {
        method: method.value,
        amount,
        comment,
        currency,
        name: '',
        trading_group_id: id,
        group: name,
        type,
        status: "requested"

      }


      setIsLoading(true)

      alert(JSON.stringify(TransactionOrderGroupData))
      const res = await Save_Group_Order(TransactionOrderGroupData, token)
      // debugger
      const { data: { message, payload, success } } = res
      if (success) {
        setIsLoading(false)
        CustomNotification({ type: "success", title: "Transaction Order", description: message, key: 1 })

        clearFields()
      }
      else {
        setIsLoading(false)
        CustomNotification({ type: "error", title: "Transaction Order", description: message, key: 1 })
      }

    } catch (err) {
      CustomNotification({ type: "error", title: "Transaction Order", description: err.message, key: 1 });
      const validationErrors = {};
      if (err.inner) {
        err.inner.forEach(error => {
          validationErrors[error.path] = error.message;
        });
      }
      setErrors(validationErrors);
    }
  }



  return (
    <div className='p-8' style={{ backgroundColor: colorBG }}>
      <div className='flex gap-3'>
        <img
          src={ARROW_BACK_CDN}
          alt='back icon'
          className='cursor-pointer'
          onClick={() => navigate(-1)}
        />
        <h1 className='text-3xl font-bold'>Mass Deposit/Withdraw</h1>
      </div>
      <div className='border rounded-lg p-8'>
        <div className='grid grid-cols-2 gap-5'>
          <div>
            <CustomAutocomplete
              name={'Operations'}
              variant={'standard'}
              label={'Operations'}
              value={method}
              options={OperationsList}
              getOptionLabel={(option) => option.label ? option.label : ""}
              onChange={(e, value) => {
                if (value) {

                  setErrors(prevErrors => ({ ...prevErrors, method: {} }))
                  setMethod(value)
                }
                else {
                  setMethod(null)
                }
              }}
            />
            {errors.method?.value && <span style={{ color: 'red' }}>{errors.method?.value}</span>}
          </div>
          <div>
            <span>{currency}</span>
            <CustomTextField label={'Amount'} fullWidth varient={'standard'} type="number" value={amount} onChange={e => handleInputChange('amount', e.target.value)}
            />
            {errors.amount && <span style={{ color: 'red' }}>{errors.amount}</span>}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 mt-4">
          <CustomTextField label={'Comments'}
            multiline={true}
            rows={4}
            value={comment}
            onChange={e => handleInputChange('comment', e.target.value)}
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4'>
          <CustomButton
            Text={"With Draw"}
            style={{ height: "48px", backgroundColor: "#D52B1E", borderColor: "#D52B1E", borderRadius: "8px" }}
            onClickHandler={() => handleSubmit('withdraw')}
          />
          <CustomButton Text={"Deposit"}
            style={{ height: "48px", borderRadius: "8px" }}
            onClickHandler={() => handleSubmit('deposit')}
          />
        </div>
      </div>
    </div>
  );
};

export default MDWEntry;
