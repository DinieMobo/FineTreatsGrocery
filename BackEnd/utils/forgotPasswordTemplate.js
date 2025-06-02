const forgotPasswordTemplate = ({ name, otp }) => {
    return `
<div>
    <p>Dear ${name},</p>
    <p>We received a request to reset your password. Use the following OTP to reset your password.</p>
    <div style="background: lightgreen; font-size: 20px; padding: 20px; text-align: center; font-weight: 800;">
        Your OTP for password reset is: ${otp}
    </div>
    <p>This OTP is valid only for 1 hour. Enter this OTP in the Fine Treats Website to proceed with resetting your password.</p>
    <br/>
    <p>Regards,</p>
    <p>Fine Treats Grocery</p>
</div>

`;
};

export default forgotPasswordTemplate;