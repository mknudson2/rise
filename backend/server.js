// backend/server.js - Complete RISE CMS Backend with User Persistence - FIXED
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// File paths for persistence
const CONTENT_FILE = path.join(__dirname, "content.json");
const USERS_FILE = path.join(__dirname, "users.json"); // NEW: Users persistence file

// ===== AUTHENTICATION SYSTEM WITH PERSISTENCE =====

// Users storage - will be loaded from file
let users = [];

let verificationCodes = new Map(); // Store verification codes temporarily

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { error: "Too many login attempts, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Default users structure
const getDefaultUsers = () => [
  {
    id: 1,
    email: "michaelknudsonphd@gmail.com",
    password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBedXHBrNaKj6y", // 'rise2024' hashed
    role: "super",
    name: "Michael Knudson",
    isActive: true,
    createdAt: new Date(),
    lastLogin: null,
  },
];

// Helper functions for user management
async function readUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, "utf8");
    const parsedUsers = JSON.parse(data);
    // Convert date strings back to Date objects
    return parsedUsers.map((user) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
    }));
  } catch (error) {
    console.log("Users file not found, creating with default users...");
    const defaultUsers = getDefaultUsers();
    await writeUsers(defaultUsers);
    return defaultUsers;
  }
}

async function writeUsers(usersData) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(usersData, null, 2));
    console.log("✅ Users saved successfully");
  } catch (error) {
    console.error("❌ Error saving users:", error);
    throw error;
  }
}

// Initialize users from file on startup
async function initializeUsers() {
  try {
    users = await readUsers();
    console.log(`👥 Loaded ${users.length} users from database`);
  } catch (error) {
    console.error("❌ Error loading users:", error);
    users = getDefaultUsers();
  }
}

// Email transporter setup
const createTransporter = () => {
  // Send real emails if EMAIL_USER is configured (both dev and production)
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    console.log("📧 Using real Gmail transport for email delivery");
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } else {
    // Fallback to console logging when email not configured
    console.log("⚠️  Email not configured - codes will appear in console only");
    console.log(
      "💡 To enable real emails, set EMAIL_USER and EMAIL_PASS in .env"
    );
    return {
      sendMail: async (options) => {
        console.log("\n🎯 ========== EMAIL VERIFICATION CODE ==========");
        console.log("📧 To:", options.to);
        console.log("📋 Subject:", options.subject);
        console.log(
          "🔑 VERIFICATION CODE:",
          options.html.match(/(\d{6})/)?.[1] || "N/A"
        );
        console.log("⏰ Use this code to log into the CMS");
        console.log("===============================================\n");
        return Promise.resolve({ messageId: "dev-" + Date.now() });
      },
    };
  }
};

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET || "rise-cms-fallback-secret-key",
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
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "rise-cms-fallback-secret-key"
    );
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

// Default content structure matching your website - YOUR EXISTING DATA
const getDefaultContent = () => ({
  hero: {
    title: "RISE",
    subtitle: "Empowering Recovery • Innovation • Science • Excellence",
    description:
      "Experience the future of stroke and SCI recovery. Our evidence-based, high-intensity training achieves in days what traditional methods take months to accomplish.",
    backgroundImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=800&fit=crop",
    rotatingWords: ["Recovery", "Innovation", "Science", "Excellence"],
    stats: [
      { label: "Revolutionary Results", value: "3-5 Days" },
      { label: "Lives Transformed", value: "500+" },
      { label: "Than Traditional Methods", value: "10x Faster" },
    ],
    buttons: [
      { text: "Start Your Journey", type: "primary", action: "consultation" },
      { text: "Discover RISE Method", type: "secondary", action: "general" },
    ],
  },
  scrollingWords: [
    "Empowering",
    "Invigorating",
    "Freedom",
    "Groundbreaking",
    "Inspiring",
    "Life-Changing",
    "Unmatched",
    "Your Spark",
    "Evidence-Based",
    "Bold",
    "Proven",
    "Effective",
    "Cutting-Edge",
    "A Fresh Start",
    "Strength",
    "Personalized",
    "Intuitive",
    "Accessible",
    "Reliable",
    "Authentic",
    "Transparent",
    "Limitless",
    "Unstoppable",
    "Transformational",
    "Your Reason",
    "Unconventional",
    "One-of-a-kind",
    "Creative",
    "Essential",
    "Priceless",
    "World-class",
    "Your 2nd Chance",
  ],
  successPathways: {
    title: "Success Pathways",
    survivor: {
      title: "…as a stroke / SCI survivor",
      image: "/assets/images/survivor.jpg",
      description:
        "Greatness is not a function of your situation. Greatness is largely a matter of choice and discipline. If you've had a Stroke or SCI and you're ready to achieve greatness, we're a click away from being your greatest resource.",
    },
    trainer: {
      title: "…as a trainer",
      image: "/assets/images/trainer.webp",
      description:
        "No exercise is better for the heart than reaching out and lifting others up. If you're a student or healthcare professional and interested in unlocking your skills while transforming people's lives, we're currently accepting applicants.",
    },
  },
  riseMethod: {
    title: "The RISE Method",
    subtitle:
      "Three pillars that make our approach to recovery uniquely effective and transformational",
    methods: [
      {
        title: "High-intensity Bootcamp",
        content:
          "The biggest obstacles you face are the ones you've placed on yourself. Let us help you tear them down so we can build you up to reclaim your life",
        icon: "⚡",
      },
      {
        title: "Personalized Training and Support",
        content:
          "We review, assess, and interview all RISE clients (and family members) to ensure we make the most out of every bootcamp. You and your goals are our biggest priority.",
        icon: "❤️",
      },
      {
        title: "Evidence-based with Grit Embraced",
        content:
          "Our methods were meticulously constructed to empower you in every possible way. We set you up for success before the bootcamp begins and provide support long after the bootcamp ends.",
        icon: "🧠",
      },
    ],
    stats: [
      { label: "Intensive Bootcamp Duration", value: "3-5 Days" },
      { label: "Evidence-Based Protocols", value: "100%" },
      { label: "Ongoing Support", value: "Lifetime" },
    ],
  },
  team: [
    {
      id: 1,
      name: "Phil Lamoreaux",
      title: "CIO - Chief Innovation Officer",
      subtitle: '"The OT Professor"',
      bio: "An Occupational Therapist and personal trainer with extensive experience in neuro-rehabilitation and high-intensity training methodologies. Phil has pioneered the evidence-based techniques that form the foundation of RISE's revolutionary approach to stroke and SCI recovery.",
      image: "/assets/images/Phil.webp",
      imageFallback: "/assets/images/Phil.PNG",
      alt: "Phil Lamoreaux, CIO and The OT Professor at RISE",
      specialties: [
        "Occupational Therapy",
        "High-Intensity Training",
        "Neuro-Rehabilitation",
      ],
      gradientFrom: "from-red-500",
      gradientTo: "to-orange-500",
    },
    {
      id: 2,
      name: "Jason Freed",
      title: "CSO - Chief Strategy Officer",
      subtitle: "Strategic Leadership",
      bio: "Brings strategic vision and operational excellence to RISE, ensuring our innovative training methods reach those who need them most. Jason focuses on scaling our impact while maintaining the personalized, high-quality care that defines the RISE experience.",
      image: "/assets/images/Jason.webp",
      imageFallback: "/assets/images/Jason.png",
      alt: "Jason Freed, CSO and Strategic Leader at RISE",
      specialties: ["Strategic Planning", "Operations", "Program Development"],
      gradientFrom: "from-yellow-500",
      gradientTo: "to-red-500",
    },
    {
      id: 3,
      name: "Claire Plunkett",
      title: "CXO - Chief Experience Officer",
      subtitle: "Client Experience Excellence",
      bio: "Dedicated to ensuring every client and family member receives exceptional care and support throughout their RISE journey. Claire oversees the holistic experience that makes RISE bootcamps transformational beyond just the physical training.",
      image: "/assets/images/claire.webp",
      imageFallback: "/assets/images/claire.png",
      alt: "Claire Plunkett, CXO and Client Experience Leader at RISE",
      specialties: [
        "Client Experience",
        "Family Support",
        "Program Coordination",
      ],
      gradientFrom: "from-purple-500",
      gradientTo: "to-yellow-500",
    },
  ],
  testimonials: [
    {
      id: 1,
      quote:
        "Absolutely. Compared to other certifications I've pursued, this was on another level. The small, intimate group setting allowed for extensive hands-on practice and observation. So much time was dedicated to both the patients and us as trainers. I gained a wealth of knowledge and practical skills that I can immediately apply, making it worth every penny.",
      author: "Bootcamp Trainee",
      type: "trainer",
    },
    {
      id: 2,
      quote:
        "Do it. It's an unparalleled experience. Seeing the difference we can make in such a short time is unlike anything I've encountered in six years of practice. This training is incredibly client-centered and adaptable to various environments. It also challenges us as therapists to grow, innovate, and offer the highest level of care.",
      author: "Bootcamp Trainee",
      type: "trainer",
    },
    {
      id: 3,
      quote:
        "Six months ago, I suffered a spinal cord injury that left me paralyzed from the waist down. My OT warned me this would be the toughest thing I'd done yet, and she was right. From the first session, I knew this was different. The workouts were intense, but the way the team encouraged me made all the difference. My walking speed doubled, and my confidence soared.",
      author: "Bootcamp Participant",
      type: "participant",
    },
    {
      id: 4,
      quote:
        "Before RISE, I didn't know what to expect for our son. The sessions were tough, but what stood out most was how the team pushed him beyond what he thought possible. The confidence and belief RISE gave him was game-changing. This bootcamp wasn't just another rehab program. It showed him what he was capable of.",
      author: "Father of Participant",
      type: "family",
    },
    {
      id: 5,
      quote:
        "When I started RISE Boot Camp, I didn't know what to expect. I thought, 'What can they really do with me? I have one bum leg and a hand that doesn't work right.' But from the start, I was pushed further than I thought possible. Now, I'm working on walking without my cane. This bootcamp gave me confidence and belief in myself.",
      author: "Bootcamp Participant",
      type: "participant",
    },
    {
      id: 6,
      quote:
        "This week has made all the tears, sleepless nights, and burnout so worth it. You lit something in me that I desperately needed—hope. You gave me the confidence to know my mom can get back on her feet and have a better quality of life. If you're questioning whether this is worth the investment, let me just say: this is about giving someone their life back. It's priceless.",
      author: "Daughter of Participant",
      type: "family",
    },
  ],
  faq: [
    {
      id: 1,
      question: "What exactly is high-intensity training (HIT)?",
      answer:
        "High-Intensity Training (HIT) in the context of stroke and SCI recovery refers to our evidence-based approach that maximizes neuroplasticity through intensive, task-specific exercises performed at higher intensities than traditional rehabilitation. Our protocols are designed to challenge the nervous system in ways that promote rapid neural adaptation and functional recovery. Unlike traditional therapy, our HIT focuses on pushing beyond comfort zones in a safe, supervised environment to achieve breakthrough results.",
    },
    {
      id: 2,
      question: "Is your training offered in-person or online?",
      answer:
        "RISE bootcamps are conducted in-person to ensure the highest quality of care and optimal results. Our intensive programs require hands-on guidance, real-time assessment, and the ability to safely progress participants through challenging exercises. We travel to various locations across the country to make our programs accessible. While we offer some educational resources and follow-up support online, the core bootcamp experience is exclusively in-person.",
    },
    {
      id: 3,
      question:
        "I've heard of HIIT (High-Intensity Interval Training). How is your High-Intensity Training (HIT) different?",
      answer:
        "Great question! While HIIT (High-Intensity Interval Training) focuses on cardiovascular fitness through alternating high and low intensity periods, our HIT (High-Intensity Training) is specifically designed for neurological recovery. Our approach targets neuroplasticity, motor learning, and functional restoration through task-specific, progressive exercises. We focus on intensity of effort and challenge rather than just cardiovascular intensity, with protocols specifically developed for stroke and SCI survivors.",
    },
    {
      id: 4,
      question:
        "How many days is a typical bootcamp and what would we do each day?",
      answer:
        "RISE bootcamps typically run 3-5 days, with each day involving 6-8 hours of intensive training. Each day includes: individualized assessment and goal setting, high-intensity functional exercises, task-specific training, strength and conditioning, balance and coordination work, and family education sessions. We also incorporate rest periods and nutritional guidance. The exact schedule is customized based on each participant's needs, goals, and capabilities.",
    },
    {
      id: 5,
      question: "How can I get ready for a RISE bootcamp?",
      answer:
        "Preparation begins with a comprehensive consultation where we assess your current abilities, medical history, and goals. We'll provide specific pre-bootcamp exercises and recommendations based on your individual needs. Generally, we recommend: maintaining your current activity level, staying hydrated, getting adequate sleep, and mentally preparing for an intensive but rewarding experience. We'll work with your healthcare team to ensure you're ready for the physical and mental challenges ahead.",
    },
    {
      id: 6,
      question: "Do I need any special, expensive equipment to do this?",
      answer:
        "No! One of the advantages of our approach is that we use readily available equipment and bodyweight exercises. We believe in functional training that translates to real-world activities. While we have specialized equipment available during bootcamps, our goal is to teach you techniques and exercises you can continue at home with minimal equipment. We focus on maximizing your body's potential rather than relying on expensive machines.",
    },
    {
      id: 7,
      question: "What kind of support is provided AFTER a RISE bootcamp?",
      answer:
        "Our commitment doesn't end when the bootcamp does. Post-bootcamp support includes: a detailed home exercise program, ongoing check-ins and progress monitoring, access to our online community and resources, follow-up consultations, and referrals to qualified local therapists when needed. We also offer refresher sessions and advanced programs for continued growth. Our goal is to set you up for long-term success and continued improvement.",
    },
    {
      id: 8,
      question:
        "I'm experiencing significant mobility challenges after my stroke. Can your program help me regain my ability to walk?",
      answer:
        "Many of our participants have experienced significant improvements in mobility, including regaining the ability of walk. However, every stroke is different, and we can't guarantee specific outcomes. What we can promise is that our evidence-based approach maximizes your potential for recovery. During your consultation, we'll honestly assess your situation and discuss realistic goals. Many participants achieve mobility improvements they thought were impossible, but we base our approach on your individual potential.",
    },
    {
      id: 9,
      question: "How can I learn more about RISE bootcamps?",
      answer:
        "The best way to learn more is to schedule a free consultation with our team. We'll discuss your specific situation, answer your questions, and determine if RISE is right for you. You can also explore our success stories, read testimonials from past participants, and review our methodology on this website. We're always happy to connect you with graduates of our program who can share their experiences.",
    },
    {
      id: 10,
      question: "What is the investment for a RISE bootcamp?",
      answer:
        "Investment varies based on the specific program, duration, and individual needs. We believe in transparent pricing and will provide detailed cost information during your consultation. We understand this is a significant investment, but consider the value of regaining independence, function, and quality of life. We also discuss payment options and can provide documentation for insurance reimbursement where applicable. The investment in your recovery is one of the most important decisions you can make.",
    },
    {
      id: 11,
      question: "This sounds too good to be true! What's the catch?",
      answer:
        "We understand the skepticism - the results do sound remarkable! The 'catch' is that this requires intense effort, commitment, and stepping outside your comfort zone. Our methods are demanding both physically and mentally. Not everyone is ready for or willing to embrace the intensity required. However, for those who are committed to pushing their limits, the results speak for themselves. We're transparent about our methods, which are all evidence-based and published in peer-reviewed research.",
    },
    {
      id: 12,
      question:
        "I'm a Therapist/clinician, do you offer CEUs as part of attending a bootcamp?",
      answer:
        "Yes! We offer continuing education credits for healthcare professionals who attend our training programs. Our bootcamps provide an excellent opportunity for therapists to learn our evidence-based protocols while earning CEUs. You'll gain hands-on experience with our methods, learn to implement high-intensity training safely, and see firsthand how these techniques transform patient outcomes. Contact us for specific CEU information and requirements.",
    },
    {
      id: 13,
      question: "How do I know if this type of training is right for me?",
      answer:
        "The best candidates for RISE training are individuals who: are committed to pushing beyond their current limitations, are willing to embrace intensive training, have medical clearance for increased activity, and are motivated to achieve significant functional improvements. During your consultation, we'll assess your readiness, discuss your goals, and determine if our approach aligns with your needs and capabilities. We're honest about who will benefit most from our programs.",
    },
    {
      id: 14,
      question:
        "What if I have other health conditions that complicate my ability to participate?",
      answer:
        "We work with participants who have various health conditions beyond stroke or SCI. During your consultation, we'll review all your health conditions with your medical team to ensure safety. Our protocols can often be modified to accommodate other conditions while still maintaining the intensity needed for optimal results. Safety is our top priority, and we won't proceed unless we're confident we can help you safely achieve your goals.",
    },
    {
      id: 15,
      question: "Do you accept insurance?",
      answer:
        "We accept private pay only. We do not accept any type of insurance at this time.",
    },
  ],
  contact: {
    title: "Ready to Transform Your Life with RISE?",
    subtitle:
      "Take the first step toward recovery or professional development. Our team is here to help you achieve what you thought was impossible.",
    contactInfo: [
      { icon: "phone", label: "Phone", value: "Contact for phone number" },
      { icon: "email", label: "Email", value: "info@risechangeslives.com" },
      { icon: "location", label: "Location", value: "Multiple locations" },
    ],
    emergencyNotice:
      "Medical Emergency: If you are experiencing a medical emergency, please call 911 or go to your nearest emergency room immediately.",
  },
  message: "Content loaded from RISE CMS API",
});

// Helper functions for content management
async function readContent() {
  try {
    const data = await fs.readFile(CONTENT_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.log("Content file not found, creating with default content...");
    const defaultContent = getDefaultContent();
    await writeContent(defaultContent);
    return defaultContent;
  }
}

async function writeContent(content) {
  try {
    await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2));
    console.log("✅ Content saved successfully");
  } catch (error) {
    console.error("❌ Error saving content:", error);
    throw error;
  }
}

// ===== API ROUTES =====

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    message: "RISE CMS Backend is running!",
  });
});

// ===== AUTHENTICATION ROUTES =====

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

    // SAVE USERS to persist the lastLogin update
    await writeUsers(users);

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

// POST /api/auth/logout - Logout user
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

// POST /api/auth/users - Create new user (super admin only) - FIXED WITH PERSISTENCE
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

      // Generate new ID (find highest existing ID and add 1)
      const maxId = users.length > 0 ? Math.max(...users.map((u) => u.id)) : 0;

      // Create user
      const newUser = {
        id: maxId + 1,
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        role,
        isActive: true,
        createdAt: new Date(),
        lastLogin: null,
      };

      users.push(newUser);

      // SAVE USERS to persist the new user
      await writeUsers(users);

      console.log(`✅ New user created: ${email} (${role})`);

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

// PUT /api/auth/users/:id - Update user (super admin only) - FIXED WITH PERSISTENCE
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

      // SAVE USERS to persist the updates
      await writeUsers(users);

      console.log(`✅ User updated: ${user.email}`);

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

// DELETE /api/auth/users/:id - Delete user (super admin only) - FIXED WITH PERSISTENCE
app.delete(
  "/api/auth/users/:id",
  verifyToken,
  requireSuperAdmin,
  async (req, res) => {
    try {
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

      const deletedUser = users[userIndex];
      users.splice(userIndex, 1);

      // SAVE USERS to persist the deletion
      await writeUsers(users);

      console.log(`✅ User deleted: ${deletedUser.email}`);

      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  }
);

// ===== CONTENT ROUTES =====

// GET /api/content - Fetch all content
app.get("/api/content", async (req, res) => {
  try {
    const content = await readContent();
    res.json(content);
  } catch (error) {
    console.error("Error reading content:", error);
    res.status(500).json({ error: "Failed to read content" });
  }
});

// GET /api/content/:section - Fetch specific section
app.get("/api/content/:section", async (req, res) => {
  try {
    const content = await readContent();
    const section = content[req.params.section];

    if (!section) {
      return res.status(404).json({ error: "Section not found" });
    }

    res.json(section);
  } catch (error) {
    console.error("Error reading section:", error);
    res.status(500).json({ error: "Failed to read section" });
  }
});

// PUT /api/content - Update all content (protected with JWT)
app.put("/api/content", verifyToken, async (req, res) => {
  try {
    await writeContent(req.body);
    res.json({
      message: "Content updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({ error: "Failed to update content" });
  }
});

// PUT /api/content/:section - Update specific section (protected with JWT)
app.put("/api/content/:section", verifyToken, async (req, res) => {
  try {
    const content = await readContent();
    content[req.params.section] = req.body;
    await writeContent(content);
    res.json({
      message: "Section updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error updating section:", error);
    res.status(500).json({ error: "Failed to update section" });
  }
});

// POST /api/upload - Handle image uploads (protected with JWT)
app.post("/api/upload", verifyToken, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large" });
    }
  }

  console.error("Unhandled error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Initialize and start server
const startServer = async () => {
  // Initialize users from file
  await initializeUsers();

  app.listen(PORT, () => {
    console.log(`🚀 RISE CMS Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API: http://localhost:${PORT}/api/content`);
    console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
    console.log(`🔧 Environment: ${process.env.NODE_ENV}`);
    console.log(`💾 Content file: ${CONTENT_FILE}`);
    console.log(`👥 Users file: ${USERS_FILE}`);
    console.log(`\n👤 DEFAULT ADMIN ACCOUNT:`);
    console.log(`   📧 Email: michaelknudsonphd@gmail.com`);
    console.log(`   🔑 Password: rise2024`);
    console.log(`\n🎯 EMAIL CONFIGURATION:`);
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      console.log(`   📧 Real emails enabled for: ${process.env.EMAIL_USER}`);
    } else {
      console.log(`   📧 Email codes will appear in this console`);
      console.log(
        `   🔧 Set EMAIL_USER and EMAIL_PASS in .env for real emails`
      );
    }
  });
};

// Start the server
startServer().catch(console.error);

module.exports = app;
