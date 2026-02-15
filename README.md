# 🏛 Freemason International - Membership Organization Website

A complete, production-ready Next.js application for a Freemason membership organization with authentication, user management, and admin dashboard.

## ✨ Features

### 🎨 Brand & Design
- Elegant, minimalist design with Navy (#0B1C2D) and Royal Gold (#C6A646) color scheme
- Playfair Display headings and Lato body font
- Mobile-first responsive layout
- Smooth transitions and hover effects

### 📄 Pages
1. **Home Page** - Hero section with CTAs, benefits preview, exclusivity banner
2. **About Freemasonry** - History, core principles, FAQ
3. **Benefits of Joining** - Personal development, brotherhood, charity, learning
4. **Testimonials** - Member stories and impact statistics
5. **Membership Sign-up** - Complete application form with validation
6. **Login** - Secure authentication
7. **User Dashboard** - Profile view and membership status
8. **Admin Dashboard** - User management with filtering and CSV export
9. **Contact** - Contact form and information

### 🔐 Security Features
- JWT token authentication with HTTP-only cookies
- Bcrypt password hashing (10 rounds)
- Role-based access control (USER/ADMIN)
- Protected API routes with middleware
- Input validation and sanitization
- CSRF protection ready
- Email verification ready
- Activity logging (IP address, user agent)
- GDPR compliance structure

### 🗄️ Database
- MongoDB with Mongoose ODM
- User model with comprehensive fields
- Activity log model for tracking
- Indexed queries for performance

### 🛠️ Tech Stack
- **Frontend:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + bcryptjs
- **Fonts:** Google Fonts (Playfair Display, Lato)

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Git

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

The `.env.local` file has been created with default values. Update these for production:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/freemason

# JWT Secret (Change in production!)
JWT_SECRET=freemason-secret-key-change-in-production-2026

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Start MongoDB

If using local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas (cloud) and update the `MONGODB_URI` in `.env.local`.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Create Admin Account

To create an admin account, you need to:
1. Sign up normally through the website
2. Manually update the database to set `role: "ADMIN"` for your account

Using MongoDB shell:
```javascript
use freemason
db.users.updateOne(
  { email: "your-admin-email@example.com" },
  { $set: { role: "ADMIN" } }
)
```

## 📱 Usage

### For Users
1. Navigate to `/signup` to apply for membership
2. Fill out the complete application form
3. After submission, status will be "PENDING"
4. Login at `/login` after registration
5. View your dashboard at `/dashboard`

### For Admins
1. Login with admin credentials
2. Navigate to `/dashboard/admin`
3. View all user applications
4. Filter by country, status, or search
5. Approve/Reject/Delete applications
6. Export user data to CSV

## 🎯 Key Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Home page | Public |
| `/about` | About Freemasonry | Public |
| `/benefits` | Membership benefits | Public |
| `/testimonials` | Member testimonials | Public |
| `/contact` | Contact form | Public |
| `/signup` | Membership application | Public |
| `/login` | User login | Public |
| `/dashboard` | User dashboard | Protected (USER) |
| `/dashboard/admin` | Admin panel | Protected (ADMIN) |

## 🔒 Security Best Practices

### Before Production:
1. **Change JWT Secret** in `.env.local` to a strong random string
2. **Enable HTTPS** - SSL certificate required
3. **Set up rate limiting** on authentication endpoints
4. **Add CAPTCHA** to signup/login forms (Google reCAPTCHA v3)
5. **Configure CORS** properly
6. **Enable CSP headers** in `next.config.js`
7. **Regular security updates** - keep dependencies updated
8. **Database backups** - automated daily backups
9. **Email verification** - implement email confirmation
10. **2FA** - optional two-factor authentication

### Environment Variables (Production):
- Never commit `.env.local` to version control
- Use environment variables in your hosting platform
- Rotate JWT secret periodically

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Docker
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### Environment Setup on Vercel:
1. Add MongoDB URI
2. Add JWT Secret (generate strong secret)
3. Add SMTP credentials (if using email)
4. Set `NODE_ENV=production`

## 📊 Database Schema

### User Model
```typescript
{
  fullName: string
  email: string (unique, required)
  phone: string
  gender: string
  country: string
  city: string
  occupation: string
  passwordHash: string
  role: 'USER' | 'ADMIN'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Activity Log Model
```typescript
{
  userId: ObjectId
  action: string
  ipAddress: string
  userAgent: string
  createdAt: Date
}
```

## 🎨 Customization

### Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  navy: { DEFAULT: '#0B1C2D', light: '#1F2937' },
  gold: { DEFAULT: '#C6A646', light: '#D4B862', dark: '#A88A38' },
}
```

### Fonts
Edit `app/layout.tsx` to change Google Fonts.

### Content
All page content is in the respective `page.tsx` files under `app/` directory.

## 🧪 Testing

### Manual Testing Checklist:
- [ ] Sign up new user
- [ ] Login with credentials
- [ ] View user dashboard
- [ ] Login as admin
- [ ] Approve/reject applications
- [ ] Filter and search users
- [ ] Export CSV
- [ ] Logout functionality
- [ ] Mobile responsiveness
- [ ] Form validation

## 📝 API Endpoints

| Endpoint | Method | Description | Auth |
|----------|--------|-------------|------|
| `/api/auth/signup` | POST | Register new user | Public |
| `/api/auth/login` | POST | User login | Public |
| `/api/auth/logout` | POST | User logout | Protected |
| `/api/user/me` | GET | Get current user | Protected |
| `/api/admin/users` | GET | Get all users | Admin |
| `/api/admin/users/[id]` | PATCH | Update user status | Admin |
| `/api/admin/users/[id]` | DELETE | Delete user | Admin |

## 🤝 Contributing

This is a complete template ready for production use. Customize as needed.

## 📄 License

Proprietary - All rights reserved for Freemason International

## 🆘 Support

For questions or issues:
- Email: info@freemason-international.org
- Documentation: This README

## 🔮 Future Enhancements

- [ ] Email verification system
- [ ] Password reset functionality
- [ ] Two-factor authentication
- [ ] Blog/Articles section
- [ ] Event calendar
- [ ] Donation/payment integration
- [ ] Member-only learning portal
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Push notifications

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ⚡ Performance

- Optimized for Core Web Vitals
- Image optimization with Next.js Image
- Font optimization with Google Fonts
- Code splitting and lazy loading
- Static generation where possible

---

**Built with Next.js 15 & React 19 | Freemason International © 2026**
