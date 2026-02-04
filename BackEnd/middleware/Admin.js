import UserModel from "../models/user.model.js"

export const admin = async(request,response,next)=>{
    try {
       const userId = request.userId

       if (!userId) {
            return response.status(401).json({
                message: "Unauthorized - User ID not found",
                error: true,
                success: false
            })
       }

       const user = await UserModel.findById(userId)

       if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
       }

       if(!user.role || user.role !== 'ADMIN'){
            return response.status(403).json({
                message : "Permission denied. Admin access required.",
                error : true,
                success : false
            })
       }

       next()

    } catch (error) {
        return response.status(500).json({
            message : "Authorization error",
            error : true,
            success : false
        })
    }
}