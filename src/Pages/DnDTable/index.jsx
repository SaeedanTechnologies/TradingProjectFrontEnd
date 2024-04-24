import React, { Component } from "react";
import "./index.css";
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table } from "antd";
import { Resizable } from "react-resizable";
import ReactDragListView from "react-drag-listview";
import CustomButton from "../../components/CustomButton";
import TableActions from "./TableActions";
import CustomNotification from "../../components/CustomNotification";

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

class DnDTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: props.columns,
      isRearangments: false,
      isMassEdit: false,
      isMassDelete: false,
      isAddRemove: false,
      selectedRowKeys: [],
    };
    this.setIsRearangments = this.setIsRearangments.bind(this);
    this.setIsMassEdit = this.setIsMassEdit.bind(this);
    this.setIsMassDelete = this.setIsMassDelete.bind(this);
    this.setIsAddRemove = this.setIsAddRemove.bind(this);
    this.handleSaveChanges = this.handleSaveChanges.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onSelectAllChange = this.onSelectAllChange.bind(this);
    this.toggleCompleteSelect = this.toggleCompleteSelect.bind(this);
    this.MassEditHandler = this.MassEditHandler.bind(this);
    this.MassDeleteHandler = this.MassDeleteHandler.bind(this);

    const that = this;
    this.dragProps = {
      onDragEnd(fromIndex, toIndex) {
        if (that.state.isRearangments) {
          const columns = [...that.state.columns];
          const item = columns.splice(fromIndex, 1)[0];
          columns.splice(toIndex, 0, item);
          that.setState({
            columns,
          });
        } else {
          CustomNotification({
            type: "error",
            title: "Validation",
            description:
              "If you want to Rearrange columns, please first turn on Rearange  mode",
            key: "1",
          });
        }
      },
      nodeSelector: "th",
      handleSelector: ".dragHandler",
      ignoreSelector: "react-resizable-handle",
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
      cell: ResizableTitle,
    },
  };

  onSelectChange(newSelectedRowKeys) {
    this.setState({ selectedRowKeys: newSelectedRowKeys });
  }

  handleResize = (index) => (e, { size }) => {
    this.setState(({ columns }) => {
      const nextColumns = [...columns];
      nextColumns[index] = {
        ...nextColumns[index],
        width: size.width,
      };
      return { columns: nextColumns };
    });
  };

  handleRowClick = (record) => {
    this.setState({ currentRecords: record });
    if (this.props.direction === "symbol-settings") {
      this.props.navigate(`/symbol-settings/${record.id}`);
    }
  };

  setIsRearangments(newValue) {
    this.setState({
      isRearangments: newValue,
      isMassEdit: false,
      isMassDelete: false,
      isAddRemove: false,
      isSelectAll: false,
      isCompleteSelect: false,
    });
  }
  setIsMassEdit(newValue) {
    this.setState({
      isRearangments: false,
      isMassEdit: newValue,
      isMassDelete: false,
      isAddRemove: false,
      isSelectAll: false,
      isCompleteSelect: false,
    });
  }
  setIsMassDelete(newValue) {
    this.setState({
      isRearangments: false,
      isMassEdit: false,
      isMassDelete: newValue,
      isAddRemove: false,
      isSelectAll: false,
      isCompleteSelect: false,
    });
  }
  setIsAddRemove(newValue) {
    this.setState({
      isRearangments: false,
      isMassEdit: false,
      isMassDelete: false,
      isAddRemove: newValue,
      isSelectAll: false,
      isCompleteSelect: false,
    });
  }
  handleSaveChanges() {
    if (this.state.isRearangments) {
      CustomNotification({
        type: "success",
        title: "Success",
        description: "Column Arranged Successfully",
        key: "1",
      });
      this.setIsRearangments(false);
    }
  }
  onSelectAllChange(checked, selectedRows) {
    this.setState({ isSelectAll: checked });
  }
  toggleCompleteSelect() {
    this.setState((prevState) => ({
      isCompleteSelect: !prevState.isCompleteSelect,
    }));
    if (this.state.isCompleteSelect) {
      const allRowKeys = this.props.data.map((row) => row.id);
      this.setState({ selectedRowKeys: allRowKeys });
    } else {
      this.setState({ selectedRowKeys: [] })
    }

  }
  MassEditHandler() {
    if (this.state.isMassEdit) {
      if (this.state.selectedRowKeys.length > 0) {
        CustomNotification({
          type: "success",
          title: "Updated",
          description: "Data Updated Successfully",
          key: "2",
        })

      } else {
        CustomNotification({
          type: "error",
          title: "Validation",
          description: "Please select any record first",
          key: "2",
        })
      }
    } else {
      CustomNotification({
        type: "error",
        title: "Validation",
        description: "Please enable mass edit mode",
        key: "2",
      })
    }
  }
  MassDeleteHandler() {
    if (this.state.isMassDelete) {
      if (this.state.selectedRowKeys.length > 0) {
        CustomNotification({
          type: "success",
          title: "Deleted",
          description: "Data Deleted Successfully",
          key: "4",
        })

      } else {
        CustomNotification({
          type: "error",
          title: "Validation",
          description: "Please select any record first",
          key: "6",
        })
      }
    } else {
      CustomNotification({
        type: "error",
        title: "Validation",
        description: "Please enable mass Delete mode",
        key: "3",
      })
    }
  }
  render() {
    const { columns, selectedRowKeys } = this.state;
    const combinedColumns = columns.map((stateCol, index) => ({
      ...stateCol,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: this.handleResize(index),
      }),
    }));

    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange, // Make sure you define onSelectChange method
      onSelectAll: this.onSelectAllChange,
      getCheckboxProps: (record) => ({
        disabled: !(this.state.isMassEdit || this.state.isMassDelete), // Disable checkboxes when isMassEdit is true
      }),
    };

    return (
      <>
        <ReactDragListView.DragColumn {...this.dragProps}>

          <div className="flex justify-between gap-4">
            <div className="bg-gray-100 p-4 flex gap-4 mb-4 rounded-md">
              <EditOutlined
                className="cursor-pointer"
                style={{ fontSize: "20px" }}
                disabled={true}
                onClick={this.MassEditHandler}
              />
              <DeleteOutlined
                className="cursor-pointer"
                style={{ fontSize: "20px" }}
                onClick={this.MassDeleteHandler}
              />
            </div>
            {
              this.state.isSelectAll ?
                <h1
                  className="text-2xl font-semibold text-blue-500 cursor-pointer"
                  onClick={this.toggleCompleteSelect}
                >
                  {
                    this.state.isCompleteSelect ? "Select All Data" : "Deselect All Data"
                  }
                </h1> : null
            }

            <div >
              {!(
                this.state.isRearangments
              ) ? (
                <TableActions
                  setIsRearangments={this.setIsRearangments}
                  setIsMassEdit={this.setIsMassEdit}
                  setIsMassDelete={this.setIsMassDelete}
                  setIsAddRemove={this.setIsAddRemove}
                />
              ) : (
                <CustomButton
                  Text={"Save Changes"}
                  className="mb-3"
                  onClickHandler={this.handleSaveChanges}
                />
              )}
            </div>

          </div>
          <Table
            bordered
            components={this.components}
            columns={combinedColumns}
            dataSource={this.props.data}
            pagination={false}
            rowSelection={rowSelection}
            rowKey="id"
            onRow={(record) => ({
              onClick: (event) => {
                const clickedCell = event.target.closest("td");
                if (clickedCell) {
                  const columnIndex = clickedCell.cellIndex;
                  const tableHeader = clickedCell.closest("table").querySelector(
                    "thead"
                  );
                  const columnName =
                    tableHeader.querySelector(
                      `th:nth-child(${columnIndex + 1})`
                    ).textContent;
                  if (columnName !== "Action" && columnName !== "") {
                    this.handleRowClick(record);
                  }
                }
              },
            })}
          />
        </ReactDragListView.DragColumn>
      </>
    );
  }
}

export default DnDTable;
