import Swal from "sweetalert2";
import CustomNotification from "../components/CustomNotification";


export const CustomDeleteDeleteHandler = async (id, token, _API,setIsLoading,fetchData)=>{

  setIsLoading(true)
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
      const res = await _API(id, token)
      const { data: { success, message, payload } } = res
      setIsLoading(false)
      if (success) {
        Swal.fire({
          title: "Deleted!",
          text: message,
          icon: "success"
        });
        fetchData()
      } else {
        Swal.fire({
          title: "Opps!",
          text: "Somthing went wrong from server side",
          icon: "error"
        });
      }

    }
  });

  setIsLoading(false)

}

export const CustomBulkDeleteHandler = async( Params, token, _API, setLoading )=>{
  if(Params.table_ids.length > 0){
    setLoading(true)
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
        setLoading(true)
        const res = await _API(Params, token)
        const { data: { success, message, payload } } = res
        setLoading(false)
        
        if (success) {
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
    

  }
}

