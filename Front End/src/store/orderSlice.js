import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    order: [],
    filteredOrders: [],
    currentOrder: null,
    loading: false,
    error: null,
    filter: {
        status: 'all',
        dateRange: 'all',
        searchQuery: ''
    }
}

const orderSlice = createSlice({
    name: 'order',
    initialState: initialValue,
    reducers: {
        setOrder: (state, action) => {
            state.order = [...action.payload];
            state.filteredOrders = [...action.payload];
        },
        setCurrentOrder: (state, action) => {
            state.currentOrder = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        updateOrderStatus: (state, action) => {
            const { orderId, status } = action.payload;
            
            // Update in order array
            const orderIndex = state.order.findIndex(order => order.orderId === orderId);
            if (orderIndex !== -1) {
                state.order[orderIndex].order_status = status;
            }
            
            // Update in filtered orders array
            const filteredIndex = state.filteredOrders.findIndex(order => order.orderId === orderId);
            if (filteredIndex !== -1) {
                state.filteredOrders[filteredIndex].order_status = status;
            }
            
            // Update current order if it's the same one
            if (state.currentOrder && state.currentOrder.orderId === orderId) {
                state.currentOrder.order_status = status;
            }
        },
        adminUpdateOrderStatus: (state, action) => {
            const { id, orderId, status } = action.payload;
            
            // Update in order array by _id or orderId
            const orderIndex = state.order.findIndex(order => 
                (id && order._id === id) || order.orderId === orderId
            );
            if (orderIndex !== -1) {
                state.order[orderIndex].order_status = status;
            }
            
            // Update in filtered orders array
            const filteredIndex = state.filteredOrders.findIndex(order => 
                (id && order._id === id) || order.orderId === orderId
            );
            if (filteredIndex !== -1) {
                state.filteredOrders[filteredIndex].order_status = status;
            }
            
            // Update current order if it's the same one
            if (state.currentOrder && 
                ((id && state.currentOrder._id === id) || state.currentOrder.orderId === orderId)) {
                state.currentOrder.order_status = status;
            }
        },
        filterOrders: (state, action) => {
            const { status, dateRange, searchQuery } = action.payload;
            state.filter = { status, dateRange, searchQuery };
            
            let filtered = [...state.order];
            
            if (status !== 'all') {
                filtered = filtered.filter(order => {
                    // Check order_status first, then fall back to payment_status
                    const orderStatus = order.order_status || order.payment_status || '';
                    return orderStatus.toLowerCase() === status.toLowerCase();
                });
            }
            
            if (dateRange !== 'all') {
                const now = new Date();
                let dateLimit;
                
                switch (dateRange) {
                    case 'last7days':
                        dateLimit = new Date(now.setDate(now.getDate() - 7));
                        break;
                    case 'last30days':
                        dateLimit = new Date(now.setDate(now.getDate() - 30));
                        break;
                    case 'last3months':
                        dateLimit = new Date(now.setMonth(now.getMonth() - 3));
                        break;
                    case 'last6months':
                        dateLimit = new Date(now.setMonth(now.getMonth() - 6));
                        break;
                    default:
                        dateLimit = null;
                }
                
                if (dateLimit) {
                    filtered = filtered.filter(order => new Date(order.createdAt) >= dateLimit);
                }
            }
            
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter(order => 
                    (order.orderId && order.orderId.toLowerCase().includes(query)) ||
                    (order.product_details?.name && order.product_details.name.toLowerCase().includes(query))
                );
            }
            
            state.filteredOrders = filtered;
        },
        clearFilters: (state) => {
            state.filter = {
                status: 'all',
                dateRange: 'all',
                searchQuery: ''
            };
            state.filteredOrders = [...state.order];
        }
    }
})

export const { 
    setOrder, 
    setCurrentOrder, 
    setLoading,
    setError,
    updateOrderStatus,
    adminUpdateOrderStatus, // Export the new action
    filterOrders,
    clearFilters
} = orderSlice.actions

export default orderSlice.reducer