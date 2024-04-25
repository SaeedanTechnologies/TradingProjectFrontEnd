// ya list h

import React, { useEffect, useState } from 'react'

import { Space, Spin, Tag, theme } from 'antd';

import { PlusCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import CustomButton from '../../components/CustomButton';
import { AddnewStyle, footerStyle, submitStyle } from '../Brand/style';
import CustomTable from '../../components/CustomTable';
import { Link } from 'react-router-dom';
import CustomModal from '../../components/CustomModal';
import TradingAccountModal from '../TradingAccountGroup/TradingAccountModal';
import { DeleteTradingAccountGroup, Trading_Account_Group_List } from '../../utils/_TradingAccountGroupAPI';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { CustomDeleteDeleteHandler } from '../../utils/helpers';
import { setTradingGroupData } from '../../store/TradingGroupData';



const Index = () => {
  const token = useSelector(({ user }) => user?.user?.token)
  const { token: { colorBG, TableHeaderColor, colorPrimary } } = theme.useToken();
  const [TradingGroupID, setTradingGroupID] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [TradingAccounGroupList, setTradingAccountGroupList] = useState([])
  const [selectedAccountData, setSelectedAccountData] = useState([])

  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const dispatch = useDispatch();

  const handleMassDepositWithdrawClick = (id, name) => {
    dispatch(setTradingGroupData({ id, name },));
  };

  const showModal = (id = null) => {
    setTradingGroupID(id)
    setIsModalOpen(true);

  };
  const showAccountModal = (trading_accounts) => {
    setIsAccountModalOpen(true)
    if (trading_accounts.length > 0) {
      setSelectedAccountData(trading_accounts)
    } else {
      setSelectedAccountData([]);
    }
  }
  const hideAccountModal = () => {
    setIsAccountModalOpen(false)
  }
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const fetchData = async () => {
    setIsLoading(true)
    const res = await Trading_Account_Group_List(token)
    const { data: { message, payload, success } } = res
    setIsLoading(false)
    if (success) {
      setTradingAccountGroupList(payload.data)
    }
  }
  useEffect(() => {

    fetchData()
  }, [])

  const DeleteHandler = async (id) => {
    setIsLoading(true)
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1CAC70",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await DeleteTradingAccountGroup(id, token)
        const { data: { success, message, payload } } = res
        setIsLoading(false)
        if (success) {
          Swal.fire({
            title: "Deleted!",
            text: message,
            icon: "success"
          });
          fetchData()
        } else {
          Swal.fire({
            title: "Opps!",
            text: { message },
            icon: "error"
          });
        }

      }
    });

    setIsLoading(false)

  }
  const headerStyle = {
    background: TableHeaderColor,
    color: 'black',
  };
  const columns = [
    {
      title: 'Group Name',
      dataIndex: 'name',
      key: '1',
    },
    {
      title: 'Symbol Group',
      dataIndex: 'symbel_groups',
      key: '2',
      render: (_, { symbel_groups }) => (
        <>
          {symbel_groups?.map((tag) => {
            return (
              <Tag color={'green'} key={tag.id}>
                {tag.name.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    },
    {
      title: 'Mass Buy/Sell Trading Order',
      dataIndex: 'MBS',
      key: '3',
      render: (text) => <Link to={'/trading-group/mb-to/0'} style={{ color: colorPrimary, fontWeight: '600' }}>View Details</Link>
    },
    {
      title: 'Mass deposit/widthdraw',
      dataIndex: 'MDW',
      key: '4',
      render: (_, record) => (
        <Link
          to={`/trading-group/mass-deposit/${record.id}`}
          style={{ color: colorPrimary, fontWeight: '600' }}
          onClick={() => handleMassDepositWithdrawClick(record.id, record.name)}
        >
          View Details
        </Link>
      ),
    },

    {
      title: 'Mass Laverage',
      dataIndex: 'mass_leverage',
      key: '5',
    },
    {
      title: 'Mass Swap',
      dataIndex: 'mass_swap',
      key: '6',
    },
    {
      title: 'Trading Accounts',
      dataIndex: 'trading_accounts',
      key: '7',
      render: (text, record) => {
        const { trading_accounts } = record
        return (
          <span className='cursor-pointer' style={{ color: colorPrimary, fontWeight: '600' }} onClick={() => showAccountModal(trading_accounts)}>View Accounts</span>
        )
      }

    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
          <EditOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => showModal(record.id)} />
          <DeleteOutlined style={{ fontSize: "24px", color: colorPrimary }} onClick={() => CustomDeleteDeleteHandler(record.id, token, DeleteTradingAccountGroup, setIsLoading)} />
        </Space>
      ),
    },
  ];


  return (
    <Spin spinning={isLoading} size="large">

      <div className='p-8' style={{ backgroundColor: colorBG }}>
        <div className='flex flex-col sm:flex-row items-center gap-2 justify-between'>
          <h1 className='text-2xl font-semibold'>Trading Account Group</h1>
          <CustomButton
            Text='Add New Trading Group'
            style={{ height: '48px', ...AddnewStyle }}
            icon={<PlusCircleOutlined />}
            onClickHandler={() => showModal(0)}
          />
        </div>
        <CustomTable columns={columns} data={TradingAccounGroupList} headerStyle={headerStyle} />
        <CustomModal
          isModalOpen={isModalOpen}
          handleOk={handleOk}
          handleCancel={handleCancel}
          title={''}
          width={800}
          footer={[]}
        >
          <TradingAccountModal
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            fetchData={fetchData}
            TradingGroupID={TradingGroupID}
          />
        </CustomModal>
        <CustomModal
          isModalOpen={isAccountModalOpen}
          title={'Selected Accounts'}
          handleOk={handleOk}
          handleCancel={hideAccountModal}
          footer={[]}
          width={400}

        >
          {selectedAccountData.length > 0 ? selectedAccountData?.map((tag) => {
            return (
              <Tag color={'green'} key={tag.id}>
                {tag?.login_id}
              </Tag>
            );
          })
            : 'Thers no selected account'
          }
        </CustomModal>
      </div>
    </Spin>
  )
}

export default Index