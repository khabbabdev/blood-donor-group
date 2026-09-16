# 🩸 রক্তদান — Blood Donor Group

<div align="center">

![Banner](https://img.shields.io/badge/Blood%20Donor%20Group-Life%20Saving%20Platform-red?style=for-the-badge&logo=heart&logoColor=white)

**একটি সম্পূর্ণ ব্লাড ডোনার ম্যানেজমেন্ট ওয়েব অ্যাপ্লিকেশন, MERN Stack দিয়ে তৈরি**

[![MERN Stack](https://img.shields.io/badge/MERN-Stack-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/mern-stack)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[🇧🇩 বাংলায় পড়ুন](#বাংলা-ডকুমেন্টেশন) • [📖 English Documentation](#english-documentation) • [🚀 Live Demo](#live-demo) • [📦 Deployment](#deployment)

</div>

---

## 📋 내용물 (Table of Contents)

- [বাংলা ডকুমেন্টেশন](#বাংলা-ডকুমেন্টেশন)
- [English Documentation](#english-documentation)
- [🎯 Features / ویژگیসমূহ](#features--বৈশিষ্ট্য)
- [🛠️ Tech Stack / প্রযুক্তি স্ট্যাক](#tech-stack--প্রযুক্তি-স্ট্যাক)
- [📁 Project Structure / প্রজেক্ট কাঠামো](#project-structure--প্রজেক্ট-কাঠামো)
- [🚀 Getting Started / শুরু করা](#getting-started--শুরু-করা)
- [📡 API Endpoints / API এন্ডপয়েন্ট](#api-endpoints--api-এন্ডপয়েন্ট)
- [👥 User Roles / ব্যবহারকারীর ভূমিকা](#user-roles--ব্যবহারকারীর-ভূমিকা)
- [🔐 Authentication & Security / প্রমাণীকরণ ও নিরাপত্তা](#authentication--security--প্রমাণীকরণ-ও-নিরাপত্তা)
- [🚀 Deployment / ডিপ্লয়মেন্ট](#deployment--ডিপ্লয়মেন্ট)
- [🤝 Contributing / অবদান রাখা](#contributing--অবদান-রাখা)
- [📄 License / লাইসেন্স](#license--লাইসেন্স)

---

## বাংলা ডকুমেন্টেশন

### 🎯 প্রধান বৈশিষ্ট্য (Features)

| বৈশিষ্ট্য | বিবরণ |
|----------|--------|
| **🔍 ডোনার অনুসন্ধান** | রক্তের গ্রুপ, জেলা, উপজেলা অনুযায়ী দ্রুত ডোনার খুঁজুন |
| **📝 রেজিস্ট্রেশন** | ডোনার, ভলান্টিয়ার এবং অ্যাডমিন হিসেবে রেজিস্ট্রেশন |
| **🩸 রক্তের আবেদন** | জরুরি রক্তের আবেদন জানান ও ট্র্যাক করুন |
| **👤 প্রোফাইল ম্যানেজমেন্ট** | আভাতার আপলোড, প্রোফাইল আপডেট, পাসওয়ার্ড পরিবর্তন |
| **📊 ড্যাশবোর্ড** | 역할-ভিত্তিক ড্যাশবোর্ড (ডোনার, ভলান্টিয়ার, অ্যাডমিন) |
| **📈 পরিসংখ্যান** | রক্তের গ্রুপ অনুযায়ী ডোনার সংখ্যা, সক্রিয় ডোনার ইত্যাদি |
| **🔔 নোটিফিকেশন** | ইমেইল এবং ইন-অ্যাপ নোটিফিকেশন |
| **🌙 ডার্ক মোড** | লাইট/ডার্ক থিম টগল সহ পূর্ণ রেসপন্সিভ UI |
| **📱 PWA सपোর্ট** | প্রগ্রেসিভ ওয়েব অ্যাপ - অফলাইন ক্যাশিং, ইনস্টলেবল |
| **🌐 i18n** | বাংলা ও ইংরেজি ভাষা সাপোর্ট |

### 🎭 ব্যবহারকারীর ভূমিকা (User Roles)

| ভূমিকা | বর্ণনা | অনুমোদন প্রক্রিয়া | মূল অনুমতি |
|--------|---------|------------------|-------------|
| **🩸 ডোনার** | রক্তদাতা | স্বয়ংক্রিয় (Auto-approved) | প্রোফাইল ম্যানেজ, রক্তের আবেদন দেখুন, দান ইতিহাস |
| **🤝 ভলান্টিয়ার** | স্বেচ্ছাসেবক | অ্যাডমিন অনুমোদন প্রয়োজন | ডোনারönetনা, আবেদন অ্যাসাইন, ডোনার যোগ/সংশোধন |
| **👑 অ্যাডমিন** | প্রশাসক | সুপার অ্যাডমিন অনুমোদন প্রয়োজন | সম্পূর্ণ সিস্টেম নিয়ন্ত্রণ, ব্যবহারকারী ব্যবস্থাপনা, রিপোর্ট |

---

## English Documentation

### 🎯 Features

| Feature | Description |
|---------|-------------|
| **🔍 Donor Search** | Find donors instantly by blood group, district, and upazila |
| **📝 Registration** | Register as Donor, Volunteer, or Admin |
| **🩸 Blood Requests** | Submit and track urgent blood requests |
| **👤 Profile Management** | Avatar upload, profile updates, password change |
| **📊 Role-based Dashboards** | Separate dashboards for Donors, Volunteers, Admins |
| **📈 Statistics** | Blood group-wise donor counts, active donors, donations |
| **🔔 Notifications** | Email and in-app notifications |
| **🌙 Dark Mode** | Full responsive UI with light/dark theme toggle |
| **📱 PWA Support** | Progressive Web App - offline caching, installable |
| **🌐 i18n** | Bengali and English language support |

### 🎭 User Roles

| Role | Description | Approval Process | Key Permissions |
|------|-------------|------------------|-----------------|
| **🩸 Donor** | Blood donor | Auto-approved | Profile mgmt, view requests, donation history |
| **🤝 Volunteer** | Community volunteer | Admin approval required | Donor mgmt, assign requests, add/edit donors |
| **👑 Admin** | System administrator | Super admin approval required | Full system control, user mgmt, reports |

---

## 🛠️ Tech Stack / প্রযুক্তি স্ট্যাক

### Frontend (Client)
```
React 18.3.1          → UI Library
Vite 5.4              → Build Tool & Dev Server
TailwindCSS 3.4       → Utility-first CSS Framework
Framer Motion 11      → Animations & Transitions
React Router DOM 6.28 → Client-side Routing
Axios 1.7             → HTTP Client
React Hook Form 7.53  → Form Validation
React Hot Toast 2.4   → Toast Notifications
React Icons 5.3       → Icon Library
React CountUp 6.5     → Animated Counters
```

### Backend (Server)
```
Node.js               → Runtime Environment
Express.js 4.19       → Web Framework
MongoDB + Mongoose 8.3 → Database & ODM
JWT (jsonwebtoken)    → Authentication
bcryptjs              → Password Hashing
Cloudinary 2.0        → Image Upload & Management
Nodemailer 6.9        → Email Service
Multer 1.4            → File Upload Handling
Helmet 7.1            → Security Headers
CORS 2.8              → Cross-Origin Resource Sharing
Morgan 1.10           → HTTP Request Logger
Compression 1.8       → Response Compression
Express Rate Limit 7.2 → Rate Limiting
Express Validator 7.0 → Input Validation
```

### DevOps & Deployment
```
Vercel                → Hosting (Frontend + Backend)
MongoDB Atlas         → Cloud Database
Cloudinary            → Media Storage
GitHub Actions        → CI/CD (Optional)
```

---

## 📁 Project Structure / প্রজেক্ট কাঠামো

```
blood-donor-group/
├── 📁 client/                    # React Frontend (Vite + Tailwind)
│   ├── 📁 public/                # Static Assets
│   │   ├── 📁 icons/             # PWA Icons (192x192, 512x512, maskable)
│   │   ├── manifest.json         # PWA Manifest
│   │   └── sw.js                 # Service Worker
│   ├── 📁 src/
│   │   ├── 📁 components/        # Reusable UI Components
│   │   │   ├── 📁 layout/        # Layout Components (Navbar, Footer, MainLayout)
│   │   │   └── 📁 common/        # Common Components (StatCard, LoadingSpinner, Modals, etc.)
│   │   ├── 📁 pages/             # Page Components
│   │   │   ├── 📁 dashboard/     # Role-based Dashboards
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── DonorDashboard.jsx
│   │   │   │   └── 📁 volunteer/ # Volunteer specific pages
│   │   │   ├── Home.jsx          # Landing Page
│   │   │   ├── DonorList.jsx     # Donor Search & List
│   │   │   ├── Login.jsx         # Login Page
│   │   │   ├── Register.jsx      # Registration Page
│   │   │   ├── ProfileUpdate.jsx # Profile Management
│   │   │   ├── Contact.jsx       # Contact Page
│   │   │   ├── About.jsx         # About Page
│   │   │   └── ...
│   │   ├── 📁 context/           # React Context Providers
│   │   │   ├── AuthContext.jsx   # Authentication State
│   │   │   └── ThemeContext.jsx  # Theme (Light/Dark) State
│   │   ├── 📁 services/          # API Services
│   │   │   └── api.js            # Axios Instance & API Calls
│   │   ├── 📁 routes/            # Route Guards
│   │   │   └── ProtectedRoute.jsx
│   │   ├── 📁 utils/             # Utility Functions & Constants
│   │   │   ├── constants.js      # Blood Groups, Districts, etc.
│   │   │   └── registerSW.js     # Service Worker Registration
│   │   ├── App.jsx               # Root Component
│   │   ├── main.jsx              # Entry Point
│   │   └── index.css             # Global Styles (Tailwind)
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── 📁 server/                    # Express Backend
│   ├── 📁 config/
│   │   └── db.js                 # MongoDB Connection
│   ├── 📁 controllers/           # Route Handlers (Business Logic)
│   │   ├── authController.js     # Authentication
│   │   ├── donorController.js    # Donor Management
│   │   ├── bloodRequestController.js # Blood Requests
│   │   ├── adminController.js    # Admin Operations
│   │   ├── contactController.js  # Contact Form
│   │   ├── donationController.js # Donation History
│   │   └── uploadController.js   # File Uploads
│   ├── 📁 middleware/            # Custom Middleware
│   │   ├── auth.js               # JWT Authentication
│   │   ├── roleCheck.js          # Role-based Access Control
│   │   ├── validator.js          # Input Validation
│   │   ├── upload.js             # Multer File Upload Config
│   │   ├── rateLimiter.js        # API Rate Limiting
│   │   └── errorHandler.js       # Global Error Handling
│   ├── 📁 models/                # Mongoose Models
│   │   ├── User.js               # User Schema (Donor/Volunteer/Admin)
│   │   ├── Donor.js              # Donor Profile Schema
│   │   ├── BloodRequest.js       # Blood Request Schema
│   │   ├── DonationHistory.js    # Donation Records
│   │   └── Contact.js            # Contact Form Schema
│   ├── 📁 routes/                # API Route Definitions
│   │   ├── authRoutes.js
│   │   ├── donorRoutes.js
│   │   ├── bloodRequestRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── donationRoutes.js
│   │   └── uploadRoutes.js
│   ├── 📁 utils/                 # Utility Functions
│   │   ├── sendEmail.js          # Email Service (Nodemailer)
│   │   └── generateToken.js      # JWT Token Generation
│   ├── server.js                 # Express App Entry Point
│   ├── createAdmin.js            # Admin User Creation Script
│   ├── package.json
│   ├── .env                      # Environment Variables (Local)
│   └── .env.example              # Environment Template
│
├── 📄 vercel.json                # Vercel Deployment Config
├── 📄 package.json               # Root Package (Monorepo Scripts)
├── 📄 README.md                  # This File
└── 📄 .gitignore
```

---

## 🚀 Getting Started / শুরু করা

### ✅ Prerequisites / পূর্বশর্ত

- **Node.js** v18.x or higher
- **MongoDB** (Local or MongoDB Atlas)
- **npm** or **yarn** or **pnpm**
- **Git**

### 📥 Installation / ইনস্টলেশন

```bash
# ১. রেপোজিটরি ক্লোন করুন
git clone https://github.com/your-username/blood-donor-group.git
cd blood-donor-group

# ২. সার্ভার ডিপেন্ডেন্সি ইনস্টল করুন
cd server
npm install

# ৩. ক্লায়েন্ট ডিপেন্ডেন্সি ইনস্টল করুন
cd ../client
npm install

# ৪. এনভায়রনমেন্ট কনফিগার করুন
cd ../server
cp .env.example .env
# .env ফাইলটি এডিট করে আপনার MongoDB URI এবং অন্যান্য সেটিংস দিন
```

### ⚙️ Environment Variables / পরিবেশ পরিবর্তী

```env
# Server (.env)
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/blood-donor-group
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=30d

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_NAME=Blood Donor Group
ADMIN_EMAIL=admin@yourdomain.com

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### ▶️ Running Development Servers / ডেভেলপমেন্ট সার্ভার চালানো

```bash
# টার্মিনাল ১: ব্যাকএন্ড চালান
cd server
npm run dev
# Server runs on http://localhost:5000

# টার্মিনাল ২: ফ্রন্টএন্ড চালান (নতুন টার্মিনাল খুলুন)
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### 🌐 Access Points / অ্যাক্সেস পয়েন্ট

| Service | URL |
|---------|-----|
| **Frontend (Development)** | http://localhost:5173 |
| **Backend API** | http://localhost:5000 |
| **API Health Check** | http://localhost:5000/api/health |
| **API Documentation** | See [API Endpoints](#api-endpoints--api-এন্ডপয়েন্ট) |

---

## 📡 API Endpoints / API এন্ডপয়েন্ট

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/register` | নতুন ব্যবহারকারী রেজিস্ট্রেশন | Public |
| `POST` | `/login` | লগইন | Public |
| `GET` | `/me` | বর্তমান ব্যবহারকারীর তথ্য | Private |
| `PUT` | `/profile` | প্রোফাইল আপডেট | Private |
| `PUT` | `/password` | পাসওয়ার্ড পরিবর্তন | Private |
| `POST` | `/forgot-password` | পাসওয়ার্ড রিসেট ইমেইল | Public |
| `PUT` | `/reset-password/:token` | পাসওয়ার্ড রিসেট | Public |

### 🩸 Donors (`/api/donors`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/` | ডোনার তালিকা (ফিল্টার, পেজিনেশন) | Private |
| `GET` | `/stats` | পরিসংখ্যান (গ্রুপ অনুযায়ী সংখ্যা) | Private |
| `GET` | `/:id` | নির্দিষ্ট ডোনার বিস্তারিত | Private |
| `PUT` | `/:id` | ডোনার তথ্য আপডেট | Volunteer/Admin |
| `DELETE` | `/:id` | ডোনার মুছুন | Admin |

### 🩸 Blood Requests (`/api/blood-requests`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/` | নতুন রক্তের আবেদন | Private (Donor/Volunteer) |
| `GET` | `/` | আবেদন তালিকা (ফিল্টারসহ) | Private |
| `GET` | `/:id` | নির্দিষ্ট আবেদন বিস্তারিত | Private |
| `PUT` | `/:id` | আবেদন আপডেট (স্ট্যাটস, অ্যাসাইন) | Volunteer/Admin |
| `DELETE` | `/:id` | আবেদন বাতিল | Owner/Admin |

### 👑 Admin (`/api/admin`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/stats` | ড্যাশবোর্ড পরিসংখ্যান | Admin |
| `GET` | `/users` | সব ব্যবহারকারী তালিকা | Admin |
| `PUT` | `/users/:id/approve` | ব্যবহারকারী অনুমোদন/বাতিল | Admin |
| `PUT` | `/users/:id/role` | ভূমিকা পরিবর্তন | Admin |
| `DELETE` | `/users/:id` | ব্যবহারকারী মুছুন | Admin |
| `GET` | `/requests` | সব রক্তের আবেদন | Admin |

### 📞 Contact (`/api/contact`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/` | যোগাযোগ ফর্ম জমা দিন | Public |
| `GET` | `/` | সব মেসেজ দেখুন | Admin |

### 📤 Upload (`/api/upload`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/avatar` | আভাতার আপলোড (Cloudinary) | Private |

---

## 🔐 Authentication & Security / প্রমাণীকরণ ও নিরাপত্তা

### JWT Token Flow
```
1. User Login/Register → Server validates credentials
2. Server generates JWT (payload: {id, role}, secret: JWT_SECRET)
3. Token sent to client → Stored in localStorage
4. Client sends token in Authorization header: "Bearer <token>"
5. Server middleware verifies token → Attaches user to request
6. Role-based middleware checks permissions
```

### Security Features
- ✅ **Helmet.js** - Security headers (CSP, XSS protection, etc.)
- ✅ **Rate Limiting** - 100 requests per 15 minutes per IP
- ✅ **CORS** - Configured allowed origins
- ✅ **Input Validation** - express-validator on all routes
- ✅ **Password Hashing** - bcryptjs with salt rounds 12
- ✅ **JWT Expiration** - Configurable (default 30 days)
- ✅ **Password Reset Tokens** - Crypto secure, 10-min expiry
- ✅ **File Upload Security** - Multer with type/size validation

---

## 🚀 Deployment / ডিপ্লয়মেন্ট

### 📦 Vercel Deployment (Recommended)

#### 1. Prepare for Production
```bash
# Build the client
cd client
npm run build

# Test production build locally
cd ../server
NODE_ENV=production npm start
```

#### 2. Deploy to Vercel
1. **Push to GitHub/GitLab/Bitbucket**
2. **Import in Vercel:** [vercel.com/new](https://vercel.com/new)
3. **Select Repository** → Root directory selected automatically
4. **Vercel auto-detects** `vercel.json` and builds accordingly

#### 3. Set Environment Variables in Vercel Dashboard
Go to **Project Settings → Environment Variables** and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production |
| `MONGODB_URI` | MongoDB Atlas connection string | Production |
| `JWT_SECRET` | Secure 32+ character secret | Production |
| `JWT_EXPIRE` | `30d` | Production |
| `CLIENT_URL` | `https://your-app.vercel.app` | Production |
| `ADMIN_EMAIL` | Admin notification email | Production |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | Production |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | Production |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | Production |
| `SMTP_HOST` | `smtp.gmail.com` | Production |
| `SMTP_PORT` | `587` | Production |
| `SMTP_USER` | Your SMTP username | Production |
| `SMTP_PASS` | Your SMTP password/app password | Production |
| `FROM_NAME` | `Blood Donor Group` | Production |

#### 4. Deploy!
Vercel automatically:
1. Builds client (`npm run build` in `client/`)
2. Installs server dependencies
3. Starts server with `node server/server.js`

#### 5. Post-Deploy
- Note your deployment URL (e.g., `https://blood-donor-group.vercel.app`)
- Update `CLIENT_URL` env var with this URL
- Redeploy if needed

### ⚠️ Important Production Notes
- **Use MongoDB Atlas** (Vercel cannot connect to localhost MongoDB)
- **Real Cloudinary credentials required** for image uploads
- **Real SMTP credentials required** for emails
- Add `?appName=Cluster0` to MongoDB URI for Atlas
- Ensure `JWT_SECRET` is 32+ characters in production

### 🐳 Docker Deployment (Alternative)
```dockerfile
# Dockerfile (create in root)
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN cd client && npm ci && npm run build
EXPOSE 5000
CMD ["node", "server/server.js"]
```

---

## 🤝 Contributing / অবদান রাখা

আমরা কমিউনিটি অবদানকে স্বাগত জানাই! অবদান রাখার জন্য:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow existing code style (ESLint + Prettier)
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all checks pass before PR

### Code Style
```bash
# Run linting (if configured)
npm run lint

# Format code
npm run format
```

---

## 📄 License / লাইসেন্স

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

এই প্রজেক্ট **MIT লাইসেন্স**-এর অধীনে প্রকাশিত। বিস্তারিতের জন্য [LICENSE](LICENSE) ফাইলটি দেখুন।

---

## 🙏 Acknowledgments / স্বীকৃতি

- **MongoDB** - Database
- **Vercel** - Hosting Platform
- **Cloudinary** - Image Management
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Icons** - Icon Library
- **All Contributors** - Thank you!

---

## 📞 Support / সমর্থন

- **Issues:** [GitHub Issues](https://github.com/your-username/blood-donor-group/issues)
- **Discussions:** [GitHub Discussions](https://github.com/your-username/blood-donor-group/discussions)
- **Email:** support@blooddonorgroup.com

---

<div align="center">

**Made with ❤️ for saving lives**

*রক্ত দিন, জীবন বাঁচান — একসাথে মানবতার সেবায়*

[⬆ Back to Top](#-রক্তদান---blood-donor-group)

</div>