QuickCourier Parcel Delivery System
Overview
A secure, role-based backend API for a parcel delivery system built with Express.js, Mongoose, TypeScript, and Zod. Supports four roles: SUPER_ADMIN, ADMIN, SENDER, and RECEIVER. Features include JWT authentication, parcel creation, status tracking, and role-based access control.
Setup Instructions

Clone the repository.
Install dependencies: npm install.
Create a .env file with:PORT=3000
DB_URL=mongodb://localhost:27017/parcel-delivery
NODE_ENV=development
BCRYPT_SALT_ROUND=10
JWT_ACCESS_SECRET=your_jwt_secret
JWT_ACCESS_EXPIRES=1h


Run the server: npm start.

Endpoints

POST /api/v1/auth/register: Register a new user (name, email, password, role).
POST /api/v1/auth/login: Login and get JWT token.
POST /api/v1/parcels: Create a new parcel (SENDER only).
PATCH /api/v1/parcels/cancel/:id: Cancel a parcel (SENDER only, status: REQUESTED).
PATCH /api/v1/parcels/confirm/:id: Confirm delivery (RECEIVER only, status: IN_TRANSIT).
PATCH /api/v1/parcels/status/:id: Update parcel status (ADMIN/SUPER_ADMIN only).
GET /api/v1/parcels/me: Get parcels for the authenticated user.
GET /api/v1/user/all-users: Get all users (ADMIN/SUPER_ADMIN only).
PATCH /api/v1/user/:id: Update user details (all roles, restricted fields for SENDER/RECEIVER).
PATCH /api/v1/parcels/block/:id: Block a parcel (ADMIN/SUPER_ADMIN only).
PATCH /api/v1/parcels/unblock/:id: Unblock a parcel (ADMIN/SUPER_ADMIN only).

Validation

Input validation using zod.
Role-based access control using checkAuth middleware.
Status transition validation (e.g., REQUESTED → APPROVED → DISPATCHED).
Blocked users and parcels cannot perform actions.

Testing

Use Postman to test all endpoints.
Ensure proper error handling and status codes (200, 201, 400, 401, 403).
Test cases:
Register and login with different roles.
Create, cancel, and confirm parcels.
Update parcel status and block/unblock users/parcels.



Project Structure
src/
├── app/
│   ├── config/
│   ├── modules/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── parcel/
│   ├── middlewares/
│   ├── utils/
│   ├── route.ts
│   ├── app.ts
│   ├── server.ts

Notes

Parcels have a unique tracking ID (format: TRK-YYYYMMDD-xxxxxx).
Status logs are embedded in the parcel document.
Fee calculation is based on a flat rate (customizable).
