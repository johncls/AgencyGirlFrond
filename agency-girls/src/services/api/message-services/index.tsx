import { apiUrl } from "../../../config";
import axios from "axios";

export const messageSendServices = async () => {
    
   const { data} = await axios.post(`${apiUrl}/api/Message/send`);
   return data;
}