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

export const CheckBrandPermission = (permissions,userRole,permissionName ) =>{

  if(userRole ===  'brand') {
    const res =   permissions?.find((permission)=>permission?.name === permissionName);  
   return res? true : false;
  }
  return true;
}

export const getOpenPrice = (symbol) => {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws');

    ws.onopen = () => {
      ws.send(JSON.stringify({ method: 'SUBSCRIBE', params: [`${symbol.toLowerCase()}@ticker`], id: 1 }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.s === symbol.toUpperCase() && message.o) {
        const openPrice = parseFloat(message.o);
        ws.close();
        resolve(openPrice);
      }
    };

    ws.onerror = (error) => {
      ws.close();
      reject(error);
    };

    ws.onclose = () => {
      // WebSocket connection closed
    };
  });
};

export const getOpenPriceFromAPI= async(symbol, feedName)=> {
  try {
    if(feedName === 'binance'){
      const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
      const data = await response.json();
      const openPrice = parseFloat(data.openPrice);
      return openPrice;
    }else{
      return null
    }
  } catch (error) {
    console.error('Error fetching open price:', error);
    return null;
  }
}

export const calculateProfitLoss = (currentPrice, entryPrice, direction, volume)=> {
  // Calculate profit/loss based on direction of the trade
  if (direction === 'buy') {
      // For a buy order, profit = (currentPrice - entryPrice) * volume
      return (currentPrice - entryPrice) * volume;
  } else {
      // For a sell order, profit = (entryPrice - currentPrice) * volume
      return (entryPrice - currentPrice) * volume;
  }
}


