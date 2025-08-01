QuickCourier Parcel Delivery System Backend
Welcome to the QuickCourier Parcel Delivery System Backend, a robust Node.js/Express.js-based API for managing parcel delivery operations. This project provides a secure and scalable backend solution with features like user authentication, parcel creation, status tracking, and admin management.
Table of Contents

Project Overview
Features
Tech Stack
Installation
Environment Variables
API Endpoints
Testing with Postman
Contributing
License

Project Overview
QuickCourier is a backend system designed to streamline parcel delivery operations. It supports multiple user roles (Super Admin, Admin, Sender, Receiver) and provides functionalities like user registration, authentication, parcel management, and status tracking. The system ensures data validation, secure authentication with JWT, and robust error handling.
Features

User Management: Register, login, and update user profiles with role-based access control (Super Admin, Admin, Sender, Receiver).
Parcel Management: Create, cancel, confirm delivery, update status, block/unblock, and delete parcels.
Authentication: Secure JWT-based authentication for protected routes.
Validation: Input validation using Zod to ensure data integrity.
Error Handling: Centralized error handling with meaningful error messages.
Super Admin Seeding: Automatically seeds a Super Admin user on server startup.
MongoDB Integration: Uses MongoDB for efficient data storage and retrieval.

Tech Stack

Runtime: Node.js
Framework: Express.js
Database: MongoDB with Mongoose
Validation: Zod
Authentication: JSON Web Tokens (JWT)
Password Hashing: bcryptjs
HTTP Status Codes: http-status-codes
Type Safety: TypeScript
Development Tools: ts-node-dev, ESLint, Prettier

Installation
Follow these steps to set up the project locally:
Prerequisites

Node.js (v16 or higher)
MongoDB (local or cloud instance)
Postman (for API testing)
Git

Steps

Clone the Repository:
git clone https://github.com/your-username/quickCourier-parcel-delivery-system-backend.git
cd quickCourier-parcel-delivery-system-backend


Install Dependencies:
npm install


Set Up Environment Variables:Create a .env file in the project root and add the following:
PORT=5000
DB_URL=mongodb://localhost:27017/quickCourier
NODE_ENV=development
BCRYPT_SALT_ROUND=12
JWT_ACCESS_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES=1d


Run MongoDB:Ensure MongoDB is running locally or use a cloud service like MongoDB Atlas. For local MongoDB:
mongod


Start the Server:
npm run dev

The server will run on http://localhost:5000.

Verify Setup:Open a browser or Postman and hit http://localhost:5000 to see the welcome message:
{
  "message": "Welcome to QuickCourier Parcel Delivery System Backend"
}



Environment Variables



Variable
Description
Example Value



PORT
Server port number
5000


DB_URL
MongoDB connection URL
mongodb://localhost:27017/quickCourier


NODE_ENV
Environment mode (development/production)
development


BCRYPT_SALT_ROUND
Salt rounds for password hashing
12


JWT_ACCESS_SECRET
Secret key for JWT authentication
your_jwt_secret


JWT_ACCESS_EXPIRES
JWT token expiration time
1d


API Endpoints
Below is a list of all available API endpoints. Use Postman or any API client to test them.
Auth Routes



Method
Endpoint
Description
Authentication Required
Sample Request Body



POST
/auth/register
Register a new user
None
{"name": "John Doe", "email": "john.doe@example.com", "password": "Password123!", "phone": "+8801712345678", "address": "123, Dhaka", "role": "SENDER"}


POST
/auth/login
Login and get JWT token
None
{"email": "john.doe@example.com", "password": "Password123!"}


User Routes



Method
Endpoint
Description
Authentication Required
Sample Request Body



POST
/user/register
Create a new user (admin)
None
{"name": "Jane Smith", "email": "jane.smith@example.com", "password": "Password123!", "phone": "01712345678", "address": "456, Dhaka", "role": "RECEIVER"}


GET
/user/all-users
Get all users
Admin/Super Admin
None


PATCH
/user/:id
Update user details
Any role (self/admin)
{"name": "John Updated", "phone": "+8801712345679", "address": "789, Dhaka"}


Parcel Routes



Method
Endpoint
Description
Authentication Required
Sample Request Body



POST
/parcels
Create a new parcel
Sender
{"receiver": "RECEIVER_ID", "type": "Document", "weight": 1.5, "senderAddress": "123, Dhaka", "receiverAddress": "456, Chittagong", "fee": 100}


PATCH
/parcels/cancel/:id
Cancel a parcel
Sender
None


PATCH
/parcels/confirm/:id
Confirm parcel delivery
Receiver
None


PATCH
/parcels/status/:id
Update parcel status
Admin/Super Admin
{"status": "APPROVED"}


GET
/parcels/me
Get user-related parcels
Any role
None


PATCH
/parcels/block/:id
Block a parcel
Admin/Super Admin
None


PATCH
/parcels/unblock/:id
Unblock a parcel
Admin/Super Admin
None


DELETE
/parcels/:id
Delete a parcel
Sender/Admin/Super Admin
None


Testing with Postman

Download Postman: Install Postman from postman.com.
Create a Collection: Create a new collection named QuickCourier API.
Set Up Environment:
Add a variable baseUrl with value http://localhost:5000/api/v1.
Add a variable jwtToken to store JWT tokens after login.


Test Flow:
Step 1: Register a Super Admin user or use the seeded Super Admin (email: superadmin@example.com, password: SuperAdmin123!).
Step 2: Login with /auth/login to get a JWT token and save it in jwtToken.
Step 3: Test user creation with /user/register or /auth/register.
Step 4: Create a parcel with /parcels using a Sender's token.
Step 5: Update parcel status with /parcels/status/:id using an Admin token.
Step 6: Confirm delivery with /parcels/confirm/:id using a Receiver's token.
Step 7: Delete a parcel with /parcels/:id using a Sender or Admin token.


Error Testing:
Test invalid inputs (e.g., wrong email format, invalid parcel ID).
Test unauthorized access (e.g., non-admin accessing /user/all-users).


