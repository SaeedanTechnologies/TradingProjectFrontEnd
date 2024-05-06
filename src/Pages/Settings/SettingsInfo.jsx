import { useSelector } from "react-redux";
import moment from 'moment'


const SettingsInfo = () => {
       const user = useSelector((state)=>state?.user?.user?.user);
       const brandDetail =  useSelector((state)=>state?.user?.user?.brand)
  return (
    <div className="flex flex-col gap-3 p-5">
          <div className="flex flex-row justify-between items-center">
            <span className="text-md font-semibold">Id:</span>
            <span>{user.id}</span>
        </div>
        <div className="flex flex-row justify-between items-center">
            <span className="text-md font-semibold">Name:</span>
            <span>{user.name}</span>
        </div>
           <div className="flex flex-row justify-between items-center">
            <span className="text-md font-semibold">Email:</span>
            <span>{user.name}</span>
        </div>
           <div className="flex flex-row justify-between items-center">
            <span className="text-md font-semibold">Password:</span>
            <span>{user.original_password}</span>
        </div>
        <div className="flex flex-row justify-between items-center">
            <span className="text-md font-semibold">Created At:</span>
            <span>{moment(user.created_at).calendar()}</span>
        </div>
         <div className="flex flex-row justify-between items-center">
            <span className="text-md font-semibold">Leverage:</span>
            <span>{brandDetail.leverage}</span>
        </div>
         <div className="flex flex-row justify-between items-center">
            <span className="text-md font-semibold">Margin Call:</span>
            <span>{brandDetail.margin_call}</span>
        </div>
        

    </div>
  )
}

export default SettingsInfo