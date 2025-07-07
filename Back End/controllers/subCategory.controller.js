import SubCategoryModel from "../models/sub_category.model.js";

export const AddSubCategoryController = async(request,response)=>{
    try {
        const { name, image, category } = request.body;

        if(!name && !image && !category[0] ){
            return response.status(500).json({
                message: "All fields are required",
                error: true,
                success: false
            });
        }

        const payload = {
            name,
            image,
            category
        }

        const createSubCategory = new SubCategoryModel(payload);
        const save = await createSubCategory.save();

        return response.json({
            message: "Sub Category added successfully",
            data: save,
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        });
    }
}

export const GetSubCategoryController = async(request,response)=>{
    try {
        const data = await SubCategoryModel.find().sort({ createdAt : -1 }).populate('category');
        return response.json({
            message : "Sub Category data found",
            data : data,
            error : false,
            success : true
        });
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        });
    }
}

export const UpdateSubCategoryController = async(request,response)=>{
    try {
        const { _id, name, image,category } = request.body 

        const checkSub = await SubCategoryModel.findById(_id)

        if(!checkSub){
            return response.status(400).json({
                message : "Check your Sub Category ID",
                error : true,
                success : false
            })
        }

        const updateSubCategory = await SubCategoryModel.findByIdAndUpdate(_id,{
            name,
            image,
            category
        })

        return response.json({
            message : 'Sub Category Updated Successfully',
            data : updateSubCategory,
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

export const DeleteSubCategoryController = async(request,response)=>{
    try {
        const { _id } = request.body 
        console.log("Id",_id)
        const deleteSub = await SubCategoryModel.findByIdAndDelete(_id)

        return response.json({
            message : "Sub Category Deleted successfully",
            data : deleteSub,
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