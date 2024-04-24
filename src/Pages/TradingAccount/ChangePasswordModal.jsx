import React, {  useState } from 'react';
import * as Yup from 'yup';
import CustomPassowordField from '../../components/CustomPassowordField';
import { Typography ,Stack} from '@mui/material';



const ChangePasswordModal = ({ setIsModalOpen   }) => {
 

//
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');



  const [errors, setErrors] = useState({}); 

const validationSchema = Yup.object().shape({
  password: Yup.string().required('Old password is required'),
  newPassword: Yup.string()
    .required('New password is required')
    .notOneOf([Yup.ref('password')], 'New password must be different from the old password'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
});

  const handleInputChange = (fieldName, value) => {
    setErrors(prevErrors => ({ ...prevErrors, [fieldName]: '' }));
    switch (fieldName) {
      case 'password':
        setPassword(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
     
    }
  };
  const clearFields = () => {
    setPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }




  return (
      <div className='flex flex-col gap-6'>

        <Typography sx={{fontSize:"24px",fontWeight:600}}>Change Password</Typography>


        <Stack>
        <CustomPassowordField
            name="password"
            label="Password"
            variant="standard"
            value={password}
            onChange={e => handleInputChange('password', e.target.value)}
        />
        {errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
        </Stack>

         <Stack>
        <CustomPassowordField
            name="newPassword"
            label="New Password"
            variant="standard"
            value={newPassword}
            onChange={e => handleInputChange('newPassword', e.target.value)}
        />
        {errors.newPassword && <span style={{ color: 'red' }}>{errors.newPassword}</span>}
        </Stack>

       <Stack>
        <CustomPassowordField
            name="confirmPassword"
            label="Confirm Password"
            variant="standard"
            value={confirmPassword}
            onChange={e => handleInputChange('confirmPassword', e.target.value)}
        />
        {errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword}</span>}
        </Stack>

       


      </div>
  );
};

export default ChangePasswordModal;
