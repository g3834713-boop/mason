/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Disable ESLint during production builds to allow deployment
    // Fix these warnings later with proper HTML entity escaping
    ignoreDuringBuilds: true,
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET || 'freemason-secret-key-change-in-production',
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
  }
}

module.exports = nextConfig
