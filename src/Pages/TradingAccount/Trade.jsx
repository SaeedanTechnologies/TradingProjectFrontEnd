import { theme } from 'antd';
import React, { useState } from 'react'
import CustomAutocomplete from '../../components/CustomAutocomplete';
import { AutocompleteDummyData } from '../../utils/constants';
import CustomTextField from '../../components/CustomTextField';
import CustomButton from '../../components/CustomButton';
import CustomCheckbox from '../../components/CustomCheckbox';

const Trade = () => {
  const {
    token: { colorBG, TableHeaderColor, colorPrimary, colorTransparentPrimary },
  } = theme.useToken();
  const [SymbolList, setSymbolList] = useState(AutocompleteDummyData)
  const [SelectedSymbol, setSelectedSymbol] = useState(null)

  const [TypeList, setTypeList] = useState([
    { id: 1, title: 'Pending Order' },
    { id: 2, title: 'Market Order' },
  ])
  const [SelectedType, setSelectedType] = useState(null)

  const [LimitTypeListPO, setLimitTypeListPO] = useState([
    { id: 1, title: 'Buy Limit' },
    { id: 2, title: 'Sell Limit' },
    { id: 3, title: 'Buy Stop' },
    { id: 5, title: 'Sell Stop' },
    { id: 6, title: 'Buy Sell Limit' },
    { id: 7, title: 'Sell Stop Limit' },
  ])
  const [SelectedLimitTypeListPO, setSelectedLimitTypeListPO] = useState(null)

  return (
    <div className='p-8 border border-gray-300 rounded-lg flex' style={{ backgroundColor: colorBG }}>
      <div className="flex-1 mr-2 ">
        <div className="mb-4 grid grid-cols-1 gap-4">
          <CustomAutocomplete
            name={'Symbol'}
            varient={'standard'}
            label={'Symbol'}
            options={SymbolList}
            getOptionLabel={(option) => option.title ? option.title : ""}
            onChange={(e, value) => {
              if (value) {
                setSelectedSymbol(value)
              }
              else {
                setSelectedSymbol(null)
              }
            }}
          />
          <CustomAutocomplete
            name={'Type'}
            varient={'standard'}
            label={'Type'}
            options={TypeList}
            getOptionLabel={(option) => option.title ? option.title : ""}
            onChange={(e, value) => {
              if (value) {
                setSelectedType(value)
              }
              else {
                setSelectedType(null)
              }
            }}
          />
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomAutocomplete
            name={'Type'}
            varient={'standard'}
            label={'Type'}
            options={LimitTypeListPO}
            getOptionLabel={(option) => option.title ? option.title : ""}
            onChange={(e, value) => {
              if (value) {
                setLimitTypeListPO(value)
              }
              else {
                setLimitTypeListPO(null)
              }
            }}
          />
          <CustomTextField label={'Volumn'} varient={'standard'} />
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <CustomTextField label={'Price'} varient={'standard'} />
            </div>
            <div className="flex gap-2 md:w-1/2 mt-4">
              <CustomButton style={{
                backgroundColor: colorTransparentPrimary,
                borderColor: colorTransparentPrimary,
                color: 'black',
                fontWeight: 'bold',
                borderRadius: 8
              }} Text={'Update'} />
              <CustomCheckbox />
              <label className='mt-2'>Auto</label>
            </div>
          </div>
          <div>
            <CustomTextField label={'Stop Limit Price'} varient={'standard'} />
          </div>
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomTextField label={'Stop Loss'} varient={'standard'} />
          <CustomTextField label={'Stop Limit Price'} varient={'standard'} />
        </div>
        <div className="mb-4 grid grid-cols-1 gap-4">
          <CustomTextField label={'Comments'}
           multiline = {true}
          rows={4}/>
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <CustomButton
           Text={"Sell at 0.111"} 
           style={{height:"48px", backgroundColor:"#D52B1E", borderColor: "#D52B1E"  }}
           />
          <CustomButton Text={"Buy at 0.111"}
           style={{height:"48px" }}
          />
        </div>
      </div> 
      <div className="flex-1 ml-2 ">
        <div className="mb-4">Chart Section</div>
        {/* Your chart content */}
      </div>
    </div>

  )
}

export default Trade