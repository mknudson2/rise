// backend/auth.js - Authentication System
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

// In-memory storage (in production, use a database)
let users = [
  {
    id: 1,
    email: "your-email@example.com", // Change this to your email
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBedXHBrNaKj6y", // 'rise2024' hashed
    role: "super",
    name: "Super Admin",
    isActive: true,
    createdAt: new Date(),
    lastLogin: null,
  },
];

let verificationCodes = new Map(); // Store verification codes temporarily

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: "Too many login attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Email transporter setup (configure with your email service)
const createTransporter = () => {
  // For development, use Ethereal (fake SMTP)
  // In production, use your actual email service (Gmail, SendGrid, etc.)
  return nodemailer.createTransporter({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "ethereal.user@ethereal.email", // Replace with your email config
      pass: "ethereal.pass", // Replace with your email config
    },
  });

  // Gmail example (uncomment and configure):
  // return nodemailer.createTransporter({
  //   service: 'gmail',
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS
  //   }
  // });
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

// Generate verification code
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send verification email
const sendVerificationEmail = async (email, code, name) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: "RISE CMS <noreply@risechangeslives.com>",
      to: email,
      subject: "RISE CMS - Login Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #ef4444, #facc15); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">RISE CMS</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333;">Hello ${name},</h2>
            <p style="color: #666; line-height: 1.6;">
              Someone attempted to log in to the RISE Content Management System using your email address.
            </p>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="margin: 0; color: #666;">Your verification code is:</p>
              <h1 style="margin: 10px 0; color: #ef4444; font-size: 32px; letter-spacing: 4px;">${code}</h1>
              <p style="margin: 0; color: #666; font-size: 14px;">This code expires in 10 minutes</p>
            </div>
            <p style="color: #666; line-height: 1.6;">
              If you did not attempt to log in, please ignore this email.
            </p>
            <p style="color: #666; line-height: 1.6;">
              For security reasons, never share this code with anyone.
            </p>
          </div>
          <div style="padding: 20px; text-align: center; background: #333; color: white;">
            <p style="margin: 0; font-size: 14px;">RISE Changes Lives - Content Management System</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Access token required" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

// Middleware to check if user is super admin
const requireSuperAdmin = (req, res, next) => {
  if (req.user.role !== "super") {
    return res.status(403).json({ error: "Super admin access required" });
  }
  next();
};

// Auth routes
const setupAuthRoutes = (app) => {
  // POST /api/auth/login - Step 1: Request verification code
  app.post("/api/auth/login", authLimiter, async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Find user
      const user = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.isActive
      );

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Generate verification code
      const code = generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store verification code
      verificationCodes.set(email.toLowerCase(), {
        code,
        expiresAt,
        userId: user.id,
        attempts: 0,
      });

      // Send email
      const emailSent = await sendVerificationEmail(email, code, user.name);

      if (!emailSent) {
        return res
          .status(500)
          .json({ error: "Failed to send verification email" });
      }

      res.json({
        message: "Verification code sent to your email",
        email: email.toLowerCase(),
        expiresIn: 600, // 10 minutes in seconds
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // POST /api/auth/verify - Step 2: Verify code and complete login
  app.post("/api/auth/verify", authLimiter, async (req, res) => {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return res
          .status(400)
          .json({ error: "Email and verification code are required" });
      }

      const verification = verificationCodes.get(email.toLowerCase());

      if (!verification) {
        return res
          .status(401)
          .json({ error: "No verification code found or code expired" });
      }

      // Check if code expired
      if (new Date() > verification.expiresAt) {
        verificationCodes.delete(email.toLowerCase());
        return res.status(401).json({ error: "Verification code expired" });
      }

      // Check attempts
      if (verification.attempts >= 3) {
        verificationCodes.delete(email.toLowerCase());
        return res.status(401).json({ error: "Too many failed attempts" });
      }

      // Verify code
      if (verification.code !== code) {
        verification.attempts++;
        return res.status(401).json({ error: "Invalid verification code" });
      }

      // Find user and update last login
      const user = users.find((u) => u.id === verification.userId);
      if (!user || !user.isActive) {
        return res.status(401).json({ error: "User not found or deactivated" });
      }

      user.lastLogin = new Date();

      // Clean up verification code
      verificationCodes.delete(email.toLowerCase());

      // Generate JWT token
      const token = generateToken(user);

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          lastLogin: user.lastLogin,
        },
      });
    } catch (error) {
      console.error("Verification error:", error);
      res.status(500).json({ error: "Verification failed" });
    }
  });

  // GET /api/auth/me - Get current user info
  app.get("/api/auth/me", verifyToken, (req, res) => {
    const user = users.find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      lastLogin: user.lastLogin,
    });
  });

  // POST /api/auth/logout - Logout user (client-side token removal)
  app.post("/api/auth/logout", verifyToken, (req, res) => {
    res.json({ message: "Logged out successfully" });
  });

  // GET /api/auth/users - Get all users (super admin only)
  app.get("/api/auth/users", verifyToken, requireSuperAdmin, (req, res) => {
    const userList = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      isActive: u.isActive,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
    }));

    res.json(userList);
  });

  // POST /api/auth/users - Create new user (super admin only)
  app.post(
    "/api/auth/users",
    verifyToken,
    requireSuperAdmin,
    async (req, res) => {
      try {
        const { email, name, role, password } = req.body;

        if (!email || !name || !role || !password) {
          return res.status(400).json({ error: "All fields are required" });
        }

        if (!["admin", "super"].includes(role)) {
          return res.status(400).json({ error: "Invalid role" });
        }

        // Check if user already exists
        if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
          return res
            .status(400)
            .json({ error: "User with this email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const newUser = {
          id: users.length + 1,
          email: email.toLowerCase(),
          password: hashedPassword,
          name,
          role,
          isActive: true,
          createdAt: new Date(),
          lastLogin: null,
        };

        users.push(newUser);

        res.status(201).json({
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          isActive: newUser.isActive,
          createdAt: newUser.createdAt,
        });
      } catch (error) {
        console.error("Create user error:", error);
        res.status(500).json({ error: "Failed to create user" });
      }
    }
  );

  // PUT /api/auth/users/:id - Update user (super admin only)
  app.put(
    "/api/auth/users/:id",
    verifyToken,
    requireSuperAdmin,
    async (req, res) => {
      try {
        const userId = parseInt(req.params.id);
        const { name, role, isActive, password } = req.body;

        const user = users.find((u) => u.id === userId);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Update fields
        if (name) user.name = name;
        if (role && ["admin", "super"].includes(role)) user.role = role;
        if (typeof isActive === "boolean") user.isActive = isActive;
        if (password) {
          user.password = await bcrypt.hash(password, 12);
        }

        res.json({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin,
        });
      } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ error: "Failed to update user" });
      }
    }
  );

  // DELETE /api/auth/users/:id - Delete user (super admin only)
  app.delete(
    "/api/auth/users/:id",
    verifyToken,
    requireSuperAdmin,
    (req, res) => {
      const userId = parseInt(req.params.id);
      const userIndex = users.findIndex((u) => u.id === userId);

      if (userIndex === -1) {
        return res.status(404).json({ error: "User not found" });
      }

      // Prevent deleting yourself
      if (userId === req.user.id) {
        return res
          .status(400)
          .json({ error: "Cannot delete your own account" });
      }

      users.splice(userIndex, 1);
      res.json({ message: "User deleted successfully" });
    }
  );
};

module.exports = {
  setupAuthRoutes,
  verifyToken,
  requireSuperAdmin,
  users, // Export for testing (remove in production)
};
