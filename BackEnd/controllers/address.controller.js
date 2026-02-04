import AddressModel from "../models/address.model.js";
import UserModel from "../models/user.model.js"; 

export const AddAddressController = async(request,response)=>{
    try {
        const userId = request.userId
        const { address_line1 ,address_line2, city, state, zipcode, country, phone } = request.body

        if (!address_line1 || !city || !state || !zipcode || !country || !phone) {
            return response.status(400).json({
                message: "All address fields are required",
                error: true,
                success: false
            });
        }

        if (typeof phone !== 'string' || phone.length < 10) {
            return response.status(400).json({
                message: "Invalid phone number format",
                error: true,
                success: false
            });
        }

        if (typeof zipcode !== 'string' || zipcode.trim().length === 0) {
            return response.status(400).json({
                message: "Invalid zipcode format",
                error: true,
                success: false
            });
        }

        const createAddress = new AddressModel({
            address_line1,
            address_line2,
            city,
            state,
            country,
            zipcode: zipcode.toString(),
            phone: phone.toString(),
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

        const data = await AddressModel.find({ userId : userId, status : true }).sort({ createdAt : -1})

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

        if (!_id) {
            return response.status(400).json({
                message: "Address ID is required",
                error: true,
                success: false
            });
        }

        if (!address_line1 || !city || !state || !zipcode || !country || !phone) {
            return response.status(400).json({
                message: "All address fields are required",
                error: true,
                success: false
            });
        }

        const updateAddress = await AddressModel.updateOne({ _id : _id, userId : userId },{
            address_line1,
            address_line2,
            city,
            state,
            country,
            phone: phone.toString(),
            zipcode: zipcode.toString()
        })

        if (updateAddress.matchedCount === 0) {
            return response.status(404).json({
                message: "Address not found or unauthorized",
                error: true,
                success: false
            });
        }

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