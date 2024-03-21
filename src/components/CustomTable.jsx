import React from 'react';
import {  Table} from 'antd';


const CustomTable = ({columns, data, headerStyle}) => {
  return (
    <>
      <div style={{ overflowX: 'auto' }}> 
        <Table
          columns={columns}
          dataSource={data}
          style={{
            marginTop: 24,
          }}
          components={{
            header: {
              cell: (props) => <th {...props} style={headerStyle} />,
            },
          }}
        />
      </div>
    </>
  );
};

export default CustomTable;