import sendEmail from '../config/sendemail.js';
import UserModel from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js';
import generatedOTP from '../utils/generatedOTP.js';
import forgotPasswordTemplate from '../utils/forgotPasswordTemplate.js';
import jwt from 'jsonwebtoken';

export async function registerUserController(request, response) {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return response.status(400).json({
                message: "Please provide an email, name, password",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (user) {
            return response.status(400).json({
                message: "This email is already associated with another user",
                error: true,
                success: false
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const payload = {
            name,
            email,
            password: hashedPassword
        };

        const newUser  = new UserModel(payload);
        const savedUser  = await newUser .save();

        const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser ._id}`;

        await sendEmail({
            sendTo: email,
            subject: "Verify your Fine Treats Account",
            html: verifyEmailTemplate({
                name,
                url: verifyEmailUrl
            })
        });

        return response.status(201).json({
            message: "User registered successfully",
            error: false,
            success: true,
            data: savedUser 
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function verifyEmailController(request, response) {
    try {
        const { code } = request.body

        const user = await UserModel.findOne({ _id: code });

        if (!user) {
            return response.status(400).json({
                message: "Invalid verification code",
                error: true,
                success: false
            });
        }

        await UserModel.updateOne({ _id: code }, { verify_email: true });

        return response.status(200).json({
            message: "Email verified successfully",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: true
        });
    }
}

export async function loginController(request, response) {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                message: "Please provide an email and password",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "User not registered",
                error: true,
                success: false
            });
        }

        if(user.status !== "Active"){
            return response.status(400).json({
                message: "Contact Admin to activate your account",
                error: true,
                success: false
            });
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return response.status(400).json({
                message: "Invalid password, please check your password",
                error: true,
                success: false
            });
        }

        const accessToken = await generatedAccessToken(user._id);
        const refreshToken = await generatedRefreshToken(user._id);

        const updateUser = await UserModel.findByIdAndUpdate(user?._id, {
            last_login_date : new Date().toISOString(),
        });

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };
        response.cookie("accessToken", accessToken, cookiesOption);
        response.cookie("refreshToken", refreshToken, cookiesOption);

        return response.status(200).json({
            message: "Login successfully",
            error: false,
            success: true,
            data: {
                accessToken,
                refreshToken,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    phone: user.phone,
                    verify_email: user.verify_email,
                    last_login_date: user.last_login_date,
                    status: user.status,
                    address_details: user.address_details,
                    shopping_cart: user.shopping_cart,
                    orderHistory: user.orderHistory,
                    role: user.role
                }
            }
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function logoutController(request, response) {
    try {
        const userId = request.userId;
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        response.clearCookie("accessToken", cookiesOption);
        response.clearCookie("refreshToken", cookiesOption);

        const removeRefreshToken = await UserModel.findByIdAndUpdate(userId,{
            refresh_token: ""
        });
        
        return response.status(200).json({
            message: "Logout successfully",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function uploadAvatar(request, response) {
    try {
        const userId = request.userId;
        const image = request.file;

        const upload = await uploadImageCloudinary(image);

        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        });

        return response.status(200).json({
            message: "Upload Profile",
            data: {
                _id: userId,
                avatar: upload.url
            }
        });
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function updateUserDetails(request, response) {
    try{
        const userId = request.userId;
        const { name, email, phone, password } = request.body;

        let hashedPassword = "";
        if(password){
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const updateUser = await UserModel.updateOne({_id : userId},{
            ...(name && { name : name }),
            ...(email && { email : email }),
            ...(phone && { phone : phone }),
            ...(password && { password : hashedPassword })
        });

        return response.status(200).json({
            message: "User details Updated successfully",
            error: false,
            success: true,
            data: updateUser
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body;
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            });
        }

        const otp = generatedOTP();
        const expireTime = new Date().getTime() + 60 * 60 * 1000;

        await UserModel.findByIdAndUpdate(user._id,{
            forgot_password_otp: otp,
            forgot_password_expiry: new Date(expireTime).toISOString()
        });

        await sendEmail({
            sendTo: email,
            subject: "Reset your Fine Treats Account Password",
            html: forgotPasswordTemplate({
                name: user.name,
                otp : otp
            })
        });

        return response.status(200).json({
            message: "We have sent you an OTP to your email to reset your password. Check your email",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function verifyForgotPasswordOTP(request, response) {
    try {
        const { email, otp } = request.body;

        if (!email || !otp) {
            return response.status(400).json({
                message: "Please provide email and OTP",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            });
        }

        const currentTime = new Date().toISOString();

        if(user.forgot_password_expiry < currentTime){
            return response.status(400).json({
                message: "OTP expired, please try again",
                error: true,
                success: false
            });
        }

        if(otp !== user.forgot_password_otp){
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            });
        }

        const updateUser = await UserModel.findByIdAndUpdate(user?._id,{
            forgot_password_otp: "",
            forgot_password_expiry: ""
        });
        
        return response.status(200).json({
            message: "OTP verified successfully",
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function resetPasswordController(request, response) {
    try{
        const { email, newPassword, confirmPassword } = request.body;

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Please provide email, new password and confirm password",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return response.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            });
        }

        if(newPassword !== confirmPassword){
            return response.status(400).json({
                message: "Password does not match",
                error: true,
                success: false
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const update = await UserModel.findOneAndUpdate(user._id,{
            password: hashedPassword
        });

        return response.status(200).json({
            message: "Password updated successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function refreshTokenController(request, response) {
    try {
        const refreshToken = request.cookies.refreshToken || request?.headers?.authorization?.split(" ")[1];

        if (!refreshToken) {
            return response.status(400).json({
                message: "Invalid token",
                error: true,
                success: false
            });
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);

        if (!verifyToken) {
            return response.status(400).json({
                message: "Token is expired",
                error: true,
                success: false
            });
        }

        const userId = verifyToken?._id;

        const newAccessToken = await generatedAccessToken(userId);

        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        response.cookie("accessToken", newAccessToken, cookiesOption);

        return response.status(200).json({
            message: "New Access Token generated",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export async function userDetails(request, response) {
    try {
        const userId = request.userId;

        console.log("User Id", userId);
        const user = await UserModel.findById(userId).select("-password -refresh_token");
        return response.json({
            message: "User details",
            data: user,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: "Something went wrong",
            error: true,
            success: false
        });
    }
}