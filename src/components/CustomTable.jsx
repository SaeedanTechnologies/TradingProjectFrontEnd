import React from 'react';
import { Table, Pagination } from 'antd';
import DnDTable from '../Pages/DnDTable';
import { useNavigate } from 'react-router-dom';

const CustomTable = ({ columns, data, current_page, total, headerStyle, onPageChange, direction }) => {
  const handlePageChange = (page) => {
    onPageChange(page);
  };
  const navigate = useNavigate()
  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <DnDTable
          direction ={direction}
          columns={columns}
          data={data}
          current={current_page}
          total={total}
          handlePageChange={handlePageChange}
          navigate={navigate}
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
