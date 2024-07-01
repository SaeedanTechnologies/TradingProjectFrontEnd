import * as React from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginTerminalUser } from '../../../store/terminalSlice';
import CustomNotification from '../../../components/CustomNotification';
import CustomButton from '../../../components/CustomButton';
import CustomTextField from '../../../components/CustomTextField';
import CustomPassowordField from '../../../components/CustomPassowordField';
import { ToastContainer, toast } from 'react-toastify';
import ErrorPage from '../../../components/ErrorPage';


export default function Terminal() {
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate()
  const dispatch = useDispatch()
   const { brand_id } = useParams();

  const local_login_id = localStorage.getItem('login_id')
  const local_password = localStorage.getItem('password')

  const [isLoading, setIsLoading] = React.useState(false);
    const [login_id, setLogin_id] = React.useState('');
  const [Password, setPassword] = React.useState('');

  const TerminalLogin_Handler = async (loginData) => {
    
    setIsLoading(true);
    const res = await dispatch(loginTerminalUser(loginData));

    setIsLoading(false);
    const { payload } = res;
    if (payload[2]) {

     if(login_id && Password){
      localStorage.setItem('login_id',login_id)
      localStorage.setItem('password',Password) 
     }
     
      else{
        localStorage.setItem('login_id',local_login_id)
       localStorage.setItem('password',local_password)
      }
      
      CustomNotification({
        type: 'success',
        title: 'Login Successfully',
        description: payload[1],
        key: 1
      });
      
       navigate(`/terminal-market-watch/${brand_id}`)

    } else {
      CustomNotification({
        type: 'error',
        title: 'Invalid',
        description: payload[1],
        key: 2
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      TerminalLogin_Handler();
    }
  };


  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(()=>{
    if(local_login_id && local_password)
        {
          TerminalLogin_Handler({ login_id:local_login_id , password:local_password })
        }


  },[])

  return (
    brand_id ? (
    <div className='flex flex-col items-center justify-center h-screen'>
      
     <div className='flex flex-col  gap-8 shadow-lg p-8 w-1/3' onKeyPress={handleKeyPress}>
      <h1 className='text-[30px] font-bold text-center'>Terminal Login</h1>
      <CustomTextField
        label={'Login Id'}
        varient={'standard'}
        sx={{  marginTop: '10px' }}
        onChange={(e) => setLogin_id(e.target.value)}
        auto  
      />
      <CustomPassowordField
        label={'Password'}
        sx={{ marginTop: '10px' }}
        onChange={(e) => setPassword(e.target.value)}

      />
      <CustomButton
        Text={'Login In'}
        type
        loading={isLoading}
        style={{ padding: '24px', fontSize: '20px', fontWeight: 'bold', borderRadius: '6px' }}
        onClickHandler={()=>TerminalLogin_Handler({ login_id , password: Password })}
      />
     
      <ToastContainer />
    </div>
    </div>)
    : (
      <ErrorPage/>
    )
    
  );
}
