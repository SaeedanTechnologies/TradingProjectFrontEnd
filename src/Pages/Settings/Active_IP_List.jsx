import React, { useEffect, useState } from 'react'
import CustomTable from '../../components/CustomTable';
import { Link, useNavigate } from 'react-router-dom';
import { Space, Spin, theme } from 'antd';
import { headerStyle } from '../MainLayout/style';
import {DeleteOutlined, EyeOutlined} from '@ant-design/icons';
import { Search_Active_IP, addToBlack_List, getActiveIPs } from '../../utils/_IPAddress';
import { useSelector } from 'react-redux';
import { ColumnSorter } from '../../utils/helpers';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import ARROW_UP_DOWN from '../../assets/images/arrow-up-down.png'
import { Button, Box } from '@mui/material';
import CustomNotification from '../../components/CustomNotification';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { setIPAddressSelectedIds, setIpAddressData } from '../../store/IpAdressSlice';
const Active_IP_List = () => {
    const { token: { colorBG, TableHeaderColor, colorPrimary } } = theme.useToken();
  const token = useSelector(({ user }) => user?.user?.token)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [CurrentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const navigate = useNavigate()
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
        
      ];
      const LoadingHandler = React.useCallback((isLoading)=>{
        setIsLoading(isLoading)
      },[])
     
    
  return (
    <Spin spinning={isLoading} size="large">
      <Box sx={{display:'flex', justifyContent:'flex-end'}}>
        <Button
        onClick={()=>navigate("/firewall/active-ip-list-entry")} 
        variant="contained" 
        endIcon={<AddCircleIcon />} sx={{
          background:"#1cac70",
          '&:hover': {
          background:"#1cac70",
          }
        }}>
          Add Ip
        </Button>
      </Box>
      <div className='mt-4'>
          <CustomTable 
          direction="/firewall/active-ip-list-entry"
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
          setCurrentPage={setCurrentPage}
          token = {token}
          table_name="ip_list"
          setSelecetdIDs={setIPAddressSelectedIds}
          setTableData={setIpAddressData}
          />
    </div>
    </Spin>
  )
}

export default Active_IP_List
