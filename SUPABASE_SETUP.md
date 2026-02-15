# Supabase Storage Setup Guide

## Overview
Your application now uses **Supabase Storage** for file uploads instead of local filesystem storage. This provides:
- **25 GB free storage** (vs 5 GB with AWS S3)
- Scalable cloud storage compatible with Vercel
- Easy file management and deletion
- Public URL access for downloads

## Setup Instructions

### 1. Create Supabase Account
1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub (recommended) or email
4. Verify your email

### 2. Create a New Project
1. Click **"New project"**
2. Project name: `freemason`
3. Password: Create a strong password (save it!)
4. Region: **US East** (us-east-1) - closest to Vercel
5. Click **"Create new project"** (takes 1-2 minutes)

### 3. Create Storage Buckets
Once project is created:

**Bucket 1: Documents**
1. Go to **Storage** (left sidebar)
2. Click **"Create a new bucket"**
3. Name: `documents`
4. **Uncheck** "Private bucket" (make it public)
5. Click **Create**

**Bucket 2: User Files (optional, for future use)**
1. Click **"Create a new bucket"** again
2. Name: `user-files`
3. **Uncheck** "Private bucket"
4. Click **Create**

### 4. Get API Credentials
1. Go to **Settings → API** (left sidebar)
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon key** (under "Project API keys")
   - **service_role key** (under "Project API keys")

### 5. Set Vercel Environment Variables
When deploying to Vercel, add these:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### 6. Network Access (if needed)
1. Go to **Settings → Authorization**
2. Ensure JWT expiration is set (default: 1 hour)
3. Optional: Go to **Settings → Policies** to add custom access rules

## Updated Code

### Files Modified:
- `app/api/admin/documents/route.ts` - Upload to Supabase instead of filesystem
- `app/api/admin/documents/[id]/route.ts` - Delete from Supabase
- `lib/supabase.ts` - NEW - Supabase client initialization
- `models/Document.ts` - Added `storagePath` field for tracking uploaded file path
- `.env.example` - Added Supabase variables

### How It Works:
1. **Upload**: Admin uploads file → File sent to Supabase → Public URL stored in DB
2. **Download**: Client access via public URL (no auth needed for public buckets)
3. **Delete**: Admin deletes document → File removed from Supabase + DB record deleted

## Storage Limits

**Free Tier:**
- 25 GB storage
- 5 GB bandwidth/month
- Unlimited API calls
- 1 GB max file size

**When you exceed free tier:**
- Charges apply per GB ($0.022/GB storage, $0.06/GB bandwidth)
- Perfect for small to medium deployments

## Testing Locally

1. Create `.env.local` with real Supabase credentials
2. Run `npm run dev`
3. Navigate to `/dashboard/admin`
4. Try uploading a document
5. Check Supabase dashboard → Storage → documents to verify upload

## Troubleshooting

**Error: "Missing NEXT_PUBLIC_SUPABASE_URL"**
- Solution: Add environment variables to `.env.local`

**Upload fails silently**
- Check browser console for errors
- Verify Supabase credentials are correct
- Ensure bucket is public (not private)

**File not accessible after upload**
- Check that bucket is public (not private)
- Verify storagePath is saved in database

## Next Steps

1. ✅ Supabase Storage integrated
2. Next: Set up MongoDB Atlas (if not done)
3. Then: Create GitHub repo and push code
4. Finally: Deploy to Vercel
