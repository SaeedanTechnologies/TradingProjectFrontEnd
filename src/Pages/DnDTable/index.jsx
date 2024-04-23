import React, { useState } from "react";

import "./index.css";
import { Button, Table, Pagination } from "antd";
import { Resizable } from "react-resizable";
import ReactDragListView from "react-drag-listview";
import CustomDropdownBtn from "../../components/CustomDropdownBtn";


const ResizableTitle = (props) => {
  const { onResize, width, ...restProps } = props;

  if (!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

class DnDTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: props.columns,
    };
    const that = this;
    this.dragProps = {
      onDragEnd(fromIndex, toIndex) {
        const columns = [...that.state.columns];
        const item = columns.splice(fromIndex, 1)[0];
        columns.splice(toIndex, 0, item);
        that.setState({
          columns
        });
      },
      nodeSelector: "th",
      handleSelector: ".dragHandler",
      ignoreSelector: "react-resizable-handle"
    };
  }
  componentDidMount() {
    this.setState({ columns: this.props.columns });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.columns !== this.props.columns) {
      this.setState({ columns: this.props.columns });
    }
  }
  components = {
    header: {
      cell: ResizableTitle
    }
  };

  handleResize = (index) => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width
      };
      return { columns: nextColumns };
    });
  };
  handleRowClick = (record) =>{
    this.setState({currentRecords: record})
      if(this.props.direction === 'symbol-settings'){
        this.props.navigate(`/symbol-settings/${record.id}`)
      }
  }
  render() {
    {/*
    const columns = this.state.columns.map((col, index) => ({
      ...col,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: this.handleResize(index)
      })
    }));
   */}
   const { columns } = this.state;
   const combinedColumns = columns.map((stateCol, index) => ({
    ...stateCol,
    onHeaderCell: (column) => ({
      width: column.width,
      onResize: this.handleResize(index)
    })
  }));
  
   
    return (
      <>
      <ReactDragListView.DragColumn {...this.dragProps}>
        <Table
          bordered
          components={this.components}
          columns={combinedColumns}
          dataSource={this.props.data}
          pagination={false}
          onRow={(record) => ({
          onClick: (event) =>{
            const clickedCell = event.target.closest("td");
            if (clickedCell) {
              const columnIndex = clickedCell.cellIndex;
              const tableHeader = clickedCell.closest("table").querySelector("thead");
              const columnName = tableHeader.querySelector(`th:nth-child(${columnIndex + 1})`).textContent;
              if(columnName !== "Action"){
                this.handleRowClick(record)
              }
            }
          }
          })}
        />
       
      </ReactDragListView.DragColumn>
      </>
    );
  }
}

export default DnDTable
