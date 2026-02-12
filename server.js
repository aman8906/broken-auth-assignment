const express = require("express");
const cookieParser = require("cookie-parser");
const requestLogger = require("./middleware/logger");
const authMiddleware = require("./middleware/auth");
const { generateToken } = require("./utils/tokenGenerator");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage
const loginSessions = {};
const otpStore = {};

// Dummy user (for assignment purpose)
const dummyUser = {
  email: "amanch@gmail.com",
  password: "aman@321",
};

// Middleware
app.use(requestLogger);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    challenge: "Complete the Authentication Flow",
    instruction:
      "Complete the authentication flow and obtain a valid access token.",
  });
});


// =========================
// LOGIN - Generate OTP
// =========================
app.post("/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Validate credentials
    if (email !== dummyUser.email || password !== dummyUser.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const loginSessionId = Math.random().toString(36).substring(2);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    loginSessions[loginSessionId] = {
      email,
      createdAt: Date.now(),
      expiresAt: Date.now() + 2 * 60 * 1000, // 2 minutes
      isVerified: false,
    };

    otpStore[loginSessionId] = otp;

    console.log(`[OTP GENERATED] Session: ${loginSessionId} | OTP: ${otp}`);

    return res.status(200).json({
      message: "OTP sent",
      loginSessionId,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Login failed",
    });
  }
});


// =========================
// VERIFY OTP
// =========================
app.post("/auth/verify-otp", (req, res) => {
  try {
    const { loginSessionId, otp } = req.body;

    if (!loginSessionId || !otp) {
      return res.status(400).json({
        error: "loginSessionId and otp required",
      });
    }

    const session = loginSessions[loginSessionId];

    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    if (Date.now() > session.expiresAt) {
      delete loginSessions[loginSessionId];
      delete otpStore[loginSessionId];
      return res.status(401).json({ error: "Session expired" });
    }

    if (otpStore[loginSessionId] !== otp) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    // Mark session verified
    session.isVerified = true;

    delete otpStore[loginSessionId];

    return res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "OTP verification failed",
    });
  }
});


// =========================
// GENERATE ACCESS TOKEN
// =========================
app.post("/auth/token", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Valid session required",
      });
    }

    const sessionId = authHeader.split(" ")[1];
    const session = loginSessions[sessionId];

    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    if (!session.isVerified) {
      return res.status(403).json({ error: "OTP not verified" });
    }

    if (Date.now() > session.expiresAt) {
      delete loginSessions[sessionId];
      return res.status(401).json({ error: "Session expired" });
    }

    // Generate JWT using tokenGenerator
    const accessToken = await generateToken({
      email: session.email,
      sessionId,
    });

    // Prevent session reuse
    delete loginSessions[sessionId];

    return res.status(200).json({
      access_token: accessToken,
      expires_in: 900,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Token generation failed",
    });
  }
});


// =========================
// PROTECTED ROUTE
// =========================
app.get("/protected", authMiddleware, (req, res) => {
  return res.json({
    message: "Access granted",
    user: req.user,
    success_flag: `FLAG-${Buffer.from(
      req.user.email + "_COMPLETED_ASSIGNMENT"
    ).toString("base64")}`,
  });
});


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
