# 🚀 Deployment Guide - Freemason International

## Deployment Options

This guide covers deployment to various platforms. Choose the one that best fits your needs.

---

## 1. 🌐 Vercel (Recommended - Easiest)

Vercel is built by the creators of Next.js and offers the easiest deployment.

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/freemason.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Sign up/Login
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Click "Deploy"

3. **Environment Variables in Vercel**
   Add these in Project Settings → Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/freemason
   JWT_SECRET=your-super-secret-production-key-min-32-chars
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

4. **Custom Domain (Optional)**
   - Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

---

## 2. 🦈 Netlify

### Steps:

1. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

2. **Environment Variables**
   Same as Vercel (add in Site Settings → Build & Deploy)

3. **Deploy**
   - Connect GitHub repository
   - Configure build settings
   - Deploy

---

## 3. 🐳 Docker Deployment

### Dockerfile
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/freemason
      - JWT_SECRET=your-secret-key
    depends_on:
      - mongo

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### Deploy with Docker
```bash
docker-compose up -d
```

---

## 4. ☁️ AWS (EC2 + MongoDB Atlas)

### Prerequisites:
- AWS Account
- MongoDB Atlas account

### Steps:

1. **Launch EC2 Instance**
   - AMI: Ubuntu Server 22.04 LTS
   - Instance Type: t2.micro (for testing) or t2.medium (production)
   - Security Group: Allow ports 22, 80, 443

2. **Connect to EC2**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

3. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

5. **Clone and Setup**
   ```bash
   git clone https://github.com/yourusername/freemason.git
   cd freemason
   npm install
   ```

6. **Environment Variables**
   ```bash
   nano .env.local
   # Add your production variables
   ```

7. **Build and Start**
   ```bash
   npm run build
   pm2 start npm --name "freemason" -- start
   pm2 startup
   pm2 save
   ```

8. **Setup Nginx (Optional)**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/freemason
   ```

   Nginx config:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **Enable SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

## 5. 🌊 DigitalOcean App Platform

### Steps:

1. Create account at digitalocean.com
2. Click "Create" → "Apps"
3. Connect GitHub repository
4. Configure:
   - Build Command: `npm run build`
   - Run Command: `npm start`
5. Add environment variables
6. Choose plan ($5/month minimum)
7. Deploy

---

## Pre-Deployment Checklist

### ✅ Security
- [ ] Change JWT_SECRET to a strong random string (32+ characters)
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas with strong password
- [ ] Enable IP whitelist on MongoDB Atlas
- [ ] Configure CORS properly
- [ ] Add rate limiting to API routes
- [ ] Enable HTTPS/SSL certificate

### ✅ Database
- [ ] Set up MongoDB Atlas (or managed MongoDB)
- [ ] Configure database backups
- [ ] Create database indexes
- [ ] Test database connection

### ✅ Environment Variables
```bash
# Production .env.local
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/freemason
JWT_SECRET=your-production-secret-min-32-characters-random
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# Optional
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@your-domain.com
SMTP_PASS=your-app-password
```

### ✅ Performance
- [ ] Enable Next.js image optimization
- [ ] Configure CDN (Vercel/Cloudflare)
- [ ] Optimize fonts and images
- [ ] Enable gzip compression
- [ ] Set up caching headers

### ✅ Monitoring
- [ ] Set up error logging (Sentry)
- [ ] Configure uptime monitoring
- [ ] Enable analytics (Google Analytics/Plausible)
- [ ] Set up database monitoring

### ✅ Testing
- [ ] Test all pages load correctly
- [ ] Test signup/login flow
- [ ] Test admin dashboard
- [ ] Test on mobile devices
- [ ] Test in different browsers
- [ ] Load testing

---

## MongoDB Atlas Setup

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (free tier available)
4. Database Access → Add User
5. Network Access → Add IP Address (0.0.0.0/0 for all, or specific IPs)
6. Get connection string
7. Update MONGODB_URI in environment variables

---

## Domain Configuration

### Option 1: Use Vercel/Netlify Domain
- Free subdomain: `your-app.vercel.app`

### Option 2: Custom Domain
1. Buy domain from Namecheap, GoDaddy, etc.
2. Configure DNS:
   - For Vercel: Add CNAME record
   - For EC2: Add A record to IP
3. Update NEXT_PUBLIC_SITE_URL

---

## SSL Certificate

### Automatic (Vercel/Netlify)
- Automatically provided

### Manual (EC2/VPS)
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## Post-Deployment

1. **Create Admin Account**
   - Sign up through the website
   - Promote to admin via MongoDB:
   ```javascript
   db.users.updateOne(
     { email: "admin@your-domain.com" },
     { $set: { role: "ADMIN" } }
   )
   ```

2. **Test Everything**
   - Create test account
   - Test login/logout
   - Test admin dashboard
   - Test all pages

3. **Monitor**
   - Check error logs
   - Monitor server resources
   - Check database performance

---

## Costs Estimate

| Platform | Free Tier | Paid Tier |
|----------|-----------|-----------|
| Vercel | Yes (Hobby) | $20/mo (Pro) |
| Netlify | Yes (100GB/mo) | $19/mo (Pro) |
| MongoDB Atlas | Yes (512MB) | $9/mo (Shared) |
| DigitalOcean | No | $5-12/mo |
| AWS EC2 | 12 months free | $10-50/mo |

**Recommended for Start**: Vercel + MongoDB Atlas Free Tier = $0/month

---

## Rollback Strategy

If deployment fails:

1. **Vercel**: Previous deployment is kept, easy rollback in dashboard
2. **Git**: Revert commit and redeploy
3. **Docker**: Keep previous image, rollback container
4. **PM2**: `pm2 stop freemason && git checkout previous-commit && pm2 restart freemason`

---

## Support Resources

- Next.js Deployment: https://nextjs.org/docs/deployment
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Let's Encrypt: https://letsencrypt.org

---

**Need Help?** Open an issue or contact support.

**Ready to go live!** 🚀
