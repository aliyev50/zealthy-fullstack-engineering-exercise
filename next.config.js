/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    COOKIE_SECRET: process.env.COOKIE_SECRET
  },
  webpack: (config) => {
    // Ignore MongoDB's optional dependencies warnings
    config.ignoreWarnings = [
      { module: /mongodb/ },
      { message: /mongodb/ }
    ];
    return config;
  }
};

module.exports = nextConfig; 