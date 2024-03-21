import React from 'react'
import CustomTextField from '../../components/CustomTextField'

const BrandModal = () => {
  return (
    <div className='flex flex-col gap-6'>
      <CustomTextField label={'Name'} varient={'standard'} />
      <CustomTextField label={'Authorization Key'} varient={'standard'} />
    </div>
  )
}

export default BrandModal