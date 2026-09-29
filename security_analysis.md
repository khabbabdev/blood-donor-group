# 🔒 Blood Donor Group — সিকিউরিটি এনালাইসিস রিপোর্ট

**তারিখ:** ২৫ সেপ্টেম্বর ২০২৬  
**বিশ্লেষিত ফাইল সংখ্যা:** ৩০+  
**প্রজেক্ট টাইপ:** Full-stack MERN (MongoDB, Express, React, Node.js)

---

## 📊 সামগ্রিক সিকিউরিটি স্কোর

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     সিকিউরিটি স্কোর:  ██████████░░░░░░░░░  55/100        ║
║                                                           ║
║     রেটিং: ⚠️ মাঝারি (Moderate)                           ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

| ক্যাটাগরি | স্কোর | স্ট্যাটাস |
|---|---|---|
| 🔐 Authentication & Authorization | 7/10 | ✅ ভালো |
| 🗄️ Database Security | 6/10 | ⚠️ মাঝারি |
| 🌐 API & Network Security | 6/10 | ⚠️ মাঝারি |
| 📂 ফাইল আপলোড সিকিউরিটি | 6/10 | ⚠️ মাঝারি |
| 🔑 Secrets & Credential Management | 2/10 | 🔴 ক্রিটিক্যাল |
| 🛡️ Input Validation | 6/10 | ⚠️ মাঝারি |
| 📧 Email Security | 4/10 | ⚠️ দুর্বল |
| 🖥️ Client-Side Security | 5/10 | ⚠️ মাঝারি |
| 📝 Error Handling & Logging | 7/10 | ✅ ভালো |
| ⚡ Rate Limiting & DoS Protection | 6/10 | ⚠️ মাঝারি |

---

## 🔴 ক্রিটিক্যাল ইস্যু (এখনই ঠিক করতে হবে)

### ১. 🚨 `.env` ফাইলে হার্ডকোডেড রিয়েল সিক্রেটস (Severity: CRITICAL)

> [!CAUTION]
> এটি সবচেয়ে গুরুতর সমস্যা। `.env` ফাইলে রিয়েল MongoDB URI, JWT Secret, এবং SMTP পাসওয়ার্ড হার্ডকোড করা আছে।

**ফাইল:** [.env](file:///c:/Users/WIN-10/Desktop/blood-donor-group/server/.env)

```
MONGODB_URI=mongodb+srv://blood-donate-management:JyKib6zL6uuKcZdV@cluster0...
JWT_SECRET=blood_donor_group_super_secret_jwt_key_2024
SMTP_PASS=eljl lpmh xahd whem
```

**সমস্যা:**
- MongoDB পাসওয়ার্ড প্লেইনটেক্সটে আছে (`JyKib6zL6uuKcZdV`)
- JWT Secret অত্যন্ত সহজে অনুমানযোগ্য (`blood_donor_group_super_secret_jwt_key_2024`)
- SMTP App Password এক্সপোজড
- `.env` ফাইলটি Git-এ ট্র্যাক হচ্ছে না (ভালো), কিন্তু যে কেউ সার্ভারে অ্যাক্সেস পেলে সব দেখতে পাবে

**সমাধান:**
```bash
# JWT Secret জেনারেট করুন:
openssl rand -base64 64

# MongoDB পাসওয়ার্ড পরিবর্তন করুন Atlas Dashboard থেকে
# SMTP App Password রিজেনারেট করুন
```

---

### ২. 🚨 Password Reset Token রেসপন্সে এক্সপোজ হচ্ছে (Severity: CRITICAL)

> [!CAUTION]
> `forgotPassword` এন্ডপয়েন্টে `resetToken` এবং `resetUrl` সরাসরি API রেসপন্সে পাঠানো হচ্ছে।

**ফাইল:** [authController.js:281-288](file:///c:/Users/WIN-10/Desktop/blood-donor-group/server/controllers/authController.js#L281-L288)

```javascript
return res.status(200).json({
  success: true,
  message: '...',
  resetToken,    // ❌ Reset token API response-এ!
  resetUrl       // ❌ পুরো URL সহ!
});
```

**ঝুঁকি:** যেকোনো আক্রমণকারী এই এন্ডপয়েন্ট কল করে যেকোনো ইউজারের পাসওয়ার্ড রিসেট করতে পারবে — ইমেইল অ্যাক্সেস ছাড়াই।

**সমাধান:** Production-এ কখনও `resetToken` বা `resetUrl` রেসপন্সে পাঠানো যাবে না। শুধু development-এ console.log করুন।

---

### ৩. 🚨 অ্যাডমিন অ্যাকাউন্টে হার্ডকোডেড দুর্বল পাসওয়ার্ড (Severity: CRITICAL)

**ফাইল:** [createAdmin.js:12-13](file:///c:/Users/WIN-10/Desktop/blood-donor-group/server/createAdmin.js#L12-L13)

```javascript
const adminEmail = 'admin@gmail.com';
const adminPassword = 'adminpassword123';  // ❌ সরাসরি কোডে!
```

**ঝুঁকি:** যেকোনো ব্যক্তি GitHub-এ কোড দেখে অ্যাডমিন হিসেবে লগইন করতে পারবে।

**সমাধান:** Environment variable থেকে পড়ুন অথবা CLI argument হিসেবে নিন:
```javascript
const adminEmail = process.env.ADMIN_EMAIL || args[0];
const adminPassword = process.env.ADMIN_PASSWORD || args[1];
```

---

## 🟠 উচ্চ ঝুঁকিপূর্ণ ইস্যু (দ্রুত ঠিক করুন)

### ৪. NoSQL Injection ভালনারেবিলিটি (Severity: HIGH)

> [!WARNING]
> `adminController.js` এবং `donorController.js`-এ ইউজার ইনপুট সরাসরি `new RegExp()` এ ব্যবহার হচ্ছে — যা RegExp Injection-এর সুযোগ দেয়।

**ফাইল:** [adminController.js:16](file:///c:/Users/WIN-10/Desktop/blood-donor-group/server/controllers/adminController.js#L16)

```javascript
{ name: new RegExp(search, 'i') },   // ❌ Unescaped user input
{ email: new RegExp(search, 'i') }   // ❌ ReDoS attack সম্ভব
```

**ফাইল:** [donorController.js:20-29](file:///c:/Users/WIN-10/Desktop/blood-donor-group/server/controllers/donorController.js#L20-L29)

```javascript
{ 'address.district': new RegExp(district, 'i') },  // ❌
{ name: new RegExp(search, 'i') },                   // ❌
```

**সমাধান:**
```javascript
// RegExp special characters escape করুন:
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
{ name: new RegExp(escapeRegex(search), 'i') }
```

---

### ৫. Mass Assignment / Prototype Pollution ঝুঁকি (Severity: HIGH)

**ফাইল:** [bloodRequestController.js:11](file:///c:/Users/WIN-10/Desktop/blood-donor-group/server/controllers/bloodRequestController.js#L11)

```javascript
const request = await BloodRequest.create(req.body);  // ❌ পুরো req.body!
```

**ঝুঁকি:** আক্রমণকারী `status: "completed"`, `assignedDonor: "..."` ইত্যাদি ফিল্ড ইনজেক্ট করতে পারবে।

**সমাধান:**
```javascript
const { patientName, bloodGroup, hospital, contactNumber, urgency, unitsNeeded, notes } = req.body;
const request = await BloodRequest.create({
  requesterId: req.user.id,
  patientName, bloodGroup, hospital, contactNumber, urgency, unitsNeeded, notes
});
```

---

### ৬. CORS কনফিগারেশনে Production-এ সব Origin গ্রহণ (Severity: HIGH)

**ফাইল:** [server.js:49](file:///c:/Users/WIN-10/Desktop/blood-donor-group/server/server.js#L49)

```javascript
if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'production') {
  return callback(null, true);  // ❌ Production-এ সব origin অনুমোদিত!
}
```

**ঝুঁকি:** Production-এ যেকোনো ওয়েবসাইট থেকে API কল করা যাবে — CSRF আক্রমণের জন্য উন্মুক্ত।

**সমাধান:** Production-এ নির্দিষ্ট origin-ই অনুমোদন করুন:
```javascript
origin: (origin, callback) => {
  if (!origin || allowedOrigins.includes(origin)) {
    return callback(null, true);
  }
  return callback(new Error('Not allowed by CORS'));
}
```

---

### ৭. `updateProfile`-এ Role Escalation সম্ভাবনা (Severity: HIGH)

**ফাইল:** [authController.js:147-163](file:///c:/Users/WIN-10/Desktop/blood-donor-group/server/controllers/authController.js#L147-L163)

```javascript
const { name, email, phone, avatar, address, ... } = req.body;
// ❌ role, isApproved, isActive ফিল্ড ফিল্টার করা হয়নি!
```

**ঝুঁকি:** যদিও শুধু নির্দিষ্ট ফিল্ড destructure করা হয়েছে, কিন্তু `req.body`-তে `role: "admin"` পাঠালে MongoDB-তে সরাসরি যেতে পারে যদি ভবিষ্যতে কোড পরিবর্তন হয়।

> [!NOTE]
> বর্তমানে destructuring ব্যবহার হওয়ায় এটি partially safe, তবে explicit deny-list বা allow-list ব্যবহার করা উচিত।

---

### ৮. JWT Token-এ দীর্ঘ Expiration (Severity: MEDIUM-HIGH)

**ফাইল:** [.env:5](file:///c:/Users/WIN-10/Desktop/blood-donor-group/server/.env#L5)

```
JWT_EXPIRE=30d  // ❌ ৩০ দিনের টোকেন!
```

**ঝুঁকি:** টোকেন চুরি হলে ৩০ দিন ধরে অ্যাক্সেস থাকবে। Refresh token মেকানিজম নেই।

**সমাধান:**
- Access token: `15m` থেকে `1h`
- Refresh token আলাদাভাবে ইমপ্লিমেন্ট করুন
- Token blacklisting/revocation সিস্টেম যোগ করুন

---

## 🟡 মাঝারি ঝুঁকিপূর্ণ ইস্যু

### ৯. Contact Form-এ XSS ভালনারেবিলিটি (Severity: MEDIUM)

**ফাইল:** [contactController.js:39](file:///c:/Users/WIN-10/Desktop/blood-donor-group/server/controllers/contactController.js#L39)

```javascript
<p style="...">${message.replace(/\\n/g, '<br/>')}</p>
// ❌ HTML injection — user message সরাসরি HTML-এ!
```

**ঝুঁকি:** আক্রমণকারী contact form-এ `<script>` ট্যাগ পাঠালে অ্যাডমিনের ইমেইলে XSS চালাতে পারবে।

**সমাধান:** HTML entities escape করুন:
```javascript
const escapeHtml = (str) => str.replace(/[&<>"']/g, (m) => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"
}[m]));
```

---

### ১০. `express.json()` Body Size Limit নেই (Severity: MEDIUM)

**ফাইল:** [server.js:30](file:///c:/Users/WIN-10/Desktop/blood-donor-group/server/server.js#L30)

```javascript
app.use(express.json());  // ❌ কোনো size limit নেই
```

**ঝুঁকি:** আক্রমণকারী অত্যন্ত বড় JSON body পাঠিয়ে সার্ভার ক্র্যাশ করতে পারবে (DoS)।

**সমাধান:**
```javascript
app.use(express.json({ limit: '10kb' }));
```

---

### ১১. Login-এ Account Enumeration (Severity: MEDIUM)

**ফাইল:** [authController.js:235-237](file:///c:/Users/WIN-10/Desktop/blood-donor-group/server/controllers/authController.js#L235-L237)

```javascript
// forgotPassword endpoint:
if (!user) {
  return next(new ErrorResponse('এই ইমেইল ঠিকানায় কোনো অ্যাকাউন্ট পাওয়া যায়নি', 404));
  // ❌ আক্রমণকারী জানবে কোন ইমেইল রেজিস্টার্ড
}
```

**সমাধান:** সবসময় একই মেসেজ দিন:
```javascript
res.json({ message: 'যদি এই ইমেইলে কোনো অ্যাকাউন্ট থাকে, তাহলে রিসেট লিংক পাঠানো হয়েছে' });
```

---

### ১২. Rate Limiting লগইন-নির্দিষ্ট নেই (Severity: MEDIUM)

**ফাইল:** [rateLimiter.js](file:///c:/Users/WIN-10/Desktop/blood-donor-group/server/middleware/rateLimiter.js)

```javascript
max: isProduction ? 200 : 100  // সব route-এর জন্য একই limit
```

**ঝুঁকি:** ১৫ মিনিটে ২০০টি লগইন attempt — Brute-force attack সহজ।

**সমাধান:**
```javascript
// Login-এর জন্য আলাদা strict limiter:
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // ১৫ মিনিটে মাত্র ৫টি attempt
  message: 'অনেক বেশি লগইন চেষ্টা। ১৫ মিনিট পরে আবার চেষ্টা করুন।'
});
```

---

### ১৩. `upload.js` MIME Type Spoofing (Severity: MEDIUM)

**ফাইল:** [upload.js:9-11](file:///c:/Users/WIN-10/Desktop/blood-donor-group/server/middleware/upload.js#L9-L11)

```javascript
const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
const mimetype = allowedExtensions.test(file.mimetype);
// ❌ MIME type client-side থেকে আসে, spoof করা সম্ভব
```

**সমাধান:** `file-type` package দিয়ে ফাইলের magic bytes চেক করুন:
```javascript
const { fileTypeFromBuffer } = require('file-type');
const type = await fileTypeFromBuffer(req.file.buffer);
```

---

### ১৪. Base64 Avatar সরাসরি MongoDB-তে সংরক্ষণ (Severity: MEDIUM)

**ফাইল:** [uploadController.js:55-56](file:///c:/Users/WIN-10/Desktop/blood-donor-group/server/controllers/uploadController.js#L55-L56)

```javascript
const base64Image = req.file.buffer.toString('base64');
imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
// ❌ 5MB ইমেজ = ~6.67MB base64 string MongoDB-তে!
```

**ঝুঁকি:** Database bloat, slow queries, এবং সম্ভাব্য DoS।

---

## ✅ যা ভালো আছে (Strengths)

| # | বিষয় | মূল্যায়ন |
|---|---|---|
| ✅ 1 | **bcrypt দিয়ে পাসওয়ার্ড হ্যাশিং** — Salt rounds 12, যথেষ্ট শক্তিশালী | 🟢 চমৎকার |
| ✅ 2 | **Helmet.js ব্যবহার** — Security headers সেট করা হচ্ছে | 🟢 ভালো |
| ✅ 3 | **JWT-based Authentication** — Stateless, scalable | 🟢 ভালো |
| ✅ 4 | **Role-based Authorization** — Admin, Volunteer, Donor আলাদা | 🟢 ভালো |
| ✅ 5 | **Input Validation** — `express-validator` ব্যবহার হচ্ছে | 🟢 ভালো |
| ✅ 6 | **Rate Limiting** — `express-rate-limit` সক্রিয় | 🟢 ভালো |
| ✅ 7 | **Admin Registration Block** — Direct admin registration বন্ধ | 🟢 ভালো |
| ✅ 8 | **Password field `select: false`** — Query-তে password আসে না | 🟢 চমৎকার |
| ✅ 9 | **Reset Token Hashing** — SHA-256 দিয়ে হ্যাশ করা হচ্ছে | 🟢 ভালো |
| ✅ 10 | **Error Handler** — Stack trace production-এ লুকানো | 🟢 ভালো |
| ✅ 11 | **`.gitignore`-এ `.env`** — Secrets Git-এ ট্র্যাক হচ্ছে না | 🟢 ভালো |
| ✅ 12 | **Account Status Check** — `isActive` ও `isApproved` চেক হচ্ছে | 🟢 ভালো |
| ✅ 13 | **File Upload Size Limit** — 5MB max limit আছে | 🟢 ভালো |
| ✅ 14 | **Compression** — Response compression সক্রিয় | 🟢 ভালো |

---

## 📋 অগ্রাধিকার ভিত্তিক কর্ম পরিকল্পনা

### 🔴 Phase 1: এখনই (Critical — ১-২ দিনের মধ্যে)

| # | কাজ | ফাইল |
|---|---|---|
| 1 | JWT Secret শক্তিশালী করুন (64+ char random) | `.env` |
| 2 | MongoDB পাসওয়ার্ড পরিবর্তন করুন | MongoDB Atlas |
| 3 | SMTP App Password রিজেনারেট করুন | Google Account |
| 4 | `forgotPassword` থেকে `resetToken` response থেকে সরান | `authController.js` |
| 5 | `createAdmin.js` থেকে হার্ডকোডেড credential সরান | `createAdmin.js` |
| 6 | Production CORS ঠিক করুন — wildcard origin বন্ধ | `server.js` |

### 🟠 Phase 2: এই সপ্তাহে (High Priority)

| # | কাজ | ফাইল |
|---|---|---|
| 7 | RegExp Injection ফিক্স করুন | `adminController.js`, `donorController.js` |
| 8 | `BloodRequest.create(req.body)` — Mass Assignment ফিক্স | `bloodRequestController.js` |
| 9 | Login-এ আলাদা strict rate limiter যোগ | `rateLimiter.js`, `authRoutes.js` |
| 10 | `express.json({ limit: '10kb' })` সেট করুন | `server.js` |

### 🟡 Phase 3: পরবর্তী ১-২ সপ্তাহে (Medium Priority)

| # | কাজ |
|---|---|
| 11 | Refresh Token মেকানিজম ইমপ্লিমেন্ট করুন |
| 12 | Account Enumeration ফিক্স করুন |
| 13 | Contact form-এ HTML sanitization যোগ করুন |
| 14 | File upload-এ magic bytes validation যোগ করুন |
| 15 | HTTPS enforcement যোগ করুন |
| 16 | CSP (Content Security Policy) কনফিগার করুন |
| 17 | `npm audit` চালিয়ে dependency vulnerability ফিক্স করুন |

---

## 🏗️ আর্কিটেকচারাল সিকিউরিটি সাজেশন

```mermaid
graph TD
    A["Client Request"] --> B["WAF / CDN<br/>(Cloudflare)"]
    B --> C["Rate Limiter<br/>(Login: 5/15min)"]
    C --> D["Helmet + CORS"]
    D --> E["Input Validation<br/>(express-validator)"]
    E --> F["JWT Auth Middleware"]
    F --> G["Role Check"]
    G --> H["Controller Logic"]
    H --> I["MongoDB<br/>(Encrypted)"]
    
    style A fill:#f9f,stroke:#333
    style B fill:#ff9,stroke:#333
    style C fill:#ff9,stroke:#333
    style D fill:#9f9,stroke:#333
    style E fill:#9f9,stroke:#333
    style F fill:#9f9,stroke:#333
    style G fill:#9f9,stroke:#333
    style H fill:#9ff,stroke:#333
    style I fill:#99f,stroke:#333
```

---

## 🔍 সারসংক্ষেপ

| মেট্রিক | মান |
|---|---|
| **মোট ইস্যু পাওয়া গেছে** | ১৪টি |
| **ক্রিটিক্যাল** | ৩টি 🔴 |
| **হাই** | ৫টি 🟠 |
| **মিডিয়াম** | ৬টি 🟡 |
| **ভালো দিক** | ১৪টি ✅ |

> [!IMPORTANT]
> আপনার প্রজেক্টের বেসিক সিকিউরিটি ফাউন্ডেশন ভালো — bcrypt, Helmet, JWT, RBAC, rate limiting সব আছে। কিন্তু **৩টি ক্রিটিক্যাল ইস্যু** (বিশেষত `.env`-এর দুর্বল সিক্রেটস এবং reset token লিক) এখনই ঠিক করতে হবে। Phase 1 সম্পন্ন করলে আপনার স্কোর **55 → 75+** হয়ে যাবে। সব Phase সম্পন্ন করলে **85-90** স্কোরে পৌঁছাবে।
