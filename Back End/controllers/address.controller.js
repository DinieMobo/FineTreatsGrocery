import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js"; 

export const AddAddressController = async(request,response)=>{
    try {
        const userId = request.userId
        const { address_line1 ,address_line2, city, state, zipcode, country, phone } = request.body

        const createAddress = new AddressModel({
            address_line1,
            address_line2,
            city,
            state,
            country,
            zipcode,
            phone,
            userId : userId 
        })
        const saveAddress = await createAddress.save()

        const addUserAddressId = await UserModel.findByIdAndUpdate(userId,{
            $push : {
                address_details : saveAddress._id
            }
        })

        return response.json({
            message : "Address created Successfully",
            data : saveAddress,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const GetAddressController = async(request,response)=>{
    try {
        const userId = request.userId

        const data = await AddressModel.find({ userId : userId }).sort({ createdAt : -1})

        return response.json({
            data : data,
            message : "Fetching list of addresses",
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error ,
            error : true,
            success : false
        })
    }
}

export const UpdateAddressController = async(request,response)=>{
    try {
        const userId = request.userId
        const { _id, address_line1 ,address_line2, city, state, zipcode, country, phone } = request.body 

        const updateAddress = await AddressModel.updateOne({ _id : _id, userId : userId },{
            address_line1,
            address_line2,
            city,
            state,
            country,
            phone,
            zipcode
        })

        return response.json({
            message : "Address Updated Successfully",
            data : updateAddress,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const DeleteAddresscontroller = async(request,response)=>{
    try {
        const userId = request.userId  
        const { _id } = request.body 

        const disableAddress = await AddressModel.updateOne({ _id : _id, userId},{
            status : false
        })

        return response.json({
            message : "Address removed Successfully",
            data : disableAddress,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}