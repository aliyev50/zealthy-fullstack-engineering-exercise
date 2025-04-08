/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Ignore MongoDB's optional dependencies warnings
    config.ignoreWarnings = [
      { module: /mongodb/ },
      { message: /mongodb/ }
    ];
    return config;
  },
  // Reduce log output for warnings during build
  logging: {
    fetches: {
      fullUrl: false
    }
  }
};

module.exports = nextConfig; 