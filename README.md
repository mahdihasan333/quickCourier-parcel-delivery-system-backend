# QuickCourier Parcel Delivery System Backend

Welcome to the **QuickCourier Parcel Delivery System Backend**, a robust Node.js/Express.js-based API for managing parcel delivery operations. This project provides a secure and scalable backend solution with features like user authentication, parcel creation, status tracking, and admin management.

---

🔗 **Live Server:** [https://quick-courier-parcel-delivery-syste.vercel.app/](https://quick-courier-parcel-delivery-syste.vercel.app/)



## 📝 Project Overview

QuickCourier is a backend system designed to streamline parcel delivery operations. It supports multiple user roles (Super Admin, Admin, Sender, Receiver) and provides functionalities like user registration, authentication, parcel management, and status tracking. The system ensures data validation, secure authentication with JWT, and robust error handling.

---

## 🚀 Features

- **User Management**: Register, login, and update user profiles with role-based access control (Super Admin, Admin, Sender, Receiver).
- **Parcel Management**: Create, cancel, confirm delivery, update status, block/unblock, and delete parcels.
- **Authentication**: Secure JWT-based authentication for protected routes.
- **Validation**: Input validation using Zod to ensure data integrity.
- **Error Handling**: Centralized error handling with meaningful error messages.
- **Super Admin Seeding**: Automatically seeds a Super Admin user on server startup.
- **MongoDB Integration**: Uses MongoDB for efficient data storage and retrieval.

---

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Validation**: Zod
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **HTTP Status Codes**: http-status-codes
- **Type Safety**: TypeScript
- **Development Tools**: ts-node-dev, ESLint, Prettier

---



## ⚙️ Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Postman
- Git

### Steps

```bash
# 1. Clone the Repository
git clone https://github.com/your-username/quickCourier-parcel-delivery-system-backend.git
cd quickCourier-parcel-delivery-system-backend

# 2. Install Dependencies
npm install

# 3. Create Environment Variables
touch .env
PORT=5000
DB_URL=mongodb://localhost:27017/quickCourier
NODE_ENV=development
BCRYPT_SALT_ROUND=12
JWT_ACCESS_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES=1d
# 4. Run MongoDB (if local)
mongod

# 5. Start the Server
npm run dev
{
  "message": "Welcome to QuickCourier Parcel Delivery System Backend"
}
| Variable             | Description                 | Example                                |
| -------------------- | --------------------------- | -------------------------------------- |
| PORT                 | Server port                 | 5000                                   |
| DB\_URL              | MongoDB connection string   | mongodb://localhost:27017/quickCourier |
| NODE\_ENV            | App environment             | development                            |
| BCRYPT\_SALT\_ROUND  | Password hashing salt round | 12                                     |
| JWT\_ACCESS\_SECRET  | JWT secret key              | your\_jwt\_secret                      |
| JWT\_ACCESS\_EXPIRES | Token expiration time       | 1d                                     |
| Method | Endpoint       | Description             | Auth Required | Sample Body                                                                                                                     |
| ------ | -------------- | ----------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| POST   | /auth/register | Register a new user     | ❌ No          | `{ "name": "John", "email": "john@example.com", "password": "123", "phone": "+8801...", "address": "Dhaka", "role": "SENDER" }` |
| POST   | /auth/login    | Login and get JWT token | ❌ No          | `{ "email": "john@example.com", "password": "123" }`                                                                            |
| Method | Endpoint        | Description           | Auth Required       |
| ------ | --------------- | --------------------- | ------------------- |
| POST   | /user/register  | Register user (admin) | ❌ No                |
| GET    | /user/all-users | Get all users         | ✅ Admin/Super Admin |
| PATCH  | /user/\:id      | Update user profile   | ✅ Own/Admin         |
| Method | Endpoint              | Description      | Auth Required       |
| ------ | --------------------- | ---------------- | ------------------- |
| POST   | /parcels              | Create parcel    | ✅ Sender            |
| PATCH  | /parcels/cancel/\:id  | Cancel a parcel  | ✅ Sender            |
| PATCH  | /parcels/confirm/\:id | Confirm delivery | ✅ Receiver          |
| PATCH  | /parcels/status/\:id  | Update status    | ✅ Admin/Super Admin |
| GET    | /parcels/me           | Get own parcels  | ✅ Any               |
| PATCH  | /parcels/block/\:id   | Block a parcel   | ✅ Admin/Super Admin |
| PATCH  | /parcels/unblock/\:id | Unblock a parcel | ✅ Admin/Super Admin |
| DELETE | /parcels/\:id         | Delete a parcel  | ✅ Sender/Admin      |
Register Super Admin (or use seeded user):

makefile
কপি করুন
এডিট করুন
email: superadmin@example.com
password: SuperAdmin123!
Login: /auth/login

Save JWT token to jwtToken.

Test user creation: /user/register

Create parcel: /parcels (Sender token required)

Update parcel status: /parcels/status/:id (Admin token required)

Confirm delivery: /parcels/confirm/:id (Receiver token required)

Delete parcel: /parcels/:id

❗ Error Testing
Invalid inputs (wrong format, missing fields)

Unauthorized access (role mismatch)

