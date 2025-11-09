import Axios from "./Axios"
import SummaryApi from "../common/SummaryApi"

const fetchUserDetails = async()=>{
    try {
        const response = await Axios({
            ...SummaryApi.userDetails
        })
        return response.data
    } catch (error) {
        console.log("Error in fetchUserDetails:", error)
        return { data: null, error: true, message: error.message }; 
    }
}

export default fetchUserDetails