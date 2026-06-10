import { apiUrl } from "../../../config";
import type { UserLogin } from "../../../interfaces/typeUser";
import axios from "axios";

export const loginServices = async (user: UserLogin) => {
    
   const { data} = await axios.post(`${apiUrl}/api/UserLogin/login`, user);
   return data;
}
