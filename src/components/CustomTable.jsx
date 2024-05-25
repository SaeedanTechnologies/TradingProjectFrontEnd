import React, { useEffect,useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Pagination } from 'antd';
import Highlighter from 'react-highlight-words';
import DnDTable from '../Pages/DnDTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const CustomTable = ({ columns, data, current_page, total, headerStyle, onPageChange, 
  direction, formName, token ,updateHandler,isUpated, setSelecetdIDs, setTableData, setTotalRecords,setCurrentPage, setLastPage,
  table_name, setSortDirection, perPage, setPerPage, editPermissionName,
   deletePermissionName, SearchQuery,SearchQueryList,LoadingHandler, footer, column_name, summary, isPagination, addButton, brandId}) => {
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handlePageChange = (page) => {
    onPageChange(page);
  };
  useEffect(()=>{
    if(setTableData){
      if(data?.length > 0){
        dispatch(setTableData(data))
      }
    }
   
  }, [data, dispatch])
  useEffect(()=> {
    localStorage.setItem("page", current_page)
  },[onPageChange])
  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <DnDTable
          formName  ={formName}
          direction ={direction}
          columns   ={columns}
          data      ={data}
          current   ={current_page}
          perPage={perPage}
          total={total}
          handlePageChange={handlePageChange}
          navigate={navigate}
          token = {token}
          dispatch={dispatch}
          updateHandler={updateHandler}
          isUpated={isUpated}
          setSelecetdIDs={setSelecetdIDs}
          table_name= {table_name}
          setSortDirection={setSortDirection}
          setPerPage={setPerPage}
          editPermissionName={editPermissionName}
          deletePermissionName={deletePermissionName}
          SearchQuery={SearchQuery}
          SearchQueryList={SearchQueryList}
          LoadingHandler={LoadingHandler}
          footer={footer}
          setTableData={setTableData}
          setTotalRecords={setTotalRecords}
          column_name={column_name}
          summary = {summary}
          addButton={addButton}
          brandId={brandId}
          setCurrentPage={setCurrentPage}
          setLastPage={setLastPage}
        />
        {/* {
          direction !== "/single-trading-accounts/details/live-orders" &&  <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Pagination
            current={current_page}
            total={total}
            pageSize={perPage} // Set your page size here
            onChange={handlePageChange}
            showSizeChanger={false} // Hide size changer
            itemRender={(current, type, originalElement) => {
              if (type === 'prev' || type === 'next') {
                return originalElement;
              }
              if (type === 'page') {
                return <span>{current}</span>;
              }
              return originalElement;
            }}
          /> 
           <span style={{ marginLeft: 8 }}>
            {total > 0 && `Showing ${(total / perPage) <= 1 ? 1 : ((current_page - 1) * perPage) + 1}-${Math.min(current_page * perPage, total)} of ${total} items`}
          </span>
        </div>
        } */}
      
      </div>
    </>
  );
};

export default CustomTable;
