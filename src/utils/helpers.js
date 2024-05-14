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
      const {askPrice, bidPrice} = data
      // const openPrice = parseFloat(data.openPrice);
      return {askPrice, bidPrice};
    }else{
      return null
    }
  } catch (error) {
    console.error('Error fetching open price:', error);
    return null;
  }
}

export function numberFormat(number, decimals) {
  const fixedNumber = number.toFixed(decimals);
  return parseFloat(fixedNumber).toLocaleString('en-US', { minimumFractionDigits: decimals });
}
function addZeroAfterOne(num) {
  let resultStr = '1';
  for (let i = 0; i < num; i++) {
          resultStr += '0';
  }
  return parseInt(resultStr);
}


export const calculateProfitLoss = (currentPrice, entryPrice, direction, volume,pip)=> {
let profit = 0
if (direction === 'buy') {
    profit =  (parseFloat(currentPrice).toFixed(pip) - parseFloat(entryPrice).toFixed(pip)) ;
} else {
     profit= parseFloat(entryPrice).toFixed(pip) - parseFloat(currentPrice).toFixed(pip);  
}
return (numberFormat(profit, pip) * addZeroAfterOne(pip)) * volume
}

export const calculateLotSize = (num, lotSize, currentPrice)=>{
  return parseFloat((num * lotSize)*currentPrice).toFixed(2);
  // if(num >= 0.01 && num<0.10 ){
  //     return num*1000
  // }else if(num >= 0.10 && num < 1.00){
  //      return num*10000
  // }else{
  //     return num*100000
  // }
}

export const requiredMargin = (volume,accountLeverage) =>{
  const lotsize = calculateLotSize(volume)
  return (volume * lotsize) / accountLeverage
}

export const calculateMarginCallPer  = (balance,grandProfit,lotSize,accountLeverage)=>{
 return parseFloat(
  (
  (parseFloat(balance) + parseFloat(grandProfit))
  /
  ((parseFloat(lotSize).toFixed(2))/parseFloat(accountLeverage).toFixed(2))
).toFixed(2)*100).toFixed(2)
}
export const calculateFreeMargin = (balance,grandProfit,lotSize,accountLeverage) =>{
  return parseFloat((parseFloat(balance) + parseFloat(grandProfit)) - (parseFloat(lotSize)/parseFloat(accountLeverage))).toFixed(2)
}
export const calculateMargin = (lotSize,accountLeverage)=>{
 return parseFloat(parseFloat(lotSize)/parseFloat(accountLeverage)).toFixed(2)
}
export const calculateEquity = (balance,grandProfit, credit, bonus)=>{
  debugger
  const equity = (parseFloat(balance) + parseFloat(grandProfit) + parseFloat(credit) + parseFloat(bonus)).toFixed(2);
  return equity
}
export const calculateNights = (startDate, endDate)=>{
  
    const endTimestamp = new Date(endDate).getTime();
    // Set the start time for each day to 11 PM
    const startOfDay = new Date(startDate);
    startOfDay.setHours(23, 0, 0, 0);
    // Calculate the number of nights
    let nights = 0;
    let currentTimestamp = startOfDay.getTime();
    
    while (currentTimestamp < endTimestamp) {
      nights++;
      // Move to the next day (24 hours)
      currentTimestamp += 24 * 60 * 60 * 1000;
      // Set the time to 11 PM for the next day
      startOfDay.setTime(currentTimestamp);
      startOfDay.setHours(23, 0, 0, 0);
      currentTimestamp = startOfDay.getTime();
    }
  
    return nights;
}
export function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
  const day = String(now.getDate()).padStart(2, '0'); // Add leading zero if needed
  const hours = String(now.getHours()).padStart(2, '0'); // Add leading zero if needed
  const minutes = String(now.getMinutes()).padStart(2, '0'); // Add leading zero if needed
  const seconds = String(now.getSeconds()).padStart(2, '0'); // Add leading zero if needed

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

