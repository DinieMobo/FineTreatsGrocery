const forgotPasswordTemplate = ({ name, otp }) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Reset Your Password - Fine Treats Grocery</title>
    <style>
        :root {
            color-scheme: light dark;
        }
        
        /* Light mode (default) */
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 12px;
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        
        .content {
            padding: 30px 20px;
            background-color: #ffffff;
        }
        
        .otp-container {
            background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
            color: white;
            font-size: 32px;
            font-weight: bold;
            padding: 25px;
            text-align: center;
            border-radius: 12px;
            margin: 25px 0;
            letter-spacing: 4px;
            border: 3px solid #16a34a;
            box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
        }
        
        .footer {
            background-color: #f8fafc;
            color: #6b7280;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            border-top: 1px solid #e5e5e5;
        }
        
        .warning {
            background-color: #fef3c7;
            color: #92400e;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #f59e0b;
        }
        
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 16px;
            opacity: 0.9;
        }
        
        /* Dark mode */
        @media (prefers-color-scheme: dark) {
            .email-container {
                background-color: #1f2937;
                color: #f9fafb;
                border-color: #374151;
            }
            
            .content {
                background-color: #1f2937;
                color: #f9fafb;
            }
            
            .footer {
                background-color: #111827;
                color: #9ca3af;
                border-top-color: #374151;
            }
            
            .warning {
                background-color: #451a03;
                color: #fbbf24;
                border-left-color: #f59e0b;
            }
        }
        
        /* Email client specific */
        [data-ogsc] .email-container {
            background-color: #1f2937 !important;
            color: #f9fafb !important;
        }
        
        [data-ogsc] .content {
            background-color: #1f2937 !important;
            color: #f9fafb !important;
        }
        
        [data-ogsc] .footer {
            background-color: #111827 !important;
            color: #9ca3af !important;
        }
    </style>
</head>
<body style="margin: 0; padding: 20px; background-color: #f1f5f9;">
    <div class="email-container">
        <div class="header">
            <div class="logo">🛒 Fine Treats Grocery</div>
            <div class="subtitle">Password Reset Request</div>
        </div>
        
        <div class="content">
            <h2 style="color: #1f2937; margin-top: 0;">Dear ${name},</h2>
            <p>We received a request to reset your password for your Fine Treats Grocery account. To proceed with resetting your password, please use the following One-Time Password (OTP):</p>
            
            <div class="otp-container">
                ${otp}
            </div>
            
            <div class="warning">
                <strong>⚠️ Important Security Information:</strong><br>
                • This OTP is valid for only <strong>1 hour</strong><br>
                • Do not share this OTP with anyone<br>
                • If you didn't request this reset, please ignore this email
            </div>
            
            <p><strong>How to use this OTP:</strong></p>
            <ol>
                <li>Go to the Fine Treats Grocery password reset page</li>
                <li>Enter the OTP exactly as shown above</li>
                <li>Create your new secure password</li>
            </ol>
            
            <p>If you have any questions or need assistance, please contact our support team.</p>
            
            <p style="margin-top: 30px;">
                <strong>Best regards,</strong><br>
                <span style="color: #22c55e; font-weight: bold;">The Fine Treats Grocery Team</span>
            </p>
        </div>
        
        <div class="footer">
            <p style="margin: 0;">© 2025 Fine Treats Grocery (Pvt) Ltd. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;
};

export default forgotPasswordTemplate;