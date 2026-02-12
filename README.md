🔐 Broken Authentication Flow Assignment
📌 Overview

This project implements a complete multi-step authentication flow using:

Node.js

Express.js

JWT (JSON Web Tokens)

OTP-based verification

Middleware-based route protection

The objective of this assignment is to correctly complete and secure the authentication process to obtain access to a protected resource.

🚀 Features

✅ Email + Password Login

✅ OTP Generation & Verification

✅ Temporary Session Management

✅ JWT Access Token Generation

✅ Protected Route with Middleware

✅ Session Expiry Handling

✅ One-Time Session Usage

🏗 Project Structure
.
├── middleware/
│   ├── auth.js
│   └── logger.js
│
├── utils/
│   ├── mockDb.js
│   └── tokenGenerator.js
│
├── server.js
├── package.json
├── .env.example
├── .gitignore
└── README.md

⚙️ Setup Instructions
1️⃣ Clone Repository
git clone https://github.com/YOUR_USERNAME/broken-auth-assignment.git
cd broken-auth-assignment

2️⃣ Install Dependencies
npm install

3️⃣ Create Environment File

Create a .env file in root directory:

PORT=3000
JWT_SECRET=your_super_secure_jwt_secret
APPLICATION_SECRET=your_super_secure_application_secret


You can generate secrets using:

node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

4️⃣ Start Server
npm start


Server runs at:

http://localhost:3000

🔄 Authentication Flow
Step 1 — Login

POST /auth/login

{
  "email": "test@example.com",
  "password": "password123"
}


Response:

{
  "message": "OTP sent",
  "loginSessionId": "generated_session_id"
}

Step 2 — Verify OTP

Check server console for generated OTP.

POST /auth/verify-otp

{
  "loginSessionId": "generated_session_id",
  "otp": "123456"
}


Response:

{
  "message": "OTP verified successfully"
}

Step 3 — Generate Access Token

POST /auth/token

Headers:

Authorization: Bearer loginSessionId


Response:

{
  "access_token": "JWT_TOKEN",
  "expires_in": 900
}

Step 4 — Access Protected Route

GET /protected

Headers:

Authorization: Bearer access_token


Response:

{
  "message": "Access granted",
  "user": {...},
  "success_flag": "FLAG-..."
}

🔐 Security Implementation Details

Password validation against dummy user

OTP-based second factor authentication

Session expiration (2 minutes)

JWT expiration (15 minutes)

JWT verification via middleware

Session invalidation after token issuance

Secrets managed via environment variables

🛡 Middleware
auth.js

Validates JWT and attaches decoded payload to req.user.

logger.js

Logs request method, URL, response status, and execution time.

🧪 Testing

You can test using:

Postman

Thunder Client

cURL

📦 Technologies Used

Node.js

Express.js

JSON Web Token (jsonwebtoken)

dotenv

cookie-parser

👤 Dummy Test Credentials
Email: test@example.com
Password: password123

📄 Assignment Objective

Successfully complete the authentication flow and retrieve the success_flag from the protected endpoint.

📌 Notes
