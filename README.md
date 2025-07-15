# Fine Treats Grocery - Web-Based E-commerce Application

## Project Overview

Fine Treats Grocery is a modern, full-stack web application designed to provide a seamless online shopping experience for grocery items. This platform allows users to browse a wide variety of products, add them to their cart, and proceed through a secure checkout process. The application is built with a strong focus on user experience, performance, and scalability, offering both customer-facing features and administrative tools for managing the store.

## Key Features

### User Management
- **User Authentication**: Secure sign-up, login, and logout functionalities for a personalized shopping experience.
- **Email Verification**: Account verification via OTP sent to email.
- **Password Management**: Forgot password and reset password functionalities.
- **User Profiles**: Users can manage their profile details, including name, email, and address.
- **Admin Roles**: Dedicated admin panel for managing products, categories, sub-categories, and orders.

### Product & Catalog Management
- **Product Catalog**: A well-organized and visually appealing display of grocery items.
- **Product Details**: View detailed information for each product, including description, price, images, and brand.
- **Product Search**: Robust search functionality to find products by name or category.
- **Category & Sub-Category Management**: Admins can add, edit, and delete product categories and sub-categories.
- **Product Administration**: Admins can upload, edit, and delete products, including managing product images.

### Shopping & Checkout
- **Shopping Cart**: A persistent and easy-to-use cart to add, remove, and manage selected items.
- **Quantity Management**: Users can adjust product quantities directly in the cart.
- **Address Management**: Users can add and manage multiple shipping addresses.
- **Checkout Process**: A streamlined, multi-step checkout process for a smooth and secure transaction.
- **Payment Gateway Integration**: Secure online payments powered by Stripe.
- **Order Confirmation**: Success and cancellation pages for payment outcomes.

### Order Management
- **User Order History**: Users can view their past orders and track current orders.
- **Admin Order Management**: Admins have a dedicated panel to view and update the status of all orders.

### Technical Aspects
- **Responsive Design**: The application is fully responsive and optimized for a great user experience on desktops, tablets, and mobile devices.
- **Image Upload**: Integrated Cloudinary for efficient and scalable image storage.
- **API Integration**: RESTful APIs for seamless communication between frontend and backend.

## Technologies & Architecture

This project is built using a modern MERN stack (MongoDB, Express.js, React.js, Node.js) and follows a robust client-server architecture.

### Frontend (Client-Side)
- **React.js**: A powerful JavaScript library for building dynamic and interactive user interfaces.
- **Vite**: A fast build tool for modern web projects.
- **Redux Toolkit**: For predictable state management across the application.
- **React Router DOM**: To handle client-side routing and navigation.
- **Axios**: For making promise-based HTTP requests to the backend API.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **React Icons**: A collection of popular icon libraries.
- **React Hot Toast**: For displaying elegant and responsive notifications.
- **Swiper**: For creating modern touch sliders.

### Backend (Server-Side)
- **Node.js**: A JavaScript runtime environment for building fast and scalable server-side applications.
- **Express.js**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **MongoDB**: A NoSQL database used to store application data, including user information, products, and orders.
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js, managing relationships between data and providing schema validation.
- **JWT (JSON Web Tokens)**: For implementing secure user authentication and authorization.
- **Bcrypt.js**: For hashing passwords securely.
- **Nodemailer**: For sending emails (e.g., OTP, password reset).
- **Cloudinary**: Cloud-based image and video management.
- **Stripe**: For processing payments.
- **Cookie-parser**: Middleware for parsing cookies.
- **CORS**: Middleware for enabling Cross-Origin Resource Sharing.
- **Dotenv**: For loading environment variables from a .env file.

## Step-by-Step Setup Instructions

To get the Fine Treats Grocery application up and running on your local machine, follow these detailed steps.

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js**: Version 18 or higher (LTS recommended). You can download it from [nodejs.org](https://nodejs.org/).
- **MongoDB**: A running MongoDB instance. You can install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/) or use a cloud-based service like MongoDB Atlas.
- **Git**: For cloning the repository. You can download it from [git-scm.com](https://git-scm.com/).

### 1. Clone the Repository
First, clone the project repository to your local machine:
```bash
git clone https://github.com/DinieMobo/FineTreatsGrocery
cd FineTreatsGrocery
```
You can also download the Entire Repository as the ZIP file and Extract it.

### 2. Backend Setup
Navigate into the Back End directory:
```bash
cd Back End
```

#### 2.1. Install Dependencies
Install the necessary Node.js packages for the backend:
```bash
npm install
```

#### 2.2. Configure Environment Variables
Create a `.env` file in the Back End directory. This file will store your sensitive information and API keys.
```
FRONTEND_URL="http://localhost:5173"  #You can change the port 5173 to your own port number.
MONGODB_URI="your_mongodb_connection_string"
RESEND_API="your_resend_api_key"

# JWT Secrets (Generate strong, random strings)
SECRET_KEY_ACCESS_TOKEN=your_access_token_secret_key_here
SECRET_KEY_REFRESH_TOKEN=your_refresh_token_secret_key_here

# Stripe API Keys (Get from Stripe Dashboard)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY=whsec_your_stripe_webhook_secret_here

# Cloudinary API Keys (Get from Cloudinary Dashboard)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET_KEY=your_cloudinary_api_secret_here
```

#### 2.3. Run the Backend
Once the dependencies are installed and environment variables are set, start the backend server:
```bash
npm start
# or
node index.js
```
The backend server should now be running on `http://localhost:8080` (or the port you specified).

### 3. Frontend Setup
Open a new terminal window and navigate into the Front End directory:
```bash
cd ../Front End
```

#### 3.1. Install Dependencies
Install the necessary Node.js packages for the frontend:
```bash
npm install
```

#### 3.2. Configure Environment Variables
Create a `.env` file in the Front End directory.
```
VITE_BACKEND_URL=http://localhost:8080  #You can change the port 8080 to your own port number.
VITE_STRIPE_PUBLIC_KEY="your_stripe_public_key_goes_here"
```

#### 3.3. Run the Frontend
Start the frontend development server:
```bash
npm run dev
```
The frontend application should now be accessible in your web browser at `http://localhost:5173` (or the port Vite assigns, which will be shown in your terminal).

You are now ready to use the Fine Treats Grocery E-commerce Application locally!

## Contact

For any questions or support, please reach out via email: dinisayuranga@gmail.com