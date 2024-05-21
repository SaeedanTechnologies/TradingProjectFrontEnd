import { Space, Tag, theme, Spin } from 'antd';
import React, { useState, useEffect } from 'react'
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import CustomAutocomplete from '../../components/CustomAutocomplete';

import CustomButton from '../../components/CustomButton';
import CustomTable from '../../components/CustomTable';

import { Link } from 'react-router-dom';
import { numberInputStyle } from './style';
import { Save_Transaction_Order, Get_Transaction_Orders } from '../../utils/_TransactionOrderAPI';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionOrderValidationSchema } from '../../utils/validations';
import moment from 'moment'
import CustomNotification from '../../components/CustomNotification';
import { Get_Single_Trading_Account } from '../../utils/_TradingAPICalls';
import { TextField, Input, InputAdornment, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import { CheckBrandPermission } from "../../utils/helpers";
import { setTradingAccountGroupData } from '../../store/tradingAccountGroupSlice';
import { AddnewStyle } from '../Brand/style';
import CustomModal from '../../components/CustomModal';
import { setTransactionsOrdersSelectedIDs,setTransactionOrdersData } from '../../store/TradingAccountSlice';

const TransactionOrder = () => {

  const token = useSelector(({ user }) => user?.user?.token)
  const {
    token: { colorBG, TableHeaderColor, colorPrimary },
  } = theme.useToken();
  const dispatch = useDispatch()
  const trading_account_id = useSelector((state) => state?.trade?.trading_account_id)
  const userRole = useSelector((state) => state?.user?.user?.user?.roles[0]?.name)
  const userPermissions = useSelector((state) => state?.user?.user?.user?.permissions)
  const currentTradingAccountData = useSelector(({ tradingAccountGroup }) => tradingAccountGroup.tradingAccountGroupData)


  const [transactionOrders, setTransactionOrders] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [method, setMethod] = useState('')
  const [currency, setCurrency] = useState('')
  const [amount, setAmount] = useState('')
  const [comment, setComment] = useState('')
  const [brandId, setBrandId] = useState(-1)
  const [OperationsList, setOperationList] = useState([
    { "label": "Balance", "value": "balance" },
    { "label": "Commission", "value": "commission" },
    { "label": "Tax", "value": "tax" },
    { "label": "Credit", "value": "credit" },
    { "label": "Bonus", "value": "bonus" }
  ])
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [SelectedMethod, setSelectedMethod] = useState([])
  const [isUpdated, setIsUpdated] = useState(true)
  const [sortDirection, setSortDirection] = useState("")
  const [perPage, setPerPage] = useState(10)


  const columns = [
    {
      title: <span className="dragHandler">Time</span>,
      dataIndex: 'created_at',
      key: '1',
      render: (text) => <a>{moment(text).format("YYYY-MM-DD HH:mm")}</a>,
      sorter: (a, b) => a.Time.length - b.Time.length,
      sortDirections: ['ascend'],

    },
    {
      title: <span className="dragHandler">Method</span>,
      dataIndex: 'method',
      key: 'method',
      sorter: (a, b) => a.method.length - b.method.length,
      sortDirections: ['ascend'],
    },
    {
      title: <span className="dragHandler">Type</span>,
      dataIndex: 'type',
      key: 'type',
      sorter: (a, b) => a.type.length - b.type.length,
      sortDirections: ['ascend'],
    },
    {
      title: <span className="dragHandler">Currency</span>,
      dataIndex: 'currency',
      key: 'currency',
      sorter: (a, b) => a.currency.length - b.currency.length,
      sortDirections: ['ascend'],
    },
    {
      title: <span className="dragHandler">Comments</span>,
      dataIndex: 'comment',
      key: 'comment',
      sorter: (a, b) => a.comment.length - b.comment.length,
      sortDirections: ['ascend'],
    },
    {
      title: <span className="dragHandler">Amount</span>,
      dataIndex: 'amount',
      key: 'amount',
      sorter: (a, b) => a.amount.length - b.amount.length,
      sortDirections: ['ascend'],
    },

  ];

   const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns , setNewColumns] = useState(columns)
  
 
  const headerStyle = {
    background: TableHeaderColor, // Set the background color of the header
    color: 'black', // Set the text color of the header
  };

   const LoadingHandler = React.useCallback((isLoading)=>{
    setIsLoading(isLoading)
  },[])

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


  const fetchTransactionOrder = async (page) => {
    try {
      setIsLoading(true)
      const res = await Get_Transaction_Orders(trading_account_id, token, page);
      const { data: { message, success, payload } } = res
      setTransactionOrders(payload.data)
      setCurrentPage(payload.current_page)
      setLastPage(payload.last_page)
      setTotalRecords(payload.total)

      setIsLoading(false)

    } catch (error) {
      console.error('Error fetching transactions Order', error);
    }
  };


  const clearFields = () => {
    setMethod('')
    setAmount('')
    setComment('')
  }

  const onPageChange = (page) => {

    fetchTransactionOrder(page)
  }

   useEffect(() => {
        const newCols = columns.filter(x => checkedList.includes(x.key));
        setNewColumns(newCols)
  }, [checkedList]);

  const handleSubmit = async (type) => {
    // handle sumbit
    let isApplicable = true;

    if ( type === 'withdraw') {
      isApplicable = parseFloat(currentTradingAccountData[method]) >= amount;
      if (!isApplicable) {
        // setIsModalOpen(false)
        CustomNotification({ type: "error", title: "Transaction Order", description: "Insufficient "+method, key: 1 });
        return;
      }
    }

    try {
      await TransactionOrderValidationSchema.validate({
        trading_account_id,
        method,
        amount,
      }, { abortEarly: false });

      setErrors({});
      const TransactionOrderData = {
        trading_account_id,
        method: method,
        amount,
        comment,
        currency,
        name: null,
        group: null,
        type,
        status: "requested",
        brand_id: brandId

      }

      setIsLoading(true)
      const res = await Save_Transaction_Order(TransactionOrderData, token)
      const { data: { message, payload, success } } = res
      if (success) {
        setIsLoading(false)
        setIsModalOpen(false)
        // for update redux value
        if (type === 'withdraw') {
          const cBal = parseFloat(currentTradingAccountData[method]) - parseFloat(amount)
          const updatedAccountData = {
            ...currentTradingAccountData,
            [method]: cBal,
          };
          dispatch(setTradingAccountGroupData(updatedAccountData))

        } else if (type === 'deposit') {
          const cBal = parseFloat(currentTradingAccountData[method]) + parseFloat(amount)
          const updatedAccountData = {
            ...currentTradingAccountData,
            [method]: cBal,
          };
          dispatch(setTradingAccountGroupData(updatedAccountData))
        }
        CustomNotification({ type: "success", title: "Transaction Order", description: 'Transaction Order Created Successfully.', key: 1 })
        fetchTransactionOrder(CurrentPage)
        clearFields()
      }
      else {
        setIsLoading(false)
        // setIsModalOpen(false)
        CustomNotification({ type: "error", title: "Transaction Order", description: message, key: 1 })
      }

    } catch (err) {
      // setIsModalOpen(false)
      CustomNotification({ type: "error", title: "Transaction Order", description: err.message, key: 1 })
      const validationErrors = {};
      err.inner.forEach(error => {
        validationErrors[error.path] = error.message;
      });
      setErrors(validationErrors);
    }


  }

  const fetchSingleTradeAccount = async () => {

    setIsLoading(true)
    const res = await Get_Single_Trading_Account(trading_account_id, token)
    const { data: { message, payload, success } } = res


    setIsLoading(false)
    if (success) {
      setCurrency(payload?.currency)
      setBrandId(payload?.brand_id)

    }



  }

  useEffect(() => {
    setMethod('balance')
    fetchTransactionOrder(CurrentPage)
    fetchSingleTradeAccount()
  }, [])

  const defaultProps = {
    options: OperationsList,
    getOptionLabel: (option) => option.label ? option.label : "",
  };

  const closeTransactionOrder = () => {
    setIsModalOpen(false)
  }

  return (
    <Spin spinning={isLoading} size="large">
      <div className='rounded-lg' style={{ backgroundColor: colorBG }}>
        <CustomModal
          isModalOpen={isModalOpen}
          title={'Add New Transaction Order'}
          // handleOk={handleOk}
          handleCancel={closeTransactionOrder}
          footer={[]}
          width={800}

        >
          {
          CheckBrandPermission(userPermissions, userRole, 'transaction_orders_create') ?
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-4">
                <div>
                  <Select
                    placeholder="Operation"
                    variant="standard"
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    fullWidth
                    value={method}
                    onChange={(e) => {
                      setErrors(prevErrors => ({ ...prevErrors, method: '' }))
                      setMethod(e.target.value)
                    }

                    }
                  >

                    {OperationsList.map((operation) => (
                      <MenuItem key={operation.value} value={operation.value}>
                        {operation.label}
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <div>
                  <Input
                    id="input-with-icon-adornment"
                    placeholder='Amount'
                    startAdornment={
                      <InputAdornment position="start">
                        <span>{currency}</span>
                      </InputAdornment>
                    }
                    label={'Amount'}
                    fullWidth
                    variant={'standard'}
                    type="number"
                    sx={numberInputStyle}
                    value={amount}
                    onChange={e => handleInputChange('amount', e.target.value)}
                  />
                  {errors.amount && <span style={{ color: 'red' }}>{errors.amount}</span>}
                </div>

                <div>
                  <Input
                    placeholder='Comments'
                    label={'Comments'}
                    fullWidth
                    value={comment}
                    onChange={e => handleInputChange('comment', e.target.value)}
                    name={'Comments'}
                    variant={'standard'}

                  />
                </div>

              </div>



              <div className="mb-4 flex justify-center gap-4 mt-4">
                <CustomButton
                  Text={"With Draw"}
                  style={{ height: "48px", width:'206px', backgroundColor: "#D52B1E", borderColor: "#D52B1E", borderRadius: "8px" }}
                  onClickHandler={() => handleSubmit('withdraw')}
                />
                <CustomButton Text={"Deposit"}
                  style={{ height: "48px", width:'206px', borderRadius: "8px" }}
                  onClickHandler={() => handleSubmit('deposit')}
                />
              </div>

            </>
            : null
        }
        </CustomModal>

        <div className="mb-4 grid grid-cols-1  gap-4 mt-4">
          {/* <CustomTable columns={columns} data={transactionOrders} headerStyle={headerStyle} /> */}

          <CustomTable
            direction="/single-trading-accounts/details/transaction-order-entry"
            formName="Trading Transaction Order"
            columns={newColumns}
            data={transactionOrders}
            headerStyle={headerStyle}
            total={totalRecords}
            onPageChange={onPageChange}
            current_page={CurrentPage}
            token={token}
            isUpated={isUpdated}
            setSelecetdIDs={setTransactionsOrdersSelectedIDs}
            setTableData = {setTransactionOrdersData}
            table_name= "transaction_orders"
            setSortDirection = {setSortDirection}
            perPage={perPage}
            setPerPage={setPerPage}
            SearchQuery = {Get_Transaction_Orders}
            LoadingHandler={LoadingHandler}
             addButton={() => (
              <CustomButton
                Text='Add Transaction Order'
                style={{ height: '48px', ...AddnewStyle }}
                icon={<PlusCircleOutlined />}
                onClickHandler={() => {
                  // dispatch(setTradeGroupsSelectedIDs([0]))
                  // showModal(0)
                  setIsModalOpen(true);
                }}
              />
            )}
          />
        </div>

      </div>
    </Spin>
  )
}

export default TransactionOrder