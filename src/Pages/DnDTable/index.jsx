import React, { Component, createRef } from "react";
import "./index.css";
import { Input, Spin, Table } from "antd";
import { Resizable } from "react-resizable";
import ReactDragListView from "react-drag-listview";
import CustomButton from "../../components/CustomButton";
import TableActions from "./TableActions";
import CustomNotification from "../../components/CustomNotification";
import CustomModal from "../../components/CustomModal";
import { Autocomplete, TextField } from "@mui/material";
import { GenericDelete, MassCloseOrders } from "../../utils/_APICalls";
import Swal from "sweetalert2";
import { GetSettings, SetSettings } from "../../utils/_SettingsAPI";
import { setTradingAccountGroupData } from "../../store/tradingAccountGroupSlice";
import { setAccountID } from "../../store/TradeSlice";
import { getValidationMsg } from "../../utils/helpers";

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
    this.inputRef = createRef();
    this.state = {
      columns: props.columns,
      handlePageChange:props.handlePageChange,
      isRearangments: false,
      isMassEdit: false,
      isMassDelete: false,
      isAddRemove: false,
      selectedRowKeys: [],
      selectedRowKeys_All:[],
      dropDownColumns: [],
      selectedColumns: null,
      isCompleteSelect: false, 
      isLoading: false, 
      data: [],
      isUpated:true,
      searchValues: {},
      buttonCreated: false, 
      isSearching: true, 
      isClear: false
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
    this.handleCancel = this.handleCancel.bind(this);
    this.setColumnsSetting = this.setColumnsSetting.bind(this)
    this.useEffect = this.useEffect.bind(this)
    this.SearchHandler = this.SearchHandler.bind(this)
    this.MassCloseOrdersHandler = this.MassCloseOrdersHandler.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleClearSearch = this.handleClearSearch.bind(this)
    this.calculateItemRange = this.calculateItemRange.bind(this)

    const that = this;

    this.dragProps = {
      onDragEnd(fromIndex, toIndex) {
        if (that.state.isRearangments) {
          const columns = [...that.state.columns];
          const item = columns.splice(fromIndex - 1, 1)[0];
          columns.splice(toIndex -1, 0, item);
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

  async SearchHandler(currentPage){
  //  this.setState({isLoading: true})
    // debugger
  const queryParams = {
      ...this.state.searchValues,
      ...this.props.SearchQueryList
    }
    this.props.LoadingHandler(true)
    const  res = await this.props.SearchQuery(this.props.token ,currentPage, this.props.perPage,queryParams )
    
    const {data:{payload, success, message}} = res
   
    //  this.setState({isLoading: false})
    if(success){
      this.props.LoadingHandler(false)
      this.props.setCurrentPage(payload.current_page)
      this.props.setTotalRecords(payload.total)
      this.props.setLastPage(payload.last_page)
      this.setState({data: payload.data})
      this.props.dispatch(this.props.setTableData(payload.data))
      localStorage.setItem('isCompleteSelect', JSON.stringify(false));
      if(this.state.isCompleteSelect) {
        const allRowKeys = payload.data.map((row) => row.id);
        this.setState({ selectedRowKeys: allRowKeys });
      }
    }
  }
  componentDidMount() {
    this.useEffect()
  }
  createButtonAndHR = () => {
    const firstColumnHeaderCell = document.querySelector('.ant-table-thead tr:first-child th:first-child');
    if (firstColumnHeaderCell && !this.state.buttonCreated) {
      const hr = document.createElement('hr');
      hr.classList.add("custom-line");
      firstColumnHeaderCell.appendChild(hr);

      const button = document.createElement('button');
      button.classList.add('custom-button');
      button.innerText = 'Search'; // Set initial button text
      button.style.backgroundColor = '#1CAC70'; // Set initial button color
      button.addEventListener('click', this.handleButtonClick);
      firstColumnHeaderCell.appendChild(button);

      this.setState({ buttonCreated: true });
    }
  };
  handleClearSearch = () => {
    const clearedSearchValues = {};
    const inputRefs = Object.keys(this.state.searchValues);
    inputRefs.forEach((key) => {
      clearedSearchValues[key] = '';
    });
    console.log(clearedSearchValues, "STATE VALUES")
    this.setState({ searchValues:clearedSearchValues, isSearching: true })
    document.getElementById("search-input").value = ''
    this.SearchHandler(this.props.current)
  };
  async useEffect(){
    const firstColumnHeaderCell = document.querySelector('.ant-table-thead tr:first-child th:first-child');
    if(!this.state.buttonCreated){
      const hr = document.createElement('hr');
      hr.classList.add("custom-line")
      firstColumnHeaderCell.appendChild(hr);
      const button = document.createElement('button');
      button.classList.add('custom-button');
      // Add event listener to the button
      button.addEventListener('click', () => {
        if(this.state.isSearching){
          this.SearchHandler(this.props.current)
          this.setState({isSearching: false})
        }else{ 
          this.setState({isSearching: true})
          this.props.LoadingHandler(true)
          this.handleClearSearch()
          setTimeout(()=>{
            this.setState({ data: this.props.data });
            this.props.LoadingHandler(false)
          },2000)
        }
       
      });
    firstColumnHeaderCell.appendChild(button);
    }
    this.setState({buttonCreated: true})
    const columnsWithChildren = this.props.columns.map(column => ({
      ...column,
      children: [ // inputs
          {
              title: <Input 
              id={`search-input`}
              placeholder={`Search ${column?.title?.props?.children}`}
              value={this.state.searchValues[column.dataIndex]}
              onChange={e => this.handleInputChange(column.dataIndex, e.target.value)}
              onPressEnter={()=>{
                // Check if object has no keys and if all keys have empty values. Our object is (this.state.searchValues)
                if(Object.keys(this.state.searchValues).length === 0 || Object.values(this.state.searchValues).every(value => value === null || value === undefined || value === '')){
                  this.setState({isSearching: true})
                }
                else{
                  this.setState({isSearching: false})
                }
                this.SearchHandler(this.props.current)
              }}
              ref={this.inputRef}
              />,
              dataIndex: column.dataIndex,
              key: `${column.dataIndex}-search`,
              width: 150,
          }
      ]
  }));
  this.setState({columns: columnsWithChildren})
    try{
      const ColumnsData = columnsWithChildren.map(x=>{
        return {
          key: x.key, 
          dataIndex: x.dataIndex,
          title: typeof x.title === 'string' ? x.title:x?.title?.props?.children 
        }
      })
      const Params = {
        names:[this.props.formName]
      }
      // this.setState({dropDownColumns: ColumnsData, selectedColumns: ColumnsData})
      this.setState({isLoading: true})
      const res = await GetSettings(Params, this.props.token)
      const {data:{message, payload, success}} = res
      this.setState({isLoading: false})
      if(payload && payload.length > 0){
        const selectedCols = JSON.parse(payload[0].value) // from db
        this.SearchHandler(this.props.current)
        // const filteredColumns = columnsWithChildren.filter(column =>  
        //   selectedCols.some(selectedColumn => selectedColumn.dataIndex === column.dataIndex)
        // );
        const columnMap = {};
        columnsWithChildren.forEach(column => {
          columnMap[column.dataIndex] = column;
        });
        
        console.log(selectedCols)
        const filteredColumns = selectedCols.map(selectedColumn => {
          const column = columnMap[selectedColumn.dataIndex];
          return column;
        });
        const mData = ColumnsData.filter(column =>
          selectedCols.some(selectedColumn => selectedColumn.dataIndex === column.dataIndex)
        );
        
        if(success){
          this.setState({ columns: filteredColumns, dropDownColumns: ColumnsData, selectedColumns: mData });
        }else{
          this.setState({ columns: ColumnsData, dropDownColumns: ColumnsData, selectedColumns: ColumnsData });
        }
      }else{
        this.SearchHandler(this.props.current)
        this.setState({ columns: columnsWithChildren, dropDownColumns: ColumnsData, selectedColumns: ColumnsData });
      }
     
  
    }catch(err){
        alert(`Error occured ${err.message}`)
    } 
  }
  componentDidUpdate(prevProps,prevState) {
    if (prevProps.columns !== this.props.columns) {
      this.setState({ columns: this.props.columns });
    }else if(prevProps.data !== this.props.data && this.state.isCompleteSelect){
       const allRowKeys = this.props.data.map((row) => this.props.column_name ? row[this.props.column_name] : row.id);
        this.setState({ selectedRowKeys: allRowKeys });
    }
    if(this.props?.data?.length > 0 && prevProps.data !== this.props.data){
      this.setState({ data: this.props.data });
    } 
     if (prevProps.isSearching !== this.state.isSearching) {
        const buttonText = this.state.isSearching ? 'Search' : 'Clear';
        const searchButton = document.querySelector('.ant-table-thead tr:first-child th:first-child button');
        if (searchButton) {
            searchButton.innerText = buttonText;
            if(!this.state.isSearching){
            searchButton.style.backgroundColor = 'red'
            }else{
              searchButton.style.backgroundColor = '#1CAC70' 
            }
        }
    }
  }

  handleInputChange = (dataIndex, value) => {
    this.setState(prevState => ({
        searchValues: {
            ...prevState.searchValues,
            [dataIndex]: value
        }
    }));
};
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
        if(this.props.column_name)
          {
            this.props.dispatch(this.props.setCurrentData(record))
          }
      this.props.dispatch(this.props.setSelecetdIDs([this.props.column_name? record[this.props.column_name] : record.id]))
      if(this.props.direction === "/single-trading-accounts/details/live-order"){
        this.props.dispatch(setTradingAccountGroupData(record))
        this.props.dispatch(setAccountID(record.id))
      }
      this.props.navigate(this.props.direction);
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
      const ColumnsData = this.state.columns.map(x=>{
        return {
          key: x.key, 
          dataIndex: x.dataIndex,
          title: typeof x.title === 'string' ? x.title:x?.title?.props?.children 
        }
      })
      this.setColumnsSetting(ColumnsData, "Columns Rearrangement Sucessfully")
      this.setIsRearangments(false);
    }
  }
  // handleClearSearch = () => {
  //   const clearedSearchValues = {};
  //   const inputRefs = Object.keys(this.state.searchValues);
  //   inputRefs.forEach((key) => {
  //     clearedSearchValues[key] = '';
  //   });
  //   console.log(clearedSearchValues, "STATE VALUES")
  //   this.setState({ searchValues:clearedSearchValues, isSearching: true })
  //   document.getElementById("search-input").value = ''
  //   this.SearchHandler(this.props.current)
  // };
  
  onSelectAllChange(checked, selectedRows) {
    this.setState({ isSelectAll: checked });
    
  }
  toggleCompleteSelect() {
    console.log("THIS IS Complete Select", this.state.isCompleteSelect)
    this.setState((prevState) => ({isCompleteSelect: !prevState.isCompleteSelect}),
    ()=>{
      localStorage.setItem('isCompleteSelect', JSON.stringify(this.state.isCompleteSelect));
      if (this.state.isCompleteSelect) {
        const allRowKeys = this.props.data.map((row) => this.props?.column_name ? row[this.props?.column_name] : row.id);
        console.log(this.props.data, "ALL ROW KEYSssssss")
        this.setState({ selectedRowKeys: allRowKeys });
        
      } else {
        this.setState((prevState)=>({isSelectAll:!prevState.isSelectAll}))
        this.setState({ selectedRowKeys: [] })
        localStorage.setItem('isCompleteSelect', JSON.stringify(false));
      }
    }
  );
   

  }
  MassEditHandler() {
      if (this.state.selectedRowKeys.length > 0) {
        this.props.dispatch(this.props.setSelecetdIDs(this.state.selectedRowKeys))
          this.props.navigate(this.props.direction);
      } else {
        CustomNotification({
          type: "error",
          title: "Validation",
          description: "Please select any record first",
          key: "2",
        })
      }
  }
  async MassDeleteHandler() {
      if (this.state.selectedRowKeys.length > 0) {
          const Params = {
           table_name: this.props.table_name, 
           table_ids:this.state.isCompleteSelect ? [] : this.state.selectedRowKeys
          }
          if (this.props.column_name) {
            Params.column_name = this.props.column_name;
          }
         this.setState({isLoading: true})
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
            const res = await GenericDelete(Params, this.props.token)
            const { data: { success, message, payload } } = res
            this.setState({isLoading: false})
            if (success) {
              this.props?.setTotalRecords(this.props?.total - this.state?.selectedRowKeys?.length)
              if(this.props.direction === "/trading-group/mass-deposit" || this.props.direction === "/trading-group/mb-to"){
                const newData = this.state.data.filter(item => !this.state.selectedRowKeys.includes(item[this.props.column_name]));
                this.setState({data: newData})
              }else{
                this.SearchHandler(this.props.current)
                // const newData = this.state.data.filter(item => !this.state.selectedRowKeys.includes(item.id));
                // this.setState({data: newData})
                // this.props.setTableData(newData)
              }
               CustomNotification({
                type: "success",
                title: "Deleted",
                description: message,
                key: "a4",
              })
            } else {
              const errorMsg = getValidationMsg(message, payload)
              if(errorMsg) 
                CustomNotification({
                  type: "error",
                  title: "Oppssss..",
                  description: errorMsg,
                  key: "b4",
                })
              else
              CustomNotification({
                type: "error",
                title: "Oppssss..",
                description: message,
                key: "b4",
              })
            }
      
          }
        });
         this.setState({isLoading: false})

      } else {
        CustomNotification({
          type: "error",
          title: "Validation",
          description: "Please select any record first",
          key: "6",
        })
      }
  }
  async MassCloseOrdersHandler (){
    if (this.state.selectedRowKeys.length > 0) {
      const Params = {
       ids: this.state.selectedRowKeys
      }
     this.setState({isLoading: true})
     Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1CAC70",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Close it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await MassCloseOrders(Params, this.props.token)
        const { data: { success, message, payload } } = res
        this.setState({isLoading: false})
        if (success) {
          const newData = this.state.data.filter(item => !this.state.selectedRowKeys.includes(item.id));
          this.setState({data: newData})
           CustomNotification({
            type: "success",
            title: "Deleted",
            description: message,
            key: "a4",
          })
        } else {
          CustomNotification({
            type: "error",
            title: "Oppssss..",
            description: message,
            key: "b4",
          })
        }
  
      }
    });
     this.setState({isLoading: false})

  } else {
    CustomNotification({
      type: "error",
      title: "Validation",
      description: "Please select any record first",
      key: "6",
    })
  }
  }
  handleCancel(){
   this.setState({isAddRemove: false})
  }
 async setColumnsSetting(values, msg){
  
  try{
    const Params = {
      data:{
      name: this.props.formName,
     
    }}
    const ColumnsData = this.state.columns.map(x=>{
      return {
        key: x.key, 
        dataIndex: x.dataIndex,
        title: typeof x.title === 'string' ? x.title:x?.title?.props?.children 
      }
    })
    this.props.LoadingHandler(true)
  // Sort array A based on the index of keys in array B
  // if values length is less then its means remove column , if greater means add columns , in case of remove column remove column from columns data else add column
  if(values.length > ColumnsData.length){
    const keysInB = new Set(ColumnsData.map(item => item.key));
    values.forEach(item => {
        if (!keysInB.has(item.key)) {
          ColumnsData.push(item);
        }
    });
        Params.data.value= JSON.stringify(ColumnsData)
      }else if(values.length < ColumnsData.length){
        const keysInValues = new Set(values.map(obj => obj.key));
        const mData = ColumnsData.filter(item => keysInValues.has(item.key));
        Params.data.value= JSON.stringify(mData)
      }else{
        Params.data.value= JSON.stringify(values)
      }
      this.setState({isLoading: true})
      const res = await SetSettings(Params,this.props.token )
      const {data:{message, data, success}} = res
      this.setState({isLoading: false})
      if(success){
        this.handleCancel()
        CustomNotification({
          type: "success",
          title: "Success ",
          description: message,
          key: "arr4",
        })
        
        this.useEffect()
        this.props.LoadingHandler(false)
        
      }else{
        CustomNotification({
          type: "error",
          title: "Oppssss... ",
          description: message,
          key: "arr4",
        })
      }
  }catch(err){
    alert(err.message)
  }finally{
    this.props.LoadingHandler(false)
  }
   
  }
  calculateItemRange = () => {
    const { current, perPage, total } = this.props;
    const start = (current - 1) * perPage + 1;
    const end = Math.min(current * perPage, total);
    return `Showing ${start}-${end} of ${total} items`;
  };
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
      onChange: this.onSelectChange, 
      onSelectAll: this.onSelectAllChange,
    };
    return (
      <>
        <ReactDragListView.DragColumn {...this.dragProps}>

          <div className="flex justify-center gap-4">
            <div></div>
          {
                this.state.isSelectAll &&
                <h1
                  className="text-2xl font-semibold text-blue-500 cursor-pointer"
                  onClick={this.toggleCompleteSelect}
                >
                  {this.state.isCompleteSelect ? `Deselect All Data (${this.props.total})` : `Select All Data (${selectedRowKeys.length})`}
                </h1>
              }
          </div>
          <Table
            bordered
            className="mt-4"
            title={() => (
              <div style={{ textAlign: 'right' }}>
              <div className="self-end">
              {!(
                this.state.isRearangments
              ) ? (
                <TableActions
                  setIsRearangments={this.setIsRearangments}
                  setIsMassEdit={this.setIsMassEdit}
                  setIsAddRemove={this.setIsAddRemove}
                  selectedRows= {this.state.selectedRowKeys}
                  MassEditHandler={this.MassEditHandler}
                  MassDeleteHandler = {this.MassDeleteHandler}
                  setPerPage={this.props.setPerPage}
                  editPermissionName={this.props.editPermissionName}
                  deletePermissionName={this.props.deletePermissionName}
                  direction = {this.props.direction}
                  MassCloseOrdersHandler={this.MassCloseOrdersHandler}
                  addButton = {this.props.addButton}
                />
              ) : (
                <CustomButton
                  Text={"Save Changes"}
                  className='mb-3 mt-6'
                  onClickHandler={this.handleSaveChanges}
                />
              )}
            </div>

              </div>
            )}
            footer={this.props.footer}
            components={this.components}
            columns={combinedColumns}
            dataSource={this.state.data} 
            pagination={{
              current: this.props.current,
              pageSize: this.props.perPage,
              total: this.props.total,
              onChange: (page, pageSize) => {
                this.SearchHandler(page)
                this.props.setCurrentPage(page);
                this.props.handlePageChange(page)
              },
            }}
            rowSelection={rowSelection}
            showSorterTooltip={false}
            summary={this.props.summary}
            onChange={(pagination, filters, sorter) => {
              this.props.setSortDirection(sorter.order);
            }}  
            rowKey={this.props.column_name ? this.props.column_name : "id"}
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
                    
                  if (columnName !== "Action" && columnName !== "Search"  && columnName !== "Authorization Key" && columnName !== "Mass Buy/Sell Trading Order" && columnName !== "Mass deposit/widthdraw" && columnName !== "Trading Accounts") {
                    this.handleRowClick(record);
                  }
                }
              },
            })}
            scroll={{ x: 'max-content' }}
          />
        </ReactDragListView.DragColumn>
        <div style={{ textAlign: "right", marginTop: "10px" }}>
          {this.calculateItemRange()}
        </div>
        <CustomModal
          title={this.props.formName+' - Add Remove Columns'}
          isModalOpen={this.state.isAddRemove}
          footer={[]}
          width={600}
          maskClosable={false}
          handleCancel={this.handleCancel}
        >
        <Autocomplete
          multiple
          id="columns"
          options={this.state.dropDownColumns}
          getOptionLabel={(option) => option?.title ? option?.title : '' }
          value={this.state.selectedColumns  ?  this.state.selectedColumns  : []}
          onChange={(e, value) => {
            if(value){
              this.setState({selectedColumns: value })
            }else{
              this.setState({selectedColumns: null })
            }
          }}
          renderInput={(params) => (
            <TextField {...params} label="Columns" placeholder="Columns" variant="standard" />
          )}
          fullWidth
        />
        <div className="flex justify-end gap-4 mt-4">
        <CustomButton
         Text={'Submit'}
         style={{
          padding: '12px',
          height: '40px',
          width: '140px',
          borderRadius: '8px',
          zIndex: '100'
        }}
        onClickHandler={()=>this.setColumnsSetting(this.state.selectedColumns, "Columns Settings updated successfully")}
        loading={this.state.isLoading}
        />
        <CustomButton
         Text={'Cancle'}
         style={{
          padding: '12px',
          height: '40px',
          width: '140px',
          borderRadius: '8px',
          backgroundColor: '#c5c5c5',
          borderColor: '#c5c5c5',
          color: '#fff'
        }}
        onClickHandler={()=> this.setState({isAddRemove: false})}
        />
        </div>
        </CustomModal>
      </>
    );
  }
}

export default DnDTable;
