import { useSelector } from "react-redux";
import moment from 'moment'
import CustomTextField from "../../components/CustomTextField";


const SettingsInfo = () => {
       const user = useSelector((state)=>state?.user?.user?.user);
       const brandDetail =  useSelector((state)=>state?.user?.user?.brand)

    const brandsFields = [

      {id: 1,    label:'Name', varient: 'standard', value: brandDetail.name},
      {id: 2,    label:'Email',varient:'standard',value: user.email },
      {id: 3,    label:'Leverage', varient: 'standard',value:brandDetail.leverage },
      {id: 4,    label:'Margin Call',varient:'standard',value:brandDetail.margin_call },
      {id: 5,    label:'Domain', varient: 'standard',value:brandDetail.domain },
    ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {brandsFields.map((field)=>(
        
        <div>
            <CustomTextField
                name={field.name} 
                varient={field.varient} 
                label={field.label}
                value={field.value}
                disabled={true}
                    />
          </div>             

        ))}
    </div>
   
  )
}

export default SettingsInfo