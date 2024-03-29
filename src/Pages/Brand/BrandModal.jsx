import React from 'react'
import CustomTextField from '../../components/CustomTextField'

const BrandModal = () => {
  const Controls = [
    {id: 1, component: 'CustomTextField', label:'Name', varient:'standard'  }, 
    {id: 2, component: 'CustomTextField', label:'Authorization Key', varient:'standard'}
  ]
  // i passed component in controls beacuse in future if we need to pass more control then we will handle esasily from component
  return (
    <div className='flex flex-col gap-6'>
     {Controls.map(item => <CustomTextField label={item.label} varient={item.varient} />) } 
    </div>
  )
}

export default BrandModal