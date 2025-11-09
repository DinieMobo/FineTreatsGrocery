const verifyEmailTemplate = ({name, url}) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Verify Your Email - Fine Treats Grocery</title>
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
            padding: 40px 20px;
            text-align: center;
        }
        
        .content {
            padding: 40px 30px;
            background-color: #ffffff;
        }
        
        .verify-button {
            display: inline-block;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white !important;
            padding: 18px 40px;
            text-decoration: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            margin: 30px 0;
            text-align: center;
            box-shadow: 0 4px 15px rgba(249, 115, 22, 0.4);
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .verify-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(249, 115, 22, 0.5);
        }
        
        .footer {
            background-color: #f8fafc;
            color: #6b7280;
            padding: 25px;
            text-align: center;
            font-size: 14px;
            border-top: 1px solid #e5e5e5;
        }
        
        .welcome-box {
            background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            border: 2px solid #3b82f6;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
        }
        
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 18px;
            opacity: 0.9;
        }
        
        .features {
            background-color: #f8fafc;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .feature-item {
            display: flex;
            align-items: center;
            margin: 10px 0;
            font-size: 16px;
        }
        
        .feature-icon {
            background-color: #22c55e;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 14px;
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
            
            .welcome-box {
                background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
                border-color: #3b82f6;
                color: #f9fafb;
            }
            
            .features {
                background-color: #111827;
                color: #f9fafb;
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
            <div class="subtitle">Welcome to the Family!</div>
        </div>
        
        <div class="content">
            <div class="welcome-box">
                <h2 style="color: #1e40af; margin: 0 0 15px 0;">🎉 Welcome ${name}!</h2>
                <p style="margin: 0; font-size: 16px;">Thank you for joining Fine Treats Grocery. You're just one step away from accessing fresh groceries and amazing deals!</p>
            </div>
            
            <p style="font-size: 18px; margin-bottom: 10px;"><strong>Please verify your email address to activate your account:</strong></p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" class="verify-button">
                    ✅ Verify Email Address
                </a>
            </div>
            
            <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 10px;">
                Can't see the button? Copy and paste this link in your browser:<br>
                <span style="word-break: break-all; color: #3b82f6;">${url}</span>
            </p>
            
            <div class="features">
                <h3 style="color: #1f2937; margin-top: 0;">What you can do with your Fine Treats account:</h3>
                
                <div class="feature-item">
                    <span class="feature-icon">🛍️</span>
                    <span>Shop from thousands of fresh products</span>
                </div>
                
                <div class="feature-item">
                    <span class="feature-icon">🚚</span>
                    <span>Fast delivery to your doorstep</span>
                </div>
                
                <div class="feature-item">
                    <span class="feature-icon">💰</span>
                    <span>Exclusive deals and discounts</span>
                </div>
                
                <div class="feature-item">
                    <span class="feature-icon">📱</span>
                    <span>Track your orders in real-time</span>
                </div>
                
                <div class="feature-item">
                    <span class="feature-icon">🎯</span>
                    <span>Personalized recommendations</span>
                </div>
            </div>
            
            <p style="margin-top: 30px;">
                <strong>Best regards,</strong><br>
                <span style="color: #22c55e; font-weight: bold;">The Fine Treats Grocery Team</span>
            </p>
        </div>
        
        <div class="footer">
            <p style="margin: 0;">© 2025 Fine Treats Grocery (Pvt) Ltd. All rights reserved.</p>
            <p style="margin: 10px 0 0 0;">You're receiving this email because you signed up for Fine Treats Grocery.</p>
            <p style="margin: 5px 0 0 0; font-size: 12px;">This is an automated message. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;
};

export default verifyEmailTemplate;