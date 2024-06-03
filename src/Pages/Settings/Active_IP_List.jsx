import React, { useEffect, useState } from 'react'
import CustomTable from '../../components/CustomTable';
import { Link } from 'react-router-dom';
import { Space, Spin, theme } from 'antd';
import { headerStyle } from '../MainLayout/style';
import {DeleteOutlined, EyeOutlined} from '@ant-design/icons';
import { Search_Active_IP, addToBlack_List, getActiveIPs } from '../../utils/_IPAddress';
import { useSelector } from 'react-redux';
import { ColumnSorter } from '../../utils/helpers';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png'
import { Button } from '@mui/material';
import CustomNotification from '../../components/CustomNotification';
const Active_IP_List = () => {
    const { token: { colorBG, TableHeaderColor, colorPrimary } } = theme.useToken();
  const token = useSelector(({ user }) => user?.user?.token)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPage, setPerPage] = useState(10)
    
  const getActiveIpData = async() => {
      try{
          setIsLoading(true)
          const res = await getActiveIPs(token)
          setIsLoading(false)
          setData(res.data.payload.data)
      }
      catch(errr){
          setIsLoading(false)
          console.log(errr)
      }

  }
  useEffect(() => {
    getActiveIpData()
    }, []);

    
      const columns = [
        {
          title: 'Date & Time',
          dataIndex: 'login_time',
          key: '1',
          sorter: (a, b) =>  ColumnSorter(a.login_time , b.login_time),
          sortDirections: ['ascend', 'descend'],
          sortIcon: (sortDir) => {
            if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
            if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
            return  <img src={ARROW_UP_DOWN} width={12} height={12} />; 
          },
        },
        {
          title: 'IP',
          dataIndex: 'ip_address',
          key: '2',
          sorter: (a, b) =>  ColumnSorter(a.ip_address , b.ip_address),
          sortDirections: ['ascend', 'descend'],
          sortIcon: (sortDir) => {
            if (sortDir.sortOrder === 'ascend') return <CaretUpOutlined />;
            if (sortDir.sortOrder === 'descend') return <CaretDownOutlined />;
            return  <img src={ARROW_UP_DOWN} width={12} height={12} />; // Return null if no sorting direction is set
          },
        },
        {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle" className='cursor-pointer'>
            <Button variant='contained' color='error' onClick={()=>addToBlackList(record.id)}>
                Add to blocklist
            </Button>

        </Space>
      ),
    },
      ];
      const LoadingHandler = React.useCallback((isLoading)=>{
        setIsLoading(isLoading)
      },[])
      const defaultCheckedList = columns.map((item) => item.key);
  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [newColumns , setNewColumns] = useState(columns)
  useEffect(() => {
    const newCols = columns.filter(x => checkedList.includes(x.key));
    setNewColumns(newCols)
    }, [checkedList]);
    const addToBlackList  = async (id) => {
        try{
            setIsLoading(true)
            const params = {
                ip_list_id : id
            }
            await addToBlack_List(params, token)
            setIsLoading(false)
            CustomNotification({ type: "success", title: "Added", description: `Added to block list successfuly`, key: 1 })
            
        }
        catch(err) {
            setIsLoading(false)
            console.log(err)
        }


    }
    
  return (
    <Spin spinning={isLoading} size="large">
      <div className='mt-4'>
          <CustomTable 
          direction="/active-ip-entry"
          formName = "Active Ips" 
          columns={columns} 
          data={data} 
          headerStyle={headerStyle}
          total={totalRecords}
          setTotalRecords={setTotalRecords}
          LoadingHandler={LoadingHandler}
          SearchQuery = {Search_Active_IP}
        //   onPageChange = {onPageChange}
          current_page={CurrentPage}
          token = {token}
          />
    </div>
    </Spin>
  )
}

export default Active_IP_List
