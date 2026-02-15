# 🚀 Quick Start Guide - Freemason International

## Step-by-Step Setup

### 1. ✅ Install Dependencies (if not done)
```bash
npm install
```

### 2. 🗄️ Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB from https://www.mongodb.com/try/download/community
# Start MongoDB service
mongod
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get your connection string
5. Update `MONGODB_URI` in `.env.local`

### 3. 🔐 Configure Environment Variables

Open `.env.local` and update:
```env
MONGODB_URI=mongodb://localhost:27017/freemason
# OR use MongoDB Atlas connection string:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freemason

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: Email configuration for future features
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 4. 🎯 Run Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

### 5. 👤 Create Your First User

1. Navigate to http://localhost:3000/signup
2. Fill out the membership application form
3. Submit the application

### 6. 🔧 Create Admin Account

**Method 1: Using MongoDB Compass (GUI)**
1. Download and install MongoDB Compass
2. Connect to your database
3. Navigate to `freemason` database → `users` collection
4. Find your user by email
5. Edit the document and change `role` from `"USER"` to `"ADMIN"`

**Method 2: Using MongoDB Shell**
```bash
# Connect to MongoDB
mongosh

# Switch to freemason database
use freemason

# Update user role to ADMIN
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "ADMIN" } }
)

# Verify the change
db.users.findOne({ email: "your-email@example.com" })
```

**Method 3: Using Node.js Script**
Create a file `scripts/make-admin.js`:
```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/freemason')
  .then(async () => {
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      role: String
    }));
    
    const email = 'your-email@example.com';
    await User.updateOne({ email }, { role: 'ADMIN' });
    console.log(`Updated ${email} to ADMIN`);
    process.exit(0);
  });
```

Run: `node scripts/make-admin.js`

### 7. 🎉 Access Admin Dashboard

1. Login at http://localhost:3000/login
2. After login, navigate to http://localhost:3000/dashboard/admin
3. Manage user applications!

## ✨ Features Tour

### For Regular Users
- **Sign Up**: Create account at `/signup`
- **Login**: Access account at `/login`
- **Dashboard**: View status at `/dashboard`
- **Profile**: See application details
- **Status Tracking**: PENDING → APPROVED/REJECTED

### For Admins
- **User Management**: View all applications
- **Approve/Reject**: Change user status
- **Filtering**: Filter by country, status
- **Search**: Search by name or email
- **Export**: Download CSV of all users
- **Delete**: Remove users if needed

## 📱 Page Overview

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with hero and CTAs |
| About | `/about` | Freemasonry history and principles |
| Benefits | `/benefits` | Membership benefits |
| Testimonials | `/testimonials` | Member stories |
| Contact | `/contact` | Contact form |
| Sign Up | `/signup` | Membership application |
| Login | `/login` | User authentication |
| User Dashboard | `/dashboard` | Member profile and status |
| Admin Dashboard | `/dashboard/admin` | User management panel |
| Privacy Policy | `/privacy` | Privacy information |
| Terms of Service | `/terms` | Terms and conditions |
| GDPR Notice | `/gdpr` | GDPR compliance info |

## 🔒 Default Test Accounts

After setting up, you can create test accounts:

**Regular User**
- Navigate to `/signup`
- Fill form and submit
- Login with credentials
- View dashboard

**Admin User**
- Create account via signup
- Promote to admin using MongoDB
- Login and access `/dashboard/admin`

## 🛠️ Common Commands

```bash
# Development
npm run dev          # Start dev server (localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Check code quality
```

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env.local`
- For Atlas: Check IP whitelist and credentials

### "Unauthorized" when accessing dashboard
- Clear browser cookies
- Try logging in again
- Check if JWT_SECRET is set in `.env.local`

### "Module not found" errors
- Run `npm install` again
- Delete `node_modules` and `.next` folders
- Run `npm install` fresh

### Port 3000 already in use
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Change port (in package.json)
"dev": "next dev -p 3001"
```

## 📊 Sample Data

To test the admin dashboard, create multiple test users:
1. Use different emails
2. Fill different countries
3. This will populate the admin dashboard with filterable data

## 🎨 Customization Quick Tips

**Change Colors**: Edit `tailwind.config.ts`
**Change Logo**: Update the `⚒` symbol in components
**Change Content**: Edit respective `page.tsx` files
**Add Pages**: Create new folder in `app/` directory

## 🚢 Ready for Production?

Before deploying:
- [ ] Change JWT_SECRET to random string
- [ ] Set up MongoDB Atlas (cloud database)
- [ ] Add SSL certificate (HTTPS)
- [ ] Configure domain name
- [ ] Set up email service (optional)
- [ ] Add Google reCAPTCHA (optional)
- [ ] Test all features thoroughly

## 📚 Additional Resources

- Next.js Docs: https://nextjs.org/docs
- MongoDB Docs: https://docs.mongodb.com
- Tailwind CSS: https://tailwindcss.com/docs
- Deployment: Vercel, Netlify, or DigitalOcean

---

**Need Help?** Check the full README.md for detailed information.

**Enjoy building with Freemason International! 🏛️**
