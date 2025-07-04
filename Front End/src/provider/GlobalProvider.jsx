import { createContext,useContext, useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useDispatch, useSelector } from "react-redux";
import { handleAddItemCart } from "../store/cartProduct";
import AxiosToastError from "../utils/AxiosToastError";
import toast from "react-hot-toast";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { handleAddAddress } from "../store/addressSlice";
import { setOrder, setLoading, setError, setCurrentOrder } from "../store/orderSlice";

export const GlobalContext = createContext(null)

export const useGlobalContext = ()=> useContext(GlobalContext)

const GlobalProvider = ({children}) => {
     const dispatch = useDispatch()
     const [totalPrice,setTotalPrice] = useState(0)
     const [notDiscountTotalPrice,setNotDiscountTotalPrice] = useState(0)
    const [totalQty,setTotalQty] = useState(0)
    const cartItem = useSelector(state => state.cartItem.cart)
    const user = useSelector(state => state?.user)

    const fetchCartItem = async()=>{
        if (!user?._id) return; 
        try {
          const response = await Axios({
            ...SummaryApi.getCartItem
          })
          const { data : responseData } = response
    
          if(responseData.success){
            dispatch(handleAddItemCart(responseData.data))
            console.log(responseData)
          }
    
        } catch (error) {
          console.log(error)
        }
    }

    const updateCartItem = async(id,qty)=>{
      if (!user?._id) return; 
      try {
          const response = await Axios({
            ...SummaryApi.updateCartItemQty,
            data : {
              _id : id,
              qty : qty
            }
          })
          const { data : responseData } = response

          if(responseData.success){
              toast.success(responseData.message)
              fetchCartItem()
              return responseData
          }
      } catch (error) {
        AxiosToastError(error)
        return error
      }
    }
    const deleteCartItem = async(cartId)=>{
      if (!user?._id) return; 
      try {
          const response = await Axios({
            ...SummaryApi.deleteCartItem,
            data : {
              _id : cartId
            }
          })
          const { data : responseData} = response

          if(responseData.success){
            toast.success(responseData.message)
            fetchCartItem()
          }
      } catch (error) {
         AxiosToastError(error)
      }
    }

    useEffect(()=>{
      const qty = cartItem.reduce((preve,curr)=>{
          return preve + curr.quantity
      },0)
      setTotalQty(qty)
      
      const tPrice = cartItem.reduce((preve,curr)=>{
          const priceAfterDiscount = pricewithDiscount(curr?.productId?.price,curr?.productId?.discount)

          return preve + (priceAfterDiscount * curr.quantity)
      },0)
      setTotalPrice(tPrice)

      const notDiscountPrice = cartItem.reduce((preve,curr)=>{
        return preve + (curr?.productId?.price * curr.quantity)
      },0)
      setNotDiscountTotalPrice(notDiscountPrice)
  },[cartItem])

     const handleLogoutOut = ()=>{
         localStorage.clear()
         dispatch(handleAddItemCart([]))
     }

    const fetchAddress = async()=>{
      if (!user?._id) return; 
      try {
        const response = await Axios({
          ...SummaryApi.getAddress
        })
        const { data : responseData } = response

        if(responseData.success){
          dispatch(handleAddAddress(responseData.data))
        }
      } catch (error) {
          AxiosToastError(error)
      }
    }
    const fetchOrder = async() => {
      if (!user?._id) return; 
      try {
        dispatch(setLoading(true));
        const response = await Axios({
          ...SummaryApi.getOrderItems,
        })
        const { data : responseData } = response

        if(responseData.success){
            dispatch(setOrder(responseData.data));
        }
      } catch (error) {
        console.log(error);
        dispatch(setError(error.message || "Failed to fetch orders"));
        AxiosToastError(error);
      } finally {
        dispatch(setLoading(false));
      }
    }
    
    const fetchOrderById = async(orderId) => {
      if (!user?._id || !orderId) return null;
      
      try {
        dispatch(setLoading(true));
        const response = await Axios({
          ...SummaryApi.getSingleOrder,
          method: 'GET',
          params: { orderId }
        });
        
        if (response.data.success) {
          dispatch(setCurrentOrder(response.data.data));
          return response.data.data;
        } else {
          toast.error(response.data.message || "Failed to fetch order details");
          return null;
        }
      } catch (error) {
        console.log(error);
        AxiosToastError(error);
        return null;
      } finally {
        dispatch(setLoading(false));
      }
    }

    useEffect(()=>{
      if (user && user._id) { 
        fetchCartItem()
        fetchAddress()
        fetchOrder()
      } else {
        dispatch(handleAddItemCart([])); 
        dispatch(handleAddAddress([])); 
        dispatch(setOrder([])); 
        dispatch(setCurrentOrder(null));
      }
    },[user, dispatch])
    
    return(
        <GlobalContext.Provider value={{
            fetchCartItem,
            updateCartItem,
            deleteCartItem,
            fetchAddress,
            totalPrice,
            totalQty,
            notDiscountTotalPrice,
            fetchOrder,
            fetchOrderById
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider