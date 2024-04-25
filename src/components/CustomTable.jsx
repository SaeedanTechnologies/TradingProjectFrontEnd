import React from 'react';
import { Table, Pagination } from 'antd';
import DnDTable from '../Pages/DnDTable';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const CustomTable = ({ columns, data, current_page, total, headerStyle, onPageChange, direction, formName, token }) => {
  const handlePageChange = (page) => {
    onPageChange(page);
  };
  const navigate = useNavigate()
  const dispatch = useDispatch()
  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <DnDTable
          formName={formName}
          direction ={direction}
          columns={columns}
          data={data}
          current={current_page}
          total={total}
          handlePageChange={handlePageChange}
          navigate={navigate}
          token = {token}
          dispatch={dispatch}
        />
        <div style={{ textAlign: 'right', marginTop: 16 }}>
          <Pagination
            current={current_page}
            total={total}
            pageSize={10} // Set your page size here
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
            {total > 0 && `Showing ${((current_page - 1) * 10) + 1}-${Math.min(current_page * 10, total)} of ${total} items`}
          </span>
        </div>
      </div>
    </>
  );
};

export default CustomTable;
