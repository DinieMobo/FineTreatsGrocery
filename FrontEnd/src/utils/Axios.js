import axios from "axios";
import SummaryApi , { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
    baseURL : baseURL,
    withCredentials : true
})

Axios.interceptors.request.use(
    async(config)=>{
        const accessToken = localStorage.getItem('accesstoken');

        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error)=>{
        return Promise.reject(error)
    }
)

Axios.interceptors.response.use(
    (response)=>{
        return response
    },
    async(error)=>{
        let originRequest = error.config 

        if(error.response?.status === 401 && !originRequest.retry){
            originRequest.retry = true

            const refreshToken = localStorage.getItem("refreshToken")

            if(refreshToken){
                const newAccessToken = await refreshAccessToken(refreshToken)

                if(newAccessToken){
                    originRequest.headers.Authorization = `Bearer ${newAccessToken}`
                    return Axios(originRequest)
                }
            }
        }
        
        return Promise.reject(error)
    }
)


const refreshAccessToken = async(refreshToken)=>{
    try {
        const response = await Axios({
            ...SummaryApi.refreshToken,
            headers : {
                Authorization : `Bearer ${refreshToken}`
            }
        })

        const accessToken = response.data.data.accessToken
        localStorage.setItem('accesstoken',accessToken)
        return accessToken
    } catch (error) {
        console.log(error)
    }
}

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await Axios({
      ...SummaryApi.updateOrderStatus,
      data: {
        orderId,
        status
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    const response = await Axios({
      ...SummaryApi.getAllOrdersAdmin
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

export default Axios